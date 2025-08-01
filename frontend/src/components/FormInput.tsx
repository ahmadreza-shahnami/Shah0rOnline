import { ErrorMessage, Field } from "formik";

const FormInput = ({
  name,
  label,
  required,
}: {
  name: string;
  label: string;
  required?: boolean;
}) => {
  return (
    <div className="relative w-full grid grid-cols-2 justify-between">
      <label htmlFor={name} className="relative text-black font-semibold">
        <div className="absolute -top-1 -right-2 text-red-600 text-sm">
          {required ? "*" : ""}
        </div>
        {label}:
      </label>
      <Field
        name={name}
        className={`border border-black/25 rounded-lg py-1 px-4 `}
      />
      <ErrorMessage
        name={name}
        component={"div"}
        className="absolute text-xs right-[50%] text-red-600 top-full before:content-['*']"
      />
    </div>
  );
};

export default FormInput;
