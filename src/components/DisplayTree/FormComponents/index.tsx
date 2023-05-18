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
import {
  useDisplayTreeStore,
  type DisplayTreeStore,
} from "../displayTreeStore";

export default function NodeForm({
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
  const { currentNodeIndex, answers, nodes } = useDisplayTreeStore(
    ({ answers, currentNodeIndex, nodes }) => ({
      answers,
      currentNodeIndex,
      nodes,
    })
  );

  const answer = answers.get(nodes[currentNodeIndex]?.id ?? "");

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
    <div className="flex h-full w-full flex-col gap-2">
      {node.img && (
        <div className="w-full flex-1 overflow-hidden rounded-lg border border-slate-300 p-1">
          <div
            className="h-full w-full rounded-md bg-cover bg-center"
            style={{
              backgroundImage: `url(${node.img})`,
            }}
          />
        </div>
      )}
      <div className="flex flex-1 items-center justify-center">
        <Formik
          onSubmit={onSubmit}
          initialValues={
            answer
              ? {
                  value: answer.multipleChoiceOption ?? answer.answer,
                }
              : {
                  value: "",
                }
          }
          validationSchema={toFormikValidationSchema(
            z.object({
              value: z.string(),
            })
          )}
        >
          {({ isSubmitting }) => (
            <Form className="w-full">
              <div className="flex max-h-full w-full flex-col gap-3">
                <p className="left-1 text-2xl font-light">{node.question}</p>
                {type === "Date" && <Date name="value" />}
                {type === "Number" && (
                  <FormInput
                    variant="flushed"
                    size={"xl"}
                    name="value"
                    type="number"
                  />
                )}
                {type === "SingleInput" && (
                  <FormInput
                    size={"xl"}
                    variant="flushed"
                    name="value"
                    type="text"
                  />
                )}
                {(type === "MultipleChoice" || type === "Select") && (
                  <FormSelect
                    variant="flushed"
                    size="xl"
                    name="value"
                    options={options}
                  />
                )}
                {type === "MultiInput" && (
                  <FormTextarea variant="flushed" name="value" size="xl" />
                )}
                <div className="flex justify-start">
                  <Button
                    size="lg"
                    type="submit"
                    className="rounded shadow-lg"
                    isloading={isSubmitting}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
