import { SimpleEditor } from "../tiptap-templates/simple/simple-editor";

interface ContentEditorProps {
  content: string;
  setContent: (content: string) => void;
  error?: string;
}

export const ContentEditor: React.FC<ContentEditorProps> = ({
  content,
  setContent,
}) => (
  <div>
    <label className="block text-sm font-bold mb-1">Content</label>
    <SimpleEditor value={content} onChange={setContent} />
    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
      <span>
        Word count: {content.trim().split(/\s+/).filter(Boolean).length}
      </span>
      <span>
        Estimated read time:{" "}
        {Math.max(
          1,
          Math.ceil(content.trim().split(/\s+/).filter(Boolean).length / 200)
        )}{" "}
        min
      </span>
    </div>
  </div>
);
