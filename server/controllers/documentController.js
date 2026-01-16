import Document from "../models/Document.js";
import Dossier from "../models/Dossier.js";

/**
 * Ajouter un document à un dossier
 */
export const createDocument = async (req, res) => {
  try {
    const { dossier, titre, type, fichierURL } = req.body;

    const dossierExiste = await Dossier.findById(dossier);
    if (!dossierExiste) {
      return res.status(404).json({ message: "Dossier introuvable" });
    }

    const document = await Document.create({
      dossier,
      titre,
      type,
      fichierURL
    });

    await Dossier.findByIdAndUpdate(
      dossier,
      { $push: { documents: document._id } }
    );

    res.status(201).json(document);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * Tous les documents
 */
export const getDocuments = async (req, res) => {
  const documents = await Document.find()
    .populate({
      path: "dossier",
      populate: { path: "client" }
    })
    .sort({ uploadedAt: -1 });

  res.json(documents);
};

/**
 * Documents par dossier
 */
export const getDocumentsByDossier = async (req, res) => {
  const documents = await Document.find({
    dossier: req.params.dossierId
  }).sort({ uploadedAt: -1 });

  res.json(documents);
};

/**
 * Supprimer un document
 */
export const deleteDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ message: "Document introuvable" });
    }

    await Dossier.findByIdAndUpdate(
      document.dossier,
      { $pull: { documents: document._id } }
    );

    // Ici tu pourras supprimer aussi le fichier Cloudinary
    await document.deleteOne();

    res.json({ message: "Document supprimé" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
