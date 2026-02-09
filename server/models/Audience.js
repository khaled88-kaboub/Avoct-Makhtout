import mongoose from "mongoose";

const audienceSchema = new mongoose.Schema(
  {
    /* ================= RELATION ================= */
    dossier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Dossier",
      required: true
    },

    /* ================= AUDIENCE INFO ================= */
    dateAudience: {
      type: Date,
      required: true
    },

    typeAudience: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TypeAudience",
      required: true
    },

    

    notes: {
      type: String
    },

    statut: {
      type: String,
      enum: ["مجدولة", "مؤجلة", "منتهية", "ملغاة"],
      default: "مجدولة"
    },

    /* ================= RESULT ================= */
    decision: {
      type: String // منطوق الحكم / ملاحظات بعد الجلسة
    },

    
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Audience", audienceSchema);
