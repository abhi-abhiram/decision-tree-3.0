import { useRouter } from "next/router";
import React from "react";
import TreeForm from "~/components/DisplayTree/FormComponents";
import {
  type DisplayTreeStore,
  useDisplayTreeStore,
} from "~/components/DisplayTree/store";
import Loader from "~/components/ui/Loader";
import { cn } from "~/utils";
import { api } from "~/utils/api";

function Tree() {
  const { setTree, setAnswers, nodes, addNode } = useDisplayTreeStore(
    ({ setTree, setAnswers, nodes, addNode }) => ({
      setTree,
      setAnswers,
      nodes,
      addNode,
    })
  );
  const router = useRouter();
  const [newNodeFetching, setNewNodeFetching] = React.useState(false);
  const { data: tree, isLoading } = api.tree.onlyTree.useQuery(
    { id: router.query.id as string },
    {
      enabled: !!router.query.id,
      onSuccess: (data) => {
        if (!data) {
          alert("This tree does not exist");
          void router.push("/");
          return;
        }
        setTree(data);
      },
    }
  );
  const utils = api.useContext();

  if (isLoading)
    return (
      <div className="absolute inset-0 z-10 flex h-full w-full items-center justify-center bg-slate-200 bg-opacity-50">
        <Loader className="h-8 w-8" />
      </div>
    );

  if (!tree) {
    return null;
  }

  return (
    <div className="cneter flex h-full flex-col items-center">
      <div className="mt-8 w-1/2">
        {nodes.map((node, index) => (
          <div
            key={node.id}
            className={cn(index !== nodes.length - 1 && "opacity-50")}
          >
            <TreeForm
              onSubmit={(val, { setSubmitting }) => {
                const submit = async () => {
                  setNewNodeFetching(true);
                  let newNode: DisplayTreeStore["nodes"][number] | null;
                  if (node.type === "MultipleChoice") {
                    const option = node.options.find(
                      (option) => option.id === val.value
                    );
                    if (!option) {
                      alert("Invalid option");
                      return;
                    }
                    if (option.nextNodeId) {
                      newNode = await utils.node.get.fetch({
                        id: option.nextNodeId,
                      });
                    } else {
                      newNode = null;
                    }
                  } else {
                    newNode = await utils.node.getSingleChild.fetch({
                      id: node.id,
                    });
                  }
                  if (newNode) {
                    addNode(newNode);
                  }
                  setAnswers({
                    nodeId: node.id,
                    answer: val.value,
                    nodeName: node.name,
                    question: node.question,
                  });
                  setNewNodeFetching(false);
                  setSubmitting(false);
                };
                void submit();
              }}
              node={node}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Tree;
