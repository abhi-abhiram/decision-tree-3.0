import Layout from "~/components/ui/Layout";
import Sidebar from "~/components/data-model/Sidebar";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import {
  ArrowsRightLeftIcon,
  Bars3BottomLeftIcon,
  Bars3Icon,
  ClockIcon,
  HashtagIcon,
} from "@heroicons/react/24/outline";
import Modal from "~/ui/Modal";
import React from "react";
import Textinput from "~/components/DisplayTree/FormComponents/Input";
import Select from "~/components/DisplayTree/FormComponents/Select";
import { Button } from "~/components/ui/Button";
import { RelationType, VarDataType } from "@prisma/client";
import { Form, Formik } from "formik";
import FormCheckbox from "~/components/DisplayTree/FormComponents/Checkbox";

const Fields = [
  {
    name: "DateTime",
    icon: <ClockIcon className="h-6 w-6 text-gray-400" />,
    description: "A date and time",
    value: VarDataType.Date,
  },
  {
    name: "String",
    icon: <Bars3BottomLeftIcon className="h-6 w-6 text-gray-400" />,
    description: "Any text",
    value: VarDataType.String,
  },
  {
    name: "Boolean",
    icon: <ArrowsRightLeftIcon className="h-6 w-6 text-gray-400" />,
    description: "True or false",
    value: VarDataType.Boolean,
  },
  {
    name: "Number",
    icon: <HashtagIcon className="h-6 w-6 text-gray-400" />,
    description: "A number",
    value: VarDataType.Number,
  },
] as const;

const AddField = ({
  field,
  onClose,
}: {
  onClose: () => void;
  field: (typeof Fields)[number] | null;
}) => {
  const { query } = useRouter();
  const utils = api.useContext();
  const { mutate, isLoading } = api.variable.create.useMutation({
    onSuccess(data) {
      utils.model.model.setData({ id: query.id as string }, (old) => {
        if (!old) return old;
        return {
          ...old,
          variables: [...old.variables, data],
        };
      });
      onClose();
    },
  });

  return (
    <Modal
      title="Add Field"
      isOpen={!!field}
      setIsOpen={onClose}
      className="w-[35rem]"
    >
      <Formik
        initialValues={{
          name: "",
          isForeignKey: false,
          referenceModel: "",
          relationType: RelationType.OneToMany,
          dataType: VarDataType.String,
          referenceName: "",
        }}
        onSubmit={(values) => {
          mutate({
            modelId: query.id as string,
            name: values.name,
            dataType: values.dataType,
            ...(values.isForeignKey && {
              relation: {
                isForeignKey: values.isForeignKey,
                targetId: values.referenceModel,
                type: values.relationType,
                name: values.referenceName,
              },
            }),
          });
        }}
      >
        {({ values }) => {
          return (
            <Form>
              <div className="mt-3">
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Name
                  </label>
                  <Textinput placeholder="Name" name="name" />
                </div>
                <div className="mt-4">
                  <label
                    htmlFor="Type"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Type
                  </label>
                  <Select
                    name="dataType"
                    options={Fields.map((field) => ({
                      label: field.name,
                      value: field.name,
                      icon: field.icon,
                    }))}
                    showValueIcon={true}
                  ></Select>
                </div>
                <div className="mt-4 flex items-center gap-8">
                  <div>
                    <label
                      htmlFor="isForeignKey"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Is Foreign Key
                    </label>
                    <FormCheckbox name="isForeignKey" />
                  </div>
                </div>
                {values.isForeignKey && (
                  <>
                    <div className="mt-4 ">
                      <label
                        htmlFor="refereceModel"
                        className="mb-2 block text-sm font-medium text-gray-700"
                      >
                        Reference Model
                      </label>
                      <Select
                        name="referenceModel"
                        options={
                          utils.model.models
                            .getData()
                            ?.filter((val) => {
                              return val.id !== query.id;
                            })
                            .map((model) => ({
                              label: model.name,
                              value: model.id,
                            })) ?? []
                        }
                      ></Select>
                    </div>
                    <div className="mt- 4">
                      <label
                        htmlFor="relationType"
                        className="mb-2 block text-sm font-medium text-gray-700"
                      >
                        Relation Type
                      </label>
                      <Select
                        options={
                          Object.values(RelationType).map((val) => ({
                            label: val,
                            value: val,
                          })) ?? []
                        }
                        name="relationType"
                      ></Select>
                    </div>
                    <div className="mt-4">
                      <label
                        htmlFor="referenceName"
                        className="mb-2 block text-sm font-medium text-gray-700"
                      >
                        Reference Name
                      </label>
                      <Textinput
                        placeholder="Reference Name"
                        name="referenceName"
                      />
                    </div>
                  </>
                )}
                <div className="mt-4 space-y-2">
                  <Button
                    type="submit"
                    className="w-full"
                    isloading={isLoading}
                  >
                    Add Field
                  </Button>
                  <Button
                    onClick={onClose}
                    className="w-full"
                    variant="secondary"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </Form>
          );
        }}
      </Formik>
    </Modal>
  );
};

export default function Model() {
  const { query } = useRouter();
  const { data } = api.model.model.useQuery(
    {
      id: query.id as string,
    },
    {
      enabled: !!query.id,
    }
  );
  const [field, setField] = React.useState<(typeof Fields)[number] | null>(
    null
  );

  return (
    <Layout>
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <div className="flex flex-1 flex-col gap-4 p-4">
          <div>
            <h2
              className="-mx-2 w-fit cursor-text rounded-md p-2 text-2xl
              font-semibold outline-none transition-colors duration-200 ease-in-out hover:bg-white hover:text-inherit
              focus:bg-white focus:text-inherit
              "
              contentEditable={true}
            >
              {data?.name}
            </h2>
            <div className="mt-2 h-1 w-full border-b border-gray-400" />
          </div>
          <div className="flex flex-1 flex-row items-center justify-between gap-3 overflow-hidden">
            <div className="h-full flex-1 space-y-3 overflow-y-auto">
              {data?.variables.map((data, i) => (
                <button
                  key={data.id}
                  className="w-full rounded-lg border border-white bg-white p-4 hover:border-indigo-500"
                >
                  <div className="flex items-center gap-4">
                    <div className="cursor-grab">
                      <span>
                        <Bars3Icon className="h-6 w-6" />
                      </span>
                    </div>
                    <div className="flex items-center justify-center rounded-md bg-gray-100 p-5">
                      {
                        Fields.find((field) => field.value === data.dataType)
                          ?.icon
                      }
                    </div>
                    <div className="flex-1">
                      <h4 className="text-left text-lg font-medium">
                        {data.name}
                      </h4>
                      <div className="flex flex-row flex-wrap items-center justify-start gap-2">
                        <div className="rounded bg-gray-100 px-1 py-0.5 text-sm text-gray-700">
                          {data.dataType}
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            <div className="h-full w-80 space-y-4 overflow-y-auto rounded-lg bg-gray-200 p-4">
              <h2 className="text-xl font-medium">Add Field</h2>
              <div className="flex flex-col items-stretch justify-stretch gap-3">
                {Fields.map((field) => (
                  <button
                    className="flex items-center rounded-md bg-white px-4 py-3"
                    key={field.name}
                    onClick={() => setField(field)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center rounded-md bg-gray-100 p-3">
                        {field.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-left font-medium">{field.name}</h4>
                        <p className="text-sm text-gray-500">
                          {field.description}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      {!!field && <AddField field={field} onClose={() => setField(null)} />}
    </Layout>
  );
}
