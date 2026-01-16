import mongoose from "mongoose";
const paiementSchema = new mongoose.Schema({
    dossier: { type: mongoose.Schema.Types.ObjectId, ref: "Dossier", required: true },
  
    montant: { type: Number, required: true },
    modePaiement: {
      type: String,
      enum: ["نقد", "تحويل بنكي", "شيك"],
      required: true
    },
  
    datePaiement: { type: Date, default: Date.now },
    description: { type: String },
  
    reste: { type: Number, default: 0 }
  });
  
  export default mongoose.model("Paiement", paiementSchema);