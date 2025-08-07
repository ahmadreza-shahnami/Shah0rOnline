import { Formik, Form } from "formik";
import * as Yup from "yup";
import FormInput, { type Input } from "../components/FormInput";

const BaseForm = ({
  initialValues,
  validationSchema,
  onSubmit,
  inputList,
  submitButton,
}: {
  initialValues: object;
  validationSchema: Yup.AnyObject;
  onSubmit: (values: any, actions: any) => void;
  inputList: Input[];
  submitButton: React.ReactNode;
}) => {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      <Form className="flex flex-col gap-20 p-4">
        <div className="grid grid-cols-2 max-w-3xl mx-auto not-md:grid-cols-1 gap-y-6 gap-x-10 not-md:max-w-sm">
          {inputList?.map((input) => (
            <FormInput {...input} />
          ))}
        </div>
        {submitButton}
      </Form>
    </Formik>
  );
};

export default BaseForm;
