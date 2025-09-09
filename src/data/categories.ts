export interface Category {
  title: string;
  desc: string;
  icon: string;
}

export const categories: Category[] = [
  {
    title: "Business",
    desc: "All about business, entrepreneurship, and management.",
    icon: "FaBuilding",
  },
  {
    title: "Startup",
    desc: "Startup culture, growth, and innovation.",
    icon: "FaRocket",
  },
  {
    title: "Economy",
    desc: "Economics, finance, and market trends.",
    icon: "FaChartBar",
  },
  {
    title: "Technology",
    desc: "Tech news, gadgets, and software.",
    icon: "FaMicrochip",
  },
];
