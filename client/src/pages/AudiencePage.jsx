import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/audiences.css";

const today = () => new Date().toISOString().slice(0, 10);


export default function AudiencesPage() {
  const [audiences, setAudiences] = useState([]);
  const [dossiers, setDossiers] = useState([]);
  const [typesAudience, setTypesAudience] = useState([]);
  const [filterDate, setFilterDate] = useState(today());


  const API_URL = import.meta.env.VITE_API_URL;
  /* ===== filters ===== */
  const [filterStatut, setFilterStatut] = useState("");
  const [filterType, setFilterType] = useState("");

  /* ===== modal ===== */
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    dossier: "",
    dateAudience: "",
    typeAudience: "",
    notes: "",
    decision: "",
    statut: "مجدولة",
  });
  

  /* ================= FETCH ================= */
  const loadData = async () => {
    const [aRes, dRes, tRes] = await Promise.all([
      axios.get(`${API_URL}/api/audiences`),
      axios.get(`${API_URL}/api/dossiers`),
      axios.get(`${API_URL}/api/typeAudiences`),
    ]);
  
    setAudiences(aRes.data || []);
    setDossiers(dRes.data || []);
    setTypesAudience(tRes.data || []);
  };
  

  useEffect(() => {
    loadData();
  }, []);
  useEffect(() => {
    document.title = "قائمة الجلسات";
  }, []);
  /* ================= FILTER ================= */
  const filteredAudiences = audiences.filter((a) => {
    const matchStatut =
      !filterStatut || a.statut === filterStatut;
  
    const matchType =
      !filterType || a.typeAudience?._id === filterType;
  
    const matchDate =
      !filterDate ||
      new Date(a.dateAudience).toISOString().slice(0, 10) ===
        filterDate;
  
    return matchStatut && matchType && matchDate;
  });
  
  

  /* ================= HANDLERS ================= */
  const openAdd = () => {
    setEditId(null);
    setForm({
      dossier: "",
      dateAudience: "",
      heureAudience: "",   // 👈 جديد
      typeAudience: "",
      notes: "",
      decision: "",
      statut: "مجدولة",
    });
    setShowModal(true);
  };
  

  const openEdit = (a) => {
    const d = a.dateAudience ? new Date(a.dateAudience) : null;
  
    setEditId(a._id);
    setForm({
      dossier: a.dossier?._id || "",
      dateAudience: d ? d.toISOString().slice(0, 10) : "",
      heureAudience: d ? d.toTimeString().slice(0, 5) : "",
      typeAudience: a.typeAudience?._id || "",
      notes: a.notes || "",
      decision: a.decision || "",
      statut: a.statut || "مجدولة",
    });
    setShowModal(true);
  };
  
  

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
      e.preventDefault();
    
      if (!form.dateAudience || !form.heureAudience) return;
    
      const dateTime = new Date(
        `${form.dateAudience}T${form.heureAudience}:00`
      );
    
      const payload = {
        dossier: form.dossier,
        dateAudience: dateTime, // ✅ تاريخ + ساعة
        typeAudience: form.typeAudience,
        notes: form.notes,
        decision: form.decision,
        statut: form.statut,
      };
    
      if (editId) {
        await axios.put(`${API_URL}/api/audiences/${editId}`, payload);
      } else {
        await axios.post(`${API_URL}/api/audiences`, payload);
      }
    
      setShowModal(false);
      loadData();
    };
    

  const handleDelete = async (id) => {
    if (!window.confirm("حذف الجلسة؟")) return;
    await axios.delete(`${API_URL}/api/audiences/${id}`);
    loadData();
  };

  
  /* ================= UI ================= */
  return (
    <div className="audience-page" dir="rtl">
      <div className="page-header">
        <h2>⚖️ الجلسات</h2>
        <button className="btn-add" onClick={openAdd}>➕ جلسة جديدة</button>
      </div>

      {/* ===== Filters ===== */}
      <div className="filters-bar">
        <select
        value={filterStatut}
        onChange={(e) => setFilterStatut(e.target.value)}>
        
          <option value="">كل الحالات</option>
          <option value="مجدولة">مجدولة</option>
          <option value="مؤجلة">مؤجلة</option>
          <option value="منتهية">منتهية</option>
          <option value="ملغاة">ملغاة</option>
        </select>

        <select 
        value={filterType}
        onChange={(e) => setFilterType(e.target.value)}>
        
        <option value="">كل الأنواع</option>
           {typesAudience.map((t) => (
        <option key={t._id} value={t._id}>
        {t.nom}
        </option>
        ))}
        </select>

        <input
        type="date"
        value={filterDate}
        onChange={(e) => setFilterDate(e.target.value)}
        />


<button
  onClick={() => {
    setFilterStatut("");
    setFilterType("");
    setFilterDate("");
  }}
>
  مسح الفلاتر
</button>

      </div>

      <hr className="separator" />
      <div className="filters-separator">
  <span>
    نتائج الجلسات ({filteredAudiences.length})
  </span>
</div>
      {/* ===== Cards ===== */}
      <div className="audience-cards">
      {filteredAudiences.map((a) => (
  <div className="audience-card" key={a._id}>
    <span className={`badge ${a.statut}`}>{a.statut}</span>

    <h4><strong>{a.dossier?.titre}</strong></h4>
    <p>📁 <strong>{a.dossier?.reference}</strong></p>
    <p>📁 رقم القضية : <strong>{a.dossier?.numero}</strong></p>
    <p>👤 {a.dossier?.client?.noms?.join(" ، ")}</p>
    <p>
  ⏰{" "}
  <strong>{new Date(a.dateAudience).toLocaleTimeString("ar-DZ", {
    hour: "2-digit",
    minute: "2-digit",
  })}</strong>{" "}
  | 📅{" "}
  {new Date(a.dateAudience).toLocaleDateString("ar-DZ")}
</p>



    {/* ===== Juridiction ===== */}
    {a.dossier?.juridictionType === "tribunal" && a.dossier?.tribunal && (
    <p>
    ⚖️ المحكمة :
    <strong>
      {" "}
      
      {a.dossier.tribunal.nom}
    </strong>
    </p>
    )}

{a.dossier?.juridictionType === "tribunal" && a.dossier?.tribunal && (
    <p>
    ⚖️ القسم :
    <strong>
      {" "}
      
      {a.dossier.classe.nom}
    </strong>
    </p>
    )}

   {a.dossier?.juridictionType === "court" && a.dossier?.court && (
   <p>
    ⚖️ المجلس :
    <strong>
      {" "}
      ({String(a.dossier.court.wilayaNumber).padStart(2, "0")}){" "}
      {a.dossier.court.nom}
    </strong>
    </p>
   )}

{a.dossier?.juridictionType === "court" && a.dossier?.court && (
   <p>
    ⚖️ الغرفة :
    <strong>
      
      {a.dossier.chambre.nom}
    </strong>
    </p>
   )}

  <p>
    🚪 القاعة : <strong>{a.dossier.salle}</strong>
  </p>


  {a.notes &&
    <p>  📝 
    ملاحظات: 
    {a.notes}</p>
}

    {a.decision && 
    <p>⚖️ 
      منطوق الحكم:
      {a.decision}</p>}

    <div className="card-actions">
      <button onClick={() => openEdit(a)}>تعديل</button>
      <button onClick={() => handleDelete(a._id)}>حذف</button>
    </div>
  </div>
))}
</div>


      {/* ===== Modal ===== */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>{editId ? "تعديل جلسة" : "إضافة جلسة"}</h3>

            <form onSubmit={handleSubmit}>
  <select name="dossier" value={form.dossier} onChange={handleChange} required>
    <option value="">اختر ملف (اسم العميل) </option>
    {dossiers.map((d) => (
      <option key={d._id} value={d._id}>
        {d.titre} ({d.client?.noms.join(" -- ")})
      </option>
    ))}
  </select>

  <input
  type="date"
  name="dateAudience"
  value={form.dateAudience || ""}
  onChange={handleChange}
  required
/>

<input
  type="time"
  name="heureAudience"
  value={form.heureAudience || ""}
  onChange={handleChange}
  required
/>



  <select
    name="typeAudience"
    value={form.typeAudience}
    onChange={handleChange}
    required
  >
    <option value="">نوع الجلسة</option>
    {typesAudience.map((t) => (
      <option key={t._id} value={t._id}>
        {t.nom}
      </option>
    ))}
  </select>

  <select name="statut" value={form.statut} onChange={handleChange}>
    <option value="مجدولة">مجدولة</option>
    <option value="مؤجلة">مؤجلة</option>
    <option value="منتهية">منتهية</option>
    <option value="ملغاة">ملغاة</option>
  </select>

  <textarea
    name="notes"
    placeholder="ملاحظات"
    value={form.notes}
    onChange={handleChange}
  />

  <textarea
    name="decision"
    placeholder="القرار / منطوق الحكم"
    value={form.decision}
    onChange={handleChange}
  />

  <div className="modal-actions">
    <button className="btn-primary">حفظ</button>
    <button type="button" onClick={() => setShowModal(false)}>
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
