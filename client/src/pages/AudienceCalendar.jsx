import { useEffect, useState } from "react";
import axios from "axios";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

//import "@fullcalendar/daygrid/main.css";
//import "@fullcalendar/timegrid/main.css";
import "../styles/audienceCalendar.css";



export default function AudienceCalendar() {
  const [audiences, setAudiences] = useState([]);
  const [selectedAudience, setSelectedAudience] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editAudience, setEditAudience] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    loadAudiences();
  }, []);
  useEffect(() => {
    document.title = "رزنامة القضايا";
  }, []);
  const loadAudiences = async () => {
    const res = await axios.get(`${API_URL}/api/audiences`);
    setAudiences(res.data);
  };

  /* تحويل audiences إلى events */
  const events = Array.isArray(audiences)
  ? audiences.map(a => ({
      id: a._id,
      title: `${a.dossier?.titre} - ${a.dossier?.client?.nom || ""} ${a.dossier?.client?.prenom || ""}`,
      start: a.dateAudience,
      backgroundColor: getColorByStatus(a.statut),
      extendedProps: a // ⭐ هنا الحل
    }))
  : [];



  const handleEventClick = (info) => {
    setSelectedAudience(info.event.extendedProps);
    setShowModal(true);
  };
  

  return (
    <div className="calendar-page" dir="rtl">
      <h2>📅 رزنامة الجلسات</h2>

      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        locale="ar"
        headerToolbar={{
          right: "prev,next today",
          center: "title",
          left: "dayGridMonth,timeGridWeek,timeGridDay"
        }}
        events={events}
        eventClick={handleEventClick}
        height="auto"
      />
      {showModal && selectedAudience && (
  <div className="modal-overlay">
    <div className="modal-box">
      <h3>📌 تفاصيل الجلسة</h3>

      <p><strong>📁 الملف:</strong> {selectedAudience.dossier?.titre}</p>

      <p>
        <strong>👤 العميل:</strong>{" "}
        {selectedAudience.dossier?.client?.nom}{" "}
        {selectedAudience.dossier?.client?.prenom}
      </p>

      <p><strong>🏛️ المحكمة:</strong> {selectedAudience.tribunal || "-"}</p>
      <p><strong>🚪 القاعة:</strong> {selectedAudience.salle || "-"}</p>

      <p>
        <strong>📅 التاريخ:</strong>{" "}
        {new Date(selectedAudience.dateAudience).toLocaleDateString("ar-DZ")}
      </p>

      <p><strong>⚖️ نوع الجلسة:</strong> {selectedAudience.typeAudience}</p>
      <p><strong>📌 الحالة:</strong> {selectedAudience.statut}</p>

      {selectedAudience.notes && (
        <p><strong>📝 ملاحظات:</strong> {selectedAudience.notes}</p>
      )}

<div className="modal-actions">
  <button
    className="btn-edit"
    onClick={() => {
      setEditAudience(selectedAudience);
      setShowModal(false);
      setShowEditModal(true);
    }}
  >
    ✏️ تعديل الجلسة
  </button>

  <button className="btn-close" onClick={() => setShowModal(false)}>
    إغلاق
  </button>
</div>

    </div>
  </div>
)}
{showEditModal && editAudience && (
  <div className="modal-overlay">
    <div className="modal-box">
      <h3>✏️ تعديل الجلسة</h3>

      <form
        onSubmit={async (e) => {
          e.preventDefault();

          await axios.put(
            `http://localhost:5000/api/audiences/${editAudience._id}`,
            editAudience
          );

          setShowEditModal(false);
          loadAudiences();
        }}
      >
        <label>📅 تاريخ الجلسة</label>
        <input
          type="date"
          value={editAudience.dateAudience.slice(0, 10)}
          onChange={(e) =>
            setEditAudience({
              ...editAudience,
              dateAudience: e.target.value
            })
          }
          required
        />

        <label>⚖️ نوع الجلسة</label>
        <select
          value={editAudience.typeAudience}
          onChange={(e) =>
            setEditAudience({
              ...editAudience,
              typeAudience: e.target.value
            })
          }
        >
          <option value="مرافعة">مرافعة</option>
          <option value="تحقيق">تحقيق</option>
          <option value="سماع الشهود">سماع الشهود</option>
          <option value="مداولة">مداولة</option>
          <option value="النطق بالحكم">النطق بالحكم</option>
        </select>

        <label>📌 الحالة</label>
        <select
          value={editAudience.statut}
          onChange={(e) =>
            setEditAudience({
              ...editAudience,
              statut: e.target.value
            })
          }
        >
          <option value="مجدولة">مجدولة</option>
          <option value="مؤجلة">مؤجلة</option>
          <option value="منتهية">منتهية</option>
          <option value="ملغاة">ملغاة</option>
        </select>

        <label>📝 ملاحظات</label>
        <textarea
          value={editAudience.notes || ""}
          onChange={(e) =>
            setEditAudience({
              ...editAudience,
              notes: e.target.value
            })
          }
        />

        <div className="modal-actions">
          <button type="submit" className="btn-primary">
            💾 حفظ التعديلات
          </button>
          <button
            type="button"
            className="btn-close"
            onClick={() => setShowEditModal(false)}
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

/* ألوان حسب الحالة */
function getColorByStatus(statut) {
  switch (statut) {
    case "مجدولة":
      return "#2563eb"; // أزرق
    case "مؤجلة":
      return "#f59e0b"; // برتقالي
    case "منتهية":
      return "#10b981"; // أخضر
    case "ملغاة":
      return "#ef4444"; // أحمر
    default:
      return "#6b7280";
  }
}
