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
import { ChevronUpIcon } from "@heroicons/react/24/outline";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { useTransition, animated, easings } from "@react-spring/web";

function Tree() {
  const {
    nodes,
    addNode,
    answers,
    currentNodeIndex,
    addAnswer,
    setCurrentNodeIndex,
    setNodes,
    setAnimationReverse,
    animationReverse,
    variables,
    setVariable,
  } = useDisplayTreeStore(
    ({
      nodes,
      addNode,
      answers,
      currentNodeIndex,
      addAnswer,
      setCurrentNodeIndex,
      setNodes,
      setAnimationReverse,
      animationReverse,
      variables,
      setVariable,
    }) => ({
      nodes,
      addNode,
      answers,
      currentNodeIndex,
      addAnswer,
      setCurrentNodeIndex,
      setNodes,
      setAnimationReverse,
      animationReverse,
      variables,
      setVariable,
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
  const currentNode = nodes[currentNodeIndex];

  const transitions = useTransition(
    { currentNode, animationReverse },
    {
      key: currentNode?.id,
      from() {
        return !animationReverse
          ? {
              opacity: 0,
              transform: "translate3d(0,60%,0)",
            }
          : {
              opacity: 0,
              transform: "translate3d(0,-60%,0)",
            };
      },
      enter: { opacity: 1, transform: "translate3d(0,0%,0)" },
      leave() {
        return !animationReverse
          ? {
              opacity: 0,
              transform: "translate3d(0,-60%,0)",
            }
          : {
              opacity: 0,
              transform: "translate3d(0,60%,0)",
            };
      },
      config: {
        duration: 500,
        easing: easings.easeInOutQuart,
      },
      exitBeforeEnter: true,
    }
  );

  if (isLoading)
    return (
      <div className="absolute inset-0 z-10 flex h-full w-full items-center justify-center bg-slate-200 bg-opacity-50">
        <Loader className="h-8 w-8" />
      </div>
    );

  if (!rootNode) return null;

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
          <div className="relative flex h-3/4 w-3/4 items-center justify-center rounded border border-gray-200 shadow-md">
            <div className="flex h-5/6 w-5/6 items-center ">
              {transitions((style, { currentNode }) => (
                <animated.div
                  key={currentNode?.id}
                  className="h-full w-full overflow-y-auto"
                  style={style}
                >
                  {currentNode && (
                    <TreeForm
                      key={currentNode.id}
                      onSubmit={(val, { setSubmitting }) => {
                        const submit = async () => {
                          let multipleChoiceOption: string | undefined =
                            undefined;
                          if (
                            currentNode._count.children !== 0 ||
                            currentNode._count.bridgeNodes !== 0
                          ) {
                            let newNode:
                              | DisplayTreeStore["nodes"][number]
                              | null = null;
                            const prevAns = answers.get(currentNode.id)?.answer;
                            if (
                              currentNode.type === "MultipleChoice" &&
                              prevAns !== val.value
                            ) {
                              multipleChoiceOption = val.value;
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
                              }

                              if (
                                newNode &&
                                currentNodeIndex !== nodes.length - 1
                              ) {
                                setNodes(
                                  nodes
                                    .slice(0, currentNodeIndex + 1)
                                    .concat(newNode)
                                );
                                newNode = null;
                              }
                            } else if (currentNodeIndex === nodes.length - 1) {
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

                          addAnswer({
                            ...newAns,
                            multipleChoiceOption,
                          });

                          currentNode.vars.forEach((variable) => {
                            setVariable(variable, val.value);
                          });
                          if (
                            currentNode._count.children === 0 &&
                            currentNode._count.bridgeNodes === 0
                          ) {
                            const ans = new Map(answers);
                            nodes.forEach((node) => {
                              if (!ans.has(node.id)) ans.delete(node.id);
                            });
                            download(
                              JSON.stringify(
                                {
                                  variables: [...variables],
                                  answers: [...ans, newAns],
                                },
                                null,
                                2
                              ),
                              "answers.json",
                              "text/plain"
                            );
                          }
                        };
                        void submit().then(() => {
                          setAnimationReverse(false);
                          setCurrentNodeIndex(currentNodeIndex + 1);
                          setSubmitting(false);
                        });
                      }}
                      node={currentNode}
                    />
                  )}
                </animated.div>
              ))}
            </div>
            <div className="absolute bottom-2 right-2 flex items-center text-white">
              <button
                onClick={() => {
                  setAnimationReverse(true);
                  setCurrentNodeIndex(currentNodeIndex - 1);
                }}
                className="flex items-center justify-center rounded-l border-r border-blue-500 bg-blue-600 p-1 hover:bg-blue-500 disabled:opacity-50"
                disabled={currentNodeIndex === 0}
              >
                <ChevronUpIcon className="h-6 w-6" />
              </button>
              <button
                onClick={() => {
                  setAnimationReverse(false);
                  setCurrentNodeIndex(currentNodeIndex + 1);
                }}
                className="flex items-center justify-center rounded-r bg-blue-600 p-1 hover:bg-blue-500 disabled:opacity-50"
                disabled={currentNodeIndex === nodes.length - 1}
              >
                <ChevronDownIcon className="h-6 w-6" />
              </button>
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
