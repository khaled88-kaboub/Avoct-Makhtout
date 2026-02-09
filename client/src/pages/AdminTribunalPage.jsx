import { useEffect, useState } from "react";
import axios from "axios";
import { FaBalanceScale, FaEdit, FaTrash } from "react-icons/fa";
import "../styles/AdminTribunalPage.css";

const API_URL = import.meta.env.VITE_API_URL;

export default function AdminTribunalsPage() {
  const [tribunals, setTribunals] = useState([]);
  const [courts, setCourts] = useState([]);
  const [form, setForm] = useState({ nom: "", cour: "" });
  const [editingId, setEditingId] = useState(null);

  const fetchTribunals = async () => {
    const res = await axios.get(`${API_URL}/api/tribunals`);
    setTribunals(res.data);
  };

  const fetchCourts = async () => {
    const res = await axios.get(`${API_URL}/api/courts`);
    setCourts(res.data);
  };

  useEffect(() => {
    fetchTribunals();
    fetchCourts();
    document.title = "إدارة المحاكم";
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingId) {
      await axios.put(`${API_URL}/api/tribunals/${editingId}`, form);
      setEditingId(null);
    } else {
      await axios.post(`${API_URL}/api/tribunals`, form);
    }

    setForm({ nom: "", cour: "" });
    fetchTribunals();
  };

  const handleEdit = (t) => {
    setForm({ nom: t.nom, cour: t.cour._id });
    setEditingId(t._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("هل أنت متأكد من حذف هذه المحكمة؟")) {
      await axios.delete(`${API_URL}/api/tribunals/${id}`);
      fetchTribunals();
    }
  };

  return (
    <div className="courts-page" dir="rtl">
      <div className="page-header">
        <h2><FaBalanceScale /> إدارة المحاكم</h2>
      </div>
      <div className="filterss-box">
      <form className="court-form" onSubmit={handleSubmit}>
        <select
          required
          value={form.cour}
          onChange={(e) => setForm({ ...form, cour: e.target.value })}
        >
          <option value="">اختر المجلس القضائي</option>
          {courts.map((c) => (
            <option key={c._id} value={c._id}>
              {String(c.wilayaNumber).padStart(2, "0")} - {c.nom}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="اسم المحكمة"
          value={form.nom}
          onChange={(e) => setForm({ ...form, nom: e.target.value })}
          required
        />

        <button type="submit">
          {editingId ? "تعديل" : "إضافة"}
        </button>
      </form>
      </div>
      <div className="filters-separator">
  <span>
  قائمة  المحاكم  ({tribunals.length})
  </span>
</div>
      <table>
        <thead>
          <tr>
            <th>المجلس القضائي</th>
            <th>اسم المحكمة</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {tribunals.length === 0 ? (
            <tr>
              <td colSpan="3">لا توجد محاكم</td>
            </tr>
          ) : (
            tribunals.map((t) => (
              <tr key={t._id}>
                <td>
                  {String(t.cour.wilayaNumber).padStart(2, "0")} - {t.cour.nom}
                </td>
                <td>{t.nom}</td>
                <td>
                  <button onClick={() => handleEdit(t)}><FaEdit /></button>
                  <button onClick={() => handleDelete(t._id)}><FaTrash /></button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
