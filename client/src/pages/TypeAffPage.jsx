import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/typeAff.css"; // on créera un CSS dédié

const API_URL = import.meta.env.VITE_API_URL;

export default function TypeAffPage() {
  const [types, setTypes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ libelle: "" });

  /* ================= FETCH TYPES ================= */
  const loadTypes = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/typeaffaire`);
      setTypes(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      alert("حدث خطأ أثناء تحميل أنواع القضايا");
    }
  };

  useEffect(() => {
    loadTypes();
  }, []);

  /* ================= HANDLERS ================= */
  const openAddModal = () => {
    setEditId(null);
    setForm({ libelle: "" });
    setShowModal(true);
  };

  const openEditModal = (type) => {
    setEditId(type._id);
    setForm({ libelle: type.libelle });
    setShowModal(true);
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`${API_URL}/api/typeaffaire/${editId}`, form);
      } else {
        await axios.post(`${API_URL}/api/typeaffaire`, form);
      }
      setShowModal(false);
      loadTypes();
    } catch (err) {
      console.error(err);
      alert("حدث خطأ أثناء حفظ نوع القضية");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("هل أنت متأكد من حذف نوع القضية؟")) return;
    try {
      await axios.delete(`${API_URL}/type-affaires/${id}`);
      loadTypes();
    } catch (err) {
      console.error(err);
      alert("حدث خطأ أثناء الحذف");
    }
  };

  /* ================= UI ================= */
  return (
    <div className="typeaff-page" dir="rtl">
      <div className="page-header">
        <h2>📚 إدارة أنواع القضايا</h2>
        <button className="btn-add" onClick={openAddModal}>
          ➕ إضافة نوع جديد
        </button>
      </div>

      <div className="typeaff-cards">
        {types.length > 0 ? (
          types.map((t) => (
            <div className="typeaff-card" key={t._id}>
              <h3>{t.libelle}</h3>
              <div className="card-actions">
                <button onClick={() => openEditModal(t)}>✏️ تعديل</button>
                <button onClick={() => handleDelete(t._id)}>🗑️ حذف</button>
              </div>
            </div>
          ))
        ) : (
          <p style={{ textAlign: "center", marginTop: "20px" }}>
            لا توجد أنواع بعد
          </p>
        )}
      </div>

      {/* ================= MODAL ================= */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>{editId ? "تعديل نوع القضية" : "إضافة نوع جديد"}</h3>

            <form onSubmit={handleSubmit} className="modal-form">
              <input
                name="libelle"
                placeholder="اسم النوع"
                value={form.libelle}
                onChange={handleChange}
                required
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
