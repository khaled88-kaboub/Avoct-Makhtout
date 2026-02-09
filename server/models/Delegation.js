import mongoose from "mongoose";

const delegationSchema = new mongoose.Schema(
  {
   
    dossier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Dossier",
      required: true
    },

   
    dateAudience: {
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

    adversaire: {
        type: String,
        required: true
      },

      qadversaire: {
        type: String,
        required: true
      },

    demandes: {
      type: String,
      required: true
    },
    
  },

  {
    timestamps: true
  }
);

export default mongoose.model("Delegation", delegationSchema);
