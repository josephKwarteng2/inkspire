import { Node, mergeAttributes } from "@tiptap/core";

export interface AudioOptions {
  HTMLAttributes: Record<string, unknown>;
}

export const AudioNode = Node.create<AudioOptions>({
  name: "audio",
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
      src: { default: null },
      controls: { default: true },
    };
  },
  parseHTML() {
    return [
      {
        tag: "audio",
      },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return [
      "audio",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      0,
    ];
  },
});
