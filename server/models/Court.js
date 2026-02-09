import mongoose from "mongoose";

const courtSchema = new mongoose.Schema(
  {
    wilayaNumber: {
      type: Number,
      required: true,
      min: 1,
      max: 58
    },
    nom: {
      type: String,
      required: true,
      trim: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("Court", courtSchema);
