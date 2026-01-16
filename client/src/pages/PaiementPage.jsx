import { useEffect, useState } from "react";
import axios from "axios";
import { FaMoneyBillWave, FaTrash, FaEdit, FaPlus } from "react-icons/fa";
import "../styles/paiementss.css";

export default function PaiementsPage() {
  const [paiements, setPaiements] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [dossiers, setDossiers] = useState([]); // pour le select dossier

  const [filterClient, setFilterClient] = useState("");
  const [filterMode, setFilterMode] = useState("");

  const API_URL = import.meta.env.VITE_API_URL;

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPaiement, setSelectedPaiement] = useState({
    montant: "",
    reste: "",
    modePaiement: "نقد",
    dossier: "",
    description: "",
    datePaiement: new Date().toISOString().substring(0, 10) // date du jour en YYYY-MM-DD
  });

  /* ================= LOAD ================= */
  const loadPaiements = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/paiements`);
      const data = Array.isArray(res.data) ? res.data : [];
      setPaiements(data);
      setFiltered(data);
    } catch (err) {
      console.error("Erreur chargement paiements:", err);
    }
  };

  const loadDossiers = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/dossiers`);
      setDossiers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Erreur chargement dossiers:", err);
    }
  };

  useEffect(() => {
    loadPaiements();
    loadDossiers();
  }, []);

  /* ================= FILTER ================= */
  useEffect(() => {
    let data = [...paiements];

    if (filterClient) {
      data = data.filter(p =>
        `${p.dossier?.client?.nom || ""} ${p.dossier?.client?.prenom || ""}`.includes(filterClient)
      );
    }

    if (filterMode) {
      data = data.filter(p => p.modePaiement === filterMode);
    }

    setFiltered(data);
  }, [filterClient, filterMode, paiements]);

  useEffect(() => {
    document.title = "قائمة المدفوعات";
  }, []);
  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("حذف هذا الدفع؟")) return;
    try {
      await axios.delete(`${API_URL}/api/paiements/${id}`);
      loadPaiements();
    } catch (err) {
      console.error("Erreur suppression paiement:", err);
      alert("Erreur lors de la suppression !");
    }
  };

  const openRecu = (id) => {
    window.open(
      `${API_URL}/api/paiements/pdf/${id}`,
      "_blank"
    );
  };
  
  /* ================= MODAL ================= */
  const openModal = (paiement = null) => {
    if (paiement) {
      setSelectedPaiement({
        _id: paiement._id,
        montant: paiement.montant ?? "",
        reste: paiement.reste ?? "",
        modePaiement: paiement.modePaiement ?? "نقد",
        dossier: paiement.dossier?._id ?? "",
        description: paiement.description ?? "",
        datePaiement: paiement.datePaiement
          ? new Date(paiement.datePaiement).toISOString().substring(0, 10)
          : new Date().toISOString().substring(0, 10),
      });
    } else {
      setSelectedPaiement({
        montant: "",
        reste: "",
        modePaiement: "نقد",
        dossier: "",
        description: "",
        datePaiement: new Date().toISOString().substring(0, 10),
      });
    }
    setModalOpen(true);
  };
  

  const closeModal = () => {
    setModalOpen(false);
    setSelectedPaiement({ montant: "", reste: "", modePaiement: "نقد", dossier: "", description: "" });
  };

  const handleSave = async (paiement) => {
    if (!paiement.dossier || !paiement.montant) {
      alert("الملف و المبلغ ضروريان!");
      return;
    }

    const payload = {
      ...paiement,
      montant: Number(paiement.montant),
      reste: Number(paiement.reste || 0),
    };

    try {
      if (paiement._id) {
        await axios.put(`${API_URL}/api/paiements/${paiement._id}`, payload);
      } else {
        await axios.post(`${API_URL}/api/paiements`, payload);
      }
      loadPaiements();
      closeModal();
    } catch (err) {
      console.error("Erreur sauvegarde paiement:", err);
      alert("Erreur lors de la sauvegarde !");
    }
  };

  return (
    <div className="paiements-page" dir="rtl">
      <div className="page-header">
      <h2><FaMoneyBillWave /> المدفوعات</h2>
      <button className="add-btn" onClick={() => openModal()}>
          <FaPlus /> إضافة دفع
        </button>
      </div>
      

      {/* ===== FILTERS ===== */}
      <div className="filters-box">
        <input
          placeholder="بحث باسم العميل"
          value={filterClient}
          onChange={(e) => setFilterClient(e.target.value)}
        />
        <select value={filterMode} onChange={(e) => setFilterMode(e.target.value)}>
          <option value="">كل طرق الدفع</option>
          <option value="نقد">نقد</option>
          <option value="تحويل بنكي">تحويل بنكي</option>
          <option value="شيك">شيك</option>
        </select>

        

        
      </div>
      <div className="filters-separator">
  <span>
  قائمة المدفوعات ({filtered.length})
  </span>
</div>
      {/* ===== TABLE ===== */}
      <table className="paiements-table">
        <thead>
          <tr>
            <th>الملف</th>
            <th>العميل</th>
            <th>المبلغ</th>
            <th>طريقة الدفع</th>
            <th>التاريخ</th>
            <th>المتبقي</th>
            <th>إجراءات</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length > 0 ? (
            filtered.map(p => (
              <tr key={p._id}>
                <td>{p.dossier?.titre || "-"}</td>
                <td>{p.dossier?.client?.nom} {p.dossier?.client?.prenom}</td>
                <td>{p.montant} دج</td>
                <td>{p.modePaiement}</td>
                <td>{new Date(p.datePaiement).toLocaleDateString("ar-DZ")}</td>
                <td>{p.reste} دج</td>
                <td className="actions">
                  <button className="edit" onClick={() => openModal(p)}><FaEdit /></button>
                  <button className="delete" onClick={() => handleDelete(p._id)}><FaTrash /></button>
                  <button onClick={() => openRecu(p._id)}>
  📄 وصل
</button>

                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" style={{ textAlign: "center" }}>لا توجد مدفوعات</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* ===== MODAL ===== */}
      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>{selectedPaiement._id ? "تعديل الدفع" : "إضافة دفع"}</h3>

            <div className="formulaire">
              <label>الملف</label>
              <select
                value={selectedPaiement.dossier}
                onChange={(e) =>
                  setSelectedPaiement({ ...selectedPaiement, dossier: e.target.value })
                }
              >
                <option value="">اختر الملف</option>
                {dossiers.map(d => (
                  <option key={d._id} value={d._id}>
                    {d.titre} - {d.client?.nom} {d.client?.prenom}
                  </option>
                ))}
              </select>

              <label>المبلغ</label>
              <input
                type="number"
                value={selectedPaiement.montant ?? ""}
                onChange={(e) =>
                  setSelectedPaiement({ ...selectedPaiement, montant: e.target.value })
                }
              />

              <label>المتبقي</label>
              <input
                type="number"
                value={selectedPaiement.reste ?? ""}
                onChange={(e) =>
                  setSelectedPaiement({ ...selectedPaiement, reste: e.target.value })
                }
              />

              <label>طريقة الدفع</label>
              <select
                value={selectedPaiement.modePaiement}
                onChange={(e) =>
                  setSelectedPaiement({ ...selectedPaiement, modePaiement: e.target.value })
                }
              >
                <option value="نقد">نقد</option>
                <option value="تحويل بنكي">تحويل بنكي</option>
                <option value="شيك">شيك</option>
              </select>

              <label>تاريخ الدفع</label>
<input
  type="date"
  value={selectedPaiement.datePaiement}
  onChange={(e) =>
    setSelectedPaiement({ ...selectedPaiement, datePaiement: e.target.value })
  }
/>

              <label>الوصف</label>
              <input
                type="text"
                value={selectedPaiement.description ?? ""}
                onChange={(e) =>
                  setSelectedPaiement({ ...selectedPaiement, description: e.target.value })
                }
              />
            </div>

            <div className="modal-actions">
              <button onClick={closeModal}>إلغاء</button>
              <button onClick={() => handleSave(selectedPaiement)}>حفظ</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
