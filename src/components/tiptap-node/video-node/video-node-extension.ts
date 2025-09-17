import { Node, mergeAttributes } from "@tiptap/core";

export interface VideoOptions {
  HTMLAttributes: Record<string, unknown>;
}

export const VideoNode = Node.create<VideoOptions>({
  name: "video",
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
      width: { default: "100%" },
      height: { default: "auto" },
    };
  },
  parseHTML() {
    return [
      {
        tag: "video",
      },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return [
      "video",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      ["source", { src: HTMLAttributes.src, type: "video/mp4" }],
    ];
  },
});
