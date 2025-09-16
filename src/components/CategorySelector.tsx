import { FaBuilding, FaRocket, FaChartBar, FaMicrochip } from "react-icons/fa6";
import type { Category } from "../data/categories";

interface CategorySelectorProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  categories: Category[];
}

const iconMap: Record<string, React.ReactNode> = {
  FaBuilding: <FaBuilding className="text-2xl category-icon" />,
  FaRocket: <FaRocket className="text-2xl category-icon" />,
  FaChartBar: <FaChartBar className="text-2xl category-icon" />,
  FaMicrochip: <FaMicrochip className="text-2xl category-icon" />,
};

const CategorySelector = ({
  selectedCategory,
  onSelectCategory,
  categories = [],
}: CategorySelectorProps) => (
  <section className="w-full flex flex-col items-center py-12">
    <h2 className="logo-inkspire text-3xl font-extrabold mb-12 text-center text-primary-foreground">
      Choose A Category
    </h2>
    <div
      className="grid gap-6 w-full max-w-6xl"
      style={{
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
      }}
    >
      {categories.map((cat) => {
        const isActive =
          (selectedCategory || "").toLowerCase() === cat.title.toLowerCase();
        return (
          <div
            key={cat.title}
            className={`flex flex-col items-start rounded-lg border shadow-sm cursor-pointer min-h-[220px] transition-all duration-200 logo-inkspire
              ${
                isActive
                  ? "bg-accent border-accent text-accent-foreground shadow-lg"
                  : "bg-card border-border text-card-foreground hover:shadow-lg hover:border-primary"
              }
              p-6 md:p-6 sm:p-4
            `}
            onClick={() => onSelectCategory(cat.title)}
          >
            <div
              className={`mb-6 p-3 rounded flex items-center justify-center
                ${isActive ? "bg-accent-foreground" : "bg-muted"}
              `}
            >
              {iconMap[cat.icon] || null}
            </div>
            <h3
              className={`text-2xl font-extrabold mb-2 ${
                isActive ? "text-accent-foreground" : "text-primary"
              }`}
            >
              {cat.title}
            </h3>
            <p
              className={`text-base ${
                isActive ? "text-accent-foreground" : "text-muted-foreground"
              }`}
            >
              {cat.description}
            </p>
          </div>
        );
      })}
    </div>
  </section>
);

export default CategorySelector;
