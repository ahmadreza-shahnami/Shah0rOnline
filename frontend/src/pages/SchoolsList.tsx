import * as React from "react";
import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import instance from "../utils/axios";
import { school } from "../api.json";
import { useNavigate } from "react-router";

type School = {
  id: number;
  name: string;
  slug: string;
  city_name: string;
  type_display: string;
};
const SchoolsList = () => {
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 1000);
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    setLoading(true);
    setError("");

    instance
      .get(school.schools, {
        params: {
          search: debouncedSearch || undefined,
          type: type || undefined,
        },
      })
      .then((res) => {
        setSchools(res.data.results);
      })
      .catch(() => setError("خطا در دریافت اطلاعات"))
      .finally(() => setLoading(false));
  }, [debouncedSearch, type]);

  return (
    <MainLayout title="لیست مدارس">
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="جستجو بر اساس نام یا شهر..."
          className="border rounded p-2 flex-1"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border rounded p-2"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="">همه نوع‌ها</option>
          <option value="elementary">دبستان</option>
          <option value="middle_school">راهنمایی</option>
          <option value="high_school">دبیرستان</option>
        </select>
      </div>

      {loading && <p>در حال بارگذاری...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* لیست مدارس */}
      {!loading && schools.length === 0 && <p>مدرسه‌ای یافت نشد.</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {schools.map((school) => (
          <div
            key={school.id}
            className="border rounded-lg p-4 shadow hover:shadow-lg transition"
            onClick={() => navigate(school.slug)}
          >
            <h2 className="font-bold text-lg">{school.name}</h2>
            <p className="text-gray-600">{school.city_name}</p>
            <p className="text-sm text-blue-600">{school.type_display}</p>
          </div>
        ))}
      </div>
    </MainLayout>
  );
};

export default SchoolsList;
