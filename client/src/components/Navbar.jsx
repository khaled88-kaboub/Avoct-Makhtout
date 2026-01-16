import { NavLink } from "react-router-dom";
import { useState } from "react";
import {
  FaFolderOpen,
  FaUsers,
  FaGavel,
  FaMoneyBillWave,
  FaRegCalendarCheck,
  FaCalendarAlt,
  FaHome,
  FaCog, // أيقونة الإعدادات
  FaChevronDown // أيقونة السهم لأسفل
} from "react-icons/fa";

import "./Navbar.css";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false); // حالة القائمة المنسدلة

  const closeAll = () => {
    setOpen(false);
    setDropdownOpen(false);
  };

  return (
    <nav className="navbar" dir="rtl">
      <button className="menu-toggle" onClick={() => setOpen(!open)}>
        ☰
      </button>

      <div className="navbar-logo">
        <NavLink to="/about" className="nav-link" onClick={closeAll}>
          <FaGavel className="logo-icon" />
          <span className="logo-text">مكتب المحامي</span>
        </NavLink>
      </div>

      <div className={`navbar-links ${open ? "open" : ""}`}>
        <NavLink to="/dashboard" className="nav-link" onClick={closeAll}>
          <FaHome /> الرئيسية
        </NavLink>

        {/* ... بقية الروابط السابقة ... */}
<NavLink to="/dossiers" className="nav-link" onClick={() => setOpen(false)}>
          <FaFolderOpen /> الملفات
        </NavLink>

        <NavLink to="/clients" className="nav-link" onClick={() => setOpen(false)}>
          <FaUsers /> العملاء
        </NavLink>

        <NavLink to="/audiences" className="nav-link" onClick={() => setOpen(false)}>
          <FaCalendarAlt /> الجلسات
        </NavLink>

        <NavLink to="/odiences/calendar" className="nav-link" onClick={() => setOpen(false)}>
          <FaRegCalendarCheck />الرزنامة
        </NavLink>

        <NavLink to="/paiements" className="nav-link" onClick={() => setOpen(false)}>
          <FaMoneyBillWave />المدفوعات
        </NavLink>
        {/* قائمة الإعدادات المنسدلة */}
        <div className="nav-item-dropdown">
          <button 
            className="dropdown-trigger" 
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <FaCog /> الإعدادات <FaChevronDown className="arrow-icon" />
          </button>
          
          {dropdownOpen && (
            <div className="dropdown-menu">
              <NavLink to="/types" className="dropdown-item" onClick={closeAll}>
              أنواع القضايا
              </NavLink>
              <NavLink to="/settings/system" className="dropdown-item" onClick={closeAll}>
              إضافة محكمة
              </NavLink>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}