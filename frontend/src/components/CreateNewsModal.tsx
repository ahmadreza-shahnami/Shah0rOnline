import * as Dialog from "@radix-ui/react-dialog";
import { useState, useEffect } from "react";
import instance from "../utils/axios";

interface Category {
  id: number;
  name: string;
}

export default function CreateNewsModal({
  onCreated,
  children,
}: {
  onCreated?: () => void;
  children?: React.ReactNode;
}) {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [body, setBody] = useState("");
  const [cover, setCover] = useState<File | null>(null);
  const [published, setPublished] = useState(false);
  const [pinned, setPinned] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCats, setSelectedCats] = useState<number[]>([]);

  useEffect(() => {
    instance.get("/categories/").then((res) => setCategories(res.data));
  }, []);

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("summary", summary);
    formData.append("body", body);
    formData.append("published", String(published));
    formData.append("pinned", String(pinned));
    selectedCats.forEach((id) => formData.append("categories", String(id)));
    if (cover) formData.append("cover", cover);

    await instance.post("/news/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    if (onCreated) onCreated();
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        {children ? (
          children
        ) : (
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">
            ➕ ایجاد خبر جدید
          </button>
        )}
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40" />
        <Dialog.Content className="fixed top-[50%] left-[50%] w-[500px] bg-white rounded-lg p-5 shadow-lg -translate-x-1/2 -translate-y-1/2">
          <Dialog.Title className="text-xl font-bold mb-4">
            ایجاد خبر جدید
          </Dialog.Title>
          <input
            type="text"
            placeholder="عنوان خبر"
            className="border p-2 w-full mb-3"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            placeholder="خلاصه خبر"
            className="border p-2 w-full mb-3"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
          />
          <textarea
            placeholder="متن کامل خبر"
            className="border p-2 w-full mb-3"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
          <input
            type="file"
            onChange={(e) => setCover(e.target.files?.[0] || null)}
            className="mb-3"
          />
          <div className="flex items-center gap-3 mb-3">
            <label>
              <input
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
              />{" "}
              منتشر شود
            </label>
            <label>
              <input
                type="checkbox"
                checked={pinned}
                onChange={(e) => setPinned(e.target.checked)}
              />{" "}
              سنجاق شود
            </label>
          </div>
          <div className="mb-3">
            <label className="block mb-1">دسته‌بندی‌ها:</label>
            <select
              multiple
              className="border p-2 w-full"
              value={selectedCats.map(String)}
              onChange={(e) =>
                setSelectedCats(
                  Array.from(e.target.selectedOptions, (o) => Number(o.value))
                )
              }
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <Dialog.Close asChild>
              <button className="bg-gray-300 px-4 py-2 rounded-lg">لغو</button>
            </Dialog.Close>
            <button
              onClick={handleSubmit}
              className="bg-green-600 text-white px-4 py-2 rounded-lg"
            >
              ذخیره
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
