import Audience from "../models/Audience.js";
import Dossier from "../models/Dossier.js"; // 👈 INDISPENSABLE

/* ================= CREATE ================= */
/* ================= CREATE ================= */
export const createAudience = async (req, res) => {
  try {
    const {
      dossier, // C'est l'ID du dossier
      dateAudience,
      typeAudience,
      notes,
      statut,
      decision
    } = req.body;

    // 1. Créer l'audience
    const audience = await Audience.create({
      dossier,
      dateAudience,
      typeAudience,
      notes,
      statut,
      decision
    });

    // 2. 🚩 AJOUTER l'ID de l'audience dans le tableau du Dossier
    await Dossier.findByIdAndUpdate(dossier, {
      $push: { audiences: audience._id }
    });

    res.status(201).json(audience);
  } catch (error) {
    res.status(400).json({
      message: "خطأ أثناء إنشاء الجلسة",
      error: error.message
    });
  }
};

/* ================= GET ALL ================= */
export const getAudiences = async (req, res) => {
  try {
    const { dossier, statut, typeAudience } = req.query;

    const filter = {};
    if (dossier) filter.dossier = dossier;
    if (statut) filter.statut = statut;
    if (typeAudience) filter.typeAudience = typeAudience;

    const audiences = await Audience.find(filter)
      .populate({
        path: "dossier",
        
          populate: [
            { path: "tribunal", select: "nom " },
            { path: "court", select: "nom wilayaNumber" },
            { path: "chambre", select: "nom" },
            { path: "classe", select: "nom" },
            { path: "client", select: "noms" }
            
          ]
        
      })
      .populate("typeAudience") // 🔴 مهم
      .sort({ dateAudience: 1 });

    res.json(audiences);
  } catch (error) {
    res.status(500).json({
      message: "خطأ أثناء جلب الجلسات",
      error: error.message
    });
  }
};


/* ================= GET ONE ================= */
export const getAudienceById = async (req, res) => {
  try {
    const audience = await Audience.findById(req.params.id)
      .populate({
        path: "dossier",
        populate: {
          path: "client",
          select: "noms"
        }
      })
      .populate("typeAudience");

    if (!audience) {
      return res.status(404).json({ message: "الجلسة غير موجودة" });
    }

    res.json(audience);
  } catch (error) {
    res.status(500).json({
      message: "خطأ أثناء جلب الجلسة",
      error: error.message
    });
  }
};


/* ================= UPDATE ================= */
export const updateAudience = async (req, res) => {
  try {
    const {
      dossier,
      dateAudience,
      typeAudience,
      notes,
      statut,
      decision
    } = req.body;

    const audience = await Audience.findByIdAndUpdate(
      req.params.id,
      {
        dossier,
        dateAudience,
        typeAudience,
        notes,
        statut,
        decision
      },
      { new: true, runValidators: true }
    )
      .populate("typeAudience")
      .populate({
        path: "dossier",
        populate: { path: "client", select: "noms" }
      });

    if (!audience) {
      return res.status(404).json({ message: "الجلسة غير موجودة" });
    }

    res.json(audience);
  } catch (error) {
    res.status(400).json({
      message: "خطأ أثناء تحديث الجلسة",
      error: error.message
    });
  }
};


/* ================= DELETE ================= */
export const deleteAudience = async (req, res) => {
  try {
    const audience = await Audience.findByIdAndDelete(req.params.id);

    if (!audience) {
      return res.status(404).json({ message: "الجلسة غير موجودة" });
    }

    // 🚩 RETIRER l'ID du tableau du dossier
    await Dossier.findByIdAndUpdate(audience.dossier, {
      $pull: { audiences: req.params.id }
    });

    res.json({ message: "تم حذف الجلسة بنجاح" });
  } catch (error) {
    // ...
  }
};