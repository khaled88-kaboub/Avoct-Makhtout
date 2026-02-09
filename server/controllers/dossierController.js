import Dossier from "../models/Dossier.js";
import Client from "../models/Client.js";
import Audience from "../models/Audience.js";


import PDFDocument from "pdfkit";


const tafnitPro = (num) => {
  if (num === 0) return "صفر";
  if (num > 999999999) return "مبلغ يتجاوز المليار";

  const parts = [];

  // --- Millions ---
  if (num >= 1000000) {
      const millions = Math.floor(num / 1000000);
      if (millions === 1) parts.push("مليون");
      else if (millions === 2) parts.push("مليونان");
      else if (millions >= 3 && millions <= 10) parts.push(tafnitSimpleBase(millions) + " ملايين");
      else parts.push(tafnitSimpleBase(millions) + " مليون");
      num %= 1000000;
  }

  // --- Milliers ---
  if (num >= 1000) {
      const thousands = Math.floor(num / 1000);
      if (thousands === 1) parts.push("ألف");
      else if (thousands === 2) parts.push("ألفان");
      else if (thousands >= 3 && thousands <= 10) parts.push(tafnitSimpleBase(thousands) + " آلاف");
      else parts.push(tafnitSimpleBase(thousands) + " ألف");
      num %= 1000;
  }

  // --- Reste (Centaines, etc.) ---
  if (num > 0) {
      parts.push(tafnitSimpleBase(num));
  }

  return parts.join(" و ") + " دينار جزائري";
};

// Fonction de base pour les nombres de 1 à 999

