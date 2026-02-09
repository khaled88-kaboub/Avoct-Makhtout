import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

import clientRoutes from "./routes/clientRoute.js";
import dossierRoutes from "./routes/dossierRoute.js";
import audienceRoutes from "./routes/audienceRoute.js";
import paiementRoutes from "./routes/paiementRoute.js";
//import documentRoutes from "./routes/documentRoute.js";
//import authRoutes from "./routes/authRoute.js";
import typeaffRoutes from "./routes/typeAffRoute.js"
import dashboardRoutes from "./routes/dashboardRoute.js";
import courtRoute from "./routes/courtRoute.js"
import tribunalRoute from "./routes/tribunalRoute.js"
import chambreRoute from "./routes/chambreRoute.js";
import classeRoute from "./routes/classeRoute.js";
import typeAudienceRoute from "./routes/typeAudienceRoute.js";
import EtatClientRoute from "./routes/etatClientRoute.js";
import DelegationRoute from "./routes/delegationRoute.js";
import TassisRoute from "./routes/tassisRoute.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//app.use("/api/auth", authRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/dossiers", dossierRoutes);
app.use("/api/typeaffaire", typeaffRoutes);
app.use("/api/courts", courtRoute)
app.use("/api/audiences", audienceRoutes);
app.use("/api/paiements", paiementRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/tribunals", tribunalRoute);
app.use("/api/chambres", chambreRoute);
app.use("/api/classes", classeRoute);
app.use("/api/typeAudiences", typeAudienceRoute);
app.use("/api/etatClients", EtatClientRoute);
app.use("/api/delegations", DelegationRoute);
app.use("/api/tassiss", TassisRoute);
//app.use("/api/documents", documentRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server lancé sur ${PORT}`));
