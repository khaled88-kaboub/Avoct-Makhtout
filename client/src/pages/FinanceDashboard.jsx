import { useEffect, useState } from "react";
import axios from "axios";

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

  useEffect(() => {
    fetchData();
  }, [year]);

  const fetchData = async () => {
    const res = await axios.get(`${API_URL}/api/dashboard/financial?year=${year}`);
    setData(res.data);
  };

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

  const chartData = {
    labels: [
        "جانفي","فيفري","مارس","أفريل","ماي","جوان",
        "جويلية","أوت","سبتمبر","أكتوبر","نوفمبر","ديسمبر"
      ],
    datasets: [
      { label: "المداخيل", data: paiements, backgroundColor: "#2E86DE" },
      { label: "المصاريف", data: months.map((_,i)=>fraisJur[i]+fraisGle[i]), backgroundColor: "#E74C3C" }
    ]
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

      </div>
    </div>
  );
}