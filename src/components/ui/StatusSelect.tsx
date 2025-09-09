import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import type { PostStatus } from "@/types/post";

interface StatusSelectProps {
  status: PostStatus;
  setStatus: (status: PostStatus) => void;
}

export const StatusSelect: React.FC<StatusSelectProps> = ({
  status,
  setStatus,
}) => (
  <div>
    <label className="block text-sm font-bold mb-1">Status</label>
    <Select
      value={status}
      onValueChange={(v) => setStatus(v as PostStatus)}
      required
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="draft">Draft</SelectItem>
        <SelectItem value="published">Published</SelectItem>
        <SelectItem value="scheduled">Scheduled</SelectItem>
      </SelectContent>
    </Select>
  </div>
);
