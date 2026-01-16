import { useEffect, useState } from "react";

import {
  getClients,
  createClient,
  updateClient,
  deleteClient
} from "../services/clientService";
import "../styles/clients.css";

export default function ClientsPage() {
  /* ================= STATES ================= */
  const [clients, setClients] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    telephone: "",
    adresse: "",
    email: "",
    cin: "",
    dateNaissance: ""
  });
  const API_URL = import.meta.env.VITE_API_URL;
  
  /* ================= DATA ================= */
  const loadClients = async () => {
    try {
      const res = await getClients();
      setClients(res.data);
    } catch {
      alert("حدث خطأ أثناء تحميل الزبائن");
    }
  };

  useEffect(() => {
    loadClients();
  }, []);
  useEffect(() => {
    document.title = "عملاء المحامي";
  }, []);

  /* ================= MODAL ================= */
  const openAddModal = () => {
    setForm({
      nom: "",
      prenom: "",
      telephone: "",
      adresse: "",
      email: "",
      cin: "",
      dateNaissance: ""
    });
    setEditId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (client) => {
    setForm({
      nom: client.nom || "",
      prenom: client.prenom || "",
      telephone: client.telephone || "",
      adresse: client.adresse || "",
      email: client.email || "",
      cin: client.cin || "",
      dateNaissance: client.dateNaissance
        ? new Date(client.dateNaissance).toISOString().split("T")[0]
        : ""
    });
    setEditId(client._id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditId(null);
  };

  /* ================= ACTIONS ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      editId
        ? await updateClient(editId, form)
        : await createClient(form);

      closeModal();
      loadClients();
    } catch {
      alert("حدث خطأ أثناء حفظ البيانات");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("هل أنت متأكد من حذف هذا الزبون؟")) {
      await deleteClient(id);
      loadClients();
    }
  };

  /* ================= UI ================= */
  return (
    <div className="clients-page" dir="rtl">
      {/* ===== HEADER ===== */}
      <div className="page-header">
        <h2>إدارة الزبائن </h2>
        <button className="btn-add" onClick={openAddModal}>
          ➕ إضافة زبون
        </button>
      </div>

      {/* ===== LIST ===== */}
      <div className="clients-cards">
        {clients.map((c) => (
          <div className="client-card" key={c._id}>
            <h3>{c.nom} {c.prenom}</h3>

            <p>📞 {c.telephone || "-"}</p>
            <p>🏠 {c.adresse || "-"}</p>
            <p>📧 {c.email || "-"}</p>
            <p>🆔 {c.cin || "-"}</p>
            <p>
              🎂{" "}
              {c.dateNaissance
                ? new Date(c.dateNaissance).toLocaleDateString("ar-DZ")
                : "-"}
            </p>

            <div className="card-actions">
              <button onClick={() => openEditModal(c)}>✏️ تعديل</button>
              <button onClick={() => handleDelete(c._id)}>🗑️ حذف</button>
            </div>
          </div>
        ))}
      </div>

      {/* ===== MODAL ===== */}
      {isModalOpen && (
        
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>{editId ? "تعديل زبون" : "إضافة زبون"}</h3>

            <form className="modal-form" onSubmit={handleSubmit}>
              <input
                placeholder="اللقب"
                value={form.nom}
                required
                onChange={(e) => setForm({ ...form, nom: e.target.value })}
              />
              <input
                placeholder="الاسم"
                value={form.prenom}
                onChange={(e) => setForm({ ...form, prenom: e.target.value })}
              />
              <input
                placeholder="رقم الهاتف"
                value={form.telephone}
                onChange={(e) => setForm({ ...form, telephone: e.target.value })}
              />
              <input
                type="email"
                placeholder="البريد الإلكتروني"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <input
                placeholder="رقم الهوية"
                value={form.cin}
                onChange={(e) => setForm({ ...form, cin: e.target.value })}
              />
              <input
                type="date"
                value={form.dateNaissance}
                onChange={(e) =>
                  setForm({ ...form, dateNaissance: e.target.value })
                }
              />
              <textarea
                placeholder="العنوان"
                value={form.adresse}
                onChange={(e) => setForm({ ...form, adresse: e.target.value })}
              />

              <div className="modal-actions">
                <button className="btn-primary" type="submit">
                  {editId ? "تحديث" : "إضافة"}
                </button>
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={closeModal}
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
