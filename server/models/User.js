import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    nom: String,
    email: { type: String, unique: true },
    motDePasse: String,
  
    role: { type: String, enum: ["avocat", "assistant"], default: "assistant" }
  });
  
  export default mongoose.model("User", userSchema);