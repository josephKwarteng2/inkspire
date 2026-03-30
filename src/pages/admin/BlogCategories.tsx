import React from "react";

interface AdminCategoriesProps {
  categories: string[];
  onAddCategory: (cat: string) => void;
  onRemoveCategory: (cat: string) => void;
}

const AdminCategories: React.FC<AdminCategoriesProps> = ({
  categories,
  onAddCategory,
  onRemoveCategory,
}) => {
  const [newCategory, setNewCategory] = React.useState("");

  const handleAddCategory = () => {
    const trimmed = newCategory.trim();
    if (trimmed) {
      onAddCategory(trimmed);
      setNewCategory("");
    }
  };

  return (
    <div className="mb-8 w-full">
      <h2 className="text-lg font-semibold mb-2">Categories</h2>
      <div className="flex flex-col sm:flex-row gap-2 mb-2 w-full">
        <input
          className="border rounded px-2 py-2 flex-1 min-w-0"
          placeholder="Add new category"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleAddCategory();
          }}
        />
        <button
          className="bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90 w-full sm:w-auto cursor-pointer"
          onClick={handleAddCategory}
        >
          Add Category
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <span
            key={cat}
            className="bg-muted rounded px-2 py-1 text-sm flex items-center gap-1"
          >
            {cat}
            <button
              className="ml-1 text-destructive hover:underline cursor-pointer"
              onClick={() => onRemoveCategory(cat)}
              title={`Remove ${cat} category`}
            >
              &times;
            </button>
          </span>
        ))}
      </div>
    </div>
  );
};

export default AdminCategories;
