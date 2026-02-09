import Tribunal from "../models/Tribunal.js";

/* ========== CREATE ========== */
export const createTribunal = async (req, res) => {
  try {
    const tribunal = await Tribunal.create(req.body);
    res.status(201).json(tribunal);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/* ========== READ ALL ========== */
export const getTribunals = async (req, res) => {
  try {
    const tribunals = await Tribunal.find()
      .populate("cour", "nom wilayaNumber")
      .sort({ createdAt: -1 });

    res.status(200).json(tribunals);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

/* ========== UPDATE ========== */
export const updateTribunal = async (req, res) => {
  try {
    const tribunal = await Tribunal.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!tribunal) {
      return res.status(404).json({ message: "المحكمة غير موجودة" });
    }

    res.status(200).json(tribunal);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/* ========== DELETE ========== */
export const deleteTribunal = async (req, res) => {
  try {
    const tribunal = await Tribunal.findByIdAndDelete(req.params.id);

    if (!tribunal) {
      return res.status(404).json({ message: "المحكمة غير موجودة" });
    }

    res.status(200).json({ message: "تم حذف المحكمة بنجاح" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};
