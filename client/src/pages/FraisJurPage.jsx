import { useEffect, useState } from "react";
import axios from "axios";
import { FaMoneyBillWave, FaTrash, FaEdit, FaPlus } from "react-icons/fa";
import "../styles/paiements.css";

export default function FraisJursPage() {
  const [paiements, setPaiements] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [designationDepJur, setDesignationDepJur] = useState([]); // pour le select dossier
  const [dossiers, setDossiers] = useState([]); 
  
  const [filterMode, setFilterMode] = useState("");

  const API_URL = import.meta.env.VITE_API_URL;

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPaiement, setSelectedPaiement] = useState({
    montant: "",
    dossier: "",
    designationDepJur: "",
    
    datePaiement: new Date().toISOString().substring(0, 10) // date du jour en YYYY-MM-DD
  });

  /* ================= LOAD ================= */
  const loadPaiements = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/fraisjur?sort=-datePaiement`);

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

  
  const loadDesignationDepJur = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/designation_dep_jur`);
      setDesignationDepJur(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Erreur chargement genres de dpences:", err);
    }
  };
  useEffect(() => {
    loadPaiements();
    loadDesignationDepJur()
    loadDossiers();
  }, []);

  /* ================= FILTER ================= */
 



  useEffect(() => {
    document.title = "قائمة المصاريف";
  }, []);
  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("حذف هذا الدفع؟")) return;
    try {
      await axios.delete(`${API_URL}/api/fraisjur/${id}`);
     await loadPaiements();
    } catch (err) {
      console.error("Erreur suppression paiement:", err);
      alert("Erreur lors de la suppression !");
    }
  };

 
  
  /* ================= MODAL ================= */
  const openModal = (fraisjur = null) => {
    if (fraisjur) {
      setSelectedPaiement({
        _id: fraisjur._id,
        montant: fraisjur.montant ?? "",
        designationDepJur: fraisjur.designationDepJur?._id ?? "",
        dossier: fraisjur.dossier?._id ?? "",
        datePaiement: fraisjur.datePaiement
          ? new Date(fraisjur.datePaiement).toISOString().substring(0, 10)
          : new Date().toISOString().substring(0, 10),
      });
    } else {
      setSelectedPaiement({
        montant: "",
        designationDepJur: "",
        dossier: "",
        datePaiement: new Date().toISOString().substring(0, 10),
      });
    }
    setModalOpen(true);
  };
  

  const closeModal = () => {
    setModalOpen(false);
    setSelectedPaiement({ montant: "", designationDepJur: "", dossier: "" });
  };

  const handleSave = async (fraisjur) => {
    if ( !fraisjur.designationDepJur || !fraisjur.montant) {
      alert(" االمبلغ ضروري !");
      return;
    }
  
    const payload = {
      ...fraisjur,
      montant: Number(fraisjur.montant),
      // On ne retire pas forcément 'reste' ici, le backend le recalculera
      datePaiement: new Date(fraisjur.datePaiement),
    };
  
    try {
      if (fraisjur._id) {
        await axios.put(`${API_URL}/api/fraisjur/${fraisjur._id}`, payload);
      } else {
        await axios.post(`${API_URL}/api/fraisjur`, payload);
      }
      
      // IMPORTANT : Recharger les deux pour être sûr que les compteurs sont justes
      await loadPaiements();
      await loadDesignationDepJur();
      await loadDossiers(); 
      
      
      closeModal();
    } catch (err) {
      console.error("Erreur sauvegarde paiement:", err);
      alert("خطأ في حفظ البيانات");
    }
  };

  return (
    <div className="paiements-page" dir="rtl">
      <div className="page-header">
      <h2><FaMoneyBillWave />  المصاريف القضائية </h2>
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
            <th>الملف</th>
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
                <td>{p.dossier?.titre || "-"}</td>
                <td>{p.montant} دج</td>
                <td>{p.designationDepJur.nom || "-"}</td>
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
                value={selectedPaiement.dossier}
                onChange={(e) =>
                  setSelectedPaiement({ ...selectedPaiement, dossier: e.target.value })
                }
              >
                <option value="">اختر الملف</option>
                {dossiers.map(d => (
                  <option key={d._id} value={d._id}>
                    {d.titre} - {d.client?.noms?.join(" ، ")}

                  </option>
                ))}
              </select>


              <label>الصنف</label>
              <select
                value={selectedPaiement.designationDepJur}
                onChange={(e) =>
                  setSelectedPaiement({ ...selectedPaiement, designationDepJur: e.target.value })
                }
              >
                <option value="">اختر صنف</option>
                {designationDepJur.map(d => (
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
