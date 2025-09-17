import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface CategorySelectProps {
  category: string;
  setCategory: (category: string) => void;
  categories: string[];
  error?: string;
}

export const CategorySelect: React.FC<CategorySelectProps> = ({
  category,
  setCategory,
  categories,
}) => (
  <div>
    <label className="block text-sm font-bold mb-1">
      Category <span className="text-red-500">*</span>
    </label>
    <Select value={category} onValueChange={setCategory} required>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select category" />
      </SelectTrigger>
      <SelectContent>
        {categories.map((cat) => (
          <SelectItem key={cat} value={cat}>
            {cat}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);
