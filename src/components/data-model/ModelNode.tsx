import { type RelationType } from "@prisma/client";
import cc from "classcat";
import React from "react";
import { Handle, Position } from "reactflow";
import styles from "./Node.module.scss";
import { cn } from "~/utils";

export interface ModelNodeData {
  type: "model";
  name: string;
  id: string;
  variables: {
    id: string;
    name: string;
    dataType: string;
    isForeignKey: boolean;
    relationType: RelationType | null;
    sourceId: string | null;
    targetId: string | null;
  }[];
  primaryKeyId: string;
}

type ColumnData = ModelNodeData["variables"][number];

const isSource = ({ sourceId }: ColumnData, modelId: string) =>
  sourceId === modelId;

const ModelNode = ({ data }: ModelNodeProps) => {
  return (
    <table
      className="border-separate rounded-lg border-2 border-black bg-white font-sans"
      style={{ minWidth: 200, maxWidth: 500, borderSpacing: 0 }}
    >
      <thead>
        <tr>
          <th
            className="rounded-t-md border-b-2 border-black bg-gray-200 p-2 font-extrabold"
            colSpan={4}
          >
            {data.name}
          </th>
        </tr>
      </thead>
      <tbody>
        {data.variables.map((col) => (
          <tr key={col.id} className={styles.row}>
            <td className="border-r-2 border-t-2 border-gray-300 font-mono font-semibold">
              <button
                type="button"
                className={cc([
                  "relative",
                  "p-2",
                  {
                    "cursor-pointer":
                      col.id === data.primaryKeyId || isSource(col, data.id),
                  },
                ])}
              >
                {col.name}
                {col.id === data.primaryKeyId && (
                  <Handle
                    key={`${data.name}-${col.name}`}
                    className={cc([styles.handle, styles.left])}
                    type="target"
                    id={col.id}
                    position={Position.Left}
                    isConnectable={false}
                  />
                )}
              </button>
            </td>
            <td className="border-r-2 border-t-2 border-gray-300 p-2 font-mono">
              {col.dataType}
            </td>
            <td className="border-t-2 border-gray-300 font-mono">
              <div className="relative p-2">
                {isSource(col, data.id) && (
                  <Handle
                    key={`${data.name}-${col.name}`}
                    className={cn([styles.handle, styles.right])}
                    type="source"
                    id={col.id}
                    position={Position.Right}
                    isConnectable={false}
                  />
                )}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export interface ModelNodeProps {
  data: ModelNodeData;
}

export default ModelNode;
