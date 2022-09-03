import { useCallback, useMemo } from "react";
import { createEditor, Descendant } from "slate";
import {
  Editable,
  RenderElementProps,
  RenderLeafProps,
  Slate,
  withReact,
} from "slate-react";
import { Element, Leaf } from "./components";
import withHtml from "./withHTML";
import { withShortcuts } from "./withShortcuts";
import { withTables } from "./withTables";

interface Props {
  content: Descendant[];
}

export const RichTextRenderer: React.FC<Props> = ({ content }: Props) => {
  const editor = useMemo(
    () => withHtml(withShortcuts(withTables(withReact(createEditor())))),
    []
  );
  const renderElement = useCallback(
    (props: RenderElementProps) => <Element {...props} />,
    []
  );
  const renderLeaf = useCallback(
    (props: RenderLeafProps) => <Leaf {...props} />,
    []
  );
  return (
    <Slate editor={editor} value={content}>
      <Editable
        readOnly
        renderElement={renderElement}
        renderLeaf={renderLeaf}
      />
    </Slate>
  );
};

export default RichTextRenderer;
