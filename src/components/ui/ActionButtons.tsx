import { Button } from "@/components/ui/button";

interface ActionButtonsProps {
  mode: "create" | "edit";
  setPreviewOpen: (open: boolean) => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  mode,
  setPreviewOpen,
}) => (
  <div className="flex gap-2 mt-4">
    <Button
      type="button"
      variant="outline"
      onClick={() => setPreviewOpen(true)}
    >
      Preview
    </Button>
    <Button type="submit" className="flex-1 cursor-pointer">
      {mode === "edit" ? "Update Post" : "Create Post"}
    </Button>
  </div>
);
