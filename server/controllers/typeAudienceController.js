import TypeAudience from "../models/TypeAudience.js";

/* ========= CREATE ========= */
export const createTypeAudience = async (req, res) => {
  try {
    const typeAudience = await TypeAudience.create(req.body);
    res.status(201).json(typeAudience);
  } catch (error) {
    res.status(400).json({
      message: "بيانات غير صحيحة",
      error: error.message
    });
  }
};

/* ========= READ ALL ========= */
export const getTypeAudiences = async (req, res) => {
  try {
    const typeAudiences = await TypeAudience.find().sort({ nom: 1 });
    res.status(200).json(typeAudiences);
  } catch (error) {
    res.status(500).json({ message: "خطأ في الخادم" });
  }
};

/* ========= UPDATE ========= */
export const updateTypeAudience = async (req, res) => {
  try {
    const typeAudience = await TypeAudience.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!typeAudience) {
      return res.status(404).json({ message: " النوع غير موجود " });
    }

    res.status(200).json(typeAudience);
  } catch (error) {
    res.status(400).json({
      message: "تعذر التحديث",
      error: error.message
    });
  }
};

/* ========= DELETE ========= */
export const deleteTypeAudience = async (req, res) => {
  try {
    const typeAudience = await TypeAudience.findByIdAndDelete(req.params.id);

    if (!typeAudience) {
      return res.status(404).json({ message: "  النوع غير موجود" });
    }

    res.status(200).json({ message: "تم حذف النوع بنجاح" });
  } catch (error) {
    res.status(500).json({ message: "خطأ في الخادم" });
  }
};
