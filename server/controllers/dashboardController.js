import Dossier from "../models/Dossier.js";
import Audience from "../models/Audience.js";
import Paiement from "../models/Paiement.js";
import Client from "../models/Client.js";

/* ================= STATS ================= */
export const getDashboardStats = async (req, res) => {
  try {
    const totalDossiers = await Dossier.countDocuments();
    const totalClients = await Client.countDocuments();

    const audiencesThisMonth = await Audience.countDocuments({
      dateAudience: {
        $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        $lte: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
      }
    });

    const paiements = await Paiement.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$montant" }
        }
      }
    ]);

    res.json({
      dossiers: totalDossiers,
      clients: totalClients,
      audiences: audiencesThisMonth,
      revenus: paiements[0]?.total || 0
    });

  } catch (err) {
    res.status(500).json({ message: "Erreur dashboard", err });
  }
};

/* ================= UPCOMING AUDIENCES ================= */
export const getUpcomingAudiences = async (req, res) => {
  try {
    const audiences = await Audience.find({
      dateAudience: { $gte: new Date() }
    })
      .sort({ dateAudience: 1 })
      .limit(5)
      .populate("dossier", "titre");

    res.json(audiences);
  } catch (err) {
    res.status(500).json(err);
  }
};

/* ================= LAST PAYMENTS ================= */
export const getLastPaiements = async (req, res) => {
  try {
    const paiements = await Paiement.find()
      .sort({ datePaiement: -1 })
      .limit(5)
      .populate({
        path: "dossier",
        populate: { path: "client", select: "nom prenom" }
      });

    res.json(paiements);
  } catch (err) {
    res.status(500).json(err);
  }
};
