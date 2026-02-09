import mongoose from "mongoose";

const tassisSchema = new mongoose.Schema(
  {
   
    dossier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Dossier",
      required: true
    },

   
    dateTassis: {
      type: Date,
      required: true
    },

    personne: {
        type: String,
        required: true
      },

      qpersonne: {
        type: String,
        required: true
      },

    

    desc: {
      type: String,
      required: true
    },
    
  },

  {
    timestamps: true
  }
);

export default mongoose.model("Tassis", tassisSchema);
