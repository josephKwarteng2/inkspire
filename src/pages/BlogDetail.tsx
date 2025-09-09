import { getPostLikes, likePost } from "@/lib/postReactions";
import { Button } from "../components/ui/button";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import React from "react";
import { getAllPosts } from "@/lib/postsStorage";
import { Avatar, AvatarImage, AvatarFallback } from "../components/ui/avatar";
import CommentsSheet from "../components/post/CommentsSheet";

const BlogDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const posts = getAllPosts();
  const post = posts.find((p) => {
    if (typeof p.id === "number") return p.id === Number(id);
    return String(p.id) === String(id);
  });

  const [likes, setLikes] = React.useState(() =>
    post ? getPostLikes(String(post.id)) : 0
  );
  const [claps, setClaps] = useState(() => {
    if (!post) return 0;
    const stored = localStorage.getItem(`post_claps_${post.id}`);
    return stored ? parseInt(stored, 10) : 0;
  });
  const [saved, setSaved] = useState(() => {
    if (!post) return false;
    const savedPosts = JSON.parse(localStorage.getItem("saved_posts") || "[]");
    return savedPosts.includes(String(post.id));
  });
  const [playing, setPlaying] = useState(false);
  const synthRef = React.useRef<SpeechSynthesis | null>(null);
  const utterRef = React.useRef<SpeechSynthesisUtterance | null>(null);
  React.useEffect(() => {
    setLikes(post ? getPostLikes(String(post.id)) : 0);
  }, [post]);

  React.useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleLike = () => {
    if (!post) return;
    likePost(String(post.id));
    setLikes(getPostLikes(String(post.id)));
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

  const author = post
    ? {
        name: post.author || "Unknown Author",
        avatar:
          post.featuredImage ||
          "https://randomuser.me/api/portraits/men/32.jpg",
        date: post.createdAt
          ? new Date(post.createdAt).toLocaleDateString()
          : "",
      }
    : {
        name: "Unknown Author",
        avatar: "https://randomuser.me/api/portraits/men/32.jpg",
        date: "",
      };

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

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 mt-16 md:mt-24">
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
            <div className="text-xs text-muted-foreground leading-tight">
              Posted on {author.date}
            </div>
          </div>
        </div>
        <div className="mt-2 sm:mt-0 sm:ml-auto text-xs font-medium text-primary bg-primary/10 rounded px-3 py-1 w-fit">
          {post.category}
        </div>
      </div>
      <h1 className="text-2xl md:text-3xl font-bold mb-4 logo-inkspire leading-tight">
        {post.title}
      </h1>
      <div className="flex items-center gap-3 mb-4">
        <Button variant="outline" onClick={handleLike} title="Like">
          👍 {likes}
        </Button>
        <Button variant="outline" onClick={handleClap} title="Clap">
          👏 {claps}
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
      <div
        className="prose prose-neutral max-w-none text-foreground"
        dangerouslySetInnerHTML={{ __html: post.content || "" }}
      />
      <div className="flex justify-end mt-8">
        <CommentsSheet postId={String(post.id)} />
      </div>
    </div>
  );
};

export default BlogDetail;
