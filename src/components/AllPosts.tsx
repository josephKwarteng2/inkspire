import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "../components/ui/skeleton";
import { Link } from "react-router-dom";
import { getAllPosts } from "@/lib/postsStorage";
import type { Post } from "@/types/post";
import { motion } from "framer-motion";
import { fadeIn, staggerContainer } from "@/lib/animation";

const AllPosts = () => {
  const { data = [], isLoading } = useQuery<Post[]>({
    queryKey: ["all-posts"],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 800));
      return getAllPosts();
    },
  });
  const posts: Post[] = data;
  const featuredPost: Post | null = posts.length > 0 ? posts[0] : null;
  const otherPosts: Post[] = posts.length > 1 ? posts.slice(1) : [];

  return (
    <motion.aside
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeIn}
      className="w-full px-4 sm:px-6 lg:px-12 xl:px-24 2xl:px-32 mx-auto text-[0.95rem] sm:text-[1rem]"
    >
      {isLoading ? (
        <div className="flex flex-col w-full">
          {[...Array(4)].map((_, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="rounded-lg px-5 py-4 w-full"
            >
              <Skeleton className="h-3 w-32 mb-2" />
              <Skeleton className="h-5 w-full" />
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div
          variants={staggerContainer}
          className="w-full flex flex-col lg:flex-row gap-22 items-start justify-center pt-10 lg:pt-14"
        >
          <motion.div
            variants={fadeIn}
            className="w-full lg:w-1/2 flex-shrink-0"
          >
            {featuredPost && (
              <div className="w-full">
                <h2 className="logo-inkspire text-base sm:text-lg lg:text-xl font-bold text-foreground mb-3">
                  Featured Post
                </h2>
                <motion.img
                  whileHover={{ scale: 1.02 }}
                  src={featuredPost.featuredImage || "/featured.svg"}
                  alt={featuredPost.title}
                  className="w-full rounded-lg object-cover aspect-[16/9] mb-6 lg:mb-0"
                  style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}
                />
                <div className="w-full mt-4">
                  <div className="text-xs sm:text-sm text-muted-foreground mb-2 flex gap-2 items-center">
                    By{" "}
                    <span className="text-primary font-medium">
                      {featuredPost.author}
                    </span>
                    <span className="text-muted-foreground">
                      {featuredPost.createdAt
                        ? new Date(featuredPost.createdAt).toLocaleDateString()
                        : ""}
                    </span>
                  </div>
                  <h3
                    className="font-bold text-lg sm:text-xl mb-2"
                    style={{ color: "var(--foreground)" }}
                  >
                    {featuredPost.title}
                  </h3>
                  <p
                    className="text-xs sm:text-sm text-muted-foreground mb-5"
                    dangerouslySetInnerHTML={{
                      __html:
                        featuredPost.metaDescription ||
                        (featuredPost.content
                          ? featuredPost.content.slice(0, 120) +
                            (featuredPost.content.length > 120 ? "..." : "")
                          : ""),
                    }}
                  />
                  <motion.a
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    href={"/posts/" + featuredPost.id}
                    className="inline-block bg-yellow-400 text-black font-bold px-3 py-1.5 rounded shadow hover:bg-yellow-500 transition text-sm mb-8"
                  >
                    Read More &gt;
                  </motion.a>
                </div>
              </div>
            )}
          </motion.div>

          <motion.div
            variants={fadeIn}
            className="w-full lg:w-1/2 flex flex-col gap-2 sm:gap-3 items-center"
          >
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

            {otherPosts.map((post, idx) => (
              <motion.div
                key={post.id + idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -3, backgroundColor: "rgba(0,0,0,0.02)" }}
                className="rounded-lg px-4 py-3 w-full transition-shadow duration-200 bg-transparent hover:shadow-sm"
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
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      )}
    </motion.aside>
  );
};

export default AllPosts;
