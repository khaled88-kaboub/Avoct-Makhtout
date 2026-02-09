import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/AdminCourtsPage.css";
import { FaDoorOpen, FaEdit, FaTrash } from "react-icons/fa";

const API_URL = import.meta.env.VITE_API_URL;

export default function AdminEtatClientsPage() {
  const [etatClients, setEtatClients] = useState([]);
  const [form, setForm] = useState({ nom: "" });
  const [editingId, setEditingId] = useState(null);

  const fetchEtatClients = async () => {
    const res = await axios.get(`${API_URL}/api/etatClients`);
    setEtatClients(res.data);
  };

  useEffect(() => {
    fetchEtatClients();
    document.title = "  إدارة  صفة الزبائن";
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingId) {
      await axios.put(`${API_URL}/api/etatClients/${editingId}`, form);
      setEditingId(null);
    } else {
      await axios.post(`${API_URL}/api/etatClients`, form);
    }

    setForm({ nom: "" });
    fetchEtatClients();
  };

  const handleEdit = (etatClient) => {
    setForm({ nom: etatClient.nom });
    setEditingId(etatClient._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("هل أنت متأكد من الحذف  ")) {
      await axios.delete(`${API_URL}/api/etatClients/${id}`);
      fetchEtatClients();
    }
  };

  return (
    <div className="courts-page" dir="rtl">
      <div className="page-header">
        <h2><FaDoorOpen /> إدارة  صفة الزبائن </h2>
      </div>

      {/* FORM */}
      <form className="court-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="صفة العميل "
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
            <th>صفة العميل </th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {etatClients.length === 0 ? (
            <tr>
              <td colSpan="2">لا توجد صفة مسجلة   </td>
            </tr>
          ) : (
            etatClients.map((ch) => (
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
