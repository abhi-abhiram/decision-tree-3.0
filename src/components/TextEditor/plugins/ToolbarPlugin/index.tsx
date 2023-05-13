import {
  type ElementFormatType,
  type LexicalEditor,
  type NodeKey,
} from "lexical";

import {
  $createCodeNode,
  $isCodeNode,
  CODE_LANGUAGE_FRIENDLY_NAME_MAP,
  CODE_LANGUAGE_MAP,
  getLanguageFriendlyName,
} from "@lexical/code";
import { $isLinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link";
import {
  $isListNode,
  INSERT_CHECK_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  ListNode,
  REMOVE_LIST_COMMAND,
} from "@lexical/list";
import { INSERT_EMBED_COMMAND } from "@lexical/react/LexicalAutoEmbedPlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $isDecoratorBlockNode } from "@lexical/react/LexicalDecoratorBlockNode";
import { INSERT_HORIZONTAL_RULE_COMMAND } from "@lexical/react/LexicalHorizontalRuleNode";
import {
  $createHeadingNode,
  $createQuoteNode,
  $isHeadingNode,
  type HeadingTagType,
} from "@lexical/rich-text";
import {
  $getSelectionStyleValueForProperty,
  $isParentElementRTL,
  $patchStyleText,
  $selectAll,
  $setBlocksType,
} from "@lexical/selection";
import { $isTableNode } from "@lexical/table";
import {
  $findMatchingParent,
  $getNearestBlockElementAncestorOrThrow,
  $getNearestNodeOfType,
  mergeRegister,
} from "@lexical/utils";
import {
  $createParagraphNode,
  $getNodeByKey,
  $getRoot,
  $getSelection,
  $isRangeSelection,
  $isRootOrShadowRoot,
  $isTextNode,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
  DEPRECATED_$isGridSelection,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  INDENT_CONTENT_COMMAND,
  OUTDENT_CONTENT_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
} from "lexical";
import { useCallback, useEffect, useState } from "react";
import * as React from "react";
import { IS_APPLE } from "~/shared/environment";

import useModal from "~/hooks/useModal";
import catTypingGif from "../../images/cat-typing.gif";
// import ColorPicker from "../../ui/ColorPicker";
import { Dropdown, MenuItem, MenuGroup } from "~/components/ui/Dropdown";
import { getSelectedNode } from "~/utils/getSelectedNode";
import { sanitizeUrl } from "~/utils/url";
import { Button } from "~/components/ui/Button";
import {
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
  Bars3BottomLeftIcon,
  Bars3CenterLeftIcon,
  CodeBracketIcon,
  ListBulletIcon,
  MinusIcon,
  PhotoIcon,
  PlayIcon,
  PlusIcon,
  TableCellsIcon,
} from "@heroicons/react/20/solid";
import { cn } from "~/utils";
import Select from "~/components/ui/Select";
import { InsertImageDialog } from "../ImagesPlugin";
// import { EmbedConfigs } from "../AutoEmbedPlugin";
// import { INSERT_COLLAPSIBLE_COMMAND } from "../CollapsiblePlugin";
// import { InsertEquationDialog } from "../EquationsPlugin";
// import { INSERT_EXCALIDRAW_COMMAND } from "../ExcalidrawPlugin";
// import {
//   INSERT_IMAGE_COMMAND,
//   InsertImageDialog,
//   InsertImagePayload,
// } from "../ImagesPlugin";
// import { InsertPollDialog } from "../PollPlugin";
// import { InsertNewTableDialog, InsertTableDialog } from "../TablePlugin";

const AlignTypes: {
  value: ElementFormatType | "indent" | "outdent";
  label: string;
  icon?: React.ReactNode;
}[] = [
  {
    value: "left",
    label: "Left Align",
    icon: (
      <i
        className="h-4 w-4 text-gray-500"
        style={{
          backgroundImage: "url(/assets/text-left.svg)",
        }}
      />
    ),
  },
  {
    value: "center",
    label: "Center Align",
    icon: (
      <i
        className="h-4 w-4 text-gray-500"
        style={{
          backgroundImage: "url(/assets/text-center.svg)",
        }}
      />
    ),
  },
  {
    value: "right",
    label: "Right Align",
    icon: (
      <i
        className="h-4 w-4 text-gray-500"
        style={{
          backgroundImage: "url(/assets/text-right.svg)",
        }}
      />
    ),
  },
  {
    value: "justify",
    label: "Justify",
    icon: (
      <i
        className="h-4 w-4 text-gray-500"
        style={{
          backgroundImage: "url(/assets/justify.svg)",
        }}
      />
    ),
  },
  {
    value: "indent",
    label: "Indent",
    icon: (
      <i
        className="h-4 w-4 text-gray-500"
        style={{
          backgroundImage: "url(/assets/indent.svg)",
        }}
      />
    ),
  },
  {
    value: "outdent",
    label: "Outdent",
    icon: (
      <i
        className="h-4 w-4 text-gray-500"
        style={{
          backgroundImage: "url(/assets/outdent.svg)",
        }}
      />
    ),
  },
];

const InsertTypes: {
  value: "image" | "horizontalRule" | "table" | "collapsible";
  label: string;
  icon?: React.ReactNode;
}[] = [
  {
    value: "image",
    label: "Image",
    icon: <PhotoIcon className="h-4 w-4 text-gray-500" />,
  },
  {
    value: "horizontalRule",
    label: "Horizontal Rule",
    icon: <MinusIcon className="h-4 w-4 text-gray-500" />,
  },
];

const blockTypeToBlockName = {
  bullet: "Bulleted List",
  check: "Check List",
  code: "Code Block",
  h1: "Heading 1",
  h2: "Heading 2",
  h3: "Heading 3",
  h4: "Heading 4",
  h5: "Heading 5",
  h6: "Heading 6",
  number: "Numbered List",
  paragraph: "Normal",
  quote: "Quote",
};

const rootTypeToRootName = {
  root: "Root",
  table: "Table",
};

function getCodeLanguageOptions(): [string, string][] {
  const options: [string, string][] = [];

  for (const [lang, friendlyName] of Object.entries(
    CODE_LANGUAGE_FRIENDLY_NAME_MAP
  )) {
    options.push([lang, friendlyName]);
  }

  return options;
}

const CODE_LANGUAGE_OPTIONS = getCodeLanguageOptions();

const FONT_FAMILY_OPTIONS: [string, string][] = [
  ["Arial", "Arial"],
  ["Courier New", "Courier New"],
  ["Georgia", "Georgia"],
  ["Times New Roman", "Times New Roman"],
  ["Trebuchet MS", "Trebuchet MS"],
  ["Verdana", "Verdana"],
];

const FONT_SIZE_OPTIONS: [string, string][] = [
  ["10px", "10px"],
  ["11px", "11px"],
  ["12px", "12px"],
  ["13px", "13px"],
  ["14px", "14px"],
  ["15px", "15px"],
  ["16px", "16px"],
  ["17px", "17px"],
  ["18px", "18px"],
  ["19px", "19px"],
  ["20px", "20px"],
];

function BlockFormatDropDown({
  editor,
  blockType,
  disabled = false,
}: {
  blockType: keyof typeof blockTypeToBlockName;
  rootType: keyof typeof rootTypeToRootName;
  editor: LexicalEditor;
  disabled?: boolean;
}): JSX.Element {
  const formatParagraph = () => {
    editor.update(() => {
      const selection = $getSelection();
      if (
        $isRangeSelection(selection) ||
        DEPRECATED_$isGridSelection(selection)
      ) {
        $setBlocksType(selection, () => $createParagraphNode());
      }
    });
  };

  const formatHeading = (headingSize: HeadingTagType) => {
    if (blockType !== headingSize) {
      editor.update(() => {
        const selection = $getSelection();
        if (
          $isRangeSelection(selection) ||
          DEPRECATED_$isGridSelection(selection)
        ) {
          $setBlocksType(selection, () => $createHeadingNode(headingSize));
        }
      });
    }
  };

  const formatBulletList = () => {
    if (blockType !== "bullet") {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }
  };

  const formatCheckList = () => {
    if (blockType !== "check") {
      editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }
  };

  const formatNumberedList = () => {
    if (blockType !== "number") {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }
  };

  const formatQuote = () => {
    if (blockType !== "quote") {
      editor.update(() => {
        const selection = $getSelection();
        if (
          $isRangeSelection(selection) ||
          DEPRECATED_$isGridSelection(selection)
        ) {
          $setBlocksType(selection, () => $createQuoteNode());
        }
      });
    }
  };

  const formatCode = () => {
    if (blockType !== "code") {
      editor.update(() => {
        let selection = $getSelection();

        if (
          $isRangeSelection(selection) ||
          DEPRECATED_$isGridSelection(selection)
        ) {
          if (selection.isCollapsed()) {
            $setBlocksType(selection, () => $createCodeNode());
          } else {
            const textContent = selection.getTextContent();
            const codeNode = $createCodeNode();
            selection.insertNodes([codeNode]);
            selection = $getSelection();
            if ($isRangeSelection(selection))
              selection.insertRawText(textContent);
          }
        }
      });
    }
  };

  return (
    <div className="w-fit">
      <Select
        disabled={disabled}
        options={[
          {
            value: "paragraph",
            label: "Normal",
            icon: (
              <Bars3BottomLeftIcon className="text- h-5 w-5 text-gray-400" />
            ),
          },
          {
            value: "h1",
            label: "Heading 1",
            icon: (
              <span className="text-base font-semibold text-gray-400">H1</span>
            ),
          },
          {
            value: "h2",
            label: "Heading 2",
            icon: (
              <span className="text-base font-semibold text-gray-400">H2</span>
            ),
          },
          {
            value: "h3",
            label: "Heading 3",
            icon: (
              <span className="text-base font-semibold text-gray-400">H3</span>
            ),
          },
          {
            value: "bullet",
            label: "Bullet List",
            icon: <ListBulletIcon className="text- h-5 w-5 text-gray-400" />,
          },
          {
            value: "number",
            label: "Numbered List",
            icon: <ListBulletIcon className="text- h-5 w-5 text-gray-400" />,
          },
          {
            value: "check",
            label: "Check List",
            icon: <ListBulletIcon className="text- h-5 w-5 text-gray-400" />,
          },
          {
            value: "quote",
            label: "Quote",
            icon: (
              <div className="h-5 w-5 text-center">
                <span className="text-center text-base font-semibold text-gray-400">{`"`}</span>
              </div>
            ),
          },
          {
            value: "code",
            label: "Code",
            icon: <CodeBracketIcon className="text- h-5 w-5 text-gray-400" />,
          },
        ]}
        selected={blockType}
        setSelected={(value) => {
          switch (value) {
            case "paragraph":
              formatParagraph();
              break;
            case "h1":
              formatHeading("h1");
              break;
            case "h2":
              formatHeading("h2");
              break;
            case "h3":
              formatHeading("h3");
              break;
            case "bullet":
              formatBulletList();
              break;
            case "number":
              formatNumberedList();
              break;
            case "check":
              formatCheckList();
              break;
            case "quote":
              formatQuote();
              break;
            case "code":
              formatCode();
              break;
          }
        }}
        showValueIcon
        dropdownClass={cn("w-fit max-h-fit p-2")}
        listboxClass={cn("py-2 rounded-md cursor-pointer")}
        selectBtnClass={cn("border-none shadow-none hover:bg-gray-200")}
      />
    </div>
  );
}

function Divider(): JSX.Element {
  return <div className="w-px bg-gray-200" />;
}

function FontDropDown({
  editor,
  value,
  style,
  disabled = false,
}: {
  editor: LexicalEditor;
  value: string;
  style: string;
  disabled?: boolean;
}): JSX.Element {
  const handleClick = useCallback(
    (option: string) => {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $patchStyleText(selection, {
            [style]: option,
          });
        }
      });
    },
    [editor, style]
  );

  const buttonAriaLabel =
    style === "font-family"
      ? "Formatting options for font family"
      : "Formatting options for font size";

  return (
    <Select
      disabled={disabled}
      options={(style === "font-family"
        ? FONT_FAMILY_OPTIONS
        : FONT_SIZE_OPTIONS
      ).map(([option, text]) => ({
        value: option,
        label: text,
      }))}
      selected={value}
      setSelected={handleClick}
      dropdownClass={cn("w-fit max-h-fit p-1")}
      listboxClass={cn("py-2 rounded-md cursor-pointer")}
      selectBtnClass={cn("border-none shadow-none hover:bg-gray-200")}
      leftIcon={
        style === "font-family" && (
          <span className="text-base text-gray-400">T</span>
        )
      }
    />
  );
}

