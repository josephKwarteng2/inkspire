import * as React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface CommentPreviewModalProps {
  open: boolean;
  onClose: () => void;
  content: string;
  author: string;
}

const CommentPreviewModal: React.FC<CommentPreviewModalProps> = ({
  open,
  onClose,
  content,
  author,
}) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <h2 className="text-lg font-semibold mb-2">Comment by {author}</h2>
        <div className="whitespace-pre-line text-base text-foreground mb-4">
          {content}
        </div>
        <Button onClick={onClose} variant="outline">
          Close
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default CommentPreviewModal;
