
import Delegation from "../models/Delegation.js";
import PDFDocument from "pdfkit";
import Dossier from "../models/Dossier.js";

export const createDelegation = async (req, res) => {
  try {
    const delegation = await Delegation.create(req.body);
    res.status(201).json(delegation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getDelegations = async (req, res) => {
  try {
    const delegations = await Delegation.find()
    .populate({
        path: "dossier",
        select: "reference titre numero adversaire client qualite court tribunal",
        populate: {
          path: "client",
          select: "noms",
          
        }
       
        })
      .sort({ dateAudience: -1 });
    res.json(delegations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteDelegation = async (req, res) => {
  try {
    await Delegation.findByIdAndDelete(req.params.id);
    res.json({ message: "Délégation supprimée" });
  } catch (error) {
    res.status(500).json({ message: error.message });
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
const logoPath = path.join(process.cwd(), "assets", "mouhalipic.png");

export const generateinabaPdf = async (req, res) => {
  try {
    const delegation = await Delegation.findById(req.params.id)
      .populate({
        path: "dossier", // 1er niveau : On entre dans le dossier
        populate: [      // 2ème niveau : On cherche les détails à l'intérieur du dossier
          { path: "tribunal", select: "nom" },
          { path: "classe", select: "nom" },
          { path: "court", select: "nom" },
          { path: "chambre", select: "nom" },
          { path: "client", select: "noms" }
        ]
      });

    if (!delegation) {
      return res.status(404).json({ message: " غير موجود" });
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
      `inline; filename=recu-paiement-${delegation._id}.pdf`
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
      doc.image(logoPath, 60, 60, { fit: [500, 500], align: 'center' });
      doc.moveDown(5);
      
      // 2. TRÈS IMPORTANT : Déplacer le curseur Y 
      // Si tu ne le fais pas, le texte suivant va s'écrire PAR-DESSUS le logo
    
      
      console.log("🚀 Image insérée avec succès dans le flux PDF");
  } catch (imgError) {
      console.error("❌ Erreur PDFKit lors de l'insertion de l'image:", imgError);
      doc.y = 50; // On revient à une position normale en cas d'échec
  }
} else {
  console.log("⚠️ Logo non trouvé à l'emplacement:", logoPath);
  
}


   /* ================= المحتوى المصحح ================= */
    // 1. العنوان (كلمتين)
   //doc.moveDown(4);
   //doc.fontSize(20).text(rtl(" أتعاب مذكرة "), { align: "center" });
   //doc.moveDown(1);

// استخدام Regex مع العلم 'g' لاستبدال كل المسافات
    //const nomClean = Array.isArray(paiement.client.noms) 
    //? paiement.client.noms.join(" * ").trim().replace(/\s+/g, '_') 
    //: (paiement.client.noms || "").trim().replace(/\s+/g, '_');

const dateAud = new Date(delegation.dateAudience).toLocaleDateString("ar-DZ");
//const titrePrice = paiement.price;
//const paiementClean = paiement.modePaiement.trim().replace(/\s+/g, '_');


//const clientName = `${nomClean}`;
//const dateStr = new Date(paiement.datePaiement).toLocaleDateString("ar-DZ");

doc.fillColor("#444444");
doc.fontSize(12);
//doc.text(`${nomClean} ${rtl("العميل:")}`, { align: "center"  });
//doc.text(`${paiement?.client.adresse.replace(/\s+/g, '_')} ${rtl("العنوان:")}`, { align: "center"  });
doc.fillColor("black"); // Retour au noir

doc.fontSize(14);
doc.moveDown(0.5);
// الحل الأضمن: فصل التسمية عن القيمة لتجنب تداخل ترتيب الكلمات
//doc.text(("  سيدي: "), { align: "right" });
//doc.moveDown(0.5);
//doc.text(("      .............. دعوى أتعاب مبلغ ذمتكم في  لنا إن      "), { align: "right" });
//doc.fillColor("#444444");
//doc.fontSize(12);
//doc.text(`${titrClean}`, { align: "center"  });
doc.fillColor("black"); // Retour au noir
doc.moveDown(0.5);
doc.fontSize(14);
//doc.text((" ....................................  أمام المرفوعة   "), { align: "right" });
doc.moveDown(0.5);
/* ================= معلومات الجهة القضائية ================= */
doc.fontSize(12);
doc.fillColor("#444444"); // Couleur grise pour les détails

// On vérifie d'abord que le dossier existe pour éviter le crash
if (delegation?.dossier) {
    const { juridictionType, tribunal, classe, court, chambre, numero } = delegation.dossier;

    if (juridictionType === "tribunal") {
        // Pas besoin de replace('_'), rtl gère les espaces
        const nomTribunal = tribunal?.nom ? tribunal.nom.trim().replace(/\s+/g, '_') : "...";
        const nomClasse = classe?.nom ? classe.nom.trim().replace(/\s+/g, '_') : "...";
        
        doc.text(`${rtl(nomTribunal)} : ${rtl("المحكمة")}`, { align: "right" });
        doc.moveDown(0.2);
        doc.text(`${rtl(nomClasse)} : ${rtl("القسم")}`, { align: "right" });
    } 
    else if (juridictionType === "court") {
        const nomCourt = court?.nom ? court.nom.trim().replace(/\s+/g, '_') : "...";
        const nomChambre = chambre?.nom ? chambre.nom.trim().replace(/\s+/g, '_') : "...";
        
        // Correction de l'ordre des mots ici
        doc.text(`${rtl(nomCourt)} : ${rtl(" القضائي المجلس ")}`, { align: "right" });
        doc.moveDown(0.2);
        doc.text(`${rtl(nomChambre)} : ${rtl("الغرفة")}`, { align: "right" });
    }

    // Affichage du numéro de dossier
    doc.moveDown(0.2);
    doc.text(`${numero || "..."} : ${rtl("القضية رقم ")}`, { align: "right" });
}

doc.moveDown(0.2);
doc.text(`${dateAud || "..."} : ${rtl(" الجلسة تاريخ  ")}`, { align: "right" });





doc.fillColor("black"); // Retour au noir
doc.moveDown(2);
doc.fontSize(14);
doc.text((" لفائدة:  "), { align: "right"  });
doc.moveDown(0.3);
//doc.text(`${delegation?.dossier?.client?.noms.replace(/\s+/g, '_') || "..."} `, { align: "right" });
//******************************************************* */
// Préparation des données
const momo = delegation.personne.trim()
  .replace(/(?<=[\u0600-\u06FF])\s+(?=[\u0600-\u06FF])/g, '_') || "...";
const popo = delegation.qpersonne.trim().replace(/(?<=[\u0600-\u06FF])\s+(?=[\u0600-\u06FF])/g, '_') || "...";

// Construction de la ligne
// On utilise les points au milieu pour combler l'espace
const ligneComplete = `)${rtl(popo)}( ....................................... ${momo}`;
doc.fontSize(12).text(rtl(ligneComplete), { align: "right" });
doc.text(("    الجزائر ،  44  عمارة  01  جراح  باش حي ، المجلس  لدى  محام  ياسين  مخطوط الأستاذ حقه في  القائم  "), { align: "right" });
doc.fontSize(14);
doc.text((" ضد:  "), { align: "right" });
const momo2 = delegation.adversaire.trim().replace(/\s+/g, '_') || "...";
const popo2 = delegation.qadversaire.trim().replace(/\s+/g, '_') || "...";

// Construction de la ligne
// On utilise les points au milieu pour combler l'espace
const ligneComplete2 = `)${rtl(popo2)}( ....................................... ${momo2}`;

doc.fontSize(12).text(rtl(ligneComplete2), { align: "right" });
//********************************************************* */

doc.moveDown(2);


//doc.fontSize(18);
//doc.fillColor("#444444");
//doc.text(("الطلبات"), { align: "center"  });


const drawHighlightRow = (textArabe) => {
    const currentY = doc.y;
    
    // Rectangle gris arrondi
    doc.fillColor("#e5e7eb")
       .roundedRect(50, currentY, 495, 40, 3) 
       .fill();
       
    // Texte blanc ou noir
    doc.fillColor("#1e3a8a") // Bleu foncé pour le contraste
       .fontSize(18)
       .text(rtl(textArabe), 50, currentY + 6, { width: 485, align: "center" });
    
    doc.y = currentY + 35; // On descend le curseur après la barre
};

// Utilisation :
drawHighlightRow("  الطلبات ");
doc.moveDown(0.5)

const lineTop = doc.y; // Position actuelle du curseur
doc.moveTo(50, lineTop)          // Point de départ (x=50, y=courant)
   .lineTo(550, lineTop)         // Point d'arrivée (x=550 pour couvrir la largeur A4)
   .lineWidth(1)                 // Épaisseur de la ligne
   .strokeColor("#bdc3c7")       // Couleur grise claire (style pro)
   .stroke();                    // Dessiner la ligne

   doc.moveDown(0.4);
   doc.fontSize(14);
   doc.fillColor("black");
   
   const momo3 = delegation.demandes || "...";
   
   // On sépare le texte par ligne pour éviter les mélanges de chiffres
   const lignes = momo3.split('\n');
   
   lignes.forEach(ligne => {
       let textLigne = ligne.trim();
       if (textLigne.length > 0) {
           // Option A: Si votre fonction rtl() gère mal les listes
           // On affiche le texte directement avec l'alignement à droite
           // SANS inverser la ligne entière si elle contient des chiffres
           doc.text(rtl(textLigne.trim().replace(/\s+/g, '-')), { 
               align: "right",
               lineGap: 4 
           });
       }
   });
   
   doc.moveDown(2);

//text(rtl(ligneComplete)


// --- Dessin de la ligne horizontale ---
doc.moveDown(1); // Espace avant la ligne

const lineTop2 = doc.y; // Position actuelle du curseur
doc.moveTo(50, lineTop2)          // Point de départ (x=50, y=courant)
   .lineTo(550, lineTop2)         // Point d'arrivée (x=550 pour couvrir la largeur A4)
   .lineWidth(1)                 // Épaisseur de la ligne
   .strokeColor("#bdc3c7")       // Couleur grise claire (style pro)
   .stroke();                    // Dessiner la ligne
   
   
   
   doc.fillColor("black"); // Retour au noir
   doc.moveDown(0.6); // Espace après la ligne
   doc.fontSize(14);
   doc.text(("شكرا "), { align: "left" });


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

