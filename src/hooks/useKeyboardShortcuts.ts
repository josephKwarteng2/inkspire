import { useEffect } from "react";
import type { PostStatus } from "@/types/post";

export const useKeyboardShortcuts = (
  setStatus: (status: PostStatus) => void,
  setPreviewOpen: (open: boolean | ((prev: boolean) => boolean)) => void
) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        const form = document.querySelector("form");
        if (form) {
          (form as HTMLFormElement).requestSubmit();
        }
      } else if (
        (e.ctrlKey || e.metaKey) &&
        !e.shiftKey &&
        e.key.toLowerCase() === "p"
      ) {
        e.preventDefault();
        setPreviewOpen((prev) => !prev);
      } else if (
        (e.ctrlKey || e.metaKey) &&
        e.shiftKey &&
        e.key.toLowerCase() === "p"
      ) {
        e.preventDefault();
        setStatus("published");
        setTimeout(() => {
          const form = document.querySelector("form");
          if (form) {
            (form as HTMLFormElement).requestSubmit();
          }
        }, 0);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setStatus, setPreviewOpen]);
};
