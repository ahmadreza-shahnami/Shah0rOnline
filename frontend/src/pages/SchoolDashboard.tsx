import { useParams } from "react-router";
import { useEffect, useState } from "react";
import instance from "../utils/axios";
import { Loader } from "../components/Loader"; // لوودر جداگانه
import { RolePanel } from "../components/RolePanel"; // پنل نقش‌ها
import Button from "../components/Button";
import SchoolLayout from "../layouts/SchoolLayout";
import GradeModal from "../components/GradeModal";
import VirtualTour from "../components/VirtualTour";

interface School {
  name: string;
  slug: string;
  type_display: string;
  city_name: string;
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
    const fetchSchoolData = async () => {
      try {
        const schoolRes = await instance.get(`/school/schools/${slug}/`);

        setSchool(schoolRes.data);
      } catch (err) {
        console.error("Error loading school:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSchoolData();
  }, [slug]);

  if (loading) return <Loader message="در حال بارگذاری اطلاعات مدرسه..." />;
  if (!school)
    return <p className="text-center text-red-500">مدرسه یافت نشد.</p>;

  return (
    <SchoolLayout>
      {/* هدر مدرسه */}
      <header className="mb-6 border-b pb-4">
        <h1 className="text-3xl font-extrabold text-gray-800">{school.name}</h1>
        <p className="text-gray-600 mt-2">
          نوع مدرسه: {school.type_display} | شهر: {school.city_name}
        </p>
      </header>
      <section>
        <GradeModal
          label="لیست پایه ها"
          className="bg-green-400 cursor-pointer border transition-all duration-200 ease-in-out border-amber-300 hover:bg-amber-300 text-white px-4 py-2 rounded-lg"
        />
      </section>
      <section>
        <VirtualTour />
      </section>
    </SchoolLayout>
  );
}
