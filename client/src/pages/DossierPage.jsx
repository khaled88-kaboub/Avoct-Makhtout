import { useEffect, useState } from "react";
import axios from "axios";

import "../styles/dossiers.css";

const API_URL = import.meta.env.VITE_API_URL;

const AudiencesListModal = ({ dossier, onClose }) => {
  if (!dossier) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-box" style={{ maxWidth: '700px' }}>
        <div className="modal-header">
          <h3> 📅 جلسات الملف: {dossier.titre} </h3>
          <h4> - {dossier.audiences?.length || 0} - </h4>
         
        </div>

        <div className="modal-body" dir="rtl" style={{ maxHeight: '400px', overflowY: 'auto' }}>
          {dossier.audiences && dossier.audiences.length > 0 ? (
            <table className="audiences-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8f9fa' }}>
                  <th>التاريخ</th>
                  <th>الحالة</th>
                  <th>ملاحظات / قرار</th>
                </tr>
              </thead>
              <tbody>
                {dossier.audiences.map((aud) => (
                  <tr key={aud._id} style={{ borderBottom: '1px solid #eee' }}>
                    <td><small>{new Date(aud.dateAudience).toLocaleString("ar-DZ")}</small></td>
                    <td>
                       <span ><small>{aud.statut}</small></span>
                    </td>
                    <td>
                      <div><strong>الملاحظة:</strong> <small>{aud.notes || "-"}</small></div>
                      {aud.decision && (
                        <div style={{ color: 'green', fontWeight: 'none' }}>
                          <strong>القرار:</strong> <small>{aud.decision}</small>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p style={{ textAlign: 'center', padding: '20px' }}>لا توجد جلسات مبرمجة لهذا الملف.</p>
          )}
        </div>

        <div className="modal-actions">
          <button className="btn-primary" onClick={onClose}>إغلاق</button>
        </div>
      </div>
    </div>
  );
};

const PaiementsListModal = ({ dossier, onClose }) => {
  if (!dossier) return null;

  // Calculs rapides pour l'affichage
  const prixTotal = dossier.price || 0;
  const totalPaye = dossier.paiements?.reduce((acc, p) => acc + p.montant, 0) || 0;
  const resteFinal = prixTotal - totalPaye;

  return (
    <div className="modal-overlay">
      <div className="modal-box" style={{ maxWidth: '750px' }}>
        <div className="modal-header" style={{ display: 'block', textAlign: 'center' }}>
          <h3>💰 الوضعية المالية للملف: {dossier.titre}</h3>
          <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '10px', background: '#f8f9fa', padding: '10px', borderRadius: '8px' }}>
             <div><small>إجمالي الأتعاب:</small> <br/> <strong>{prixTotal} دج</strong></div>
             <div style={{ color: 'green' }}><small>المبلغ المدفوع:</small> <br/> <strong>{totalPaye} دج</strong></div>
             <div style={{ color: 'red' }}><small>المبلغ المتبقي:</small> <br/> <strong>{resteFinal} دج</strong></div>
          </div>
        </div>

        <div className="modal-body" dir="rtl" style={{ maxHeight: '400px', overflowY: 'auto' }}>
          {dossier.paiements && dossier.paiements.length > 0 ? (
            <table className="audiences-table" style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th>التاريخ</th>
                  <th>المبلغ</th>
                  <th>الطريقة</th>
                  <th>المتبقي</th>
                </tr>
              </thead>
              {/* Dans PaiementsListModal */}
<tbody>
  {dossier.paiements.map((p, index) => {
    // Calcul du reste au moment de ce paiement précis :
    // On prend le prix total et on soustrait tous les paiements depuis le début jusqu'à celui-ci
    const cumulPrecedent = dossier.paiements
      .slice(0, index + 1)
      .reduce((sum, item) => sum + item.montant, 0);
    
    const resteHistorique = dossier.price - cumulPrecedent;

    return (
      <tr key={p._id}>
        <td>{new Date(p.datePaiement).toLocaleDateString("ar-DZ")}</td>
        <td style={{ fontWeight: 'bold' }}>{p.montant} دج</td>
        <td>{p.modePaiement}</td>
        <td style={{ color: resteHistorique > 0 ? 'red' : 'green', fontWeight: 'bold' }}>
          {resteHistorique} دج
        </td>
        
           {/* Optionnel : bouton pour imprimer le reçu PDF directement depuis l'historique */}
           {/*<button onClick={() => window.open(`${API_URL}/api/paiements/pdf/${p._id}`)}>*/}
             
           {/*📄</button>*/}
        
      </tr>
    );
  })}
</tbody>
            </table>
          ) : (
            <p style={{ textAlign: 'center', padding: '20px' }}>لا توجد دفعات مسجلة.</p>
          )}
        </div>
        <div className="modal-actions">
          <button className="btn-primary" onClick={onClose}>إغلاق</button>
        </div>
      </div>
    </div>
  );
};
export default function DossiersPage() {
  const [dossiers, setDossiers] = useState([]);
  const [clients, setClients] = useState([]);
  const [typesAff, setTypesAff] = useState([]);
  const [selectedDossierForAud, setSelectedDossierForAud] = useState(null);
  const [selectedDossierForPay, setSelectedDossierForPay] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [filterStatut, setFilterStatut] = useState("");
  
  const [juridictionType, setJuridictionType] = useState(""); // court | tribunal

  const [courts, setCourts] = useState([]);
  const [tribunals, setTribunals] = useState([]);
  const [chambres, setChambres] = useState([]);
  const [classes, setClasses] = useState([]);
  
  const [qualites, setQualites] = useState([]);

  const [form, setForm] = useState({
    titre: "",
    description: "",
    typeAffaire: "",
    client: "",
    statut: "جارٍ",
    salle: "",
    price: "",
    juridictionType: "", // court | tribunal
    court: "",
    chambre: "",
    tribunal: "",
    classe: "",
    numero:"",
    adversaire: ""
  });
  
  /* ================= FETCH DATA ================= */
  const loadData = async () => {
    try {
      const [dRes, cRes, tRes, courtRes, tribRes, chRes, clRes, qualRes] =
        await Promise.all([
          axios.get(`${API_URL}/api/dossiers`),
          axios.get(`${API_URL}/api/clients`),
          axios.get(`${API_URL}/api/typeaffaire`),
          axios.get(`${API_URL}/api/courts`),
          axios.get(`${API_URL}/api/tribunals`),
          axios.get(`${API_URL}/api/chambres`),
          axios.get(`${API_URL}/api/classes`),
          
          axios.get(`${API_URL}/api/etatClients`),
          

        ]);
  
      setDossiers(dRes.data || []);
      setClients(cRes.data || []);
      setTypesAff(tRes.data || []);
      setCourts(courtRes.data || []);
      setTribunals(tribRes.data || []);
      setChambres(chRes.data || []);
      setClasses(clRes.data || []);
      setQualites(qualRes.data || []);
      
    } catch (err) {
      console.error(err);
      alert("حدث خطأ أثناء تحميل البيانات");
    }
  };
  

  useEffect(() => {
    loadData();
  }, []);
  useEffect(() => {
    document.title = "ملفات المحامي";
  }, []);
  /* ================= HANDLERS ================= */
  const openAddModal = () => {
    setEditId(null);
    setForm({ 
      titre: "",
  description: "",
  typeAffaire: "",
  client: "",
  qualite: "",
  statut: "جارٍ",
  salle: "",
  price: "",
  juridictionType: "",
  court: "",
  chambre: "",
  tribunal: "",
  classe: "",
  dateCloture: "",
  numero: "",
  adversaire: ""
     });
    setShowModal(true);
  };

  const openEditModal = (d) => {
    setEditId(d._id);
    setForm({
      titre: d.titre,
      price: d.price,
      salle: d.salle,
      description: d.description || "",
      typeAffaire: d.typeAffaire?._id || "",
      client: d.client?._id || "",
      statut: d.statut,
      qualite: d.qualite?._id || "",
      juridictionType: d.juridictionType || "",
      court: d.court?._id || "",
      chambre: d.chambre?._id || "",
      tribunal: d.tribunal?._id || "",
      classe: d.classe?._id || "",
      dateCloture: d.dateCloture || "",
      numero: d.numero || "",
      adversaire: d.adversaire || ""
    });
    
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newForm = {
      ...form,
      [name]: name === "price" ? Number(value) : value
    };
  
    // Si statut devient منتهي → définir date par défaut
    if (name === "statut" && value === "منتهي" && !form.dateCloture) {
      newForm.dateCloture = new Date().toISOString().slice(0, 10);
    }
  
    // ⭐ Si statut ≠ منتهي → vider dateCloture
    if (name === "statut" && value !== "منتهي") {
      newForm.dateCloture = "";
    }
  
    setForm(newForm);
  };
  

  const handleSubmit = async (e) => {
    const payload = { ...form };
    e.preventDefault();

  // تنظيف حسب الجهة القضائية
  if (payload.juridictionType === "court") {
    delete payload.tribunal;
    delete payload.classe;
  }

  if (payload.juridictionType === "tribunal") {
    delete payload.court;
    delete payload.chambre;
  }

  console.log("📤 CLEAN PAYLOAD:", payload);
  
    try {
      if (editId) {
        await axios.put(`${API_URL}/api/dossiers/${editId}`, payload);
      } else {
        await axios.post(`${API_URL}/api/dossiers`, payload);
      }
  
      setShowModal(false);
      loadData();
    } catch (err) {
      console.error("❌ BACKEND ERROR:", err.response?.data);
      alert(err.response?.data?.message || "خطأ في إرسال البيانات");
    }
  };
  

  const handleDelete = async (id) => {
    if (!window.confirm("هل أنت متأكد من حذف الملف؟")) return;
    try {
      await axios.delete(`${API_URL}/api/dossiers/${id}`);
      loadData();
    } catch (err) {
      console.error(err);
      alert("حدث خطأ أثناء الحذف");
    }
  };

  const filteredDossiers = dossiers.filter((d) => {
    const text = searchText.toLowerCase();
  
    const matchText =
    d.titre?.toLowerCase().includes(text) ||
    d.reference?.toLowerCase().includes(text) ||
    d.client?.noms?.some(n =>
      n.toLowerCase().includes(text)
    );
  
    const matchStatut = filterStatut
      ? d.statut === filterStatut
      : true;
  
    return matchText && matchStatut;
  });
  
  const openfacture = (id) => {
    window.open(
      `${API_URL}/api/dossiers/pdffacture/${id}`,
      "_blank"
    );
  };
  
  /* ================= UI ================= */
  return (
    <div className="dossiers-page" dir="rtl">
      <div className="page-header">
        <h2>📁 الملفات القضائية</h2>
        <button className="btn-add" onClick={openAddModal}>
          ➕ ملف جديد
        </button>
      </div>
      <div className="filters-bar">
  <input
    type="text"
    placeholder="🔍 البحث بالعنوان أو اسم العميل"
    value={searchText}
    onChange={(e) => setSearchText(e.target.value)}
  />

  <select
    value={filterStatut}
    onChange={(e) => setFilterStatut(e.target.value)}
  >
    <option value="">كل الحالات</option>
    <option value="جارٍ">جارٍ</option>
    <option value="منتهي">منتهي</option>
    <option value="ملغى">ملغى</option>
  </select>
</div>

<div className="filters-separator">
  <span>
    نتائج الملفات ({filteredDossiers.length})
  </span>
</div>


      <div className="dossiers-cards">
      {Array.isArray(filteredDossiers) && filteredDossiers.length > 0 ? (
  filteredDossiers.map((d) => (

            <div className="dossier-card" key={d._id}>
              <div className="card-header">
              
                <h3>{d.titre}</h3>
                <span className={`baadge ${d.statut}`}>{d.statut}</span>
              </div>
              
              <p>🔖 المرجع: {d.reference || "-"}</p>
              <p>📌 نوع القضية:   <strong >{d.typeAffaire?.libelle || "-"}</strong> </p>
              <p>
              👤  العميل: 
              <span
              className="client-name"
              title={d.client?.noms?.join(" / ")}
              >
              {d.client?.noms?.join(" / ") || "-"} <small>-{d.client?.typeClient || "-"}-</small>
             </span>
             </p>
             <p> صفة العميل: {d.qualite?.nom || "-"}</p>


              {d.juridictionType === "court" && (
               <>
              <p>⚖️ المجلس القضائي: {d.court?.nom || "-"}</p>
              <p>📂 الغرفة: {d.chambre?.nom || "-"}</p>
              <p className="couleur"> 📂 القاعة :  {d.salle || "-"}</p>
              <p>📂 رقم تسجيل القضية: {d.numero || "-"}</p>
              </>
               )}

               {d.juridictionType === "tribunal" && (
               <>
               <p>⚖️ المحكمة: {d.tribunal?.nom || "-"}</p>
               <p>📂 القسم: {d.classe?.nom || "-"} -  </p>
               <p className="couleur">📂 القاعة :  {d.salle || "-"}</p>
               <p>📂 رقم تسجيل القضية: {d.numero || "-"}</p>
               <p>📂 الخصم :  : {d.adversaire || "-"}</p>
               </>
                )}


              <p>
                📅 تاريخ الفتح:{" "}
                {d.dateOuverture
                  ? new Date(d.dateOuverture).toLocaleDateString("ar-DZ")
                  : "-"}
              </p>
              {d.dateCloture && (
              <p>
              📅 تاريخ الإغلاق: {new Date(d.dateCloture).toLocaleDateString("ar-DZ")}
              </p>
               )}
               <div>💵 أتعاب المحامي: {d.price || "-"}  دج</div>
               {/* Dans DossierCard */}
              <p>
               💵 الحالة المالية: 
              { (d.price - d.paiements?.reduce((acc, p) => acc + p.montant, 0)) > 0 ? (
              <span style={{ color: 'orange', fontWeight: 'bold' }}> ⚠️ غير مستوفي </span>
              ) : (
              <span style={{ color: 'green', fontWeight: 'bold' }}> ✅ مستوفي </span>
              )}
             </p>
             <a 
             href="#!" 
             className="dossier-linko" 
             onClick={() => openfacture(d._id)}
             >
              📂 نسخ مذكرة أتعاب المحامي  
             </a>


               {/* Dans le rendu de votre carte dossier */}
<div className="card-actions">
  {/* REMPLACER LE BOUTON PAR UN LIEN */}
  <a 
    href="#!" 
    className="dossier-link" 
    onClick={(e) => {
      e.preventDefault(); // Empêche le saut de page
      setSelectedDossierForAud(d);
    }}
  >
    📅 عرض الجلسات  ({d.audiences?.length || 0})
  </a>
  <a 
  href="#!" 
  className="dossier-link" 
  style={{ color: '#27ae60' }} // Couleur verte pour le paiement
  onClick={(e) => {
    e.preventDefault();
    setSelectedDossierForPay(d);
  }}
>
  💰 سجل الدفعات ({d.paiements?.length || 0})
</a>
 
</div>
              <div className="card-actions">
              
                <button onClick={() => openEditModal(d)}> تعديل</button>
                <button onClick={() => handleDelete(d._id)}> حذف</button>
              </div>
            </div>
          ))
        ) : (
          <p style={{ textAlign: "center", marginTop: "20px" }}>
            لا توجد ملفات بعد
          </p>
        )}
      </div>

      {/* ================= MODAL ================= */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>{editId ? "تعديل ملف" : "إضافة ملف جديد"}</h3>

            <form onSubmit={handleSubmit} className="modal-form">
              <input
                name="titre"
                placeholder="عنوان الملف"
                value={form.titre}
                onChange={handleChange}
                required
              />

              <select
                name="typeAffaire"
                value={form.typeAffaire}
                onChange={handleChange}
                required
              >
                <option value="">نوع القضية</option>
                {typesAff.map((t) => (
                  <option key={t._id} value={t._id}>
                    {t.libelle}
                  </option>
                ))}
              </select>
              <select
              name="juridictionType"
              value={form.juridictionType}
              onChange={(e) => {
              const value = e.target.value;
              setForm({
              ...form,
              juridictionType: value,
              court: "",
              tribunal: "",
              chambre: "",
              classe: ""
              
              });
               }}
             required
              >
              <option value="">الجهة القضائية</option>
              <option value="court">مجلس قضائي</option>
              <option value="tribunal">محكمة</option>
              </select>

              {form.juridictionType === "court" && (
  <>
    <select
      name="court"
      value={form.court}
      onChange={handleChange}
      required
    >
      <option value="">المجلس القضائي</option>
      {courts.map((c) => (
        <option key={c._id} value={c._id}>
          {String(c.wilayaNumber).padStart(2, "0")} - {c.nom}
        </option>
      ))}
    </select>

    <select
      name="chambre"
      value={form.chambre}
      onChange={handleChange}
      required
    >
      <option value="">الغرفة</option>
      {chambres.map((ch) => (
        <option key={ch._id} value={ch._id}>
          {ch.nom}
        </option>
      ))}
    </select>
  </>
)}




{form.juridictionType === "tribunal" && (
  <>
    <select
      name="tribunal"
      value={form.tribunal}
      onChange={handleChange}
      required
    >
      <option value="">المحكمة</option>
      {tribunals.map((t) => (
        <option key={t._id} value={t._id}>
          {t.cour
      ? `${String(t.cour.wilayaNumber).padStart(2, "0")} - ${t.nom}`
      : t.nom}
        </option>
      ))}
    </select>

    <select
      name="classe"
      value={form.classe}
      onChange={handleChange}
      required
    >
      <option value="">القسم</option>
      {classes.map((cl) => (
        <option key={cl._id} value={cl._id}>
          {cl.nom}
        </option>
      ))}
    </select>
  </>
)}

                <input
                type="string"
                name="numero"
                placeholder=" رقم تسجيل القضية"
                value={form.numero}
                onChange={handleChange}
                required
              />
              
              <input
                type="string"
                name="salle"
                placeholder=" رقم القاعة "
                value={form.salle}
                onChange={handleChange}
                required
              />

<input
                type="string"
                name="adversaire"
                placeholder=" الخصم  "
                value={form.adversaire}
                onChange={handleChange}
                required
              />
              <input
                type="number"
                name="price"
                placeholder=" أتعاب المحامي"
                value={form.price}
                onChange={handleChange}
                required
              />
              <select
                name="client"
                value={form.client}
                onChange={handleChange}
                required
              >
                <option value="">العميل</option>
                {clients.map((c) => (
                  <option key={c._id} value={c._id}>
                     {c.noms.join(" / ")} ({c.typeClient})
                  </option>
                
                ))}
              </select>
              <select
               name="qualite"
               value={form.qualite}
               onChange={handleChange}
               required
>
               <option value="">صفة العميل</option>
               {qualites.map((q) => (
               <option key={q._id} value={q._id}>
               {q.nom}
               </option>
               ))}
               </select>

              <select
                name="statut"
                value={form.statut}
                onChange={handleChange}
              >
                <option value="جارٍ">جارٍ</option>
                
                <option value="منتهي">منتهي</option>
                <option value="ملغى">ملغى</option>
              </select>
              {form.statut === "منتهي" && (
  <input
    type="date"
    name="dateCloture"
    value={form.dateCloture ? form.dateCloture.slice(0, 10) : ""}
    onChange={handleChange}
    placeholder="تاريخ الإغلاق"
  />
)}
              <textarea
                name="description"
                placeholder="وصف الملف (اختياري)"
                value={form.description}
                onChange={handleChange}
              />

              <div className="modal-actions">
                <button className="btn-primary">حفظ</button>
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setShowModal(false)}
                >
                  إلغاء
                </button>
              </div>
            </form>
            
          </div>
        </div>
      )}
      {/* Juste après la modale d'ajout/modification */}
      {selectedDossierForAud && (
  <AudiencesListModal 
    dossier={selectedDossierForAud} 
    onClose={() => setSelectedDossierForAud(null)} 
  />
)}
{selectedDossierForPay && (
  <PaiementsListModal 
    dossier={selectedDossierForPay} 
    onClose={() => setSelectedDossierForPay(null)} 
  />
)}
    </div>
  );
}
