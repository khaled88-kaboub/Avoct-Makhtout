import { useEffect, useState } from "react";
import axios from "axios";
import {
    FaFolderOpen,
    FaCalendarAlt,
    FaMoneyBillWave,
    FaUsers,
    FaPlus,
    FaChartLine
} from "react-icons/fa";

import "../styles/dashboard.css";



export default function Dashboard() {
  const [stats, setStats] = useState({});
  const [audiences, setAudiences] = useState([]);
  const [paiements, setPaiements] = useState([]);
  const [paiements1, setPaiements1] = useState([]);
  const [paiements2, setPaiements2] = useState([]);
  const API_URL = import.meta.env.VITE_API_URL;
  useEffect(() => {
    loadDashboard();
  }, []);
  useEffect(() => {
    document.title = "لوحة تحكم المحامي";
  }, []);
  const loadDashboard = async () => {
    const [s, a, p] = await Promise.all([
      axios.get(`${API_URL}/api/dashboard/stats`),
      axios.get(`${API_URL}/api/dashboard/audiences-upcoming`),
      axios.get(`${API_URL}/api/dashboard/last-paiements`)
    ]);

    setStats(s.data);
    setAudiences(a.data);
    setPaiements(p.data);
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
          <button>
            <FaPlus /> ملف جديد
          </button>
          <button>
            <FaCalendarAlt /> إضافة جلسة
          </button>
          <button>
            <FaMoneyBillWave /> تسجيل دفع
          </button>
          <button>
            <FaChartLine /> تقرير مالي
          </button>
        </div>
    </div>
    
  );
}
