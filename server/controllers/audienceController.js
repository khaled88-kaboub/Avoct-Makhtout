import Audience from "../models/Audience.js";

/* ================= CREATE ================= */
export const createAudience = async (req, res) => {
  try {
    const audience = await Audience.create(req.body);
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

    let filter = {};
    if (dossier) filter.dossier = dossier;
    if (statut) filter.statut = statut;
    if (typeAudience) filter.typeAudience = typeAudience;

    const audiences = await Audience.find(filter)
      .populate("dossier")
      .populate({
        path: "dossier",
        populate: { path: "client", select: "nom prenom" } // on récupère nom et prénom du client
      })
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
      .populate("dossier")
      .populate({
        path: "dossier",
        populate: { path: "client", select: "nom prenom" } // on récupère nom et prénom du client
      });

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
    const audience = await Audience.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

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

    res.json({ message: "تم حذف الجلسة بنجاح" });
  } catch (error) {
    res.status(500).json({
      message: "خطأ أثناء حذف الجلسة",
      error: error.message
    });
  }
};
