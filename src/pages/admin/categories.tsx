import React from "react";
import AdminCategories from "./BlogCategories";
import { categories as defaultCategories } from "@/data/categories";

const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = React.useState<string[]>(() =>
    defaultCategories.map((c) => c.title)
  );

  const handleAddCategory = (cat: string) => {
    if (cat && !categories.includes(cat)) {
      setCategories((prev) => [...prev, cat]);
    }
  };

  const handleRemoveCategory = (cat: string) => {
    setCategories((prev) => prev.filter((c) => c !== cat));
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-2 sm:px-0">
      <h1 className="text-2xl font-semibold mb-6">Manage Categories</h1>
      <AdminCategories
        categories={categories}
        onAddCategory={handleAddCategory}
        onRemoveCategory={handleRemoveCategory}
      />
    </div>
  );
};

export default CategoriesPage;
