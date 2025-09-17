import * as React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface UserPopoverProps {
  author: string;
  email: string;
  commentCount?: number;
}

const UserPopover: React.FC<UserPopoverProps> = ({
  author,
  email,
  commentCount,
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <span className="cursor-pointer underline decoration-dotted underline-offset-2 hover:text-primary">
          {author}
        </span>
      </PopoverTrigger>
      <PopoverContent className="w-56">
        <div className="font-semibold text-base mb-1">{author}</div>
        <div className="text-xs text-muted-foreground mb-2">{email}</div>
        {typeof commentCount === "number" && (
          <div className="text-xs">Comments: {commentCount}</div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default UserPopover;
