import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/AdminCourtsPage.css";
import { FaDoorOpen, FaEdit, FaTrash } from "react-icons/fa";

const API_URL = import.meta.env.VITE_API_URL;

export default function AdminTypeAudiencesPage() {
  const [typeAudiences, setTypeAudiences] = useState([]);
  const [form, setForm] = useState({ nom: "" });
  const [editingId, setEditingId] = useState(null);

  const fetchTypeAudiences = async () => {
    const res = await axios.get(`${API_URL}/api/typeAudiences`);
    setTypeAudiences(res.data);
  };

  useEffect(() => {
    fetchTypeAudiences();
    document.title = "  إدارة  أنواع الجلسات";
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingId) {
      await axios.put(`${API_URL}/api/typeAudiences/${editingId}`, form);
      setEditingId(null);
    } else {
      await axios.post(`${API_URL}/api/typeAudiences`, form);
    }

    setForm({ nom: "" });
    fetchTypeAudiences();
  };

  const handleEdit = (typeAudience) => {
    setForm({ nom: typeAudience.nom });
    setEditingId(typeAudience._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("هل أنت متأكد من حذف هذا النوع")) {
      await axios.delete(`${API_URL}/api/typeAudiences/${id}`);
      fetchTypeAudiences();
    }
  };

  return (
    <div className="courts-page" dir="rtl">
      <div className="page-header">
        <h2><FaDoorOpen /> إدارة  أنواع الجلسات</h2>
      </div>

      {/* FORM */}
      <form className="court-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="اسم النوع"
          value={form.nom}
          onChange={(e) => setForm({ nom: e.target.value })}
          required
        />

        <button type="submit">
          {editingId ? "تعديل" : "إضافة"}
        </button>
      </form>

      {/* TABLE */}
      <table>
        <thead>
          <tr>
            <th>اسم النوع</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {typeAudiences.length === 0 ? (
            <tr>
              <td colSpan="2">لا توجد أنواع مسجلة   </td>
            </tr>
          ) : (
            typeAudiences.map((ch) => (
              <tr key={ch._id}>
                <td>{ch.nom}</td>
                <td>
                  <button onClick={() => handleEdit(ch)}>
                    <FaEdit />
                  </button>
                  <button onClick={() => handleDelete(ch._id)}>
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
