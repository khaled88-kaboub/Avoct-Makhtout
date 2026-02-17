import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/AdminCourtsPage.css";
import { FaDoorOpen, FaEdit, FaTrash, FaWallet } from "react-icons/fa";

const API_URL = import.meta.env.VITE_API_URL;


export default function DesignationDepJursPage() {
  const [designationDepJurs, setDesignationDepJurs] = useState([]);
  const [form, setForm] = useState({ nom: "" });
  const [editingId, setEditingId] = useState(null);

  const fetchDesignationDepJurs = async () => {
    const res = await axios.get(`${API_URL}/api/designation_dep_jur`);
    setDesignationDepJurs(res.data);
  };

  useEffect(() => {
    fetchDesignationDepJurs();
    document.title = "   إدارة أصناف المصاريف القضائية   ";
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingId) {
      await axios.put(`${API_URL}/api/designation_dep_jur/${editingId}`, form);
      setEditingId(null);
    } else {
      await axios.post(`${API_URL}/api/designation_dep_jur`, form);
    }

    setForm({ nom: "" });
    fetchDesignationDepJurs();
  };

  const handleEdit = (designationDepJurs) => {
    setForm({ nom: designationDepJurs.nom });
    setEditingId(designationDepJurs._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("هل أنت متأكد من الحذف  ")) {
      await axios.delete(`${API_URL}/api/designation_dep_jur/${id}`);
      fetchDesignationDepJurs();
    }
  };

  return (
    <div className="courts-page" dir="rtl">
      <div className="page-header">
        <h2><FaWallet /> إدارة أصناف المصاريف القضائية    </h2>
      </div>

      {/* FORM */}
      <form className="court-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="الصنف "
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
            <th> الصنف </th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {designationDepJurs.length === 0 ? (
            <tr>
              <td colSpan="2">لا توجد صفة مسجلة   </td>
            </tr>
          ) : (
            designationDepJurs.map((ch) => (
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
