import mongoose from "mongoose";
const fraisGleSchema = new mongoose.Schema({
    
  
    montant: { type: Number, required: true },
    
  
    datePaiement: { type: Date, default: Date.now },
    designationDepGle: { type: mongoose.Schema.Types.ObjectId, ref: "DesignationDepGle", required: true },
  
    
  });
  
  export default mongoose.model("FraisGle", fraisGleSchema);