import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { cn } from "~/utils";
import { Button } from "./ui/Button";
import Select, { type Option } from "./ui/Select";
import useStore from "./Tree/store";
import { NodeTypeIcon } from "./Tree/NodeTypeIcon";
import { api } from "~/utils/api";
import { Formik } from "formik";
import { useMemo } from "react";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { ZCreateOptionInput } from "~/zodObjs/option";

export default function Options() {
  const { selectedNode, nodes } = useStore(
    ({ selectedNode, d3Tree, nodes }) => ({
      selectedNode,
      d3Tree,
      nodes,
    })
  );

  const { data: options } = api.option.options.useQuery(
    { id: selectedNode?.id ?? "" },
    {
      enabled: !!selectedNode,
    }
  );
  const { mutateAsync: createOption } = api.option.create.useMutation();
  const { mutateAsync: updateOption } = api.option.update.useMutation();
  const { mutateAsync: deleteOption } = api.option.delete.useMutation();

  const nextNodeOptions = useMemo(() => {
    return (
      nodes
        .filter((val) => val.data.parentId === selectedNode?.id)
        .map((val) => ({
          label: val.data.name,
          value: val.id,
          icon: <NodeTypeIcon type={val.data.type} className="h-4 w-4" />,
        })) ?? []
    );
  }, [selectedNode?.id, nodes]);

  const utils = api.useContext();

  return (
    <>
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium leading-10 text-gray-900">
          Options
        </label>
        <Button
          className="shadow-sm"
          variant={"secondary"}
          size={"sm"}
          onClick={() => {
            if (!selectedNode) return;
            if (nextNodeOptions?.length === 0) {
              alert("Please add a node first");
              return;
            }

            void createOption({
              nodeId: selectedNode.id,
              label: "",
              value: "",
            }).then(() => {
              void utils.option.options.invalidate({ id: selectedNode.id });
            });
          }}
        >
          Add Option
        </Button>
      </div>
      {options?.map((option) => (
        <OptionForm
          key={option.id}
          data={option}
          onSubmit={async (data) => {
            await updateOption(data);
          }}
          onDelete={async () => {
            await deleteOption(option.id);
            void utils.option.options.invalidate({ id: selectedNode?.id });
          }}
          nextNodeOptions={nextNodeOptions}
        />
      ))}
    </>
  );
}

const initialValues: {
  id: string;
  label: string;
  value: string;
  nextNodeId: string | null;
  nodeId: string;
} = {
  id: "",
  label: "",
  value: "",
  nextNodeId: "",
  nodeId: "",
};

function OptionForm<T extends typeof initialValues>({
  data,
  onSubmit,
  onDelete,
  nextNodeOptions,
}: {
  data?: T;
  onSubmit: (data: T) => Promise<void>;
  onDelete?: () => Promise<void>;
  nextNodeOptions: Option<string | number>[];
}) {
  const { selectedNode } = useStore(({ selectedNode }) => ({
    selectedNode,
  }));

  return (
    <Formik
      initialValues={
        data ??
        ({
          ...initialValues,
          nodeId: selectedNode?.id ?? "",
        } as T)
      }
      onSubmit={async (values, { setSubmitting }) => {
        console.log(values);
        await onSubmit(values);
        setSubmitting(false);
      }}
      validationSchema={toFormikValidationSchema(ZCreateOptionInput)}
    >
      {({
        handleBlur,
        handleChange,
        values,
        errors,
        touched,
        setFieldValue,
        isSubmitting,
        handleSubmit,
      }) => (
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2 rounded border-2 border-slate-300 bg-slate-200 bg-opacity-80 p-2">
            <div className="flex items-center">
              <div className="w-16 text-sm font-medium text-slate-900">
                Label
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  className="h-9 w-full rounded border-2 border-slate-300 border-opacity-70 p-1 text-sm font-light focus:border-blue-300 focus:outline-none"
                  value={values.label}
                  name="label"
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {
                  <div className="text-sm text-red-500">
                    {errors.label && touched.label && (errors.label as string)}
                  </div>
                }
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-16 text-sm font-medium text-slate-900">
                Value
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  className="h-9 w-full rounded border-2 border-slate-300 border-opacity-70 p-1 text-sm font-light focus:border-blue-300 focus:outline-none"
                  value={values.value}
                  name="value"
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {
                  <div className="text-sm text-red-500">
                    {errors.value && touched.value && (errors.value as string)}
                  </div>
                }
              </div>
            </div>
            <div className="flex items-center ">
              <div className="w-16 text-sm font-medium text-slate-900">
                Jump To
              </div>
              <div className="flex-1">
                <Select
                  options={nextNodeOptions}
                  selected={values.nextNodeId}
                  setSelected={function (val) {
                    setFieldValue("nextNodeId", val);
                  }}
                  selectBtnClass={cn(
                    "rounded text-sm h-9 border-2 border-slate-300 border-opacity-70 w-full"
                  )}
                  rightIcon={
                    <ChevronDownIcon className="h-5 w-5 text-gray-400" />
                  }
                  listboxClass={cn("py-2 text-sm")}
                  showValueIcon={true}
                />
              </div>
            </div>
            <div className="flex gap-2 self-end">
              <Button
                type="button"
                className="shadow-sm"
                variant={"secondary"}
                size={"sm"}
                onClick={onDelete}
              >
                Delete
              </Button>
              <Button
                type="submit"
                className="shadow-sm"
                size={"sm"}
                isloading={isSubmitting}
              >
                Save
              </Button>
            </div>
          </div>
        </form>
      )}
    </Formik>
  );
}
