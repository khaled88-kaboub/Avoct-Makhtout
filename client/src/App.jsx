import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Composants
import Navbar from "./components/Navbar";
import ClientsPage from "./pages/ClientsPage";
import DossiersPage from "./pages/DossierPage";
import TypeAffPage from "./pages/TypeAffPage";
import AudiencesPage from "./pages/AudiencePage";
import AudienceCalendar from "./pages/AudienceCalendar";
import Dashboard from "./pages/Dashboard";
import PaiementsPage from "./pages/PaiementPage";
import AboutPage from "./pages/AboutPage";

export default function App() {
  return (
    <Router>
      <Navbar />
      <div className="page-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/clients" element={<ClientsPage />} />
          <Route path="/dossiers" element={<DossiersPage />} />
          <Route path="/types" element={<TypeAffPage />} />
          <Route path="/audiences" element={<AudiencesPage />} />
          <Route path="/paiements" element={<PaiementsPage />} />
          <Route path="/odiences/calendar" element={<AudienceCalendar />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}
