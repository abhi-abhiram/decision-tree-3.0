import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import ToolbarPlugin from "./plugins/ToolbarPlugin";
import PlaygroundNodes from "./nodes";
import { type EditorThemeClasses } from "lexical";
import { cn } from "~/utils";
import React from "react";
import DraggableBlockPlugin from "./plugins/DraggableBlockPlugin";
import HtmlPlugin from "./plugins/HtmlPlugin";

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

  return (
    <>
      <LexicalComposer initialConfig={initialConfig}>
        <ToolbarPlugin />
        <RichTextPlugin
          contentEditable={
            <div className="relative flex flex-1 flex-col" ref={onRef}>
              <ContentEditable className="flex-1 py-2 px-7 leading-6 focus-visible:outline-none" />
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
        <HtmlPlugin onHtmlChanged={(html) => console.log(html)} />
      </LexicalComposer>
    </>
  );
}
