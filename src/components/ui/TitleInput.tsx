import { Input } from "@/components/ui/input";

interface TitleInputProps {
  title: string;
  setTitle: (title: string) => void;
  slug: string;
  setSlug: (slug: string) => void;
  slugManuallyEdited: boolean;
  setSlugManuallyEdited: (edited: boolean) => void;
}

export const TitleInput: React.FC<TitleInputProps> = ({
  title,
  setTitle,
  setSlug,
  slugManuallyEdited,
}) => (
  <div>
    <label className="block text-sm font-bold mb-1">
      Title <span className="text-red-500">*</span>
    </label>
    <Input
      value={title}
      onChange={(e) => {
        setTitle(e.target.value);
        if (!slugManuallyEdited) {
          const generatedSlug = e.target.value
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, "")
            .trim()
            .replace(/\s+/g, "-");
          setSlug(generatedSlug);
        }
      }}
      required
    />
  </div>
);