export default function ToolbarPlugin(): JSX.Element {
  const [editor] = useLexicalComposerContext();
  const [activeEditor, setActiveEditor] = useState(editor);
  const [blockType, setBlockType] =
    useState<keyof typeof blockTypeToBlockName>("paragraph");
  const [rootType, setRootType] =
    useState<keyof typeof rootTypeToRootName>("root");
  const [selectedElementKey, setSelectedElementKey] = useState<NodeKey | null>(
    null
  );
  const [fontSize, setFontSize] = useState<string>("15px");
  const [fontColor, setFontColor] = useState<string>("#000");
  const [bgColor, setBgColor] = useState<string>("#fff");
  const [fontFamily, setFontFamily] = useState<string>("Arial");
  const [isLink, setIsLink] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isSubscript, setIsSubscript] = useState(false);
  const [isSuperscript, setIsSuperscript] = useState(false);
  const [isCode, setIsCode] = useState(false);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [modal, showModal] = useModal();
  const [isRTL, setIsRTL] = useState(false);
  const [codeLanguage, setCodeLanguage] = useState<string>("");
  const [isEditable, setIsEditable] = useState(() => editor.isEditable());

  const $updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const anchorNode = selection.anchor.getNode();
      let element =
        anchorNode.getKey() === "root"
          ? anchorNode
          : $findMatchingParent(anchorNode, (e) => {
              const parent = e.getParent();
              return parent !== null && $isRootOrShadowRoot(parent);
            });

      if (element === null) {
        element = anchorNode.getTopLevelElementOrThrow();
      }

      const elementKey = element.getKey();
      const elementDOM = activeEditor.getElementByKey(elementKey);

      // Update text format
      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsUnderline(selection.hasFormat("underline"));
      setIsStrikethrough(selection.hasFormat("strikethrough"));
      setIsSubscript(selection.hasFormat("subscript"));
      setIsSuperscript(selection.hasFormat("superscript"));
      setIsCode(selection.hasFormat("code"));
      setIsRTL($isParentElementRTL(selection));

      // Update links
      const node = getSelectedNode(selection);
      const parent = node.getParent();
      if ($isLinkNode(parent) || $isLinkNode(node)) {
        setIsLink(true);
      } else {
        setIsLink(false);
      }

      const tableNode = $findMatchingParent(node, $isTableNode);
      if ($isTableNode(tableNode)) {
        setRootType("table");
      } else {
        setRootType("root");
      }

      if (elementDOM !== null) {
        setSelectedElementKey(elementKey);
        if ($isListNode(element)) {
          const parentList = $getNearestNodeOfType<ListNode>(
            anchorNode,
            ListNode
          );
          const type = parentList
            ? parentList.getListType()
            : element.getListType();
          setBlockType(type);
        } else {
          const type = $isHeadingNode(element)
            ? element.getTag()
            : element.getType();
          if (type in blockTypeToBlockName) {
            setBlockType(type as keyof typeof blockTypeToBlockName);
          }
          if ($isCodeNode(element)) {
            const language =
              element.getLanguage() as keyof typeof CODE_LANGUAGE_MAP;
            setCodeLanguage(
              language ? CODE_LANGUAGE_MAP[language] || language : ""
            );
            return;
          }
        }
      }
      // Handle buttons
      setFontSize(
        $getSelectionStyleValueForProperty(selection, "font-size", "15px")
      );
      setFontColor(
        $getSelectionStyleValueForProperty(selection, "color", "#000")
      );
      setBgColor(
        $getSelectionStyleValueForProperty(
          selection,
          "background-color",
          "#fff"
        )
      );
      setFontFamily(
        $getSelectionStyleValueForProperty(selection, "font-family", "Arial")
      );
    }
  }, [activeEditor]);

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      (_payload, newEditor) => {
        $updateToolbar();
        setActiveEditor(newEditor);
        return false;
      },
      COMMAND_PRIORITY_CRITICAL
    );
  }, [editor, $updateToolbar]);

  useEffect(() => {
    return mergeRegister(
      editor.registerEditableListener((editable) => {
        setIsEditable(editable);
      }),
      activeEditor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          $updateToolbar();
        });
      }),
      activeEditor.registerCommand<boolean>(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        COMMAND_PRIORITY_CRITICAL
      ),
      activeEditor.registerCommand<boolean>(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        COMMAND_PRIORITY_CRITICAL
      )
    );
  }, [$updateToolbar, activeEditor, editor]);

  //   const insertGifOnClick = (payload: InsertImagePayload) => {
  //     activeEditor.dispatchCommand(INSERT_IMAGE_COMMAND, payload);
  //   };

  return (
    <div className="relative z-10 flex space-x-1 border-b border-gray-200 p-1 ">
      <div className="flex flex-row items-center space-x-1">
        <button
          disabled={!canUndo || !isEditable}
          onClick={() => {
            activeEditor.dispatchCommand(UNDO_COMMAND, undefined);
          }}
          title={IS_APPLE ? "Undo (⌘Z)" : "Undo (Ctrl+Z)"}
          type="button"
          className={cn("rounded-md p-2 hover:bg-gray-200", {
            "bg-transparent text-gray-400 hover:bg-transparent":
              !canUndo || !isEditable,
          })}
          aria-label="Undo"
        >
          <ArrowUturnLeftIcon className="h-5 w-5" />
        </button>
        <button
          disabled={!canRedo || !isEditable}
          onClick={() => {
            activeEditor.dispatchCommand(REDO_COMMAND, undefined);
          }}
          title={IS_APPLE ? "Redo (⌘Y)" : "Redo (Ctrl+Y)"}
          type="button"
          className={cn("rounded-md p-2 hover:bg-gray-200", {
            "bg-transparent text-gray-400 hover:bg-transparent":
              !canRedo || !isEditable,
          })}
          aria-label="Redo"
        >
          <ArrowUturnRightIcon className="h-5 w-5" />
        </button>
      </div>
      <Divider />
      {blockType in blockTypeToBlockName && activeEditor === editor && (
        <>
          <BlockFormatDropDown
            disabled={!isEditable}
            blockType={blockType}
            rootType={rootType}
            editor={editor}
          />
          <Divider />
        </>
      )}
      {blockType === "code" ? (
        <></>
      ) : (
        <>
          <FontDropDown
            disabled={!isEditable}
            style={"font-family"}
            value={fontFamily}
            editor={editor}
          />
          <FontDropDown
            disabled={!isEditable}
            style={"font-size"}
            value={fontSize}
            editor={editor}
          />
          <Divider />
          <button
            disabled={!isEditable}
            onClick={() => {
              activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
            }}
            className={cn(
              "h-9 w-9 rounded-lg  text-center font-bold text-gray-400 transition-colors duration-200 ease-in-out hover:bg-gray-200 hover:text-gray-800",
              isBold ? "bg-gray-200 text-gray-800" : "bg-transparent"
            )}
            title={IS_APPLE ? "Bold (⌘B)" : "Bold (Ctrl+B)"}
            type="button"
            aria-label={`Format text as bold. Shortcut: ${
              IS_APPLE ? "⌘B" : "Ctrl+B"
            }`}
          >
            B
          </button>
          <button
            disabled={!isEditable}
            onClick={() => {
              activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
            }}
            className={cn(
              "h-9 w-9 rounded-lg  text-center italic text-gray-400 transition-colors duration-200 ease-in-out hover:bg-gray-200 hover:text-gray-800",
              isItalic ? "bg-gray-200 text-gray-800" : "bg-transparent"
            )}
            title={IS_APPLE ? "Italic (⌘I)" : "Italic (Ctrl+I)"}
            type="button"
            aria-label={`Format text as italics. Shortcut: ${
              IS_APPLE ? "⌘I" : "Ctrl+I"
            }`}
          >
            I
          </button>
          <button
            disabled={!isEditable}
            onClick={() => {
              activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
            }}
            className={cn(
              "h-9 w-9  rounded-lg text-center text-gray-400 underline transition-colors duration-200 ease-in-out hover:bg-gray-200 hover:text-gray-800",
              isUnderline ? "bg-gray-200 text-gray-800" : "bg-transparent"
            )}
            title={IS_APPLE ? "Underline (⌘U)" : "Underline (Ctrl+U)"}
            type="button"
            aria-label={`Format text to underlined. Shortcut: ${
              IS_APPLE ? "⌘U" : "Ctrl+U"
            }`}
          >
            U
          </button>
          <Divider />
          {rootType === "table" && (
            <>
              <Divider />
            </>
          )}
          <Select
            disabled={!isEditable}
            options={InsertTypes}
            dropdownClass={cn("w-fit max-h-fit p-1")}
            listboxClass={cn("py-2 rounded-md cursor-pointer")}
            selectBtnClass={cn("border-none shadow-none hover:bg-gray-200")}
            selected={""}
            leftIcon={
              <PlusIcon className="h-5 w-5 text-gray-800" aria-hidden="true" />
            }
            placeholder="Insert"
            setSelected={(value) => {
              if (value === "image") {
                showModal("Insert Image", (onClose) => (
                  <InsertImageDialog
                    activeEditor={activeEditor}
                    onClose={onClose}
                  />
                ));
              } else if (value === "horizontalRule") {
                activeEditor.dispatchCommand(
                  INSERT_HORIZONTAL_RULE_COMMAND,
                  undefined
                );
              }
            }}
          />
        </>
      )}
      <Divider />
      <Select
        disabled={!isEditable}
        options={AlignTypes}
        selected={""}
        placeholder="Align"
        setSelected={(value) => {
          if (value === "outdent") {
            activeEditor.dispatchCommand(OUTDENT_CONTENT_COMMAND, undefined);
            return;
          }
          if (value === "indent") {
            activeEditor.dispatchCommand(INDENT_CONTENT_COMMAND, undefined);
            return;
          }

          activeEditor.dispatchCommand(FORMAT_ELEMENT_COMMAND, value);
        }}
        dropdownClass={cn("w-fit max-h-fit p-1")}
        listboxClass={cn("py-2 rounded-md cursor-pointer")}
        selectBtnClass={cn("border-none shadow-none hover:bg-gray-200")}
        leftIcon={
          <i
            className="h-4 w-4 text-gray-500"
            style={{
              backgroundImage: "url(/assets/text-left.svg)",
            }}
          />
        }
      />
      {modal}
    </div>
  );
}
