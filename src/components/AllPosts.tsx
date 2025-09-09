import { useEffect, useState } from "react";
import { Skeleton } from "../components/ui/skeleton";
import { Link } from "react-router-dom";
import { getAllPosts } from "@/lib/postsStorage";
import type { Post } from "@/types/post";

const AllPosts = () => {
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      const loaded = getAllPosts();
      setPosts(loaded);
      setIsLoading(false);
    }, 800);
  }, []);

  return (
    <aside className="w-full px-4 sm:px-6 lg:px-12 xl:px-24 2xl:px-32 mx-auto text-[0.95rem] sm:text-[1rem]">
      {isLoading ? (
        <div className="flex flex-col w-full">
          {[...Array(4)].map((_, idx) => (
            <div key={idx} className="rounded-lg px-5 py-4 w-full">
              <Skeleton className="h-3 w-32 mb-2" />
              <Skeleton className="h-5 w-full" />
            </div>
          ))}
        </div>
      ) : (
        <div className="w-full flex flex-col lg:flex-row gap-22 items-start justify-center pt-10 lg:pt-14">
          <div className="w-full lg:w-1/2 flex-shrink-0">
            <div className="w-full">
              <h2 className="logo-inkspire text-base sm:text-lg lg:text-xl font-bold text-foreground mb-3">
                Featured Post
              </h2>
              <img
                src="/featured.svg"
                alt="Featured Post"
                className="w-full rounded-lg object-cover aspect-[16/9] mb-6 lg:mb-0"
                style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}
              />
              <div className="w-full mt-4">
                <div className="text-xs sm:text-sm text-muted-foreground mb-2 flex gap-2 items-center">
                  By <span className="text-primary font-medium">John Doe</span>
                  <span className="text-muted-foreground">May 23, 2022</span>
                </div>
                <h3
                  className="font-bold text-lg sm:text-xl mb-2"
                  style={{ color: "var(--foreground)" }}
                >
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor.
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground mb-5">
                  Duis aute irure dolor in reprehenderit in voluptate velit esse
                  cillum dolore eu fugiat nulla pariatur. Excepteur sint
                  occaecat cupidatat non proident.
                </p>
                <a
                  href="#"
                  className="inline-block bg-yellow-400 text-black font-bold px-3 py-1.5 rounded shadow hover:bg-yellow-500 transition text-sm mb-8"
                >
                  Read More &gt;
                </a>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-1/2 flex flex-col gap-2 sm:gap-3 items-center">
            <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <h2 className="logo-inkspire text-base sm:text-lg lg:text-xl font-bold text-foreground mb-2 sm:mb-0">
                All Posts
              </h2>
              <Link
                to="/blog"
                className="text-primary font-medium text-xs sm:text-sm hover:underline"
              >
                View All
              </Link>
            </div>

            {(posts ?? []).map((post, idx) => (
              <div
                key={post.id + idx}
                className={`rounded-lg px-4 py-3 w-full transition-shadow duration-200 ${
                  post.featured
                    ? "bg-[var(--background)] border border-[var(--background)]"
                    : "bg-transparent hover:shadow-sm"
                }`}
                style={{
                  boxShadow: post.featured
                    ? "0 0 0 1px var(--background)"
                    : undefined,
                }}
              >
                <div className="text-[0.8rem] sm:text-xs text-muted-foreground mb-1 flex flex-col sm:flex-row gap-1 sm:gap-2 items-start sm:items-center">
                  By{" "}
                  <span className="text-primary font-medium">
                    {post.author}
                  </span>
                  <span className="text-muted-foreground">
                    {post.createdAt
                      ? new Date(post.createdAt).toLocaleDateString()
                      : ""}
                  </span>
                </div>
                <div className="font-bold text-sm sm:text-base lg:text-lg text-foreground leading-snug">
                  {post.title}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
};

export default AllPosts;
