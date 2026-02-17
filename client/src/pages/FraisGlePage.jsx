import { useEffect, useState } from "react";
import axios from "axios";
import { FaMoneyBillWave, FaTrash, FaEdit, FaPlus } from "react-icons/fa";
import "../styles/paiements.css";

export default function FraisGlesPage() {
  const [paiements, setPaiements] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [designationDepGle, setDesignationDepGle] = useState([]); // pour le select dossier

  
  const [filterMode, setFilterMode] = useState("");

  const API_URL = import.meta.env.VITE_API_URL;

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPaiement, setSelectedPaiement] = useState({
    montant: "",
    designationDepGle: "",
    
    datePaiement: new Date().toISOString().substring(0, 10) // date du jour en YYYY-MM-DD
  });

  /* ================= LOAD ================= */
  const loadPaiements = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/fraisgle?sort=-datePaiement`);

      const data = Array.isArray(res.data) ? res.data : [];
      setPaiements(data);
      setFiltered(data);
    } catch (err) {
      console.error("Erreur chargement paiements:", err);
    }
  };

  
  const loadDesignationDepGle = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/designation_dep_gle`);
      setDesignationDepGle(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Erreur chargement genres de dpences:", err);
    }
  };
  useEffect(() => {
    loadPaiements();
    loadDesignationDepGle()
    
  }, []);

  /* ================= FILTER ================= */
 

  useEffect(() => {
    document.title = "قائمة المصاريف";
  }, []);
  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("حذف هذا الدفع؟")) return;
    try {
      await axios.delete(`${API_URL}/api/fraisgle/${id}`);
     await loadPaiements();
    } catch (err) {
      console.error("Erreur suppression paiement:", err);
      alert("Erreur lors de la suppression !");
    }
  };

 
  
  /* ================= MODAL ================= */
  const openModal = (fraisgle = null) => {
    if (fraisgle) {
      setSelectedPaiement({
        _id: fraisgle._id,
        montant: fraisgle.montant ?? "",
        designationDepGle: fraisgle.designationDepGle?._id ?? "",
        datePaiement: fraisgle.datePaiement
          ? new Date(fraisgle.datePaiement).toISOString().substring(0, 10)
          : new Date().toISOString().substring(0, 10),
      });
    } else {
      setSelectedPaiement({
        montant: "",
        designationDepGle: "",
        datePaiement: new Date().toISOString().substring(0, 10),
      });
    }
    setModalOpen(true);
  };
  

  const closeModal = () => {
    setModalOpen(false);
    setSelectedPaiement({ montant: "", designationDepGle: "" });
  };

  const handleSave = async (fraisgle) => {
    if ( !fraisgle.designationDepGle || !fraisgle.montant) {
      alert(" االمبلغ ضروري !");
      return;
    }
  
    const payload = {
      ...fraisgle,
      montant: Number(fraisgle.montant),
      // On ne retire pas forcément 'reste' ici, le backend le recalculera
      datePaiement: new Date(fraisgle.datePaiement),
    };
  
    try {
      if (fraisgle._id) {
        await axios.put(`${API_URL}/api/fraisgle/${fraisgle._id}`, payload);
      } else {
        await axios.post(`${API_URL}/api/fraisgle`, payload);
      }
      
      // IMPORTANT : Recharger les deux pour être sûr que les compteurs sont justes
      await loadPaiements();
      await loadDesignationDepGle();
      
      
      closeModal();
    } catch (err) {
      console.error("Erreur sauvegarde paiement:", err);
      alert("خطأ في حفظ البيانات");
    }
  };

  return (
    <div className="paiements-page" dir="rtl">
      <div className="page-header">
      <h2><FaMoneyBillWave />  المصاريف العامة </h2>
      <button className="add-btn" onClick={() => openModal()}>
          <FaPlus /> إضافة مصاريف
        </button>
      </div>
      

      {/* ===== FILTERS ===== */}
      <div className="filters-box">
        
        

        
      </div>
      <div className="filters-separator">
  <span>
  قائمة المصاريف ({filtered.length})
  </span>
</div>
      {/* ===== TABLE ===== */}
      <table className="paiements-table">
        <thead>
          <tr>
           
            <th>المبلغ</th>
            <th> الصنف</th>
            <th>التاريخ</th>
            
            <th></th>
          </tr>
        </thead>
        <tbody>
          {filtered.length > 0 ? (
            filtered.map(p => (
              <tr key={p._id}>
                <td>{p.montant} دج</td>
                <td>{p.designationDepGle.nom || "-"}</td>
                <td>{new Date(p.datePaiement).toLocaleDateString("ar-DZ")}</td>
                
                <td className="actions">
                  <button className="edit" onClick={() => openModal(p)}><FaEdit /></button>
                  <button className="delete" onClick={() => handleDelete(p._id)}><FaTrash /></button>
                 

                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" style={{ textAlign: "center" }}>لا توجد مصاريف</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* ===== MODAL ===== */}
      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>{selectedPaiement._id ? "تعديل مصاريف" : "إضافة مصاريف"}</h3>

            <div className="formulaire">
              <label>الملف</label>
              <select
                value={selectedPaiement.designationDepGle}
                onChange={(e) =>
                  setSelectedPaiement({ ...selectedPaiement, designationDepGle: e.target.value })
                }
              >
                <option value="">اختر صنف</option>
                {designationDepGle.map(d => (
                  <option key={d._id} value={d._id}>
                    {d.nom}

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



              <label>تاريخ الدفع</label>
<input
  type="date"
  value={selectedPaiement.datePaiement}
  onChange={(e) =>
    setSelectedPaiement({ ...selectedPaiement, datePaiement: e.target.value })
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
