import { use, useEffect, useState } from "react";
import { useParams } from "react-router";
import instance from "../utils/axios";
import SchoolLayout from "../layouts/SchoolLayout";

interface NewsDetail {
  id: number;
  title: string;
  body: string;
  cover?: string;
  published: boolean;
  categories: { id: number; name: string }[];
}

export default function NewsDetail() {
  const { id } = useParams();
  const [news, setNews] = useState<NewsDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const params = useParams<{ slug: string; newsslug: string }>();

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await instance.get(
          `/school/schools/${params.slug}/news/${params.newsslug}/`
        );
        setNews(res.data);
      } catch (err) {
        console.error("Error fetching news:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [id]);

  if (loading) return <p>در حال بارگذاری...</p>;
  if (!news) return <p>خبر یافت نشد.</p>;

  return (
    <SchoolLayout title={news.title}>
      {news.cover && (
        <img
          src={news.cover}
          alt={news.title}
          className="w-full max-h-[400px] object-cover rounded-lg mb-4"
        />
      )}
      <div className="text-gray-700 leading-relaxed">{news.body}</div>
      {news.categories.length > 0 && (
        <div className="mt-4">
          <span className="font-semibold">دسته‌بندی‌ها:</span>{" "}
          {news.categories.map((cat) => cat.name).join("، ")}
        </div>
      )}
    </SchoolLayout>
  );
}
