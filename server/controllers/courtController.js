import Court from "../models/Court.js";

/* ============== CREATE ============== */
export const createCourt = async (req, res) => {
  try {
    const court = await Court.create(req.body);
    res.status(201).json(court);
  } catch (error) {
    res.status(400).json({
      message: "Erreur lors de la création",
      error: error.message
    });
  }
};

/* ============== READ ALL ============== */
export const getCourts = async (req, res) => {
  try {
    const courts = await Court.find().sort({ wilayaNumber: 1 });
    res.status(200).json(courts);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

/* ============== READ ONE ============== */
export const getCourtById = async (req, res) => {
  try {
    const court = await Court.findById(req.params.id);
    if (!court) {
      return res.status(404).json({ message: "Cour non trouvée" });
    }
    res.status(200).json(court);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

/* ============== UPDATE ============== */
export const updateCourt = async (req, res) => {
  try {
    const court = await Court.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!court) {
      return res.status(404).json({ message: "Cour non trouvée" });
    }

    res.status(200).json(court);
  } catch (error) {
    res.status(400).json({
      message: "Erreur lors de la mise à jour",
      error: error.message
    });
  }
};

/* ============== DELETE ============== */
export const deleteCourt = async (req, res) => {
  try {
    const court = await Court.findByIdAndDelete(req.params.id);
    if (!court) {
      return res.status(404).json({ message: "Cour non trouvée" });
    }
    res.status(200).json({ message: "Cour supprimée avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};
