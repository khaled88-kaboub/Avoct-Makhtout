import { useEffect, useState } from "react";
import axios from "axios";

import "../styles/dossiers.css";

const API_URL = import.meta.env.VITE_API_URL;

export default function DossiersPage() {
  const [dossiers, setDossiers] = useState([]);
  const [clients, setClients] = useState([]);
  const [typesAff, setTypesAff] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [filterStatut, setFilterStatut] = useState("");
  
  const [form, setForm] = useState({
    titre: "",
    description: "",
    typeAffaire: "",
    client: "",
    statut: "جارٍ",
  });
  
  /* ================= FETCH DATA ================= */
  const loadData = async () => {
    try {
      const [dRes, cRes, tRes] = await Promise.all([
        axios.get(`${API_URL}/api/dossiers`),
        axios.get(`${API_URL}/api/clients`),
        axios.get(`${API_URL}/api/typeaffaire`),
      ]);
      

      setDossiers(Array.isArray(dRes.data) ? dRes.data : []);
      setClients(Array.isArray(cRes.data) ? cRes.data : []);
      setTypesAff(Array.isArray(tRes.data) ? tRes.data : []);
    } catch (err) {
      console.error(err);
      alert("حدث خطأ أثناء تحميل البيانات");
    }
  };

  useEffect(() => {
    loadData();
  }, []);
  useEffect(() => {
    document.title = "ملفات المحامي";
  }, []);
  /* ================= HANDLERS ================= */
  const openAddModal = () => {
    setEditId(null);
    setForm({ titre: "", price: "",  description: "", typeAffaire: "", client: "", statut: "جارٍ" });
    setShowModal(true);
  };

  const openEditModal = (d) => {
    setEditId(d._id);
    setForm({
      titre: d.titre,
      price: d.price,
      description: d.description || "",
      typeAffaire: d.typeAffaire?._id || "",
      client: d.client?._id || "",
      statut: d.statut,
      dateCloture: d.dateCloture || "", // <-- ajoute cette ligne
    });
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newForm = { ...form, [name]: value };
  
    // Si statut devient منتهي → définir date par défaut
    if (name === "statut" && value === "منتهي" && !form.dateCloture) {
      newForm.dateCloture = new Date().toISOString().slice(0, 10);
    }
  
    // ⭐ Si statut ≠ منتهي → vider dateCloture
    if (name === "statut" && value !== "منتهي") {
      newForm.dateCloture = "";
    }
  
    setForm(newForm);
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("FORM SENT TO API:", form);
    try {
      if (editId) {
        await axios.put(`${API_URL}/api/dossiers/${editId}`, form);
      } else {
        await axios.post(`${API_URL}/api/dossiers`, form);
      }
      setShowModal(false);
      loadData();
    } catch (err) {
      console.error(err);
      alert("حدث خطأ أثناء حفظ الملف");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("هل أنت متأكد من حذف الملف؟")) return;
    try {
      await axios.delete(`${API_URL}/api/dossiers/${id}`);
      loadData();
    } catch (err) {
      console.error(err);
      alert("حدث خطأ أثناء الحذف");
    }
  };

  const filteredDossiers = dossiers.filter((d) => {
    const text = searchText.toLowerCase();
  
    const matchText =
      d.titre?.toLowerCase().includes(text) ||
     
      d.client?.nom?.toLowerCase().includes(text) ||
      d.client?.prenom?.toLowerCase().includes(text) ||
      d.reference?.toLowerCase().includes(text);
  
    const matchStatut = filterStatut
      ? d.statut === filterStatut
      : true;
  
    return matchText && matchStatut;
  });
  

  /* ================= UI ================= */
  return (
    <div className="dossiers-page" dir="rtl">
      <div className="page-header">
        <h2>📁 الملفات القضائية</h2>
        <button className="btn-add" onClick={openAddModal}>
          ➕ ملف جديد
        </button>
      </div>
      <div className="filters-bar">
  <input
    type="text"
    placeholder="🔍 البحث بالعنوان أو اسم العميل"
    value={searchText}
    onChange={(e) => setSearchText(e.target.value)}
  />

  <select
    value={filterStatut}
    onChange={(e) => setFilterStatut(e.target.value)}
  >
    <option value="">كل الحالات</option>
    <option value="جارٍ">جارٍ</option>
    <option value="مؤجل">مؤجل</option>
    <option value="منتهي">منتهي</option>
    <option value="ملغى">ملغى</option>
  </select>
</div>

<div className="filters-separator">
  <span>
    نتائج الملفات ({filteredDossiers.length})
  </span>
</div>


      <div className="dossiers-cards">
      {Array.isArray(filteredDossiers) && filteredDossiers.length > 0 ? (
  filteredDossiers.map((d) => (

            <div className="dossier-card" key={d._id}>
              <div className="card-header">
              
                <h3>{d.titre}</h3>
                <span className={`baadge ${d.statut}`}>{d.statut}</span>
              </div>
              
              <p>🔖 المرجع: {d.reference || "-"}</p>
              <p>📌 نوع القضية: {d.typeAffaire?.libelle || "-"}</p>
              <p>👤 العميل: {d.client?.nom || "-"} {d.client?.prenom || "-"}</p>
              <p>
                📅 تاريخ الفتح:{" "}
                {d.dateOuverture
                  ? new Date(d.dateOuverture).toLocaleDateString("ar-DZ")
                  : "-"}
              </p>
              {d.dateCloture && (
              <p>
              📅 تاريخ الإغلاق: {new Date(d.dateCloture).toLocaleDateString("ar-DZ")}
              </p>
               )}
               <div>💵 أتعاب المحامي: {d.price || "-"}  دج</div>
              <div className="card-actions">
                <button onClick={() => openEditModal(d)}>✏️ تعديل</button>
                <button onClick={() => handleDelete(d._id)}>🗑️ حذف</button>
              </div>
            </div>
          ))
        ) : (
          <p style={{ textAlign: "center", marginTop: "20px" }}>
            لا توجد ملفات بعد
          </p>
        )}
      </div>

      {/* ================= MODAL ================= */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>{editId ? "تعديل ملف" : "إضافة ملف جديد"}</h3>

            <form onSubmit={handleSubmit} className="modal-form">
              <input
                name="titre"
                placeholder="عنوان الملف"
                value={form.titre}
                onChange={handleChange}
                required
              />

              <select
                name="typeAffaire"
                value={form.typeAffaire}
                onChange={handleChange}
                required
              >
                <option value="">نوع القضية</option>
                {typesAff.map((t) => (
                  <option key={t._id} value={t._id}>
                    {t.libelle}
                  </option>
                ))}
              </select>
              <input
                type="number"
                name="price"
                placeholder=" أتعاب المحامي"
                value={form.price}
                onChange={handleChange}
                required
              />
              <select
                name="client"
                value={form.client}
                onChange={handleChange}
                required
              >
                <option value="">العميل</option>
                {clients.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.nom} {c.prenom}
                  </option>
                ))}
              </select>

              <select
                name="statut"
                value={form.statut}
                onChange={handleChange}
              >
                <option value="جارٍ">جارٍ</option>
                <option value="مؤجل">مؤجل</option>
                <option value="منتهي">منتهي</option>
                <option value="ملغى">ملغى</option>
              </select>
              {form.statut === "منتهي" && (
  <input
    type="date"
    name="dateCloture"
    value={form.dateCloture ? form.dateCloture.slice(0, 10) : ""}
    onChange={handleChange}
    placeholder="تاريخ الإغلاق"
  />
)}
              <textarea
                name="description"
                placeholder="وصف الملف (اختياري)"
                value={form.description}
                onChange={handleChange}
              />

              <div className="modal-actions">
                <button className="btn-primary">حفظ</button>
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setShowModal(false)}
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
