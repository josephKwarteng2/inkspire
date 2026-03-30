import React from "react";
import { useNavigate } from "react-router-dom";
import type { Post } from "@/types/post";
import { getAllPosts } from "@/lib/postsStorage";
import { getPostLikes } from "@/lib/postReactions";
import { getPostViews } from "@/lib/postViews";

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = React.useState<Post[]>(() => {
    const stored = localStorage.getItem("posts");
    return stored ? (JSON.parse(stored) as Post[]) : [];
  });

  React.useEffect(() => {
    setPosts(getAllPosts());
  }, []);

  // Calculate metrics
  const totalViews = posts.reduce(
    (sum, p) => sum + getPostViews(String(p.id)),
    0
  );
  const totalLikes = posts.reduce(
    (sum, p) => sum + getPostLikes(String(p.id)),
    0
  );
  const totalClaps = posts.reduce((sum, p) => {
    const claps = localStorage.getItem(`post_claps_${p.id}`);
    return sum + (claps ? parseInt(claps, 10) : 0);
  }, 0);

  const publishedCount = posts.filter((p) => p.status === "published").length;
  const draftCount = posts.filter((p) => p.status === "draft").length;
  const scheduledCount = posts.filter((p) => p.status === "scheduled").length;
  const recentPosts = posts.slice(-5).reverse();

  // Top posts data
  const topPosts = React.useMemo(
    () =>
      posts
        .map((p) => ({
          ...p,
          views: getPostViews(String(p.id)),
          likes: getPostLikes(String(p.id)),
          claps: parseInt(
            localStorage.getItem(`post_claps_${p.id}`) || "0",
            10
          ),
        }))
        .sort((a, b) => b.views - a.views)
        .slice(0, 10),
    [posts]
  );

  return (
    <div className="w-full max-w-full space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground logo-inkspire">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Welcome to your content management hub
          </p>
        </div>
        <button
          className="bg-primary text-primary-foreground px-5 py-2.5 rounded-lg shadow hover:bg-primary/90 transition font-medium flex items-center gap-2 mt-4 sm:mt-0"
          onClick={() => navigate("/admin/posts/new")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          New Post
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="bg-card rounded-xl shadow-sm p-5 border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Published
              </p>
              <h3 className="text-2xl font-bold text-foreground mt-1">
                {publishedCount}
              </h3>
            </div>
            <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-green-600 dark:text-green-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            Live on your site
          </p>
        </div>

        <div className="bg-card rounded-xl shadow-sm p-5 border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Scheduled
              </p>
              <h3 className="text-2xl font-bold text-foreground mt-1">
                {scheduledCount}
              </h3>
            </div>
            <div className="bg-yellow-100 dark:bg-yellow-900/30 p-3 rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-yellow-600 dark:text-yellow-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            Waiting to be published
          </p>
        </div>

        <div className="bg-card rounded-xl shadow-sm p-5 border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Drafts
              </p>
              <h3 className="text-2xl font-bold text-foreground mt-1">
                {draftCount}
              </h3>
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-600 dark:text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-3">In progress</p>
        </div>

        <div className="bg-card rounded-xl shadow-sm p-5 border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Posts
              </p>
              <h3 className="text-2xl font-bold text-foreground mt-1">
                {posts.length}
              </h3>
            </div>
            <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-blue-600 dark:text-blue-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-3">All content</p>
        </div>
      </div>

      {/* Engagement Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <div className="bg-card rounded-xl shadow-sm p-5 border border-border">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-blue-600 dark:text-blue-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-foreground">
                {totalViews}
              </h3>
              <p className="text-sm text-muted-foreground">Total Views</p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl shadow-sm p-5 border border-border">
          <div className="flex items-center gap-4">
            <div className="bg-pink-100 dark:bg-pink-900/30 p-3 rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-pink-600 dark:text-pink-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-foreground">
                {totalLikes}
              </h3>
              <p className="text-sm text-muted-foreground">Total Likes</p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl shadow-sm p-5 border border-border">
          <div className="flex items-center gap-4">
            <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-purple-600 dark:text-purple-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905a3.61 3.61 0 01-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-foreground">
                {totalClaps}
              </h3>
              <p className="text-sm text-muted-foreground">Total Claps</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Posts Table */}
        <div className="bg-card rounded-xl shadow-sm p-6 border border-border">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-foreground">
              Top Performing Posts
            </h2>
            <button className="text-sm text-primary hover:text-primary/80 font-medium">
              View All
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider border-b border-border">
                  <th className="pb-3 px-2">Title</th>
                  <th className="pb-3 px-2 text-center">Views</th>
                  <th className="pb-3 px-2 text-center">Likes</th>
                  <th className="pb-3 px-2 text-center">Claps</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {topPosts.map((p) => (
                  <tr
                    key={p.id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="py-3 px-2 max-w-xs truncate font-medium text-sm text-foreground">
                      {p.title}
                    </td>
                    <td className="py-3 px-2 text-center text-sm text-foreground">
                      {p.views}
                    </td>
                    <td className="py-3 px-2 text-center text-sm text-foreground">
                      {p.likes}
                    </td>
                    <td className="py-3 px-2 text-center text-sm text-foreground">
                      {p.claps}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Posts */}
        <div className="bg-card rounded-xl shadow-sm p-6 border border-border">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-foreground">
              Recent Posts
            </h2>
            <button className="text-sm text-primary hover:text-primary/80 font-medium">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {recentPosts.length === 0 && (
              <p className="text-muted-foreground text-sm p-4 text-center">
                No posts yet.
              </p>
            )}
            {recentPosts.map((post) => (
              <div
                key={post.id}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/30 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-foreground truncate">
                    {post.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-muted-foreground">
                      {post.category || "Uncategorized"}
                    </span>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{
                        backgroundColor:
                          post.status === "published"
                            ? "var(--color-chart-5)"
                            : post.status === "draft"
                            ? "var(--color-muted)"
                            : "var(--color-chart-4)",
                        color:
                          post.status === "published"
                            ? "var(--color-primary-foreground)"
                            : post.status === "draft"
                            ? "var(--color-muted-foreground)"
                            : "var(--color-primary-foreground)",
                      }}
                    >
                      {post.status.charAt(0).toUpperCase() +
                        post.status.slice(1)}
                    </span>
                  </div>
                </div>
                <button
                  className="text-primary hover:text-primary/80 text-sm font-medium ml-4 whitespace-nowrap"
                  onClick={() => navigate(`/admin/posts/${post.id}`)}
                >
                  Edit
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
