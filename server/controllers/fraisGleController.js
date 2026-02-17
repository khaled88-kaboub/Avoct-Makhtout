import FraisGle from "../models/FraisGle.js";

/* ========= CREATE ========= */
export const createFraisGle = async (req, res) => {
  try {
    const fraisGle = await FraisGle.create(req.body);
    res.status(201).json(fraisGle);
  } catch (error) {
    res.status(400).json({
      message: "بيانات غير صحيحة",
      error: error.message
    });
  }
};

/* ========= READ ALL ========= */
export const getFraisGles = async (req, res) => {
  try {
    const fraisGles = await FraisGle.find()
    .populate("designationDepGle", "nom")
   
    .sort({ nom: 1 });
    res.status(200).json(fraisGles);
  } catch (error) {
    res.status(500).json({ message: "خطأ في الخادم" });
  }
};

/* ========= UPDATE ========= */
export const updateFraisGle = async (req, res) => {
  try {
    const fraisGle = await FraisGle.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!fraisGle) {
      return res.status(404).json({ message: "الغرفة غير موجودة" });
    }

    res.status(200).json(fraisGle);
  } catch (error) {
    res.status(400).json({
      message: "تعذر التحديث",
      error: error.message
    });
  }
};

/* ========= DELETE ========= */
export const deleteFraisGle = async (req, res) => {
  try {
    const fraisGle = await FraisGle.findByIdAndDelete(req.params.id);

    if (!fraisGle) {
      return res.status(404).json({ message: "الغرفة غير موجودة" });
    }

    res.status(200).json({ message: "تم حذف الغرفة بنجاح" });
  } catch (error) {
    res.status(500).json({ message: "خطأ في الخادم" });
  }
};
