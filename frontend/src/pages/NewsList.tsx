import { useEffect, useState } from "react";
import instance from "../utils/axios";
import { Link, useParams } from "react-router";
import SchoolLayout from "../layouts/SchoolLayout";
import CreateNewsModal from "../components/CreateNewsModal";

interface News {
  id: number;
  title: string;
  slug: string;
  summary: string;
  cover?: string;
  published: boolean;
}

export default function NewsList() {
  const [newsList, setNewsList] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const param = useParams<{ slug: string }>();

  useEffect(() => {
    const fetchNews = async () => {
      try {
        console.log("Fetching news for slug:", param.slug);
        const res = await instance.get(`/school/schools/${param.slug}/news/`);
        setNewsList(res.data.results);
      } catch (err) {
        console.error("Error fetching news:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) return <p>در حال بارگذاری...</p>;

  return (
    <SchoolLayout title="اخبار مدرسه">
        <CreateNewsModal onCreated={() => window.location.reload()} />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {newsList.map((item) => (
          <Link
            key={item.id}
            to={`${item.slug}`}
            className="border rounded-lg shadow hover:shadow-lg transition"
          >
            {item.cover && (
              <img
                src={item.cover}
                alt={item.title}
                className="w-full h-48 object-cover rounded-t-lg"
              />
            )}
            <div className="p-4">
              <h2 className="font-bold text-lg">{item.title}</h2>
              <p className="text-gray-600">{item.summary}</p>
            </div>
          </Link>
        ))}
      </div>
    </SchoolLayout>
  );
}
