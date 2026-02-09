import mongoose from "mongoose";

const tribunalSchema = new mongoose.Schema(
  {
    nom: {
      type: String,
      required: true,
      trim: true
    },
    cour: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Court",
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("Tribunal", tribunalSchema);
