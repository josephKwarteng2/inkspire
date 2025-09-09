import { Input } from "@/components/ui/input";

interface SlugInputProps {
  slug: string;
  setSlug: (slug: string) => void;
  setSlugManuallyEdited: (edited: boolean) => void;
}

export const SlugInput: React.FC<SlugInputProps> = ({
  slug,
  setSlug,
  setSlugManuallyEdited,
}) => (
  <div>
    <label className="block text-sm font-bold mb-1">
      Slug (URL) <span className="text-red-500">*</span>
    </label>
    <Input
      value={slug}
      onChange={(e) => {
        setSlug(e.target.value);
        setSlugManuallyEdited(true);
      }}
      placeholder="e.g. my-post-title"
      required
    />
  </div>
);
