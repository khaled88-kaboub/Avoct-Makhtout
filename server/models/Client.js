import mongoose from "mongoose";

const clientSchema = new mongoose.Schema(
  {
    // Physique ou Moral
    typeClient: {
      type: String,
      enum: ["شخص طبيعي", "شخص معنوي"],
      required: true,
      default: "شخص طبيعي"
    },

    // Plusieurs noms possibles (ex: héritiers, associés, sociétés liées…)
    noms: {
      type: [String],
      required: true,
      validate: {
        validator: v => Array.isArray(v) && v.length > 0,
        message: "Au moins un nom est requis"
      }
    },

    adresse: { type: String },
    telephone: { type: String },
    email: { type: String },
    cin: { type: String }, // seulement pour personne physique
    dateNaissance: { type: Date },

    createdAt: { type: Date, default: Date.now }
  },
  {
    timestamps: true // createdAt & updatedAt automatiques
  }
);

export default mongoose.model("Client", clientSchema);
