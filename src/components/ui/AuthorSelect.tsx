import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface AuthorSelectProps {
  author: string;
  setAuthor: (author: string) => void;
  users: { id: string; name: string }[];
  error?: string;
}

export const AuthorSelect: React.FC<AuthorSelectProps> = ({
  author,
  setAuthor,
  users,
}) => (
  <div>
    <label className="block text-sm font-bold mb-1">
      Author <span className="text-red-500">*</span>
    </label>
    {users && users.length > 0 ? (
      <Select value={author} onValueChange={setAuthor} required>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select author" />
        </SelectTrigger>
        <SelectContent>
          {users.map((user) => (
            <SelectItem key={user.id} value={user.name}>
              {user.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    ) : (
      <Input
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        placeholder="Enter author name"
        required
      />
    )}
  </div>
);
