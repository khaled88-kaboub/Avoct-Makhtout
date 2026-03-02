import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
    FaFolderOpen,
    FaCalendarAlt,
    FaMoneyBillWave,
    FaUsers,
    FaPlus,
    FaChartLine
} from "react-icons/fa";

import "../styles/dashboard.css";
import { FaFileInvoiceDollar } from "react-icons/fa"; // Nouvelle icône pour le tableau
import * as XLSX from 'xlsx'; // Importation de la librairie

export default function Dashboard() {
  const [stats, setStats] = useState({});
  const [audiences, setAudiences] = useState([]);
  const [paiements, setPaiements] = useState([]);
  const [paiements1, setPaiements1] = useState([]);
  const [paiements2, setPaiements2] = useState([]);
  const [financeSummary, setFinanceSummary] = useState([]);
  const [financeData, setFinanceData] = useState({ data: [], totals: {} });
  const [showOnlyDebts, setShowOnlyDebts] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  useEffect(() => {
    loadDashboard();
  }, []);
  useEffect(() => {
    document.title = "لوحة تحكم المحامي";
  }, []);
  const loadDashboard = async () => {
    const summary = await axios.get(`${API_URL}/api/dashboard/summary?onlyDebts=${showOnlyDebts}`);
    
    const [s, a, p] = await Promise.all([
      axios.get(`${API_URL}/api/dashboard/stats`),
      axios.get(`${API_URL}/api/dashboard/audiences-upcoming`),
      axios.get(`${API_URL}/api/dashboard/last-paiements`),
     
    ]);

    setStats(s.data);
    setAudiences(a.data);
    setPaiements(p.data);
    setFinanceData(summary.data);
  };

  useEffect(() => {
    loadDashboard();
  }, [showOnlyDebts]); // Recharge quand on change le filtre
// ... à l'intérieur de ton composant Dashboard
const exportToExcel = () => {
  // 1. Préparer les données pour Excel (noms de colonnes en Arabe ou Français)
  const dataToExport = financeData.data.map((item) => ({
      "الملف": item.titre,
      "الموكل": item.client,
      "الأتعاب (دج)": item.prix,
      "المدفوع (دج)": item.paye,
      "الباقي (دج)": item.dette
  }));

  // 2. Ajouter la ligne de total à la fin
  dataToExport.push({
      "الملف": "الإجمالي العام",
      "الموكل": "",
      "الأتعاب (دج)": financeData.totals.totalPrix,
      "المدفوع (دج)": financeData.totals.totalPaye,
      "الباقي (دج)": financeData.totals.totalDette
  });

  // 3. Création du classeur
  const worksheet = XLSX.utils.json_to_sheet(dataToExport);
  
  // Optionnel : Ajuster la direction pour l'Arabe (RTL) dans Excel
  worksheet['!dir'] = "rtl";

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "التقرير المالي");

  // 4. Téléchargement
  const date = new Date().toLocaleDateString("fr-CA"); // Format YYYY-MM-DD
  XLSX.writeFile(workbook, `Rapport_Financier_${date}.xlsx`);
};
  return (
    <div className="dashboard-page" dir="rtl">
      <h2>لوحة القيادة</h2>

      {/* ===== KPI ===== */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <FaFolderOpen />
          <div>
            <h4>الملفات</h4>
            <span>{stats.dossiers || 0}</span>
          </div>
        </div>


        <div className="kpi-card">
          <FaUsers />
          <div>
            <h4>العملاء</h4>
            <span>{stats.clients || 0}</span>
          </div>
        </div>


        <div className="kpi-card">
          <FaCalendarAlt />
          <div>
            <h4>جلسات هذا الشهر</h4>
            <span>{stats.audiences || 0}</span>
          </div>
        </div>

        <div className="kpi-card">
          <FaMoneyBillWave />
          <div>
            <h4>المداخيل</h4>
            <span>{stats.revenus || 0} دج</span>
          </div>
        </div>

        <div className="kpi-card">
          <FaMoneyBillWave />
          <div>
            <h4>المصاريف العامة</h4>
            <span >{stats.fraisgeneral || 0} دج</span>
          </div>
        </div>

        <div className="kpi-card">
          <FaMoneyBillWave />
          <div>
            <h4>المصاريف القضائية</h4>
            <span>{stats.fraisjuridiues || 0} دج</span>
          </div>
        </div>

       
      </div>

{/* ===== TABLEAU RÉSUMÉ FINANCIER ===== */}
<div className="dashboard-box full-width">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3><FaFileInvoiceDollar /> ملخص المستحقات المالية</h3>
          <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
          <button 
            onClick={exportToExcel}
            className="btn-export-excel"
            style={{ 
                backgroundColor: "#27ae60", 
                color: "white", 
                border: "none", 
                padding: "5px 15px", 
                borderRadius: "5px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px"
            }}
        >
            📥 تصدير Excel
        </button>
          <label className="filter-label">
            <input 
              type="checkbox" 
              checked={showOnlyDebts} 
              onChange={() => setShowOnlyDebts(!showOnlyDebts)} 
            />
            عرض الديون فقط
          </label>
        </div>
        </div>
        <div className="table-responsive">
          <table className="summary-table">
            <thead>
              <tr>
                <th>الملف</th>
                <th>الموكل</th>
                <th>الأتعاب</th>
                <th>المدفوع</th>
                <th>الباقي</th>
              </tr>
            </thead>
            <tbody>
              {financeData.data.map(item => (
                <tr key={item._id}>
                  <td>{item.titre}</td>
                  <td>{item.client}</td>
                  <td>{item.prix.toLocaleString()} دج</td>
                  <td className="txt-green">{item.paye.toLocaleString()} دج</td>
                  <td className={item.dette > 0 ? "txt-red" : "txt-green"}>
                    {item.dette.toLocaleString()} {item.dette > 0 ? "دج" : "✓"}
                  </td>
                </tr>
              ))}
            </tbody>
            {/* LIGNE DES TOTAUX */}
            <tfoot className="table-footer">
              <tr>
                <td colSpan="2">الإجمالي العام</td>
                <td>{financeData.totals.totalPrix?.toLocaleString()} دج</td>
                <td className="txt-green">{financeData.totals.totalPaye?.toLocaleString()} دج</td>
                <td className="txt-red" style={{fontSize: '1.2rem'}}>{financeData.totals.totalDette?.toLocaleString()} دج</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
  
      {/* ===== LISTS ===== */}
      <div className="dashboard-grid">
        <div className="dashboard-box">
          <h3>📅 الجلسات القادمة</h3>
          <ul className="list">
            {audiences.map(a => (
              <li key={a._id}>
                <span>{a.dossier?.titre} {a.typeAffaire}</span>
                <small>{new Date(a.dateAudience).toLocaleDateString("ar-DZ")}</small>
              </li>
            ))}
          </ul>
        </div>
      {/* ===== PAYMENTS ===== */}
        <div className="dashboard-box">
          <h3>💰 آخر المدفوعات</h3>
          <ul className="list">
            {paiements.map(p => (
              <li key={p._id}>
                <span>
                  {p.dossier?.client?.noms.join(" ، ")} 
                </span>
                <small>{p.montant} دج</small>
              </li>
            ))}
          </ul>
        </div>
        
      </div>
      <div className="quick-actions">
          
          <button onClick={() => navigate("/financial")}>
  <FaChartLine /> تقرير مالي
</button>
        </div>
    </div>
    
  );
}
