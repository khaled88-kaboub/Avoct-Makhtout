import mongoose from "mongoose";
import Counter from "./Counter.js";


const dossierSchema = new mongoose.Schema({
    reference: { type: String, unique: true }, // généré automatiquement
    titre: { type: String, required: true },
    description: { type: String },
  
    typeAffaire: 
      { type: mongoose.Schema.Types.ObjectId, ref: "TypeAff", required: true, },
      
    client: { type: mongoose.Schema.Types.ObjectId, ref: "Client", required: true },
    price: { type: Number, required: true },
    
  
    statut: {
      type: String,
      enum: [
        "ملغى",
        "جارٍ",
        "مؤجل",
        "منتهي"
      ],
      default: "جارٍ"
    },
  
    dateOuverture: { type: Date, default: Date.now },
    dateCloture: { type: Date },
  
    audiences: [{ type: mongoose.Schema.Types.ObjectId, ref: "Audience" }],
    paiements: [{ type: mongoose.Schema.Types.ObjectId, ref: "Paiement" }],
    documents: [{ type: mongoose.Schema.Types.ObjectId, ref: "Document" }]
  });
  
 /* 🔥 génération automatique - Version Moderne */
dossierSchema.pre("save", async function () { 
  // 1. On vérifie si c'est un nouveau document ou si la référence existe déjà
  if (!this.isNew || this.reference) return; 

  try {
    const counter = await Counter.findOneAndUpdate(
      { name: "dossier" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    this.reference = `${new Date().getFullYear()}-${counter.seq}-ملف`;
    // Pas besoin de next() ici, la fin de la fonction async suffit
  } catch (error) {
    // Si une erreur survient, on la jette pour que Mongoose l'attrape
    throw error; 
  }
});
  export default mongoose.model("Dossier", dossierSchema);
  