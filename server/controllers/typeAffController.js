import TypeAff from "../models/TypeAff.js";

/**
 * ➕ Créer un type d'affaire
 */
export const createTypeAff = async (req, res) => {
  try {
    const { libelle } = req.body;

    if (!libelle) {
      return res.status(400).json({ message: "Le libellé est obligatoire" });
    }

    const exists = await TypeAff.findOne({ libelle });
    if (exists) {
      return res.status(400).json({ message: "Ce type existe déjà" });
    }

    const typeAff = await TypeAff.create({ libelle });
    res.status(201).json(typeAff);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * 📄 Récupérer tous les types d'affaires
 */
export const getAllTypeAff = async (req, res) => {
  try {
    const types = await TypeAff.find().sort({ libelle: 1 });
    res.json(types);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * 🔍 Récupérer un type par ID
 */
export const getTypeAffById = async (req, res) => {
  try {
    const type = await TypeAff.findById(req.params.id);
    if (!type) {
      return res.status(404).json({ message: "Type introuvable" });
    }
    res.json(type);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * ✏️ Mettre à jour un type
 */
export const updateTypeAff = async (req, res) => {
  try {
    const type = await TypeAff.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!type) {
      return res.status(404).json({ message: "Type introuvable" });
    }

    res.json(type);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * 🗑️ Supprimer un type
 */
export const deleteTypeAff = async (req, res) => {
  try {
    const type = await TypeAff.findByIdAndDelete(req.params.id);
    if (!type) {
      return res.status(404).json({ message: "Type introuvable" });
    }
    res.json({ message: "Type supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
