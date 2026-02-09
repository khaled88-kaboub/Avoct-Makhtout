import Chambre from "../models/Chambre.js";

/* ========= CREATE ========= */
export const createChambre = async (req, res) => {
  try {
    const chambre = await Chambre.create(req.body);
    res.status(201).json(chambre);
  } catch (error) {
    res.status(400).json({
      message: "بيانات غير صحيحة",
      error: error.message
    });
  }
};

/* ========= READ ALL ========= */
export const getChambres = async (req, res) => {
  try {
    const chambres = await Chambre.find().sort({ nom: 1 });
    res.status(200).json(chambres);
  } catch (error) {
    res.status(500).json({ message: "خطأ في الخادم" });
  }
};

/* ========= UPDATE ========= */
export const updateChambre = async (req, res) => {
  try {
    const chambre = await Chambre.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!chambre) {
      return res.status(404).json({ message: "الغرفة غير موجودة" });
    }

    res.status(200).json(chambre);
  } catch (error) {
    res.status(400).json({
      message: "تعذر التحديث",
      error: error.message
    });
  }
};

/* ========= DELETE ========= */
export const deleteChambre = async (req, res) => {
  try {
    const chambre = await Chambre.findByIdAndDelete(req.params.id);

    if (!chambre) {
      return res.status(404).json({ message: "الغرفة غير موجودة" });
    }

    res.status(200).json({ message: "تم حذف الغرفة بنجاح" });
  } catch (error) {
    res.status(500).json({ message: "خطأ في الخادم" });
  }
};
