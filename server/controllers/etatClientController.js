import EtatClient from "../models/EtatClient.js";

/* ========= CREATE ========= */
export const createEtatClient = async (req, res) => {
  try {
    const etatClient = await EtatClient.create(req.body);
    res.status(201).json(etatClient);
  } catch (error) {
    res.status(400).json({
      message: "بيانات غير صحيحة",
      error: error.message
    });
  }
};

/* ========= READ ALL ========= */
export const getEtatClients = async (req, res) => {
  try {
    const etatClients = await EtatClient.find().sort({ nom: 1 });
    res.status(200).json(etatClients);
  } catch (error) {
    res.status(500).json({ message: "خطأ في الخادم" });
  }
};

/* ========= UPDATE ========= */
export const updateEtatClient = async (req, res) => {
  try {
    const etatClient = await EtatClient.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!etatClient) {
      return res.status(404).json({ message: " القسم غير موجود " });
    }

    res.status(200).json(etatClient);
  } catch (error) {
    res.status(400).json({
      message: "تعذر التحديث",
      error: error.message
    });
  }
};

/* ========= DELETE ========= */
export const deleteEtatClient = async (req, res) => {
  try {
    const etatClient = await EtatClient.findByIdAndDelete(req.params.id);

    if (!etatClient) {
      return res.status(404).json({ message: "  القسم غير موجود" });
    }

    res.status(200).json({ message: "تم حذف القسم بنجاح" });
  } catch (error) {
    res.status(500).json({ message: "خطأ في الخادم" });
  }
};
