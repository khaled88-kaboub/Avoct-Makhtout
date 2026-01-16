import Client from "../models/Client.js";

// Créer un client
export const createClient = async (req, res) => {
  try {
    const client = await Client.create(req.body);
    res.status(201).json(client);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Récupérer tous les clients
export const getClients = async (req, res) => {
  try {
    const clients = await Client.find(); // plus de populate
    res.status(200).json(clients);
  } catch (error) {
    console.error("Erreur getClients:", error.message);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Récupérer un client par id
export const getClientById = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id); // plus de populate
    if (!client) return res.status(404).json({ message: "Client non trouvé" });
    res.status(200).json(client);
  } catch (error) {
    console.error("Erreur getClientById:", error.message);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Mettre à jour un client
export const updateClient = async (req, res) => {
  try {
    const client = await Client.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!client) return res.status(404).json({ message: "Client non trouvé" });
    res.status(200).json(client);
  } catch (error) {
    console.error("Erreur updateClient:", error.message);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Supprimer un client
export const deleteClient = async (req, res) => {
  try {
    const client = await Client.findByIdAndDelete(req.params.id);
    if (!client) return res.status(404).json({ message: "Client non trouvé" });
    res.status(200).json({ message: "Client supprimé" });
  } catch (error) {
    console.error("Erreur deleteClient:", error.message);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
