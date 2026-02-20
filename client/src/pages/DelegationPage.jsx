import { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaPlus, FaTrash, FaUserTie } from "react-icons/fa";
import "../styles/delegation.css";

const API_URL = import.meta.env.VITE_API_URL;

export default function DelegationPage() {
  const [delegations, setDelegations] = useState([]);
  const [dossiers, setDossiers] = useState([]);

  const [form, setForm] = useState({
    dossier: "",
    dateAudience: "",
    personne: "",
    adversaire: "",
    demandes: "",
    qpersonne: "",
    qadversaire: ""
  });

  /* ================= FETCH ================= */

  const fetchDelegations = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/delegations`);
      setDelegations(res.data);
    } catch (err) {
      toast.error("خطأ في تحميل التفويضات");
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
    fetchDelegations();
    fetchDossiers();
  }, []);

  /* ================= HANDLERS ================= */

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("FORM DATA 👉", form);
    if (!form.dossier || !form.dateAudience) {
      return toast.warning("يرجى ملء الحقول الإلزامية");
    }

    try {
      await axios.post(`${API_URL}/api/delegations`, form);
      toast.success("تمت إضافة الإنابة");
      setForm({
        dossier: "",
        dateAudience: "",
        personne: "",
        adversaire: "",
        demandes: "",
        qpersonne: "",
        qadversaire: ""
      });
      fetchDelegations();
    } catch (err) {
      toast.error("فشل في إضافة الإنابة");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("هل أنت متأكد من الحذف؟")) return;

    try {
      await axios.delete(`${API_URL}/api/delegations/${id}`);
      toast.success("تم الحذف");
      fetchDelegations();
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
          adversaire: "",
          qpersonne: "",
          qadversaire: ""
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
        adversaire: selected.adversaire, // ✅ String
        qadversaire: selected.qadversaire, // ✅ String
        qpersonne: selected.qualite?.nom || ""
      });
    };
  
    const openRecu = (id) => {
        window.open(
          `${API_URL}/api/delegations/inaba/${id}`,
          "_blank"
        );
      };
  /* ================= UI ================= */

  return (
    <div className="delegation-page" dir="rtl">
      <ToastContainer />
      <div className="page-header">
      <h2><FaUserTie/> إدارة التفويضات</h2>
        
      </div>
      {/* ===== FORM ===== */}
      <form onSubmit={handleSubmit} className="delegation-form">
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
          name="dateAudience"
          value={form.dateAudience}
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

        <input
          type="text"
          name="adversaire"
          placeholder="الخصم"
          value={form.adversaire}
          onChange={handleChange}
        />
         <input
          type="text"
          name="qadversaire"
          placeholder="صفة الخصم"
          value={form.qadversaire}
          onChange={handleChange}
        />

        <textarea
          name="demandes"
          placeholder="الطلبات"
          value={form.demandes}
          onChange={handleChange}
        />

        <button type="submit">
          <FaPlus /> إضافة تفويض
        </button>
      </form>

      {/* ===== LIST ===== */}
      <table className="delegation-table">
        <thead>
          <tr>
            
            <th>تاريخ الجلسة</th>
            <th>العميل</th>
            
            
            <th></th>
          </tr>
        </thead>

        <tbody>
          {delegations.map((d) => (
            <tr key={d._id}>
              
              <td>{new Date(d.dateAudience).toLocaleDateString("ar-DZ")} 
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
