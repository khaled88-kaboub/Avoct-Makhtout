const documentSchema = new mongoose.Schema({
    dossier: { type: mongoose.Schema.Types.ObjectId, ref: "Dossier", required: true },
  
    titre: { type: String, required: true },
    type: { type: String }, // ex : "jugement", "contrat", "preuve"
    fichierURL: { type: String, required: true }, // lien vers file storage (Cloudinary)
  
    uploadedAt: { type: Date, default: Date.now }
  });
  
  export default mongoose.model("Document", documentSchema);