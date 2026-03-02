import { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { FaFileInvoiceDollar } from "react-icons/fa"; // Nouvelle icône pour le tableau

import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "../styles/FinanceDashboard.css";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend
  } from "chart.js";
  
  import { Bar } from "react-chartjs-2";
  
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend
  );
const API_URL = import.meta.env.VITE_API_URL;

export default function FinanceDashboard() {
  const [data, setData] = useState(null);
  const [year, setYear] = useState(new Date().getFullYear());
  const [sortOrder, setSortOrder] = useState("asc");
  const [financeSummary, setFinanceSummary] = useState([]); // Nouvel état
  useEffect(() => {
    fetchData();
  }, [year]);

  const fetchData = async () => {
    const res = await axios.get(`${API_URL}/api/dashboard/financial?year=${year}`);
    setData(res.data);
  };
  useEffect(() => {
    document.title = "بيانات رقمية ";
  }, []);
  const exportPDF = async () => {
    const element = document.getElementById("dashboard");
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("landscape");
    pdf.addImage(imgData, "PNG", 10, 10, 280, 150);
    pdf.save(`Finance-${year}.pdf`);
  };

  if (!data) return <div>جاري تحميل البيانات...</div>;

  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  const mapData = (arr) =>
    months.map(m => arr.find(x => x._id.month === m)?.total || 0);

  const paiements = mapData(data.paiements);
  const fraisJur = mapData(data.fraisJur);
  const fraisGle = mapData(data.fraisGle);

  const totalPaiements = paiements.reduce((a,b)=>a+b,0);
  const totalDepenses = [...fraisJur,...fraisGle].reduce((a,b)=>a+b,0);
  const gain = totalPaiements - totalDepenses;
  const monthlyExpenses = months.map((_, i) => fraisJur[i] + fraisGle[i]);
  const monthlyProfit = months.map((_, i) => paiements[i] - monthlyExpenses[i]);
 
  
  
  const chartData = {
    labels: [
      "جانفي","فيفري","مارس","أفريل","ماي","جوان",
      "جويلية","أوت","سبتمبر","أكتوبر","نوفمبر","ديسمبر"
    ],
    datasets: [
      { label: "المداخيل", data: paiements, backgroundColor: "#2E86DE" },
      { 
        label: "المصاريف", 
        data: monthlyExpenses, 
        backgroundColor: "#E74C3C" 
      }
    ]
  };

  const tableData = chartData.labels.map((month, index) => ({
    month,
    income: paiements[index],
    expenses: monthlyExpenses[index],
    profit: monthlyProfit[index],
    monthIndex: index
  }));

  const sortedData = [...tableData].sort((a, b) => {
    return sortOrder === "asc"
      ? a.monthIndex - b.monthIndex
      : b.monthIndex - a.monthIndex;
  });
  const exportExcel = () => {
    const worksheetData = sortedData.map(row => ({
      الشهر: row.month,
      المداخيل: row.income,
      المصاريف: row.expenses,
      "صافي الربح": row.profit
    }));
  
    worksheetData.push({
      الشهر: "الإجمالي",
      المداخيل: totalPaiements,
      المصاريف: totalDepenses,
      "صافي الربح": gain
    });
  
    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Finance");
  
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array"
    });
  
    const file = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(file, `التقرير-المالي-${year}.xlsx`);
  };


  return (
    
        <div className="dashboard-container" dir="rtl">
      <div className="top-bar">
        <select value={year} onChange={(e)=>setYear(e.target.value)}>
          {[2023,2024,2025,2026].map(y=>(
            <option key={y}>{y}</option>
          ))}
        </select>

        <button onClick={exportPDF}> PDF</button>
      </div>

      <div id="dashboard">

        <div className="kpi-container">
          <div className="kpi revenu">
            <h4>إجمالي المداخيل</h4>
           <p> {totalPaiements.toLocaleString("ar-DZ")} دج</p>
          </div>

          <div className="kpi depense">
          <h4>إجمالي المصاريف</h4>
            <p>{totalDepenses.toLocaleString()} دج</p>
          </div>

          <div className={`kpi gain ${gain >= 0 ? "positive" : "negative"}`}>
          <h4>صافي الربح</h4>
            <p>{gain.toLocaleString()} دج</p>
          </div>
        </div>

        <div className="chart-box">
          <Bar data={chartData}/>
        </div>


        <div className="table-box">
  <h3>تفاصيل شهرية</h3>
  

 {/* <button 
    className="sort-btn"
    onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
  >
    ترتيب حسب الشهر {sortOrder === "asc" ? "⬆" : "⬇"}
          </button>*/}

  <button className="export-btn" onClick={exportExcel}>Excel</button>

  <table className="finance-table">
    <thead>
      <tr>
        <th>الشهر</th>
        <th>المداخيل</th>
        <th>المصاريف</th>
        <th>صافي الربح</th>
      </tr>
    </thead>
    <tbody>
      {sortedData.map((row, index) => (
        <tr key={index}>
          <td>{row.month}</td>
          <td>{row.income.toLocaleString("ar-DZ")} دج</td>
          <td>{row.expenses.toLocaleString("ar-DZ")} دج</td>
          <td
            style={{
              color: row.profit >= 0 ? "#27AE60" : "#C0392B",
              fontWeight: "bold"
            }}
          >
            {row.profit.toLocaleString("ar-DZ")} دج
          </td>
        </tr>
      ))}

      {/* TOTAL ROW */}
      <tr className="total-row">
        <td>الإجمالي</td>
        <td>{totalPaiements.toLocaleString("ar-DZ")} دج</td>
        <td>{totalDepenses.toLocaleString("ar-DZ")} دج</td>
        <td
          style={{
            color: gain >= 0 ? "#27AE60" : "#C0392B",
            fontWeight: "bold"
          }}
        >
          {gain.toLocaleString("ar-DZ")} دج
        </td>
      </tr>
    </tbody>
  </table>

</div>
      </div>
    </div>
  );
}