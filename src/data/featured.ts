export interface FeaturedPost {
  image: string;
  author: string;
  date: string;
  title: string;
  description: string;
}

export const featured: FeaturedPost = {
  image: "/featured.svg",
  author: "John Doe",
  date: "May 23, 2022",
  title: "Step-by-step guide to choosing great font pairs",
  description:
    "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.",
};
