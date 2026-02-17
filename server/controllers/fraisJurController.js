import FraisJur from "../models/FraisJur.js";
import Dossier from "../models/Dossier.js";
/* ========= CREATE ========= */
//export const createFraisJur = async (req, res) => {
 // try {
   // const fraisJur = await FraisJur.create(req.body);
   // res.status(201).json(fraisJur);
  //}// catch (error) {
   // res.status(400).json({
    //  message: "بيانات غير صحيحة",
    //  error: error.message
  //  });
 // }
//};


export const createFraisJur = async (req, res) => {
  try {
    const { dossier: dossierId } = req.body;

    // 1. Récupérer le dossier avec ses paiements actuels pour faire le calcul
    const dossier = await Dossier.findById(dossierId).populate("fraisJurs");
    if (!dossier) return res.status(404).json({ message: "الملف غير موجود" });

    // 2. Calculer le total déjà payé (avant ce nouveau paiement)
    //const totalDejaPaye = dossier.fraisJurs.reduce((sum, p) => sum + p.montant, 0);

    // 3. Calculer le nouveau reste : Prix Dossier - (Ancien Total + Nouveau Montant)
   // const nouveauReste = dossier.price - (totalDejaPaye + montant);

    // 4. Créer le paiement avec le reste calculé
    const fraisJur = await FraisJur.create({
      ...req.body,
      
    });

    // 5. Mettre à jour le tableau du dossier
    await Dossier.findByIdAndUpdate(dossierId, {
      $push: { fraisJurs: fraisJur._id }
    });

    res.status(201).json(fraisJur);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
/* ========= READ ALL ========= */
export const getFraisJurs = async (req, res) => {
  try {
    const fraisJurs = await FraisJur.find()
    .populate("designationDepJur", "nom")
    .populate({
      path: "dossier",
      select: "titre"
      
    })
    .sort({ nom: 1 });
    res.status(200).json(fraisJurs);
  } catch (error) {
    res.status(500).json({ message: "خطأ في الخادم" });
  }
};

/* ========= UPDATE ========= */
export const updateFraisJur = async (req, res) => {
  try {
    const fraisJur = await FraisJur.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!fraisJur) {
      return res.status(404).json({ message: "الغرفة غير موجودة" });
    }

    res.status(200).json(FraisJur);
  } catch (error) {
    res.status(400).json({
      message: "تعذر التحديث",
      error: error.message
    });
  }
};

/* ========= DELETE ========= */
export const deleteFraisJur = async (req, res) => {
  try {
    const fraisJur = await FraisJur.findByIdAndDelete(req.params.id);

    if (!FraisJur) {
      return res.status(404).json({ message: "الغرفة غير موجودة" });
    }

    res.status(200).json({ message: "تم حذف الغرفة بنجاح" });
  } catch (error) {
    res.status(500).json({ message: "خطأ في الخادم" });
  }
};
