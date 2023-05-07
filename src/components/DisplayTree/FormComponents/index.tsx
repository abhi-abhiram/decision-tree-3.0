import { Formik, Form, type FormikHelpers } from "formik";
import React from "react";
import Date from "./Date";
import FormInput from "./Input";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { Button } from "~/ui/Button";
import { type Option } from "@prisma/client";
import FormSelect from "./Select";
import FormTextarea from "./Textarea";
import { type DisplayTreeStore } from "../store";

export default function TreeForm({
  onSubmit,
  node: { type, ...node },
}: {
  onSubmit: (
    value: {
      value: string;
    },
    formikHelpers: FormikHelpers<{ value: string; option?: Option }>
  ) => void;
  node: DisplayTreeStore["nodes"][number];
}) {
  const options = React.useMemo(() => {
    return (
      node.options.map((option) => {
        return {
          label: option.value,
          value: option.id,
        };
      }) ?? []
    );
  }, [node]);
  return (
    <Formik
      onSubmit={onSubmit}
      initialValues={{
        value: "",
      }}
      validationSchema={toFormikValidationSchema(
        z.object({
          value: z.string(),
        })
      )}
    >
      {({ isSubmitting }) => (
        <Form>
          <div className="flex flex-col gap-2">
            <div>
              <p className="text-sm font-medium">{node.question}</p>
            </div>
            {type === "Date" && <Date name="value" />}
            {type === "Number" && <FormInput name="value" type="number" />}
            {type === "SingleInput" && <FormInput name="value" type="text" />}
            {(type === "MultipleChoice" || type === "Select") && (
              <FormSelect name="value" options={options} />
            )}
            {type === "MultiInput" && <FormTextarea name="value" />}
            <div className="self-end">
              <Button type="submit" isloading={isSubmitting}>
                Next
              </Button>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
}
