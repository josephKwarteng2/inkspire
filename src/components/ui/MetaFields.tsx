import { Input } from "@/components/ui/input";

interface MetaFieldsProps {
  metaTitle: string;
  setMetaTitle: (title: string) => void;
  metaDescription: string;
  setMetaDescription: (description: string) => void;
  metaKeywords: string;
  setMetaKeywords: (keywords: string) => void;
}

export const MetaFields: React.FC<MetaFieldsProps> = ({
  metaTitle,
  setMetaTitle,
  metaDescription,
  setMetaDescription,
  metaKeywords,
  setMetaKeywords,
}) => (
  <div className="space-y-4 mt-8">
    <div>
      <label className="block text-sm font-bold mb-1">Meta Title (SEO)</label>
      <Input
        value={metaTitle}
        onChange={(e) => setMetaTitle(e.target.value)}
        placeholder="Meta title for SEO"
      />
    </div>
    <div>
      <label className="block text-sm font-bold mb-1">
        Meta Description (SEO)
      </label>
      <Input
        value={metaDescription}
        onChange={(e) => setMetaDescription(e.target.value)}
        placeholder="Meta description for SEO"
      />
    </div>
    <div>
      <label className="block text-sm font-bold mb-1">
        Meta Keywords (comma separated)
      </label>
      <Input
        value={metaKeywords}
        onChange={(e) => setMetaKeywords(e.target.value)}
        placeholder="e.g. react, typescript, blogging"
      />
    </div>
  </div>
);
