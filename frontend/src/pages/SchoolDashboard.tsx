import { useParams } from "react-router";
import { useEffect, useState } from "react";
import axios from "axios";
import instance from "../utils/axios";

interface School {
  name: string;
  slug: string;
  type: string;
  city: string;
}

interface Membership {
  role?: string;
  is_approved?: boolean;
}

export default function SchoolDashboard() {
  const { slug } = useParams();
  const [school, setSchool] = useState<School | null>(null);
  const [membership, setMembership] = useState<Membership | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const schoolRes = await instance.get(`/school/schools/${slug}/`);
        setSchool(schoolRes.data);

        const membershipRes = await instance.get(
          `/school/schools/${slug}/membership/`
        );
        console.log(membershipRes);
        setMembership(membershipRes.data);
      } catch (err) {
        console.error("Error loading school:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  if (loading) return <p>در حال بارگذاری...</p>;
  if (!school) return <p>مدرسه یافت نشد.</p>;

  return (
    <div className="p-5">
      <h1 className="text-3xl font-bold mb-4">{school.name}</h1>
      <p className="text-gray-700 mb-6">
        نوع مدرسه: {school.type} - شهر: {school.city}
      </p>

      {!membership && (
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
          ثبت‌نام در مدرسه
        </button>
      )}

      {membership && !membership.is_approved && (
        <p className="text-yellow-600">درخواست شما در انتظار تایید مدیر است.</p>
      )}

      {membership && membership.is_approved && (
        <div>
          <p className="text-green-600 mb-4">
            شما به عنوان "{membership.role}" عضو هستید.
          </p>
          {membership.role === "مدیر" && <p>📌 اینجا منوی مدیریت مدرسه میاد</p>}
          {membership.role === "معلم" && <p>📌 اینجا پنل معلم میاد</p>}
          {membership.role === "دانش‌آموز" && (
            <p>📌 اینجا پنل دانش‌آموز میاد</p>
          )}
        </div>
      )}
    </div>
  );
}
