import { useParams } from "react-router";
import { useEffect, useState } from "react";
import instance from "../utils/axios";
import { Loader } from "../components/Loader"; // لوودر جداگانه
import { RolePanel } from "../components/RolePanel"; // پنل نقش‌ها
import Button from "../components/Button";
import SchoolLayout from "../layouts/SchoolLayout";

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

    const fetchMemberData = async () => {
      try {
        const membershipRes = await instance.get(
          `/school/schools/${slug}/membership/`
        );

        setMembership(membershipRes.data);
      } catch (err) {
        console.error("Error loading school:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMemberData();
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
      {/* وضعیت عضویت */}
      <section>
        {!membership && <Button text="ثبت‌نام" style="submit" />}
        {membership && !membership.is_approved && (
          <p className="bg-yellow-100 text-yellow-800 p-3 rounded-lg">
            درخواست شما در انتظار تایید مدیر است.
          </p>
        )}
        {membership && membership.is_approved && (
          <RolePanel role={membership.role!} />
        )}
      </section>
    </SchoolLayout>
  );
}
