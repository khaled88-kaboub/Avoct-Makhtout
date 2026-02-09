import { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaPlus, FaTrash, FaUserTie } from "react-icons/fa";
import "../styles/tassis.css";

const API_URL = import.meta.env.VITE_API_URL;

export default function TassisPage() {
  const [tassiss, setTassiss] = useState([]);
  const [dossiers, setDossiers] = useState([]);

  const [form, setForm] = useState({
    dossier: "",
    dateTassis: "",
    personne: "",
   
    desc: "",
    qpersonne: "",
    
  });

  /* ================= FETCH ================= */

  const fetchTassiss = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/tassiss`);
      setTassiss(res.data);
    } catch (err) {
      toast.error("خطأ في تحميل ");
    }
  };

  const fetchDossiers = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/dossiers`);
      setDossiers(res.data);
    } catch (err) {
      toast.error("خطأ في تحميل الملفات");
    }
  };

  useEffect(() => {
    fetchTassiss();
    fetchDossiers();
  }, []);

  /* ================= HANDLERS ================= */

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("FORM DATA 👉", form);
    if (!form.dossier || !form.dateTassis) {
      return toast.warning("يرجى ملء الحقول الإلزامية");
    }

    try {
      await axios.post(`${API_URL}/api/tassiss`, form);
      toast.success("تمت إضافة ");
      setForm({
        dossier: "",
        dateTassis: "",
        personne: "",
       
        desc: "",
        qpersonne: "",
        
      });
      fetchTassiss();
    } catch (err) {
      toast.error("فشل في إضافة ");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("هل أنت متأكد من الحذف؟")) return;

    try {
      await axios.delete(`${API_URL}/api/tassiss/${id}`);
      toast.success("تم الحذف");
      fetchTassiss();
    } catch (err) {
      toast.error("فشل في الحذف");
    }
  };
  const handleDossierChange = (e) => {
    const dossierId = e.target.value;
    const selected = dossiers.find(d => d._id === dossierId);
  
    if (!selected) {
        setForm({
          ...form,
          dossier: "",
          personne: "",
          
          qpersonne: ""
        });
        return;
      }
    
      const clientName = Array.isArray(selected.client?.noms)
        ? selected.client.noms.join("--")
        : selected.client?.noms || "";
    
      setForm({
        ...form,
        dossier: dossierId,
        personne: clientName,          // ✅ String
        /// String
        qpersonne: selected.qualite?.nom || ""
      });
    };
  
    const openRecu = (id) => {
        window.open(
          `${API_URL}/api/tassiss/tassis/${id}`,
          "_blank"
        );
      };
  /* ================= UI ================= */

  return (
    <div className="tassis-page" dir="rtl">
      <ToastContainer />
      <div className="page-header">
      <h2><FaUserTie/> إدارة إعلانات التأسيس </h2>
        
      </div>
      {/* ===== FORM ===== */}
      <form onSubmit={handleSubmit} className="tassis-form">
      <select
  name="dossier"
  value={form.dossier}
  onChange={handleDossierChange}
>
  <option value="">-- اختر الملف --</option>
  {dossiers.map((d) => (
    <option key={d._id} value={d._id}>
      {d.reference} - {d.titre}
    </option>
  ))}
</select>


        <input
          type="date"
          name="dateTassis"
          value={form.dateTassis}
          onChange={handleChange}
        />

        <input
          type="text"
          name="personne"
          placeholder="العميل "
          value={form.personne}
          onChange={handleChange}
        />
        <input
          type="text"
          name="qpersonne"
          placeholder="صفة العميل "
          value={form.qpersonne}
          onChange={handleChange}
        />

       

        <textarea
          name="desc"
          placeholder="ديباجة"
          value={form.desc}
          onChange={handleChange}
        />

        <button type="submit">
          <FaPlus /> إضافة إعلان تأسيس 
        </button>
      </form>

      {/* ===== LIST ===== */}
      <table className="tassis-table">
        <thead>
          <tr>
            
            <th>تاريخ الإعلان </th>
            <th>العميل</th>
            
            
            <th></th>
          </tr>
        </thead>

        <tbody>
          {tassiss.map((d) => (
            <tr key={d._id}>
              
              <td>{new Date(d.dateTassis).toLocaleDateString("ar-DZ")} 
              <div>الملف: {d.dossier?.titre}</div>
              <div>العميل: {d.dossier?.client?.noms?.join(" / ") || "-"}</div>
              
              </td>
             
             
              
              <td>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(d._id)}
                >
                  <FaTrash />
                </button>
                <span><button onClick={() => openRecu(d._id)}>
                📄
                </button></span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
