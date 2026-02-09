import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/AdminCourtsPage.css";
import { FaDoorOpen, FaEdit, FaTrash } from "react-icons/fa";

const API_URL = import.meta.env.VITE_API_URL;

export default function AdminChambresPage() {
  const [chambres, setChambres] = useState([]);
  const [form, setForm] = useState({ nom: "" });
  const [editingId, setEditingId] = useState(null);

  const fetchChambres = async () => {
    const res = await axios.get(`${API_URL}/api/chambres`);
    setChambres(res.data);
  };

  useEffect(() => {
    fetchChambres();
    document.title = "إدارة الغرف القضائية";
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingId) {
      await axios.put(`${API_URL}/api/chambres/${editingId}`, form);
      setEditingId(null);
    } else {
      await axios.post(`${API_URL}/api/chambres`, form);
    }

    setForm({ nom: "" });
    fetchChambres();
  };

  const handleEdit = (chambre) => {
    setForm({ nom: chambre.nom });
    setEditingId(chambre._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("هل أنت متأكد من حذف هذه الغرفة؟")) {
      await axios.delete(`${API_URL}/api/chambres/${id}`);
      fetchChambres();
    }
  };

  return (
    <div className="courts-page" dir="rtl">
      <div className="page-header">
        <h2><FaDoorOpen /> إدارة الغرف القضائية</h2>
      </div>

      {/* FORM */}
      <form className="court-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="اسم الغرفة (مدنية، جزائية...)"
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
            <th>اسم الغرفة</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {chambres.length === 0 ? (
            <tr>
              <td colSpan="2">لا توجد غرف مسجلة</td>
            </tr>
          ) : (
            chambres.map((ch) => (
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
