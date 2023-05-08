import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import ToolbarPlugin from "./plugins/ToolbarPlugin";
import PlaygroundNodes from "./nodes";
import { $getRoot, $insertNodes, type EditorThemeClasses } from "lexical";
import { cn } from "~/utils";
import React from "react";
import DraggableBlockPlugin from "./plugins/DraggableBlockPlugin";
import { HorizontalRulePlugin } from "@lexical/react/LexicalHorizontalRulePlugin";
import ImagesPlugin from "./plugins/ImagesPlugin";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { $generateNodesFromDOM } from "@lexical/html";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import ExportPlugin from "./plugins/ExportPlugin";

function onError(error: Error) {
  console.error(error);
}

const theme: EditorThemeClasses = {
  heading: {
    h1: cn("text-4xl"),
    h2: cn("text-3xl"),
    h3: cn("text-2xl"),
  },
  quote: cn("ml-4 border-l-4 border-gray-300 p-4 text-gray-600"),
  list: {
    listitem: cn("ml-4 list-inside"),
    ol: cn("list-decimal"),
    ul: cn("list-disc"),
  },
  text: {
    bold: cn("font-bold"),
    italic: cn("italic"),
  },
};

const initialConfig = {
  namespace: "MyEditor",
  onError,
  nodes: [...PlaygroundNodes],
  theme,
};

export default function Editor() {
  const [floatingAnchorElem, setFloatingAnchorElem] =
    React.useState<HTMLDivElement | null>(null);

  const onRef = (_floatingAnchorElem: HTMLDivElement) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem);
    }
  };

  const [isInitialized, setIsInitialized] = React.useState(false);

  return (
    <>
      <LexicalComposer
        initialConfig={{
          ...initialConfig,
          editorState() {
            return '<div class="flex flex-col"><div class="flex-1 px-7 py-2 leading-6 focus-visible:outline-none" contenteditable="true"></div></div>';
          },
        }}
      >
        <Intialize
          isInitialized={isInitialized}
          setInitialized={setIsInitialized}
        />
        <ToolbarPlugin />
        <ListPlugin />
        <RichTextPlugin
          contentEditable={
            <div className="relative flex flex-1 flex-col" ref={onRef}>
              <ContentEditable className="flex-1 px-7 py-2 leading-6 focus-visible:outline-none" />
            </div>
          }
          placeholder={null}
          ErrorBoundary={LexicalErrorBoundary}
        />
        <HistoryPlugin />
        {floatingAnchorElem ? (
          <DraggableBlockPlugin anchorElem={floatingAnchorElem} />
        ) : (
          <></>
        )}
        <ExportPlugin />
        <HorizontalRulePlugin />
        <ImagesPlugin />
      </LexicalComposer>
    </>
  );
}

function Intialize({
  setInitialized,
  isInitialized,
}: {
  setInitialized: (initialized: boolean) => void;
  isInitialized: boolean;
}) {
  const router = useRouter();
  const { data: nodeDate } = api.node.get.useQuery(
    {
      id: router.query.id as string,
    },
    {
      enabled: !!router.query.id,
    }
  );
  const [editor] = useLexicalComposerContext();

  React.useEffect(() => {
    const helpText = nodeDate?.helpText;
    if (helpText && !isInitialized) {
      setInitialized(true);
      editor.update(() => {
        const parser = new DOMParser();
        const dom = parser.parseFromString(helpText, "text/html");

        const nodes = $generateNodesFromDOM(editor, dom);

        $getRoot().select();

        console.log(isInitialized);

        $insertNodes(nodes);
      });
    }
  }, [nodeDate]);

  return <></>;
}
