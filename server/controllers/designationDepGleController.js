import DesignationDepGle from "../models/DesignationDepGle.js";

/* ========= CREATE ========= */
export const createDesignationDepGle = async (req, res) => {
  try {
    const designationDepGle = await DesignationDepGle.create(req.body);
    res.status(201).json(designationDepGle);
  } catch (error) {
    res.status(400).json({
      message: "بيانات غير صحيحة",
      error: error.message
    });
  }
};

/* ========= READ ALL ========= */
export const getDesignationDepGles = async (req, res) => {
  try {
    const designationDepGles = await DesignationDepGle.find().sort({ nom: 1 });
    res.status(200).json(designationDepGles);
  } catch (error) {
    res.status(500).json({ message: "خطأ في الخادم" });
  }
};

/* ========= UPDATE ========= */
export const updateDesignationDepGle = async (req, res) => {
  try {
    const designationDepGle = await DesignationDepGle.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!designationDepGle) {
      return res.status(404).json({ message: " النوع غير موجود " });
    }

    res.status(200).json(designationDepGle);
  } catch (error) {
    res.status(400).json({
      message: "تعذر التحديث",
      error: error.message
    });
  }
};

/* ========= DELETE ========= */
export const deleteDesignationDepGle = async (req, res) => {
  try {
    const designationDepGle = await DesignationDepGle.findByIdAndDelete(req.params.id);

    if (!designationDepGle) {
      return res.status(404).json({ message: "  النوع غير موجود" });
    }

    res.status(200).json({ message: "تم حذف النوع بنجاح" });
  } catch (error) {
    res.status(500).json({ message: "خطأ في الخادم" });
  }
};
