// components/FormDateTimePicker.tsx
import { Field, ErrorMessage } from "formik";
import DatePicker, { DateObject } from "react-multi-date-picker";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import persian from "react-date-object/calendars/persian";
import gregorian from "react-date-object/calendars/gregorian";
import gregorian_en from "react-date-object/locales/gregorian_en";
import persian_fa from "react-date-object/locales/persian_fa";
import opacity from "react-element-popper/animations/opacity";
import "react-multi-date-picker/styles/colors/green.css";

export interface FormDateTimePickerProps {
  name: string;
  label: string;
  required?: boolean;
  placeholder?: string;
  calendarType?: "persian" | "gregorian";
  format?: string; // e.g. "YYYY-MM-DD", "HH:mm", "YYYY-MM-DD HH:mm"
  disableDayPicker?: boolean;
}

const FormDateTimePicker = ({
  name,
  label,
  required,
  placeholder = "تاریخ را انتخاب کنید.",
  calendarType = "persian",
  format = "YYYY-MM-DD HH:mm",
  disableDayPicker = false,
}: FormDateTimePickerProps) => {
  // Pick calendar + locale based on prop
  const calendar = calendarType === "persian" ? persian : gregorian;
  const locale = calendarType === "persian" ? persian_fa : gregorian_en;

  // If format contains time, we add TimePicker plugin
  const plugins =
    format.includes("HH") || format.includes("mm")
      ? [<TimePicker key="time" hideSeconds />]
      : [];

  return (
    <div className="relative w-full grid grid-cols-2 items-start gap-2">
      {/* Label */}
      <label
        htmlFor={name}
        className="relative text-black font-semibold leading-6"
      >
        <div className="absolute -top-1 -right-2 text-red-600 text-sm">
          {required ? "*" : ""}
        </div>
        {label}:
      </label>

      {/* Field wrapper */}
      <Field name={name}>
        {({ field, form }: any) => (
          <DatePicker
            {...field}
            value={
              field.value
                ? new DateObject({ date: field.value, format }).convert(
                    calendar,
                    locale
                  )
                : ""
            }
            onChange={(value: DateObject | string | null) => {
              if (!value) {
                form.setFieldValue(name, "");
              } else {
                form.setFieldValue(name, value);
              }
            }}
            calendar={calendar}
            locale={locale}
            format={format}
            plugins={plugins}
            inputClass="p-1 w-full caret-gray-600 rounded-md text-black text-center focus:outline-none bg-gray-100"
            animations={[opacity({ from: 0.1, to: 1, duration: 500 })]}
            className="green"
            placeholder={placeholder}
            disableDayPicker={disableDayPicker}
          />
        )}
      </Field>

      {/* Error */}
      <ErrorMessage
        name={name}
        component="div"
        className="absolute text-xs right-[50%] text-red-600 top-full w-max before:content-['*']"
      />
    </div>
  );
};

export default FormDateTimePicker;
