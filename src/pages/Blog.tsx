import React from "react";
import { useMemo } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../components/ui/select";
import { categories as categoriesData } from "../data/categories";
import { getAllPosts } from "@/lib/postsStorage";
import type { Category } from "../data/categories";
import type { Post } from "@/types/post";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "../components/ui/skeleton";
import EmptyPostsLottie from "../components/post/EmptyPostsLottie";
import { truncateText } from "../lib/truncateText";
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
      const posts: BlogPost[] = getAllPosts()
        .filter((p) => !p.trashed && p.status === "published")
        .map((p) => {
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
  const [selectedCategory, setSelectedCategory] = React.useState<string>("All");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [postsPerPage, setPostsPerPage] = React.useState(5);

  const { data: categories = [], isLoading: categoriesLoading } = useQuery<
    Category[]
  >({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const { data: allPosts = [], isLoading: postsLoading } = useQuery<BlogPost[]>(
    {
      queryKey: ["posts"],
      queryFn: fetchPosts,
    }
  );

  const filteredPosts = useMemo(() => {
    if (selectedCategory === "All") {
      return allPosts;
    }
    return allPosts.filter((post) => post.category === selectedCategory);
  }, [allPosts, selectedCategory]);

  const totalPages = Math.ceil(
    Math.max(filteredPosts.length - 1, 0) / postsPerPage
  );
  const paginatedPosts = useMemo(() => {
    const posts = filteredPosts.slice(1);
    const start = (currentPage - 1) * postsPerPage;
    return posts.slice(start, start + postsPerPage);
  }, [filteredPosts, currentPage, postsPerPage]);

  const loading = categoriesLoading || postsLoading;
  const navigate = useNavigate();

  const featuredPost = filteredPosts[0];

  return (
    <div className="w-full mx-auto mt-10">
      {featuredPost && (
        <section
          className="w-full py-10 mb-12"
          style={{ backgroundColor: "var(--lavender)" }}
        >
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-8 px-4">
            <div className="flex-1">
              <div className="text-xs tracking-widest text-muted-foreground mb-2 uppercase">
                Featured Post
              </div>
              <h1 className="text-2xl md:text-3xl font-bold mb-3 text-foreground">
                {featuredPost.title}
              </h1>
              <div className="text-xs text-muted-foreground mb-2">
                By {featuredPost.author} &nbsp;|&nbsp;{" "}
                {featuredPost && featuredPost.createdAt
                  ? new Date(featuredPost.createdAt).toLocaleDateString()
                  : "May 23, 2022"}
              </div>
              <p
                className="mb-4 text-muted-foreground text-sm max-w-xl"
                dangerouslySetInnerHTML={{
                  __html: truncateText(featuredPost.description, 120),
                }}
              />
              <button
                className="bg-yellow-400 text-white px-5 py-2 rounded font-semibold shadow hover:bg-yellow-300 transition"
                onClick={() => navigate(`/posts/${featuredPost.id}`)}
              >
                Read More &gt;
              </button>
            </div>
            <div className="flex-1 flex justify-end">
              <img
                src={featuredPost.image}
                alt={featuredPost.title}
                className="w-full max-w-md rounded-lg object-cover aspect-[4/3]"
              />
            </div>
          </div>
        </section>
      )}

      <section className="max-w-6xl mx-auto px-4 py-22">
        <h2 className="text-2xl font-bold text-foreground mb-6">All posts</h2>
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              selectedCategory === "All"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
            onClick={() => setSelectedCategory("All")}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category.title}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                selectedCategory === category.title
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
              onClick={() => setSelectedCategory(category.title)}
            >
              {category.title}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-8">
          {loading ? (
            Array.from({ length: 3 }).map((_, idx) => (
              <div
                key={idx}
                className="flex flex-col md:flex-row gap-6 items-start border-b border-border pb-8"
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
                No posts found in {selectedCategory === "All" ? "any" : "this"}{" "}
                category.
              </div>
            </div>
          ) : (
            paginatedPosts.map((post) => (
              <div
                key={post.id}
                className="flex flex-col md:flex-row gap-6 items-start border-b border-border pb-8 cursor-pointer"
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
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-foreground mb-1">
                    {post.title}
                  </h3>
                  <div className="text-xs text-muted-foreground mb-2">
                    By {post.author}
                  </div>
                  <p
                    className="mb-2 text-foreground text-sm max-w-xl"
                    dangerouslySetInnerHTML={{
                      __html: truncateText(post.description, 120),
                    }}
                  />
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
          <button
            className="text-foreground text-sm px-3 py-1 rounded disabled:opacity-50"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            &lt; Prev
          </button>
          <span className="text-primary text-sm font-bold">
            Page {currentPage} of {Math.max(totalPages, 1)}
          </span>
          <button
            className="text-foreground text-sm px-3 py-1 rounded disabled:opacity-50"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            Next &gt;
          </button>
          <Select
            value={String(postsPerPage)}
            onValueChange={(val) => {
              setPostsPerPage(Number(val));
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="ml-4 w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[5, 10, 20].map((n) => (
                <SelectItem key={n} value={String(n)}>
                  {n} per page
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </section>
      <section
        className="w-full py-12"
        style={{ backgroundColor: "var(--lavender)" }}
      >
        <div className="max-w-2xl mx-auto flex flex-col items-center justify-center text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Join our team to be a part of our story
          </h2>
          <p className="mb-6 text-muted-foreground text-base max-w-xl">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt.
          </p>
          <button className="bg-yellow-400 text-white px-6 py-3 rounded font-semibold shadow hover:bg-yellow-300 transition">
            Join Now
          </button>
        </div>
      </section>
    </div>
  );
};

export default Blog;
