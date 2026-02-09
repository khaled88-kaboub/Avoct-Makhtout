import mongoose from "mongoose";

const chambreSchema = new mongoose.Schema(
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

export default mongoose.model("Chambre", chambreSchema);
