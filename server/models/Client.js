import mongoose from "mongoose";

const clientSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  prenom: { type: String },
  adresse: { type: String },
  telephone: { type: String },
  email: { type: String },
  cin: { type: String }, // carte d'identité (optionnel)
  dateNaissance: { type: Date },

 

  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Client", clientSchema);