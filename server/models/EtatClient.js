import mongoose from "mongoose";

const etatClientSchema = new mongoose.Schema(
  {
    nom: {
      type: String,
      required: true,
      trim: true,
      unique: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("EtatClient", etatClientSchema);