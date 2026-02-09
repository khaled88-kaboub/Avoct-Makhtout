import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/AdminCourtsPage.css";
import { FaDoorOpen, FaEdit, FaTrash } from "react-icons/fa";

const API_URL = import.meta.env.VITE_API_URL;

export default function AdminClassesPage() {
  const [classes, setClasses] = useState([]);
  const [form, setForm] = useState({ nom: "" });
  const [editingId, setEditingId] = useState(null);

  const fetchClasses = async () => {
    const res = await axios.get(`${API_URL}/api/classes`);
    setClasses(res.data);
  };

  useEffect(() => {
    fetchClasses();
    document.title = "  إدارة أقسام المحكمة";
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingId) {
      await axios.put(`${API_URL}/api/classes/${editingId}`, form);
      setEditingId(null);
    } else {
      await axios.post(`${API_URL}/api/classes`, form);
    }

    setForm({ nom: "" });
    fetchClasses();
  };

  const handleEdit = (classe) => {
    setForm({ nom: classe.nom });
    setEditingId(classe._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("هل أنت متأكد من حذف هذا القسم")) {
      await axios.delete(`${API_URL}/api/classes/${id}`);
      fetchClasses();
    }
  };

  return (
    <div className="courts-page" dir="rtl">
      <div className="page-header">
        <h2><FaDoorOpen /> إدارة أقسام المحكمة </h2>
      </div>

      {/* FORM */}
      <form className="court-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="اسم القسم"
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
            <th>اسم القسم</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {classes.length === 0 ? (
            <tr>
              <td colSpan="2">لا توجد أقسام مسجلة   </td>
            </tr>
          ) : (
            classes.map((ch) => (
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
