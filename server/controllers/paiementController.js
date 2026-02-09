import Paiement from "../models/Paiement.js";
import PDFDocument from "pdfkit";
import Dossier from "../models/Dossier.js"; // 👈 Importez le modèle Dossier



/* ================= CREATE  ================= */
export const createPaiement = async (req, res) => {
  try {
    const { dossier: dossierId, montant } = req.body;

    // 1. Récupérer le dossier avec ses paiements actuels pour faire le calcul
    const dossier = await Dossier.findById(dossierId).populate("paiements");
    if (!dossier) return res.status(404).json({ message: "الملف غير موجود" });

    // 2. Calculer le total déjà payé (avant ce nouveau paiement)
    const totalDejaPaye = dossier.paiements.reduce((sum, p) => sum + p.montant, 0);

    // 3. Calculer le nouveau reste : Prix Dossier - (Ancien Total + Nouveau Montant)
    const nouveauReste = dossier.price - (totalDejaPaye + montant);

    // 4. Créer le paiement avec le reste calculé
    const paiement = await Paiement.create({
      ...req.body,
      reste: nouveauReste
    });

    // 5. Mettre à jour le tableau du dossier
    await Dossier.findByIdAndUpdate(dossierId, {
      $push: { paiements: paiement._id }
    });

    res.status(201).json(paiement);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/* ================= GET ALL ================= */
export const getPaiements = async (req, res) => {
  try {
    const paiements = await Paiement.find()
      .populate({
        path: "dossier",
        populate: {
          path: "client",
          select: "noms"
        }
      })
      .sort({ datePaiement: -1 });

    res.json(paiements);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= GET BY ID ================= */
export const getPaiementById = async (req, res) => {
  try {
    const paiement = await Paiement.findById(req.params.id)
      .populate({
        path: "dossier",
        populate: {
          path: "client",
          select: "noms"
        }
      });

    if (!paiement) {
      return res.status(404).json({ message: "الدفع غير موجود" });
    }

    res.json(paiement);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= UPDATE ================= */
export const updatePaiement = async (req, res) => {
  try {
    const paiement = await Paiement.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!paiement) {
      return res.status(404).json({ message: "الدفع غير موجود" });
    }

    res.json(paiement);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/* ================= DELETE ================= */
/* ================= DELETE ================= */
export const deletePaiement = async (req, res) => {
  try {
    const paiementId = req.params.id;
    
    // 1. Trouver le paiement pour connaître son dossier avant de le supprimer
    const paiement = await Paiement.findById(paiementId);
    if (!paiement) return res.status(404).json({ message: "الدفع غير موجود" });

    // 2. Supprimer le paiement
    await Paiement.findByIdAndDelete(paiementId);

    // 3. Retirer la référence du dossier
    await Dossier.findByIdAndUpdate(paiement.dossier, {
      $pull: { paiements: paiementId }
    });

    res.json({ message: "تم حذف الدفع بنجاح" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= GET BY DOSSIER ================= */
export const getPaiementsByDossier = async (req, res) => {
  try {
    const paiements = await Paiement.find({ dossier: req.params.dossierId })
      .sort({ datePaiement: -1 });

    res.json(paiements);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};




import fs from "fs";
import path from "path";
import { createRequire } from "module";
const require = createRequire(import.meta.url);

// تحميل المكتبات باستخدام require لضمان الوصول للدوال
const ArReshaper = require("arabic-persian-reshaper");
const bidiFactory = require("bidi-js");

const bidi = bidiFactory();

const rtl = (text) => {
  if (!text) return "";
  try {
    // في نظام require، الدالة موجودة دائماً في .reshape
    const reshaperFunc = ArReshaper.reshape;

    if (typeof reshaperFunc !== 'function') {
      // محاولة أخيرة إذا كانت المكتبة مصدرة كدالة مباشرة
      const finalFunc = typeof ArReshaper === 'function' ? ArReshaper : null;
      if (!finalFunc) return text;
      
      const reshaped = finalFunc(String(text));
      return bidi.getReorderedString(reshaped, { level: 1, isRTL: true });
    }

    const reshaped = reshaperFunc(String(text));
    
    // حل مشكلة انعكاس الأسماء المركبة (مثل محمد علي)
    return bidi.getReorderedString(reshaped, { 
      level: 1, 
      isRTL: true 
    });
  } catch (e) {
    console.error("RTL Error:", e);
    return text;
  }
};
// Chemin vers votre logo (assurez-vous que le dossier 'assets' existe)
const logoPath = path.join(process.cwd(), "assets", "ero.jpg");

export const generatePaiementPdf = async (req, res) => {
  try {
    const paiement = await Paiement.findById(req.params.id).populate({
      path: "dossier",
      populate: {
        path: "client",
        select: "noms",
      },
    });

    if (!paiement) {
      return res.status(404).json({ message: "الدفع غير موجود" });
    }

    // 1. إنشاء الوثيقة أولاً
    const doc = new PDFDocument({ size: "A4", margin: 50 });

    // 2. إعداد الخط (تأكد من وجود الملف في هذا المسار)
    const fontPath = path.join(process.cwd(), "fonts", "Amiri-Regular.ttf");
    if (!fs.existsSync(fontPath)) {
        throw new Error("Font file not found at " + fontPath);
    }

    // 3. إرسال الهيدرز قبل البدء بالـ pipe
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `inline; filename=recu-paiement-${paiement._id}.pdf`
    );

    // 4. الآن نربط الوثيقة بالاستجابة
    doc.pipe(res);
    doc.font(fontPath);
// --- AJOUT DU LOGO ICI ---

if (fs.existsSync(logoPath)) {
  console.log("✅ Logo trouvé, tentative d'insertion...");
  try {
      // 1. On force l'insertion de l'image
      // On utilise 'fit' au lieu de 'width' pour plus de stabilité
      doc.image(logoPath, 70, 60, { fit: [120, 120] }, { align: "right" });

      doc.fontSize(8).text(" Agrément//N°=ح.ن/ب.م/25/0253", { align: "right" });
      
      doc.moveDown(0.2);
      doc.fontSize(8).text(rtl(" CCP // 00799999000472134805"), { align: "right" });
      doc.moveDown(0.2);
      doc.fontSize(8).text(rtl(" ART//  16193744057 "), { align: "right" });
      doc.moveDown(0.2);
      doc.fontSize(8).text(rtl("Matricule fiscal // 178161701285138"), { align: "right" });
      doc.moveDown(0.2);
      doc.fontSize(8).text(rtl("RIP// 00300606000087130020 "), { align: "right" });
      doc.moveDown(2.5);
      // 2. TRÈS IMPORTANT : Déplacer le curseur Y 
      // Si tu ne le fais pas, le texte suivant va s'écrire PAR-DESSUS le logo
      doc.y = 130; 
      
      console.log("🚀 Image insérée avec succès dans le flux PDF");
  } catch (imgError) {
      console.error("❌ Erreur PDFKit lors de l'insertion de l'image:", imgError);
      doc.y = 50; // On revient à une position normale en cas d'échec
  }
} else {
  console.log("⚠️ Logo non trouvé à l'emplacement:", logoPath);
  doc.y = 120;
}


   /* ================= المحتوى المصحح ================= */
// 1. العنوان (كلمتين)
doc.moveDown(4);
doc.fontSize(20).text(rtl("دفع وصل "), { align: "center" });
doc.moveDown(2);

// استخدام Regex مع العلم 'g' لاستبدال كل المسافات
const nomClean = Array.isArray(paiement.dossier.client.noms) 
    ? paiement.dossier.client.noms.join(" -- ").trim() 
    : (paiement.dossier.client.noms || "").trim();

const titrClean = paiement.dossier.titre.trim().replace(/\s+/g, '_');
const paiementClean = paiement.modePaiement.trim().replace(/\s+/g, '_');


const clientName = `${nomClean}`;
const dateStr = new Date(paiement.datePaiement).toLocaleDateString("ar-DZ");

doc.fontSize(14);

// الحل الأضمن: فصل التسمية عن القيمة لتجنب تداخل ترتيب الكلمات
doc.text(`${clientName} : ${rtl(" العميل اسم ")}`, { align: "right" });
doc.moveDown(0.5);

doc.text(`${titrClean} : ${rtl("الملف  ")}`, { align: "right" });
doc.moveDown(0.5);

doc.text(`${dateStr} : ${rtl("الدفع تاريخ  ")}`, { align: "right" });
doc.moveDown(0.5);

doc.text(`${paiementClean} : ${rtl("الدفع طريقة  ")}`, { align: "right" });
doc.moveDown(1);

/* ================= المبلغ ================= */
// هنا نعالج كلمة "المبلغ المدفوع" و "دج" بـ rtl، ونترك الرقم في الوسط
doc.fontSize(16).text(
  `${rtl("دج")} ${paiement.montant} : ${rtl(" المدفوع المبلغ  ")}`, 
  { align: "right" }
);
doc.moveDown(1);
doc.fillColor("red")
doc.fontSize(16).text(
  `${rtl("دج")} ${paiement.reste} : ${rtl(" المتبقي المبلغ   ")}`, 
  { align: "right" }
);
doc.fillColor("black")
doc.moveDown(3);

/* ================= التوقيع ================= */
doc.text(rtl("المحامي توقيع "), { align: "left" });


    // 5. الإنهاء
    doc.end();

  } catch (err) {
    console.error("PDF Final Error:", err);
    // إذا حدث خطأ ولم نرسل الهيدرز بعد، نرسل خطأ JSON
    if (!res.headersSent) {
      res.status(500).json({ message: "خطأ داخلي: " + err.message });
    } else {
      // إذا بدأ الـ pipe بالفعل، ننهي الاستجابة فقط
      res.end();
    }
  }
};

