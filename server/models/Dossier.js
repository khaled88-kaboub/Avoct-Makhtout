import mongoose from "mongoose";
import Counter from "./Counter.js";

const dossierSchema = new mongoose.Schema({
  /* ================= IDENTITE ================= */
  reference: { type: String, unique: true },
  titre: { type: String, required: true },
  description: { type: String },

  /* ================= RELATIONS ================= */
  typeAffaire: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TypeAff",
    required: true
  },

  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client",
    required: true
  },

  qualite: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "EtatClient",
    required: true
  },

  price: {
    type: Number,
    required: true
  },

  numero: {
    type: String,
    required: true
  },

  adversaire: {
    type: String,
    required: true
  },
  salle: {
    type: String,
    required: true
  },

  /* ================= JURIDICTION ================= */
  juridictionType: {
    type: String,
    enum: ["court", "tribunal"],
    required: true
  },

  /* ===== SI COURT ===== */
  court: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Court",
    required: function () {
      return this.juridictionType === "court";
    }
  },
  chambre: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Chambre",
    required: function () {
      return this.juridictionType === "court";
    }
  },
  tribunal: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tribunal",
    required: function () {
      return this.juridictionType === "tribunal";
    }
  },
  classe: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Classe",
    required: function () {
      return this.juridictionType === "tribunal";
    }
  },
  
  /* ================= STATUT ================= */
  statut: {
    type: String,
    enum: ["ملغى", "جارٍ",  "منتهي"],
    default: "جارٍ"
  },

  dateOuverture: { type: Date, default: Date.now },
  dateCloture: { type: Date },

  audiences: [{ type: mongoose.Schema.Types.ObjectId, ref: "Audience" }],
  paiements: [{ type: mongoose.Schema.Types.ObjectId, ref: "Paiement" }],
  documents: [{ type: mongoose.Schema.Types.ObjectId, ref: "Document" }]
});

/* ================= VALIDATION METIER ================= */
dossierSchema.pre("validate", function (next) {
  if (this.juridictionType === "COURT") {
    if (!this.court || !this.chambre) {
      return next(new Error("المجلس القضائي والغرفة مطلوبان"));
    }
    this.tribunal = undefined;
    this.classe = undefined;
  }

  if (this.juridictionType === "TRIBUNAL") {
    if (!this.tribunal || !this.classe) {
      return next(new Error("المحكمة والصنف مطلوبان"));
    }
    this.court = undefined;
    this.chambre = undefined;
  }

  next();
});

/* ================= AUTO REFERENCE ================= */
dossierSchema.pre("save", async function () {
  if (!this.isNew || this.reference) return;

  const counter = await Counter.findOneAndUpdate(
    { name: "dossier" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  this.reference = `ملف-${counter.seq}-${new Date().getFullYear()}`;
});

export default mongoose.model("Dossier", dossierSchema);
