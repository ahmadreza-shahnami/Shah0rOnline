export function RolePanel({ role }: { role: string }) {
  switch (role) {
    case "مدیر":
      return <p className="text-green-600">📌 اینجا منوی مدیریت مدرسه میاد</p>;
    case "معلم":
      return <p className="text-green-600">📌 اینجا پنل معلم میاد</p>;
    case "دانش‌آموز":
      return <p className="text-green-600">📌 اینجا پنل دانش‌آموز میاد</p>;
    default:
      return <p className="text-gray-600">📌 پنل مخصوص این نقش هنوز ساخته نشده</p>;
  }
}
