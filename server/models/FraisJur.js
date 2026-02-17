import mongoose from "mongoose";
const fraisJurSchema = new mongoose.Schema({
    dossier: { type: mongoose.Schema.Types.ObjectId, ref: "Dossier", required: true },
  
    montant: { type: Number, required: true },
    
  
    datePaiement: { type: Date, default: Date.now },
    designationDepJur: { type: mongoose.Schema.Types.ObjectId, ref: "DesignationDepJur", required: true },
  
    
  });
  
  export default mongoose.model("FraisJur", fraisJurSchema);