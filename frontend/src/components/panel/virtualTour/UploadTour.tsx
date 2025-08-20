import { useState } from "react";
import { useParams } from "react-router";
import instance from "../../../utils/axios";

export default function UploadTour() {
  const { slug } = useParams();
  const [title, setTitle] = useState("");
  const [zip, setZip] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [indexUrl, setIndexUrl] = useState<string | null>(null);

  const submit = async () => {
    if (!slug || !zip) return;
    setLoading(true);
    try {
      const form = new FormData();
      form.append("title", title);
      form.append("zip_file", zip);
      const { data } = await instance.post(`/school/schools/${slug}/virtual-tour/`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setIndexUrl(data?.index_url ?? null);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div dir="rtl" className="space-y-4">
      <h2 className="text-xl font-bold">آپلود تور مجازی</h2>

      <div className="grid gap-3 max-w-xl">
        <input
          className="border rounded-lg p-2"
          placeholder="عنوان تور (اختیاری)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label className="flex items-center gap-3">
          <span className="text-sm">فایل ZIP</span>
          <input
            type="file"
            accept=".zip"
            onChange={(e) => setZip(e.target.files?.[0] ?? null)}
          />
        </label>

        <div className="flex gap-3">
          <button
            onClick={submit}
            disabled={!zip || loading}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white disabled:opacity-50"
          >
            {loading ? "در حال بارگذاری…" : "آپلود"}
          </button>
          {indexUrl && (
            <a
              href={indexUrl}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
            >
              مشاهده تور
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
