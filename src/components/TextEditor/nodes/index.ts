import type { Klass, LexicalNode } from "lexical";

import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { HashtagNode } from "@lexical/hashtag";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { ListItemNode, ListNode } from "@lexical/list";
import { MarkNode } from "@lexical/mark";
import { OverflowNode } from "@lexical/overflow";
import { HorizontalRuleNode } from "@lexical/react/LexicalHorizontalRuleNode";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";

import { CollapsibleContainerNode } from "~/components/TextEditor/plugins/CollapsiblePlugin/CollapsibleContainerNode";
import { CollapsibleContentNode } from "~/components/TextEditor/plugins/CollapsiblePlugin/CollapsibleContentNode";
import { CollapsibleTitleNode } from "~/components/TextEditor/plugins/CollapsiblePlugin/CollapsibleTitleNode";
// import { AutocompleteNode } from "./AutocompleteNode";
// import { EmojiNode } from "./EmojiNode";
// import { EquationNode } from "./EquationNode";
// import { ExcalidrawNode } from "./ExcalidrawNode";
// import { FigmaNode } from "./FigmaNode";
import { ImageNode } from "./ImageNode";
// import { KeywordNode } from "./KeywordNode";

// import { TableNode as NewTableNode } from "./TableNode";

const PlaygroundNodes: Klass<LexicalNode>[] = [
  HeadingNode,
  ListNode,
  ListItemNode,
  QuoteNode,
  CodeNode,
  //   NewTableNode,
  TableNode,
  TableCellNode,
  TableRowNode,
  HashtagNode,
  CodeHighlightNode,
  AutoLinkNode,
  LinkNode,
  OverflowNode,
  //   PollNode,
  //   StickyNode,
  ImageNode,
  //   MentionNode,
  //   EmojiNode,
  //   ExcalidrawNode,
  //   EquationNode,
  //   AutocompleteNode,
  //   KeywordNode,
  HorizontalRuleNode,
  //   TweetNode,
  //   YouTubeNode,
  //   FigmaNode,
  MarkNode,
  CollapsibleContainerNode,
  CollapsibleContentNode,
  CollapsibleTitleNode,
];

export default PlaygroundNodes;
