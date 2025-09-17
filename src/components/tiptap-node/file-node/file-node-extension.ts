import { Node, mergeAttributes } from "@tiptap/core";

export interface FileOptions {
  HTMLAttributes: Record<string, unknown>;
}

export const FileNode = Node.create<FileOptions>({
  name: "file",
  group: "block",
  atom: true,
  selectable: true,
  draggable: true,
  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },
  addAttributes() {
    return {
      href: { default: null },
      name: { default: null },
      type: { default: null },
      size: { default: null },
    };
  },
  parseHTML() {
    return [
      {
        tag: 'a[data-type="file"]',
      },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return [
      "a",
      mergeAttributes(
        { "data-type": "file", target: "_blank", rel: "noopener noreferrer" },
        this.options.HTMLAttributes,
        HTMLAttributes
      ),
      HTMLAttributes.name || "Download file",
    ];
  },
});
