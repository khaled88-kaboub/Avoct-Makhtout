import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const login = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(401).json({ message: "Email incorrect" });

  const isMatch = await bcrypt.compare(req.body.motDePasse, user.motDePasse);
  if (!isMatch) return res.status(401).json({ message: "Mot de passe incorrect" });

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({ token, user });
};
