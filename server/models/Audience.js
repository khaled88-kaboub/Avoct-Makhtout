import mongoose from "mongoose";
const audienceSchema = new mongoose.Schema({
    dossier: { type: mongoose.Schema.Types.ObjectId, ref: "Dossier", required: true },
  
    dateAudience: { type: Date, required: true },
    typeAudience: { type: String,
      enum: [
        "مرافعة",
        "تحقيق",
        "سماع الشهود",
        "استجواب",
        "خبرة",
        "صلح",
        "مداولة",
        "النطق بالحكم",
        
        "إجرائية",
        "استعجالية",
        "إعادة السير في الدعوى"
      ],
     }, // ex : "délibération", "comparution", etc.
  
    tribunal: { type: String },
    salle: { type: String },
  
    notes: { type: String },
  
    statut: {
      type: String,
      enum: ["مجدولة", "مؤجلة", "منتهية","ملغاة"],
      default: "مجدولة"
    },
  
    createdAt: { type: Date, default: Date.now }
  });
  
  export default mongoose.model("Audience", audienceSchema);