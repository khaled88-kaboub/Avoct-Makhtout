import Paiement from "../models/Paiement.js";
import PDFDocument from "pdfkit";

/* ================= CREATE ================= */
export const createPaiement = async (req, res) => {
  try {
    const paiement = await Paiement.create(req.body);
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
          select: "nom prenom"
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
          select: "nom prenom"
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
export const deletePaiement = async (req, res) => {
  try {
    const paiement = await Paiement.findByIdAndDelete(req.params.id);

    if (!paiement) {
      return res.status(404).json({ message: "الدفع غير موجود" });
    }

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

export const generatePaiementPdf = async (req, res) => {
  try {
    const paiement = await Paiement.findById(req.params.id).populate({
      path: "dossier",
      populate: {
        path: "client",
        select: "nom prenom",
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

   /* ================= المحتوى المصحح ================= */
// 1. العنوان (كلمتين)
doc.fontSize(20).text(rtl("دفع وصل "), { align: "center" });
doc.moveDown(2);

// استخدام Regex مع العلم 'g' لاستبدال كل المسافات
const nomClean = paiement.dossier.client.nom.trim().replace(/\s+/g, '_');
const prenomClean = paiement.dossier.client.prenom.trim().replace(/\s+/g, '_');
const titrClean = paiement.dossier.titre.trim().replace(/\s+/g, '_');
const paiementClean = paiement.modePaiement.trim().replace(/\s+/g, '_');


const clientName = `${nomClean}-${prenomClean}`;
const dateStr = new Date(paiement.datePaiement).toLocaleDateString("ar-DZ");

doc.fontSize(14);

// الحل الأضمن: فصل التسمية عن القيمة لتجنب تداخل ترتيب الكلمات
doc.text(`${clientName} : ${rtl(" العميل اسم ")}`, { align: "right" });
doc.moveDown(0.5);

doc.text(`${titrClean} : ${rtl(" الملف")}`, { align: "right" });
doc.moveDown(0.5);

doc.text(`${dateStr} : ${rtl("الدفع تاريخ ")}`, { align: "right" });
doc.moveDown(0.5);

doc.text(`${paiementClean} : ${rtl("الدفع طريقة ")}`, { align: "right" });
doc.moveDown(1);

/* ================= المبلغ ================= */
// هنا نعالج كلمة "المبلغ المدفوع" و "دج" بـ rtl، ونترك الرقم في الوسط
doc.fontSize(16).text(
  `${rtl("دج")} ${paiement.montant} : ${rtl(" المدفوع المبلغ ")}`, 
  { align: "right" }
);
doc.moveDown(1);
doc.fontSize(16).text(
  `${rtl("دج")} ${paiement.reste} : ${rtl(" المتبقي المبلغ ")}`, 
  { align: "right" }
);
doc.moveDown(3);

/* ================= التوقيع ================= */
doc.text(rtl("المحامي توقيع "), { align: "left" });
doc.text("__________________", { align: "left" });

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

