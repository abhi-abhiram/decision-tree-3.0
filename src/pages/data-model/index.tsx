import Layout from "~/components/ui/Layout";
import Sidebar from "~/components/data-model/Sidebar";
import { api } from "~/utils/api";
import FlowView from "~/components/data-model/Flow";
import { parseNodes } from "~/utils/parseNodes";
import "reactflow/dist/style.css";
import { ReactFlow, applyNodeChanges } from "reactflow";

export default function Models() {
  const models = api.model.modelsWithVariables.useQuery();
  return (
    <Layout>
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <div className="flex-1">
          <div className="h-full flex-1">
            {<FlowView data={parseNodes(models.data ?? [])} />}
          </div>
        </div>
      </div>
    </Layout>
  );
}
