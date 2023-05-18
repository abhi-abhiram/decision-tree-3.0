import { useRouter } from "next/router";
import React from "react";
import TreeForm from "~/components/DisplayTree/FormComponents";
import {
  type DisplayTreeStore,
  useDisplayTreeStore,
} from "~/components/DisplayTree/displayTreeStore";
import Loader from "~/components/ui/Loader";
import { api } from "~/utils/api";
import download from "js-file-download";
import Drawer from "~/components/ui/Drawer";
import { Button } from "~/ui/Button";

function Tree() {
  const {
    nodes,
    addNode,
    answers,
    currentNodeIndex,
    addAnswer,
    setCurrentNodeIndex,
  } = useDisplayTreeStore(
    ({
      nodes,
      addNode,
      answers,
      currentNodeIndex,
      addAnswer,
      setCurrentNodeIndex,
    }) => ({
      nodes,
      addNode,
      answers,
      currentNodeIndex,
      addAnswer,
      setCurrentNodeIndex,
    })
  );
  const router = useRouter();
  const { data: rootNode, isLoading } = api.tree.getRootNode.useQuery(
    {
      id: router.query.id as string,
    },
    {
      enabled: !!router.query.id,
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        if (nodes.length === 0) addNode(data);
      },
    }
  );
  const utils = api.useContext();
  const [isHelpPanelOpen, setIsHelpPanelOpen] = React.useState(false);

  if (isLoading)
    return (
      <div className="absolute inset-0 z-10 flex h-full w-full items-center justify-center bg-slate-200 bg-opacity-50">
        <Loader className="h-8 w-8" />
      </div>
    );

  if (!rootNode) return null;

  const currentNode = nodes[currentNodeIndex];

  return (
    <>
      <div className="cneter flex h-screen flex-col items-center">
        <div className="relative w-full">
          <Button
            variant="secondary"
            onClick={() => {
              setIsHelpPanelOpen(true);
            }}
            className="absolute right-2 top-2"
          >
            Help
          </Button>
        </div>
        <div className="flex h-full w-full flex-1 items-center justify-center">
          <div className="flex h-3/4 w-3/4 items-center justify-center border border-gray-200 shadow-md">
            <div className="flex h-5/6 w-5/6 items-center overflow-auto rounded ">
              <div className="flex max-h-full w-full flex-col gap-3">
                {currentNode && (
                  <TreeForm
                    key={currentNode.id}
                    onSubmit={(val, { setSubmitting }) => {
                      const submit = async () => {
                        if (currentNode._count.children !== 0) {
                          let newNode: DisplayTreeStore["nodes"][number] | null;
                          if (currentNode.type === "MultipleChoice") {
                            const option = currentNode.options.find(
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
                              id: currentNode.id,
                            });
                          }
                          if (newNode) {
                            addNode(newNode);
                          }
                        }
                        const newAns = {
                          nodeId: currentNode.id,
                          answer: val.value,
                          nodeName: currentNode.name,
                          question: currentNode.question,
                        };
                        addAnswer(newAns);

                        if (currentNode._count.children === 0) {
                          download(
                            JSON.stringify([...answers, newAns], null, 2),
                            "answers.json",
                            "text/plain"
                          );
                        }
                        setCurrentNodeIndex(currentNodeIndex + 1);
                        setSubmitting(false);
                      };
                      void submit();
                    }}
                    node={currentNode}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Drawer
        isShowing={isHelpPanelOpen}
        setIsShowing={setIsHelpPanelOpen}
        title={"Help"}
      >
        <div
          className="content"
          dangerouslySetInnerHTML={{
            __html: nodes[nodes.length - 1]?.helpText ?? "",
          }}
        ></div>
      </Drawer>
    </>
  );
}

export default Tree;
