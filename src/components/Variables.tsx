import { Button } from "./ui/Button";
import useStore from "./TreeEditor/store";
import { api } from "~/utils/api";
import Select from "./ui/Select";
import { VarOperator } from "@prisma/client";
import { Input } from "./ui/Input";
import _ from "lodash";
import { useCallback } from "react";
import React from "react";

export default function Variables() {
  const { tree } = useStore(({ selectedNode, d3Tree, nodes, tree }) => ({
    selectedNode,
    d3Tree,
    nodes,
    tree,
  }));

  const variables = api.variable.getAllVariablesByTreeId.useQuery(
    {
      treeId: tree?.id ?? "",
    },
    {
      enabled: !!tree?.id,
    }
  );
  const { mutateAsync: createVariable } = api.variable.create.useMutation();
  const debounce = useCallback(
    _.debounce(async (func: () => Promise<void>) => await func(), 1000),
    []
  );

  const utils = api.useContext();

  return (
    <>
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium leading-10 text-gray-900"></label>
        <Button
          className="shadow-sm"
          variant={"secondary"}
          size={"sm"}
          onClick={() => {
            void createVariable({
              treeId: tree?.id ?? "",
              name: "",
            }).then(() => {
              void utils.variable.getAllVariablesByTreeId.invalidate();
            });
          }}
          isloading={variables.isLoading}
        >
          Add Variable
        </Button>
      </div>

      <div className="mt-2 space-y-2">
        {variables.data?.map((variable) => (
          <div
            key={variable.id}
            className="flex flex-col gap-1 border border-black border-opacity-5 p-1"
          >
            <div>
              <Input
                size={"sm"}
                onChange={(e) => {
                  void debounce(async () => {
                    await utils.client.variable.update.mutate({
                      id: variable.id,
                      name: e.target.value,
                    });
                    await utils.variable.getAllVariablesByTreeId.invalidate();
                  });
                }}
                defaultValue={variable.name}
              />
            </div>
            <Select
              options={[
                {
                  label: "Replace",
                  value: VarOperator.Replace,
                },
                {
                  label: "Append",
                  value: VarOperator.Append,
                },
              ]}
              selected={variable.operator}
              setSelected={(val) => {
                void debounce(async () => {
                  await utils.client.variable.update.mutate({
                    id: variable.id,
                    operator: val,
                  });
                  await utils.variable.getAllVariablesByTreeId.invalidate();
                });
              }}
              dropdownClass="z-10"
              size="sm"
            />
            <div className="mb-4 flex items-center">
              <CheckBox variableId={variable.id} />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export const CheckBox = ({ variableId }: { variableId: string }) => {
  const { selectedNode } = useStore(
    ({ selectedNode, d3Tree, nodes, tree }) => ({
      selectedNode,
      d3Tree,
      nodes,
      tree,
    })
  );

  const debounce = useCallback(
    _.debounce(async (func: () => Promise<void>) => await func(), 1000),
    []
  );
  const utils = api.useContext();
  const [checked, setChecked] = React.useState(false);
  const variable = api.variable.getVariableById.useQuery(
    {
      id: variableId,
    },
    {
      enabled: !!variableId,
    }
  );

  React.useEffect(() => {
    setChecked(
      variable.data?.nodes.some((node) => node.id === selectedNode?.id) ?? false
    );
  }, [variable.data?.nodes, selectedNode?.id]);

  return (
    <input
      id="default-checkbox"
      type="checkbox"
      value={variableId}
      className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
      checked={checked}
      onChange={(e) => {
        if (e.target.checked) {
          void debounce(async () => {
            await utils.client.variable.connectNode.mutate({
              nodeId: selectedNode?.id ?? "",
              variableId,
            });
            await utils.variable.getVariableById.invalidate({
              id: variableId,
            });
          });
        } else {
          void debounce(async () => {
            await utils.client.variable.disconnectNode.mutate({
              nodeId: selectedNode?.id ?? "",
              variableId: variableId,
            });
            await utils.variable.getVariableById.invalidate({
              id: variableId,
            });
          });
        }
        setChecked(e.target.checked);
      }}
    />
  );
};
