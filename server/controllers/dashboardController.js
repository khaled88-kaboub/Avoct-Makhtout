import Dossier from "../models/Dossier.js";
import Audience from "../models/Audience.js";
import Paiement from "../models/Paiement.js";
import Client from "../models/Client.js";
import FraisJur from "../models/FraisJur.js";
import FraisGle from "../models/FraisGle.js"; 

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

    const fraisJurs = await FraisJur.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$montant" }
        }
      }
    ]);

    const fraisGles = await FraisGle.aggregate([
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
      revenus: paiements[0]?.total || 0,
      fraisjuridiues: fraisJurs[0]?.total || 0,
      fraisgeneral: fraisGles[0]?.total || 0,
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
        populate: { 
          path: "client", 
          select: "noms" }
      });

    res.json(paiements);
  } catch (err) {
    res.status(500).json(err);
  }
};

/* ================= MONTHLY FINANCIAL STATS ================= */
export const getMonthlyFinanceStats = async (req, res) => {
  try {
    const { year } = req.query;

    const matchStage = year
      ? {
          $match: {
            datePaiement: {
              $gte: new Date(`${year}-01-01`),
              $lte: new Date(`${year}-12-31`)
            }
          }
        }
      : null;

    const paiements = await Paiement.aggregate([
      ...(matchStage ? [matchStage] : []),
      {
        $group: {
          _id: {
            year: { $year: "$datePaiement" },
            month: { $month: "$datePaiement" }
          },
          total: { $sum: "$montant" }
        }
      },
      { $sort: { "_id.month": 1 } }
    ]);

    const fraisJur = await FraisJur.aggregate([
      ...(matchStage ? [matchStage] : []),
      {
        $group: {
          _id: {
            year: { $year: "$datePaiement" },
            month: { $month: "$datePaiement" }
          },
          total: { $sum: "$montant" }
        }
      },
      { $sort: { "_id.month": 1 } }
    ]);


    const fraisGle = await FraisGle.aggregate([
      ...(matchStage ? [matchStage] : []),
      {
        $group: {
          _id: {
            year: { $year: "$datePaiement" },
            month: { $month: "$datePaiement" }
          },
          total: { $sum: "$montant" }
        }
      },
      { $sort: { "_id.month": 1 } }
    ]);


    res.json({ paiements, fraisJur, fraisGle });

  } catch (err) {
    res.status(500).json({ message: "Erreur stats mensuelles", err });
  }
};

/* ================= DOSSIERS FINANCE SUMMARY ================= */
export const getDossiersFinanceSummary = async (req, res) => {
  try {
    const { onlyDebts } = req.query; // On récupère le filtre si présent

    const dossiers = await Dossier.find().populate("client", "noms").select("titre price client");
    const paiements = await Paiement.find().select("dossier montant");

    let summary = dossiers.map(d => {
      const totalPaye = paiements
        .filter(p => p.dossier?.toString() === d._id.toString())
        .reduce((sum, p) => sum + p.montant, 0);

      const prixDossier = d.price || 0;
      return {
        _id: d._id,
        titre: d.titre,
        client: d.client?.noms?.join(" ، ") || "غير معروف",
        prix: prixDossier,
        paye: totalPaye,
        dette: prixDossier - totalPaye
      };
    });

    // Appliquer le filtre si demandé
    if (onlyDebts === "true") {
      summary = summary.filter(item => item.dette > 0);
    }

    // Calculer les totaux globaux pour la ligne du bas
    const totals = summary.reduce((acc, curr) => {
      acc.totalPrix += curr.prix;
      acc.totalPaye += curr.paye;
      acc.totalDette += curr.dette;
      return acc;
    }, { totalPrix: 0, totalPaye: 0, totalDette: 0 });

    res.json({ data: summary, totals });
  } catch (err) {
    res.status(500).json({ message: "Erreur résumé financier", err });
  }
};