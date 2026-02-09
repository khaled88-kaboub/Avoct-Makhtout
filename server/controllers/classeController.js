import Classe from "../models/Classe.js";

/* ========= CREATE ========= */
export const createClasse = async (req, res) => {
  try {
    const classe = await Classe.create(req.body);
    res.status(201).json(classe);
  } catch (error) {
    res.status(400).json({
      message: "بيانات غير صحيحة",
      error: error.message
    });
  }
};

/* ========= READ ALL ========= */
export const getClasses = async (req, res) => {
  try {
    const classes = await Classe.find().sort({ nom: 1 });
    res.status(200).json(classes);
  } catch (error) {
    res.status(500).json({ message: "خطأ في الخادم" });
  }
};

/* ========= UPDATE ========= */
export const updateClasse = async (req, res) => {
  try {
    const classe = await Classe.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!classe) {
      return res.status(404).json({ message: " القسم غير موجود " });
    }

    res.status(200).json(classe);
  } catch (error) {
    res.status(400).json({
      message: "تعذر التحديث",
      error: error.message
    });
  }
};

/* ========= DELETE ========= */
export const deleteClasse = async (req, res) => {
  try {
    const classe = await Classe.findByIdAndDelete(req.params.id);

    if (!classe) {
      return res.status(404).json({ message: "  القسم غير موجود" });
    }

    res.status(200).json({ message: "تم حذف القسم بنجاح" });
  } catch (error) {
    res.status(500).json({ message: "خطأ في الخادم" });
  }
};
