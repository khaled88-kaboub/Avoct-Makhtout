import Client from "../models/Client.js";

/* ================= CREATE ================= */
export const createClient = async (req, res) => {
  try {
    if (req.body.typeClient === "شخص معنوي") {
      req.body.cin = undefined;
      req.body.dateNaissance = undefined;
    }
    const client = await Client.create(req.body);
   
    
    res.status(201).json(client);
  } catch (error) {
    console.error("Erreur createClient:", error.message);
    res.status(400).json({
      message: "Données invalides",
      error: error.message
    });
  }
};

/* ================= READ ALL ================= */
export const getClients = async (req, res) => {
  try {
    const clients = await Client.find().sort({ createdAt: -1 });
    res.status(200).json(clients);
  } catch (error) {
    console.error("Erreur getClients:", error.message);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

/* ================= READ ONE ================= */
export const getClientById = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) {
      return res.status(404).json({ message: "Client non trouvé" });
    }
    res.status(200).json(client);
  } catch (error) {
    console.error("Erreur getClientById:", error.message);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

/* ================= UPDATE ================= */
export const updateClient = async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (req.body.typeClient === "شخص معنوي") {
      updateData.$unset = {
        cin: "",
        dateNaissance: ""
      };
      delete updateData.cin;
      delete updateData.dateNaissance;
    }

    const client = await Client.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!client) {
      return res.status(404).json({ message: "Client non trouvé" });
    }

    res.status(200).json(client);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


/* ================= DELETE ================= */
export const deleteClient = async (req, res) => {
  try {
    const client = await Client.findByIdAndDelete(req.params.id);

    if (!client) {
      return res.status(404).json({ message: "Client non trouvé" });
    }

    res.status(200).json({ message: "Client supprimé avec succès" });
  } catch (error) {
    console.error("Erreur deleteClient:", error.message);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
