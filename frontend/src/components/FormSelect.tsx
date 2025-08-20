// components/FormSelect.tsx
import { Field, ErrorMessage } from "formik";
import * as Select from "@radix-ui/react-select";
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@radix-ui/react-icons";

export interface FormSelectProps {
  name: string;
  label: string;
  required?: boolean;
  options: { label: string; value: string }[];
}

const FormSelect = ({ name, label, required, options }: FormSelectProps) => {
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
          <Select.Root
            value={field.value}
            onValueChange={(value) => form.setFieldValue(name, value)}
          >
            <Select.Trigger
              id={name}
              className="inline-flex items-center justify-between w-full border border-black/25 rounded-lg py-1 px-4 text-sm focus:outline-none"
            >
              <Select.Value placeholder="Select an option" />
              <Select.Icon>
                <ChevronDownIcon fontSize={16} />
              </Select.Icon>
            </Select.Trigger>

            <Select.Portal>
              <Select.Content
                className="z-50 overflow-hidden bg-white rounded-lg shadow-md"
                position="popper"
              >
                <Select.ScrollUpButton className="flex items-center justify-center h-6 bg-white cursor-default">
                  <ChevronUpIcon fontSize={16} />
                </Select.ScrollUpButton>

                <Select.Viewport className="p-1">
                  {options.map((opt) => (
                    <Select.Item
                      key={opt.value}
                      value={opt.value}
                      className="relative flex items-center px-6 py-2 rounded-md text-sm hover:bg-gray-100 cursor-pointer"
                    >
                      <Select.ItemText>{opt.label}</Select.ItemText>
                      <Select.ItemIndicator className="absolute left-1 inline-flex items-center">
                        <CheckIcon fontSize={14} />
                      </Select.ItemIndicator>
                    </Select.Item>
                  ))}
                </Select.Viewport>

                <Select.ScrollDownButton className="flex items-center justify-center h-6 bg-white cursor-default">
                  <ChevronDownIcon fontSize={16} />
                </Select.ScrollDownButton>
              </Select.Content>
            </Select.Portal>
          </Select.Root>
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

export default FormSelect;
