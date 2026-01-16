import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/audiences.css";



export default function AudiencesPage() {
  const [audiences, setAudiences] = useState([]);
  const [dossiers, setDossiers] = useState([]);
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
    tribunal: "",
    salle: "",
    notes: "",
    statut: "مجدولة",
  });

  /* ================= FETCH ================= */
  const loadData = async () => {
    const [aRes, dRes] = await Promise.all([
      axios.get(`${API_URL}/api/audiences`),
      axios.get(`${API_URL}/api/dossiers`),
    ]);
    setAudiences(aRes.data || []);
    setDossiers(dRes.data || []);
  };

  useEffect(() => {
    loadData();
  }, []);
  useEffect(() => {
    document.title = "قائمة الجلسات";
  }, []);
  /* ================= FILTER ================= */
  const filteredAudiences = audiences.filter((a) => {
    return (
      (!filterStatut || a.statut === filterStatut) &&
      (!filterType || a.typeAudience === filterType)
    );
  });

  /* ================= HANDLERS ================= */
  const openAdd = () => {
    setEditId(null);
    setForm({
      dossier: "",
      dateAudience: "",
      typeAudience: "",
      tribunal: "",
      salle: "",
      notes: "",
      statut: "مجدولة",
    });
    setShowModal(true);
  };

  const openEdit = (a) => {
    setEditId(a._id);
    setForm({
      dossier: a.dossier?._id,
      dateAudience: a.dateAudience?.slice(0, 10),
      typeAudience: a.typeAudience,
      tribunal: a.tribunal || "",
      salle: a.salle || "",
      notes: a.notes || "",
      statut: a.statut,
    });
    setShowModal(true);
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
   if (editId) {
      await axios.put(`${API_URL}/api/audiences/${editId}`, form);
    } else {
      await axios.post(`${API_URL}/api/audiences`, form);
    }
    setShowModal(false);
    loadData();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("حذف الجلسة؟")) return;
    await axios.delete(`${API_URL}/${id}`);
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
      <div className="filters-box">
        <select onChange={(e) => setFilterStatut(e.target.value)}>
          <option value="">كل الحالات</option>
          <option value="مجدولة">مجدولة</option>
          <option value="مؤجلة">مؤجلة</option>
          <option value="منتهية">منتهية</option>
          <option value="ملغاة">ملغاة</option>
        </select>

        <select onChange={(e) => setFilterType(e.target.value)}>
          <option value="">كل الأنواع</option>
          {[
            "مرافعة",
            "تحقيق",
            "سماع الشهود",
            "استجواب",
            "خبرة",
            "صلح",
            "مداولة",
            "النطق بالحكم",
            "إجرائية",
            "استعجالية",
            "إعادة السير في الدعوى",
          ].map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>

        <span className="result-count">
          عدد النتائج: {filteredAudiences.length}
        </span>
      </div>

      <hr className="separator" />

      {/* ===== Cards ===== */}
      <div className="audience-cards">
        {filteredAudiences.map((a) => (
          <div className="audience-card" key={a._id}>
            <span className={`badge ${a.statut}`}>{a.statut}</span>

            <h4>{a.dossier?.client?.nom || "-"} {a.dossier?.client?.prenom || "-"}</h4>
            <p>📁 {a.dossier?.titre}</p>
            <p>📅 {new Date(a.dateAudience).toLocaleDateString("ar-DZ")}</p>
            <p>⚖️ {a.tribunal} – قاعة {a.salle}</p>
            <p>📌 {a.typeAudience}</p>
            
            <div className="card-actions">
              <button onClick={() => openEdit(a)}>✏️</button>
              <button onClick={() => handleDelete(a._id)}>🗑️</button>
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
                <option value="">اختر ملف</option>
                {dossiers.map((d) => (
                  <option key={d._id} value={d._id}>{d.client?.nom } {d.client?.prenom } - {d.titre} ({d.reference})</option>
                ))}
              </select>

              <input type="date" name="dateAudience" value={form.dateAudience} onChange={handleChange} required />

              <select name="typeAudience" value={form.typeAudience} onChange={handleChange} required>
                <option value="">نوع الجلسة</option>
                {[
                  "مرافعة","تحقيق","سماع الشهود","استجواب","خبرة","صلح",
                  "مداولة","النطق بالحكم","إجرائية","استعجالية","إعادة السير في الدعوى"
                ].map((t) => <option key={t}>{t}</option>)}
              </select>

              <input name="tribunal" placeholder="المحكمة" value={form.tribunal} onChange={handleChange} />
              <input name="salle" placeholder="القاعة" value={form.salle} onChange={handleChange} />

              <select name="statut" value={form.statut} onChange={handleChange}>
                <option value="مجدولة">مجدولة</option>
                <option value="مؤجلة">مؤجلة</option>
                <option value="منتهية">منتهية</option>
                <option value="ملغاة">ملغاة</option>
              </select>

              <textarea name="notes" placeholder="ملاحظات" value={form.notes} onChange={handleChange} />

              <div className="modal-actions">
                <button className="btn-primary">حفظ</button>
                <button type="button" onClick={() => setShowModal(false)}>إلغاء</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