function tafnitSimpleBase(n) {
  const units = ["", "واحد", "اثنان", "ثلاثة", "أربعة", "خمسة", "ستة", "سبعة", "ثمانية", "تسعة"];
  const tens = ["", "عشرة", "عشرون", "ثلاثون", "أربعون", "خمسون", "ستون", "سبعون", "ثمانون", "تسعون"];
  const hundreds = ["", "مائة", "مائتان", "ثلاثمائة", "أربعمائة", "خمسمائة", "ستمائة", "سبعمائة", "ثمانمائة", "تسمائة"];
  
  let res = "";

  // Centaines
  if (n >= 100) {
      res += hundreds[Math.floor(n / 100)];
      n %= 100;
      if (n > 0) res += " و ";
  }

  // Dizaines et Unités
  if (n >= 20) {
      const unitPart = units[n % 10];
      const tenPart = tens[Math.floor(n / 10)];
      res += (unitPart ? unitPart + " و " : "") + tenPart;
  } else if (n >= 11) {
      const special = ["", "أحد عشر", "اثنا عشر", "ثلاثة عشر", "أربعة عشر", "خمسة عشر", "ستة عشر", "سبعة عشر", "ثمانية عشر", "تسعة عشر"];
      res += special[n - 10];
  } else if (n === 10) {
      res += "عشرة";
  } else if (n > 0) {
      res += units[n];
  }

  return res;
}
/* ================= CREATE ================= */
export const createDossier = async (req, res) => {
  try {
    console.log("📦 BODY REÇU:", req.body);

    const data = { ...req.body };

    // 🔁 تنظيف الحقول حسب جهة التقاضي
    if (data.lieuType === "COUR") {
      data.tribunal = null;
      data.classe = null;
    }

    if (data.lieuType === "TRIBUNAL") {
      data.court = null;
      data.chambre = null;
    }

    // 🗓️ تاريخ الإغلاق
    if (data.statut !== "منتهي") {
      data.dateCloture = null;
    }

    const dossier = await Dossier.create(data);
    res.status(201).json(dossier);

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/* ================= GET ALL ================= */
export const getDossiers = async (req, res) => {
  try {
    const dossiers = await Dossier.find()
      .populate("client", "noms typeClient")
      .populate("typeAffaire", "libelle")
      

      // 👇 الجديد
      .populate("court", "nom wilayaNumber")
      .populate("audiences", "dateAudience typeAudience notes statut decision")
    
      .populate("paiements")
  
      .populate("chambre", "nom")
      .populate({
        path: "tribunal",
        populate: { path: "cour", select: "wilayaNumber" }
      })
      .populate("classe", "nom")
      .populate("qualite", "nom"); // ✅ مهم جدًا
    res.json(dossiers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= GET BY ID ================= */
export const getDossierById = async (req, res) => {
  try {
    const dossier = await Dossier.findById(req.params.id)
      .populate("client", "noms")
      .populate("typeAffaire", "libelle")
      .populate("audiences", "dateAudience typeAudience notes statut decision")
      .populate("paiements")
      .populate("court", "nom wilayaNumber")
      .populate("chambre", "nom")
      .populate({
        path: "tribunal",
        populate: { path: "cour", select: "wilayaNumber" }
      })
      .populate("classe", "nom");

    res.json(dossier);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

/* ================= UPDATE ================= */
export const updateDossier = async (req, res) => {
  try {
    const data = { ...req.body };

    // 🔁 تنظيف الحقول
    if (data.lieuType === "COUR") {
      data.tribunal = null;
      data.classe = null;
    }

    if (data.lieuType === "TRIBUNAL") {
      data.court = null;
      data.chambre = null;
    }

    if (data.statut !== "منتهي") {
      data.dateCloture = null;
    }

    const dossier = await Dossier.findByIdAndUpdate(
      req.params.id,
      data,
      { new: true }
    );

    res.json(dossier);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/* ================= CLOSE ================= */
export const closeDossier = async (req, res) => {
  try {
    const dossier = await Dossier.findByIdAndUpdate(
      req.params.id,
      { statut: "منتهي", dateCloture: new Date() },
      { new: true }
    );

    res.json(dossier);
  } catch (error) {
    res.status(400).json({ message: error.message });
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

export const generatePaiementfacturePdf = async (req, res) => {
  try {
    const paiement = await Dossier.findById(req.params.id)
    .populate("client", "noms adresse")
    .populate("court", "nom")    // Assurez-vous que le champ s'appelle "nom" dans votre modèle Court
    .populate("chambre", "nom")  
    .populate("tribunal", "nom") 
    .populate("classe", "nom");

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

      doc.fontSize(8).text(" Agrément : N°=ح.ن/ب.م/25/0253", { align: "right" });
      
      doc.moveDown(0.2);
      doc.fontSize(8).text(rtl(" CCP : 00799999000472134805"), { align: "right" });
      doc.moveDown(0.2);
      doc.fontSize(8).text(rtl(" ART :  16193744057 "), { align: "right" });
      doc.moveDown(0.2);
      doc.fontSize(8).text(rtl("Matricule fiscal : 178161701285138"), { align: "right" });
      doc.moveDown(0.2);
      doc.fontSize(8).text(rtl("RIP : 00300606000087130020 "), { align: "right" });
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
   // "ar-DZ" utilise les chiffres arabes standards (1, 2, 3) utilisés en Algérie
  const dateArabe = new Date().toLocaleDateString("ar-DZ"); 
  doc.moveDown(2);
  doc.fontSize(12).text(`${rtl(dateArabe)} : ${rtl(" بتاريخ الجزائر  ")}  `, { align: "right" });
   
    doc.moveDown(3);
   doc.fontSize(20).text(rtl(" أتعاب مذكرة "), { align: "center" });
   doc.moveDown(1);

// استخدام Regex مع العلم 'g' لاستبدال كل المسافات
    const nomClean = Array.isArray(paiement.client.noms) 
    ? paiement.client.noms.join(" * ").trim().replace(/\s+/g, '_') 
    : (paiement.client.noms || "").trim().replace(/\s+/g, '_');

const titrClean = paiement.titre.trim().replace(/\s+/g, '_');
const titrePrice = paiement.price;
//const paiementClean = paiement.modePaiement.trim().replace(/\s+/g, '_');


const clientName = `${nomClean}`;
//const dateStr = new Date(paiement.datePaiement).toLocaleDateString("ar-DZ");

doc.fillColor("#444444");
doc.fontSize(12);
doc.text(`${nomClean} ${rtl("العميل:")}`, { align: "center"  });
doc.text(`${paiement?.client.adresse.replace(/\s+/g, '_')} ${rtl("العنوان:")}`, { align: "center"  });
doc.fillColor("black"); // Retour au noir

doc.fontSize(14);
// الحل الأضمن: فصل التسمية عن القيمة لتجنب تداخل ترتيب الكلمات
doc.text(("  سيدي: "), { align: "right" });
doc.moveDown(0.5);
doc.text(("      .............. دعوى أتعاب مبلغ ذمتكم في  لنا إن      "), { align: "right" });
doc.fillColor("#444444");
doc.fontSize(12);
doc.text(`${titrClean}`, { align: "center"  });
doc.fillColor("black"); // Retour au noir
doc.moveDown(0.5);
doc.fontSize(14);
doc.text((" ....................................  أمام المرفوعة   "), { align: "right" });
doc.moveDown(0.5);
/* ================= معلومات الجهة القضائية ================= */
doc.fontSize(12);
doc.fillColor("#444444"); // Couleur grise pour les détails

if (paiement.juridictionType === "tribunal") {
    // Affichage pour le Tribunal
    const nomTribunal = paiement.tribunal ? paiement.tribunal.nom.trim().replace(/\s+/g, '_') : "...";
    const nomClasse = paiement.classe ? paiement.classe.nom.trim().replace(/\s+/g, '_') : "...";
    
    doc.text(`${rtl(nomTribunal)} : ${rtl("المحكمة")}`, { align: "center" });
    doc.moveDown(0.2);
    doc.text(`${rtl(nomClasse)} : ${rtl("القسم")}`, { align: "center" });
} else if (paiement.juridictionType === "court") {
    // Affichage pour la Cour
    const nomCourt = paiement.court ? paiement.court.nom.trim().replace(/\s+/g, '_') : "...";
    const nomChambre = paiement.chambre ? paiement.chambre.nom.trim().replace(/\s+/g, '_') : "...";
    
    doc.text(`${rtl(nomCourt)} : ${rtl("القضائي المجلس ")}`, { align: "center" });
    doc.moveDown(0.2);
    doc.text(`${rtl(nomChambre)} : ${rtl("الغرفة")}`, { align: "center" });
}

// Affichage du numéro de dossier et de la salle (communs aux deux)
doc.moveDown(0.2);
doc.text(`${paiement.numero} : ${rtl("القضية رقم ")}`, { align: "center" });



doc.fillColor("black"); // Retour au noir
doc.moveDown(1);
doc.fontSize(14);
doc.text(("........ الرسوم كافة احتساب مع الأتعاب مبلغ  "), { align: "right" });
doc.moveDown(0.5);
doc.fontSize(12);
doc.fillColor("#444444");
doc.text(`${rtl("  دج")} ${titrePrice}`, { align: "center"  });

const priceText = tafnitPro(Number(titrePrice));
doc.fontSize(11).fillColor("#555555");
doc.text(`${priceText.trim().replace(/\s+/g, '_')}`, { align: "center" });
doc.fillColor("black"); // Retour au noir

doc.fontSize(14);
// --- Dessin de la ligne horizontale ---
doc.moveDown(1); // Espace avant la ligne

const lineTop = doc.y; // Position actuelle du curseur
doc.moveTo(50, lineTop)          // Point de départ (x=50, y=courant)
   .lineTo(550, lineTop)         // Point d'arrivée (x=550 pour couvrir la largeur A4)
   .lineWidth(1)                 // Épaisseur de la ligne
   .strokeColor("#bdc3c7")       // Couleur grise claire (style pro)
   .stroke();                    // Dessiner la ligne

doc.moveDown(0.2); // Espace après la ligne
doc.fontSize(11);
doc.text(rtl("Maitre MAKHTOUT Yacine"), { align: "center" });
doc.moveDown(2);
//doc.text(`${paiementClean} : ${rtl("الدفع طريقة  ")}`, { align: "right" });
//doc.moveDown(1);

/* ================= المبلغ ================= */
// هنا نعالج كلمة "المبلغ المدفوع" و "دج" بـ rtl، ونترك الرقم في الوسط
//doc.fontSize(16).text(
  //`${rtl("دج")} ${paiement.montant} : ${rtl(" المدفوع المبلغ  ")}`, 
  ///{ align: "right" }
//);
///doc.moveDown(1);
//doc.fillColor("red")
//doc.fontSize(16).text(
  //`${rtl("دج")} ${paiement.reste} : ${rtl(" المتبقي المبلغ   ")}`, 
  //{ align: "right" }
///);
//doc.fillColor("black")
//doc.moveDown(3);

// --- Dessin de la ligne horizontale ---
doc.moveDown(1); // Espace avant la ligne

const lineTop2 = doc.y; // Position actuelle du curseur
doc.moveTo(50, lineTop2)          // Point de départ (x=50, y=courant)
   .lineTo(550, lineTop2)         // Point d'arrivée (x=550 pour couvrir la largeur A4)
   .lineWidth(1)                 // Épaisseur de la ligne
   .strokeColor("#bdc3c7")       // Couleur grise claire (style pro)
   .stroke();                    // Dessiner la ligne
doc.moveDown(0.2); // Espace après la ligne
doc.fontSize(11);
doc.text(("PS: non assujetti a la TVA.  "), { align: "left" });


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

