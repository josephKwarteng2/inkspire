import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPostLikes, likePost } from "@/lib/postReactions";
import { getPostViews, incrementPostViews } from "@/lib/postViews";
import { Button } from "../components/ui/button";
import { useParams, useNavigate } from "react-router-dom";
import RelatedPosts from "@/components/post/RelatedPosts";
import { getAllPosts } from "@/lib/postsStorage";
import { Avatar, AvatarImage, AvatarFallback } from "../components/ui/avatar";
import CommentsSheet from "../components/post/CommentsSheet";

const BlogDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: post, isLoading: isPostLoading } = useQuery({
    queryKey: ["post", id],
    queryFn: () => {
      const posts = getAllPosts();
      const foundPost = posts.find((p) => {
        if (typeof p.id === "number") return p.id === Number(id);
        return String(p.id) === String(id);
      });
      if (!foundPost) {
        throw new Error("Post not found");
      }
      return foundPost;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });

  const { data: likes = 0 } = useQuery({
    queryKey: ["post-likes", post?.id],
    queryFn: () => getPostLikes(String(post?.id)),
    enabled: !!post,
    staleTime: 30 * 1000,
  });

  const { data: views = 0 } = useQuery({
    queryKey: ["post-views", post?.id],
    queryFn: () => getPostViews(String(post?.id)),
    enabled: !!post,
    staleTime: 30 * 1000,
  });

  const incrementViewsMutation = useMutation({
    mutationFn: async (postId: string) => {
      incrementPostViews(postId);
      return getPostViews(postId);
    },
    onSuccess: (newViews, postId) => {
      queryClient.setQueryData(["post-views", postId], newViews);
    },
  });

  const likeMutation = useMutation({
    mutationFn: async (postId: string) => {
      likePost(postId);
      return getPostLikes(postId);
    },
    onSuccess: (newLikes, postId) => {
      queryClient.setQueryData(["post-likes", postId], newLikes);
    },
  });

  const [fontSize, setFontSize] = React.useState<"sm" | "md" | "lg">("md");
  const fontSizeClass =
    fontSize === "sm"
      ? "text-base"
      : fontSize === "lg"
      ? "text-2xl"
      : "text-lg";

  const [claps, setClaps] = React.useState(() => {
    if (!post) return 0;
    const stored = localStorage.getItem(`post_claps_${post?.id}`);
    return stored ? parseInt(stored, 10) : 0;
  });

  const [saved, setSaved] = React.useState(() => {
    if (!post) return false;
    const savedPosts = JSON.parse(localStorage.getItem("saved_posts") || "[]");
    return savedPosts.includes(String(post?.id));
  });

  const [playing, setPlaying] = React.useState(false);
  const synthRef = React.useRef<SpeechSynthesis | null>(null);
  const utterRef = React.useRef<SpeechSynthesisUtterance | null>(null);

  const hasIncrementedView = React.useRef<string | null>(null);

  React.useEffect(() => {
    if (!post) return;

    const postIdString = String(post.id);
    if (hasIncrementedView.current !== postIdString) {
      incrementViewsMutation.mutate(postIdString);
      hasIncrementedView.current = postIdString;
    }
  }, [post, incrementViewsMutation]);

  React.useEffect(() => {
    if (!post) return;

    const stored = localStorage.getItem(`post_claps_${post.id}`);
    setClaps(stored ? parseInt(stored, 10) : 0);

    const savedPosts = JSON.parse(localStorage.getItem("saved_posts") || "[]");
    setSaved(savedPosts.includes(String(post.id)));
  }, [post]);

  React.useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  React.useEffect(() => {
    if (!post) return;

    const metaTitle = post?.metaTitle || post?.title || "Post";
    const metaDescription = post?.metaDescription || "";
    const metaKeywords = post?.metaKeywords || [];
    document.title = metaTitle;

    let descTag = document.querySelector('meta[name="description"]');
    if (!descTag) {
      descTag = document.createElement("meta");
      descTag.setAttribute("name", "description");
      document.head.appendChild(descTag);
    }
    descTag.setAttribute("content", metaDescription);

    let keywordsTag = document.querySelector('meta[name="keywords"]');
    if (!keywordsTag) {
      keywordsTag = document.createElement("meta");
      keywordsTag.setAttribute("name", "keywords");
      document.head.appendChild(keywordsTag);
    }
    const keywords = Array.isArray(metaKeywords)
      ? metaKeywords.join(", ")
      : metaKeywords;
    keywordsTag.setAttribute("content", keywords);
  }, [post]);

  const handleLike = () => {
    if (!post) return;
    likeMutation.mutate(String(post.id));
  };

  const handleClap = () => {
    if (!post) return;
    const newClaps = claps + 1;
    setClaps(newClaps);
    localStorage.setItem(`post_claps_${post.id}`, String(newClaps));
  };

  const handleSave = () => {
    if (!post) return;
    const savedPosts = JSON.parse(localStorage.getItem("saved_posts") || "[]");
    if (!savedPosts.includes(String(post.id))) {
      savedPosts.push(String(post.id));
      localStorage.setItem("saved_posts", JSON.stringify(savedPosts));
      setSaved(true);
    }
  };

  const handlePlay = () => {
    if (!post) return;
    if (playing) return;
    setPlaying(true);
    const synth = window.speechSynthesis;
    const utter = new window.SpeechSynthesisUtterance(
      post.title +
        ". " +
        (post.content ? post.content.replace(/<[^>]+>/g, " ") : "")
    );
    utter.onend = () => setPlaying(false);
    synthRef.current = synth;
    utterRef.current = utter;
    synth.speak(utter);
  };

  const handleStop = () => {
    const synth = synthRef.current || window.speechSynthesis;
    synth.cancel();
    setPlaying(false);
  };

  const formatContent = (content: string) => {
    if (!content) return "";

    if (!content.includes("<p>") && !content.includes("<div>")) {
      return content
        .split(/\n\s*\n/)
        .filter((paragraph) => paragraph.trim().length > 0)
        .map((paragraph) => `<p>${paragraph.trim()}</p>`)
        .join("");
    }

    return content;
  };

  if (isPostLoading) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="mt-4 text-lg text-muted-foreground">Loading post...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-20">
        <p className="text-lg text-muted-foreground">Post not found.</p>
        <button
          className="mt-4 px-4 py-2 bg-primary text-white rounded"
          onClick={() => navigate(-1)}
        >
          Go Back
        </button>
      </div>
    );
  }

  const author = {
    name: post.author || "Unknown Author",
    avatar:
      post.featuredImage || "https://randomuser.me/api/portraits/men/32.jpg",
    date: post.createdAt ? new Date(post.createdAt).toLocaleDateString() : "",
  };

  const posts = getAllPosts();

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 mt-16 md:mt-24">
      <div className="flex items-center mb-6">
        <div className="flex rounded-full bg-muted-foreground/10 p-1 gap-1 shadow-inner border border-muted-foreground/10">
          {[
            { key: "sm", label: <span className="text-xs">A</span> },
            { key: "md", label: <span className="text-base">A</span> },
            { key: "lg", label: <span className="text-xl">A</span> },
          ].map((opt) => (
            <button
              key={opt.key}
              type="button"
              aria-label={`Set font size to ${opt.key}`}
              onClick={() => setFontSize(opt.key as "sm" | "md" | "lg")}
              className={`transition-all px-3 py-1 rounded-full font-semibold focus:outline-none focus:ring-2 focus:ring-primary/50
                ${
                  fontSize === opt.key
                    ? "bg-primary text-white shadow"
                    : "text-foreground hover:bg-primary/10"
                }
              `}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
        <div className="flex items-center gap-3">
          <Avatar className="w-12 h-12">
            <AvatarImage src={author.avatar} alt={author.name} />
            <AvatarFallback>
              {author.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-semibold text-primary text-base leading-tight">
              {author.name}
            </div>
          </div>
        </div>
        {post.category && (
          <div className="mt-2 sm:mt-0 sm:ml-auto text-xs font-medium text-primary bg-primary/10 rounded px-3 py-1 w-fit">
            {post.category}
          </div>
        )}
      </div>

      <h1 className="text-2xl md:text-3xl font-bold mb-4 logo-inkspire leading-tight">
        {post.title}
      </h1>

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex items-center gap-2 px-4 py-2 rounded bg-muted/50 border border-muted-foreground/10 shadow-sm">
          <span className="text-primary font-semibold text-lg">👁️ {views}</span>
          <span className="text-xs text-muted-foreground ml-1">Views</span>
        </div>
        <Button
          variant="outline"
          onClick={handleLike}
          title="Like"
          className="flex items-center gap-1"
          disabled={likeMutation.isPending}
        >
          <span role="img" aria-label="like">
            👍
          </span>{" "}
          <span>{likes}</span>
        </Button>
        <Button
          variant="outline"
          onClick={handleClap}
          title="Clap"
          className="flex items-center gap-1"
        >
          <span role="img" aria-label="clap">
            👏
          </span>{" "}
          <span>{claps}</span>
        </Button>
        {playing ? (
          <Button variant="outline" onClick={handleStop} title="Stop">
            ⏹️
          </Button>
        ) : (
          <Button variant="outline" onClick={handlePlay} title="Play">
            ▶️
          </Button>
        )}
        <Button
          variant={saved ? "default" : "outline"}
          onClick={handleSave}
          title="Save for later"
          disabled={saved}
        >
          {saved ? "Saved" : "🔖 Save"}
        </Button>
      </div>

      <img
        src={post.featuredImage || "https://placehold.co/800x400?text=No+Image"}
        alt={post.title}
        className="w-full rounded-lg mb-8 object-cover aspect-[4/2]"
      />

      {post.videoEmbed && post.videoEmbed.trim() && (
        <div className="mb-8">
          {post.videoEmbed.includes("youtube.com") ||
          post.videoEmbed.includes("youtu.be") ? (
            <iframe
              width="100%"
              height="400"
              src={post.videoEmbed
                .replace("watch?v=", "embed/")
                .replace("youtu.be/", "youtube.com/embed/")}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full rounded-lg"
            />
          ) : post.videoEmbed.includes("twitter.com") ? (
            <blockquote className="twitter-tweet">
              <a href={post.videoEmbed}>{post.videoEmbed}</a>
            </blockquote>
          ) : (
            <a
              href={post.videoEmbed}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              {post.videoEmbed}
            </a>
          )}
        </div>
      )}

      <div
        className={`prose prose-neutral max-w-none text-foreground ${fontSizeClass} 
          prose-p:mb-6 prose-p:leading-relaxed prose-p:text-justify
          prose-headings:mt-8 prose-headings:mb-4
          prose-ul:my-6 prose-ol:my-6
          prose-li:mb-2
          [&>p]:mb-6 [&>p]:leading-relaxed
          [&>h1]:mt-8 [&>h1]:mb-4
          [&>h2]:mt-8 [&>h2]:mb-4
          [&>h3]:mt-6 [&>h3]:mb-3
          [&>ul]:my-6 [&>ol]:my-6
          [&>blockquote]:my-6 [&>blockquote]:border-l-4 [&>blockquote]:border-primary/30 [&>blockquote]:pl-6
        `}
        dangerouslySetInnerHTML={{ __html: formatContent(post.content || "") }}
      />

      <div className="flex justify-end mt-8">
        <CommentsSheet postId={String(post.id)} />
      </div>

      <RelatedPosts currentPost={post} allPosts={posts} />
    </div>
  );
};

export default BlogDetail;
