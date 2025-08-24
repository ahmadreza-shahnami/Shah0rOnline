import moment from "moment";
import { Tabs } from "radix-ui";
import * as React from "react";

export type ScheduleData = {
  id: number;
  day_of_week_display: string;
  subject: string;
  start_time: string;
  end_time: string;
};

type WeeklyScheduleTableProps = {
  data: ScheduleData[] | undefined;
  loading?: boolean;
  emptyMessage?: string;
};

const DAY_ORDER_FA = [
  "شنبه",
  "یکشنبه",
  "دوشنبه",
  "سه‌شنبه",
  "چهارشنبه",
  "پنجشنبه",
  "جمعه",
];

/**
 * Utility: stable sort days based on Persian week order.
 */
function sortByDayOrder(data: ScheduleData[]) {
  const index = (d: string) => DAY_ORDER_FA.indexOf(d);
  return [...data].sort(
    (a, b) => index(a.day_of_week_display) - index(b.day_of_week_display)
  );
}

const WeeklyScheduleTable: React.FC<WeeklyScheduleTableProps> = ({
  data,
  loading = false,
  emptyMessage = "برنامه‌ای ثبت نشده است.",
}) => {
  const currentDays = React.useMemo(() => {
    return DAY_ORDER_FA.filter((day) =>
      data?.some((item) => item.day_of_week_display === day)
    );
  }, [data]);
  const sorted = React.useMemo(() => sortByDayOrder(data || []), [data]);

  const isEmpty = !loading && (!sorted || sorted.length === 0);

  return (
    <Tabs.Root defaultValue={currentDays[0]} dir="rtl">
      <Tabs.List className="p-5 flex flex-row gap-5 flex-wrap">
        {currentDays.map((day) => (
          <Tabs.Trigger
            value={day}
            key={"trigger" + day}
            className="border border-green-800 rounded-2xl px-2 py-1 bg-green-600 text-white hover:bg-green-700 hover:scale-105 transition-all duration-500 ease-in-out cursor-pointer data-[state=active]:bg-green-700 data-[state=active]:scale-105"
          >
            {day}
          </Tabs.Trigger>
        ))}
      </Tabs.List>
      {currentDays.map((day) => (
        <Tabs.Content value={day} key={"content" + day}>
          <table
            className="w-full text-center text-green-900 table-fixed  bg-amber-200 rounded-2xl"
            key={"table" + day}
          >
            <thead className="">
              <tr key={day}>
                <th
                  className="border-l border-b border-green-600 rounded-2xl py-2"
                  key={"barname" + day}
                >
                  برنامه زمانی
                </th>
                <th
                  className="border-r border-b border-green-600 rounded-2xl py-2"
                  key={"subject" + day}
                >
                  موضوع
                </th>
              </tr>
            </thead>
            <tbody>
              {sorted
                .filter((it) => it.day_of_week_display === day)
                .map((item) => (
                  <tr key={item.id}>
                    <td
                      className="border-l border-t border-green-600 rounded-2xl py-2"
                      key={item.id + "date"}
                    >
                      {new Date(
                        moment(item.start_time, "HH:mm").toDate()
                      ).toLocaleTimeString("FA-IR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      }) +
                        " - " +
                        new Date(
                          moment(item.end_time, "HH:mm").toDate()
                        ).toLocaleTimeString("FA-IR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        }) || "—"}
                    </td>
                    <td
                      className="border-r border-t border-green-600 rounded-2xl py-2 "
                      key={item.id + "subject"}
                    >
                      {item.subject}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </Tabs.Content>
      ))}
    </Tabs.Root>
  );
};

export default WeeklyScheduleTable;
