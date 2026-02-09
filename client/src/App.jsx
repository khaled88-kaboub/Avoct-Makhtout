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
import AdminCourtsPage from "./pages/AdminCourtsPage";
import AdminTribunalsPage from "./pages/AdminTribunalPage";
import AdminChambresPage from "./pages/AdminChambrePage";
import AdminClassesPage from "./pages/AdminClassePage";
import AdminTypeAudiencesPage from "./pages/AdminTypeAudiencePage";
import AdminEtatClientsPage from "./pages/AdminEtatClientPage";
import DelegationPage from "./pages/DelegationPage";
import TassisPage from "./pages/TassisPage";
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
          <Route path="/settings/courts" element={<AdminCourtsPage />} />
          <Route path="/settings/tribunaux" element={<AdminTribunalsPage />} />
          <Route path="/settings/courts-chambres" element={<AdminChambresPage />} />
          <Route path="/settings/tribunaux-classes" element={<AdminClassesPage />} />
          <Route path="/settings/type-audiences" element={<AdminTypeAudiencesPage />} />
          <Route path="/settings/etat-clients" element={<AdminEtatClientsPage />} />
          <Route path="/inaba" element={<DelegationPage />} />
          <Route path="/tassis" element={<TassisPage />} />
     
        </Routes>
      </div>
    </Router>
  );
}
