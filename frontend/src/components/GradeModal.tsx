import * as Dialog from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import instance from "../utils/axios";
import clsx from "clsx";

interface Grade {
  id: number;
  name: string;
  classes: { id: number; name: string }[];
}
interface Classroom {
  id: number;
  name: string;
}

export default function GradeModal({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [classroom, setClassroom] = useState<Classroom[]>([]);
  const [selectedGrade, setSelectedGrade] = useState<Grade | null>(null);
  const param = useParams<{ slug: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const response = await instance.get(
          `/school/schools/${param.slug}/grades/`
        );
        setGrades(response.data);
      } catch (error) {
        console.error("Error fetching grades:", error);
      }
    };

    fetchGrades();
  }, [param.slug]);

  useEffect(() => {
    const fetchClassrooms = async () => {
      try {
        const response = await instance.get(
          `/school/schools/${param.slug}/grades/${selectedGrade?.id}/classrooms/`
        );
        setClassroom(response.data);
      } catch (error) {
        console.error("Error fetching grades:", error);
      }
    };

    if (selectedGrade) {
      fetchClassrooms();
    }
  }, [selectedGrade, param.slug]);

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button className={clsx(className)}>{label}</button>
      </Dialog.Trigger>
      <Dialog.Portal>
        {/* Overlay */}
        <Dialog.Overlay className="fixed inset-0 bg-black/25 z-[1000]" />

        {/* Content */}
        <Dialog.Content
          className="fixed top-1/2 left-1/2 w-[400px] max-w-full -translate-x-1/2 -translate-y-1/2 
          bg-white rounded-2xl p-6 shadow-lg focus:outline-none z-[1001]"
        >
          <Dialog.Title className="text-xl font-bold mb-4">
            {selectedGrade ? `کلاس‌های ${selectedGrade.name}` : "لیست پایه‌ها"}
          </Dialog.Title>

          {/* لیست پایه‌ها */}
          {!selectedGrade && (
            <ul className="space-y-2">
              {grades.map((grade) => (
                <li
                  key={grade.id}
                  className="p-3 bg-gray-100 rounded-lg hover:bg-gray-200 cursor-pointer"
                  onClick={() => setSelectedGrade(grade)}
                >
                  {grade.name}
                </li>
              ))}
            </ul>
          )}

          {/* لیست کلاس‌ها */}
          {selectedGrade && (
            <ul className="space-y-2">
              {classroom.map((cls) => (
                <li
                  key={cls.id}
                  className="p-3 bg-blue-100 rounded-lg hover:bg-blue-200 cursor-pointer"
                  onClick={() => {
                    navigate(`grades/${selectedGrade.id}/classrooms/${cls.id}/`);
                  }}
                >
                  {cls.name}
                </li>
              ))}
            </ul>
          )}

          {/* دکمه‌های پایین */}
          <div className="flex justify-between mt-6">
            {selectedGrade ? (
              <button
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                onClick={() => setSelectedGrade(null)}
              >
                بازگشت
              </button>
            ) : (
              <span />
            )}
            <Dialog.Close asChild>
              <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
                بستن
              </button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
