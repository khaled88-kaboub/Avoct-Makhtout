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
    return (
      <div className="dashboard-page" dir="rtl">
        <h2>لوحة التحكم</h2>
  
        {/* ===== KPI CARDS ===== */}
        <div className="kpi-grid">
          <div className="kpi-card">
            <FaFolderOpen />
            <div>
              <h4>الملفات</h4>
              <span>42 ملف</span>
            </div>
          </div>
  
          <div className="kpi-card">
            <FaCalendarAlt />
            <div>
              <h4>جلسات هذا الشهر</h4>
              <span>8 جلسات</span>
            </div>
          </div>
  
          <div className="kpi-card">
            <FaMoneyBillWave />
            <div>
              <h4>المداخيل</h4>
              <span>320,000 دج</span>
            </div>
          </div>
  
          <div className="kpi-card">
            <FaUsers />
            <div>
              <h4>العملاء</h4>
              <span>27 عميل</span>
            </div>
          </div>
        </div>
  
        {/* ===== MAIN GRID ===== */}
        <div className="dashboard-grid">
          {/* ===== AUDIENCES ===== */}
          <div className="dashboard-box">
            <h3>📅 الجلسات القادمة</h3>
  
            <ul className="list">
              <li>
                <span>جلسة مدنية – ملف 102</span>
                <small>12 / 03 / 2026</small>
              </li>
              <li>
                <span>جلسة جزائية – ملف 87</span>
                <small>15 / 03 / 2026</small>
              </li>
              <li>
                <span>جلسة تجارية – ملف 64</span>
                <small>18 / 03 / 2026</small>
              </li>
            </ul>
          </div>
  
          {/* ===== PAYMENTS ===== */}
          <div className="dashboard-box">
            <h3>💰 آخر المدفوعات</h3>
  
            <ul className="list">
              <li>
                <span>أحمد بن صالح</span>
                <small>50,000 دج</small>
              </li>
              <li>
                <span>سميرة قندوز</span>
                <small>30,000 دج</small>
              </li>
              <li>
                <span>يوسف مهدي</span>
                <small>70,000 دج</small>
              </li>
            </ul>
          </div>
        </div>
  
        {/* ===== QUICK ACTIONS ===== */}
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
  