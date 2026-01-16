import Dossier from "../models/Dossier.js";
import Client from "../models/Client.js";




export const createDossier = async (req, res) => {
  try {

    console.log("📦 BODY REÇU:", req.body); // 
    const dossier = await Dossier.create(req.body);

   

    res.status(201).json(dossier);
  } catch (error) {

 
    res.status(400).json({ message: error.message });
  }
};

export const getDossiers = async (req, res) => {
  const dossiers = await Dossier.find()
    .populate("client", "nom prenom")
    .populate("typeAffaire", "libelle")
    ;
  res.json(dossiers);
};

export const getDossierById = async (req, res) => {
  const dossier = await Dossier.findById(req.params.id)
    .populate("client")
    ;
  res.json(dossier);
};

export const updateDossier = async (req, res) => {
  const dossier = await Dossier.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(dossier);
};

export const closeDossier = async (req, res) => {
  const dossier = await Dossier.findByIdAndUpdate(
    req.params.id,
    { statut: "منتهي", dateCloture: new Date() },
    { new: true }
  );
  res.json(dossier);
};
