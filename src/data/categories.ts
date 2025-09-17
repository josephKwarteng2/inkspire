export interface Category {
  title: string;
  description: string;
  icon: string;
}

export const categories: Category[] = [
  {
    title: "Business",
    description: "All about business, entrepreneurship, and management.",
    icon: "FaBuilding",
  },
  {
    title: "Startup",
    description: "Startup culture, growth, and innovation.",
    icon: "FaRocket",
  },
  {
    title: "Economy",
    description: "Economics, finance, and market trends.",
    icon: "FaChartBar",
  },
  {
    title: "Technology",
    description: "Tech news, gadgets, and software.",
    icon: "FaMicrochip",
  },
];
