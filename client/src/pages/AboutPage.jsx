import { FaGavel, FaFolderOpen, FaMoneyBillWave, FaWallet,FaUserEdit, FaPhone, FaEnvelope,FaPrint, FaUser, FaCalendarAlt, FaUsers, FaChartLine } from "react-icons/fa";
import "../styles/about.css";
import { useEffect, useState } from "react";
export default function AboutPage() {
    useEffect(() => {
        document.title = "حول التطبيق";
      }, []);
  return (
    <div className="about-page" dir="rtl">
      <h2>حول تطبيق Avocat Manager</h2>

      <p className="about-intro">
        <strong>Avocat Manager</strong> هو تطبيق احترافي مخصص لمكاتب المحاماة،
        يهدف إلى تنظيم العمل اليومي وتسهيل متابعة القضايا، الجلسات، والمدفوعات
        بطريقة بسيطة وآمنة.
      </p>

      <div className="features-grid">
        <div className="feature-card">
          <FaFolderOpen />
          <h4>إدارة القضايا</h4>
          <p>
            إنشاء ومتابعة الملفات القضائية، ربطها بالعملاء،
            وتحديد نوع القضية وحالتها.
          </p>
        </div>

        <div className="feature-card">
          <FaUsers />
          <h4>إدارة العملاء</h4>
          <p>
            حفظ بيانات العملاء، ربطهم بالقضايا،
            والوصول السريع إلى معلوماتهم.
          </p>
        </div>


{/* الجديدة: إدارة الإنابات */}
<div className="feature-card">
          <FaUserEdit />
          <h4>إدارة الإنابات</h4>
          <p>تسجيل وإدارة الإنابات القضائية بدقة، مع تحديد المحامي المناب وتفاصيل المهمة.</p>
        </div>

        {/* الجديدة: الطباعة الذكية */}
        <div className="feature-card">
          <FaPrint />
          <h4>طباعة الوثائق</h4>
          <p>طباعة فورية واحترافية للإنابات، وصولات الدفع، الفواتير، وإعلانات افتتاح القضايا.</p>
        </div>


        <div className="feature-card">
          <FaCalendarAlt />
          <h4>الرزنامة والجلسات</h4>
          <p>
            عرض الجلسات في رزنامة احترافية،
            مع تواريخ دقيقة وتنبيهات مرئية.
          </p>
        </div>

        <div className="feature-card">
          <FaMoneyBillWave />
          <h4>المدفوعات</h4>
          <p>
            تسجيل المدفوعات، تحديد طريقة الدفع،
            حساب المبالغ المتبقية وتتبعها بسهولة.
          </p>
        </div>

{/* الجديدة: إدارة المصاريف */}
<div className="feature-card">
          <FaWallet />
          <h4>تتبع المصاريف</h4>
          <p>إدارة دقيقة للمصاريف (العامة كالكهرباء والكراء، والقضائية الخاصة بكل ملف).</p>
        </div>


        <div className="feature-card">
          <FaChartLine />
          <h4>متابعة مالية</h4>
          <p>
            رؤية شاملة للوضع المالي،
            عدد المدفوعات، والمبالغ الإجمالية.
          </p>
        </div>

        <div className="feature-card">
          <FaGavel />
          <h4>واجهة مخصصة للمحامي</h4>
          <p>
            تصميم عربي (RTL) بسيط،
            يركز على السرعة والوضوح في العمل.
          </p>
        </div>
      </div>

      <p className="about-footer">
        تم تطوير هذا التطبيق لمساعدة المحامي على
        <strong> التركيز على القضايا </strong>
        بدل تضييع الوقت في التسيير اليدوي.
      </p>

      {/* قسم معلومات الاتصال */}
      <div className="contact-section">
        <h3>معلومات المطور</h3>
        <div className="contact-info">
          <div className="contact-item">
            <FaUser /> <span>خالد كبوب</span>
          </div>
          <div className="contact-item">
            <FaPhone /> <span>0669-36-19-52</span>
          </div>
          <div className="contact-item">
            <FaEnvelope /> <span>[khaledkaboub88@gmail.com ]</span>
          </div>
        </div>
        </div>
    </div>
  );
}
