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
import download from "js-file-download";

function Tree() {
  const { setTree, setAnswers, nodes, addNode, answers } = useDisplayTreeStore(
    ({ setTree, setAnswers, nodes, addNode, tree, answers }) => ({
      setTree,
      setAnswers,
      nodes,
      addNode,
      tree,
      answers,
    })
  );
  const router = useRouter();
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
  const scrollToBottom = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (scrollToBottom.current) {
      scrollToBottom.current.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [nodes]);

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
    <div className="cneter flex h-screen flex-col items-center">
      <div className="flex w-1/2 flex-1 flex-col gap-1 ">
        {<div className="flex-1" key="end" />}
        {nodes.map((node, index) => (
          <div
            key={node.id}
            className={cn(
              index !== nodes.length - 1 && "pointer-events-none opacity-50"
            )}
          >
            <TreeForm
              onSubmit={(val, { setSubmitting }) => {
                const submit = async () => {
                  if (node._count.children !== 0) {
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
                        val.value = option.value;
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
                  }
                  const newAns = {
                    nodeId: node.id,
                    answer: val.value,
                    nodeName: node.name,
                    question: node.question,
                  };

                  setAnswers(newAns);

                  if (node._count.children === 0) {
                    download(
                      JSON.stringify([...answers, newAns], null, 2),
                      "answers.json",
                      "text/plain"
                    );
                  }

                  setSubmitting(false);
                };
                void submit();
              }}
              node={node}
              isDisabled={index !== nodes.length - 1}
              isLast={node._count.children === 0}
            />
          </div>
        ))}
        <div style={{ float: "left", clear: "both" }} ref={scrollToBottom} />
        {nodes.length > 0 && <div className="h-72" key="end" />}
      </div>
    </div>
  );
}

export default Tree;
