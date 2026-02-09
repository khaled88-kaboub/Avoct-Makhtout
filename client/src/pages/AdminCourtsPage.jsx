import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/AdminCourtsPage.css";
import { FaGavel, FaTrash, FaEdit, FaPlus } from "react-icons/fa";

const API_URL = import.meta.env.VITE_API_URL;

export default function AdminCourtsPage() {
  const [courts, setCourts] = useState([]);
  const [form, setForm] = useState({ wilayaNumber: "", nom: "" });
  const [editingId, setEditingId] = useState(null);

  const fetchCourts = async () => {
    const res = await axios.get(`${API_URL}/api/courts`);
    setCourts(res.data);
  };

  useEffect(() => {
    fetchCourts();
  }, []);
  useEffect(() => {
    document.title = "بوابة المجالس القضائية ";
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingId) {
      await axios.put(`${API_URL}/api/courts/${editingId}`, form);
      setEditingId(null);
    } else {
      await axios.post(`${API_URL}/api/courts`, form);
    }

    setForm({ wilayaNumber: "", nom: "" });
    fetchCourts();
  };

  const handleEdit = (court) => {
    setForm({
      wilayaNumber: court.wilayaNumber,
      nom: court.nom
    });
    setEditingId(court._id);
  };

  const formatWilayaNumber = (num) => {
    return String(num).padStart(2, "0");
  };
  
  const handleDelete = async (id) => {
    if (window.confirm("هل أنت متأكد من حذف هذا المجلس القضائي")) {
      await axios.delete(`${API_URL}/courts/api/${id}`);
      fetchCourts();
    }
  };

  return (
    <div className="courts-page" dir="rtl">
      <div className="page-header">
      <h2>  <FaGavel  />  إدارة المجالس القضائية  </h2>
      </div>
      <div className="filterss-box">
      <form onSubmit={handleSubmit} className="court-form">
        <input
          type="number"
          placeholder="رقم الولاية"
          value={form.wilayaNumber}
          onChange={(e) =>
            setForm({ ...form, wilayaNumber: e.target.value })
          }
          required
        />

        <input
          type="text"
          placeholder="اسم المجلس القضائي"
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
  قائمة المجالس القضائية  ({courts.length})
  </span>
</div>
      <table>
        <thead>
          <tr>
            <th>رقم الولاية</th>
            <th>اسم المجلس القضائي</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {courts.length === 0 ? (
            <tr>
              <td colSpan="3" style={{ textAlign: "center" }}>
                لا توجد مجالس قضائية مسجلة
              </td>
            </tr>
          ) : (
            courts.map((court) => (
              <tr key={court._id}>
                <td><td>{formatWilayaNumber(court.wilayaNumber)}</td>
                </td>
                <td>{court.nom}</td>
                <td>
                  <button onClick={() => handleEdit(court)}><FaEdit /></button>
                  <button onClick={() => handleDelete(court._id)}><FaTrash /></button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
