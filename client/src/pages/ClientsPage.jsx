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
    typeClient: "شخص طبيعي",
    noms: [""], // tableau de noms
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
  const handleTypeChange = (e) => {
    const value = e.target.value;
  
    if (value === "شخص معنوي") {
      setForm({
        ...form,
        typeClient: value,
        cin: "",
        dateNaissance: ""
      });
    } else {
      setForm({
        ...form,
        typeClient: value
      });
    }
  };
  
  /* ================= MODAL ================= */
  const openAddModal = () => {
    setForm({
      typeClient: "شخص طبيعي",
      noms: [""],
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
      typeClient: client.typeClient,
      noms: client.noms.length ? client.noms : [""],
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

  const updateNom = (index, value) => {
    const newNoms = [...form.noms];
    newNoms[index] = value;
    setForm({ ...form, noms: newNoms });
  };
  
  const addNom = () => {
    setForm({ ...form, noms: [...form.noms, ""] });
  };
  
  const removeNom = (index) => {
    const newNoms = form.noms.filter((_, i) => i !== index);
    setForm({ ...form, noms: newNoms.length ? newNoms : [""] });
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
      <div className="filters-separator">
  <span>
  قائمة الزبائن ({clients.length})
  </span>
</div>
      {/* ===== LIST ===== */}
      <div className="clients-cards">
        {clients.map((c) => (
          <div className="client-card" key={c._id}>
            <h3>{c.noms.join(" / ")}</h3>
                 <p>👤 {c.typeClient}</p>


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

{/* TYPE CLIENT */}
<select value={form.typeClient} onChange={handleTypeChange}>
  <option value="شخص طبيعي">شخص طبيعي</option>
  <option value="شخص معنوي">شخص معنوي</option>
</select>


{/* NOMS (TABLEAU) */}
<label>
  {form.typeClient === "شخص طبيعي"
    ? "الاسم"
    : "الاسم التجاري"}
</label>

{form.noms.map((nom, index) => (
  <div key={index} style={{ display: "flex", gap: "5px" }}>
    <input
  required
  placeholder={
    form.typeClient === "شخص طبيعي"
      ? `الاسم ${index + 1}`
      : `الاسم التجاري ${index + 1}`
  }
  value={nom}
  onChange={(e) => updateNom(index, e.target.value)}
/>

    {form.noms.length > 1 && (
      <button type="button" onClick={() => removeNom(index)}>❌</button>
    )}
  </div>
))}

<button  className="btn-primary"  type="button" onClick={addNom}>➕ إضافة شخص جديد</button>

{/* AUTRES CHAMPS */}
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

{form.typeClient === "شخص طبيعي" && (
  <>
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
  </>
)}

<textarea
  placeholder="العنوان"
  value={form.adresse}
  onChange={(e) => setForm({ ...form, adresse: e.target.value })}
/>

<div className="modal-actions">
  <button className="btn-primary" type="submit">
    {editId ? "تحديث" : "إضافة"}
  </button>
  <button type="button" className="btn-cancel" onClick={closeModal}>
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
