import { useEffect, useState } from "react";
import { useParams } from "react-router";
import instance from "../../../utils/axios";
import Button from "../../Button";

type PendingMember = {
  id: number;
  user: string;
  role: string;
};

export default function ApproveNewUsers() {
  const { slug } = useParams<{ slug: string }>();
  const [items, setItems] = useState<PendingMember[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await instance.get(
        `/school/schools/${slug}/memberships/pending/`
      );
      setItems(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [slug]);

  const getRole = (role: string) => {
    const roleChoices = [
      ["teacher", "معلم"],
      ["student", "دانش‌آموز"],
    ];
    const choosenRole = roleChoices.find((item) => item[0] == role);
    if (choosenRole) {
      return choosenRole[1];
    }
    return "نامشخص";
  };

  const act = async (id: number, action: "approve") => {
    try {
      await instance.patch(
        `/school/schools/${slug}/memberships/${id}/${action}/`
      );
      setItems((prev) => prev.filter((x) => x.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">تأیید کاربران جدید</h2>
        <Button
          text={loading ? "…" : "بروزرسانی"}
          type="button"
          style="normal"
          onClick={load}
        />
      </div>

      <div className="border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-right">کاربر</th>
              <th className="p-3 text-right">نقش درخواستی</th>
              <th className="p-3 text-center">اقدام</th>
            </tr>
          </thead>
          <tbody>
            {items.map((m) => (
              <tr key={m.id} className="border-t">
                <td className="p-3">
                  <div className="font-medium">{m.user}</div>
                </td>
                <td className="p-3">{getRole(m.role)}</td>
                <td className="p-3 text-center">
                  <button
                    onClick={() => act(m.id, "approve")}
                    className="px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700"
                  >
                    تایید
                  </button>
                </td>
              </tr>
            ))}
            {!items.length && !loading && (
              <tr>
                <td colSpan={4} className="p-6 text-center text-gray-500">
                  درخواستی وجود ندارد.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
