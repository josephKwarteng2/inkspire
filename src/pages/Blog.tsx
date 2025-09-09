import CategorySelector from "../components/CategorySelector";
import React, { useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { categories as categoriesData } from "../data/categories";
import { getAllPosts } from "@/lib/postsStorage";
import type { Category } from "../data/categories";
import type { Post } from "@/types/post";
import { Skeleton } from "../components/ui/skeleton";
import { truncateText } from "../lib/truncateText";
import EmptyPostsLottie from "../components/post/EmptyPostsLottie";
import { getReadingTime } from "../lib/readingTime";
import { useNavigate } from "react-router-dom";

const fetchCategories = async (): Promise<Category[]> => {
  return new Promise((resolve) =>
    setTimeout(() => resolve(categoriesData), 800)
  );
};
type BlogPost = Post & {
  id: string;
  image: string;
  description: string;
};

const fetchPosts = async (): Promise<BlogPost[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const posts: BlogPost[] = getAllPosts().map((p) => {
        const image =
          p.featuredImage || "https://placehold.co/400x300?text=No+Image";
        const description =
          p.metaDescription || truncateText(p.content || "", 200);
        return {
          ...p,
          id: String(p.id),
          image,
          description,
          trashed: !!p.trashed,
        };
      });
      resolve(posts);
    }, 400);
  });
};

const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const initialLoad = useRef(true);

  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const { data: posts = [], isLoading: postsLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
  });

  React.useEffect(() => {
    if (categories.length && !selectedCategory) {
      setSelectedCategory(categories[0].title);
    }
  }, [categories, selectedCategory]);

  const [categoryLoading, setCategoryLoading] = useState(false);
  React.useEffect(() => {
    if (initialLoad.current) {
      initialLoad.current = false;
      return;
    }
    setCategoryLoading(true);
    const timeout = setTimeout(() => setCategoryLoading(false), 800);
    return () => clearTimeout(timeout);
  }, [selectedCategory]);

  const filteredPosts = posts.filter(
    (post) =>
      post.category &&
      post.category.toLowerCase() === selectedCategory.toLowerCase()
  );

  const loading = categoriesLoading || postsLoading;

  const navigate = useNavigate();
  return (
    <div className="w-full mt-10 mx-auto">
      <CategorySelector
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        categories={categories}
      />

      <h2 className="text-xl md:text-2xl font-bold text-foreground mb-6 text-left w-full max-w-6xl mx-auto px-2">
        {selectedCategory} Posts
      </h2>
      <div className="w-full flex flex-col gap-8 items-start justify-start max-w-6xl mx-auto">
        {loading || categoryLoading ? (
          Array.from({ length: 3 }).map((_, idx) => (
            <div
              key={idx}
              className="flex flex-col md:flex-row gap-6 items-start border-b border-border pb-8 w-full max-w-6xl mx-auto"
            >
              <Skeleton className="w-full max-w-xs h-40 rounded-lg aspect-[4/3] md:mr-6" />
              <div className="flex-1 flex flex-col justify-center">
                <Skeleton className="h-4 w-32 mb-2" />
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
              </div>
            </div>
          ))
        ) : filteredPosts.length === 0 ? (
          <div className="flex flex-col items-center justify-center w-full py-12">
            <EmptyPostsLottie className="w-64 h-64 mx-auto" />
            <div className="text-center text-muted-foreground mt-4 text-lg font-medium">
              No posts found for this category.
            </div>
          </div>
        ) : (
          filteredPosts.map((post) => (
            <div
              key={post.id}
              className="flex flex-col md:flex-row gap-6 items-start border-b border-border w-full cursor-pointer transition-all duration-200 rounded-xl p-6 md:p-8"
              style={{
                background: "var(--tt-gray-light-50)",
                boxShadow: "none",
                minHeight: "140px",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--tt-gray-light-a-100)";
                e.currentTarget.style.boxShadow =
                  "0 4px 24px 0 var(--tt-gray-light-a-200)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "var(--tt-gray-light-50)";
                e.currentTarget.style.boxShadow = "none";
              }}
              onClick={() => navigate(`/posts/${post.id}`)}
            >
              <img
                src={post.image}
                alt={post.title}
                className="w-full max-w-xs rounded-lg object-cover aspect-[4/3] md:mr-6"
              />
              <div className="flex-1 flex flex-col justify-center">
                <div className="mb-2 flex items-center gap-4 text-xs font-semibold tracking-wide text-primary uppercase">
                  <span>{post.category}</span>
                  <span className="text-muted-foreground font-normal lowercase">
                    {getReadingTime(post.content || "")} min read
                  </span>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-foreground mb-1">
                  {post.title}
                </h3>
                <div className="text-xs text-muted-foreground mb-2">
                  By {post.author}
                </div>
                <p className="mb-2 text-foreground text-sm max-w-xl">
                  {truncateText(post.description, 120)}
                </p>
                <span
                  className="text-primary text-xs font-semibold underline cursor-pointer mt-2 inline-block"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/posts/${post.id}`);
                  }}
                >
                  Read more
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="w-full flex justify-center items-center gap-4 py-10">
        <span className="text-foreground text-sm">&lt; Prev</span>
        <span className="text-primary text-sm font-bold">Next &gt;</span>
      </div>
    </div>
  );
};

export default Blog;
