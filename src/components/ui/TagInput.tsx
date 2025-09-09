import React, { useMemo } from "react";
import { Input } from "@/components/ui/input";

interface TagInputProps {
  tags: string;
  setTags: React.Dispatch<React.SetStateAction<string>>;
  setError: (error: string) => void;
  setActiveSuggestion: React.Dispatch<React.SetStateAction<number>>;
  tagSuggestions: string[];
  activeSuggestion: number;
  disabled?: boolean;
}

export const TagInput: React.FC<TagInputProps> = ({
  tags,
  setTags,
  setError,
  setActiveSuggestion,
  tagSuggestions,
  activeSuggestion,
  disabled = false,
}) => {
  const TAG_LIMIT = 5;
  const tagList = useMemo(
    () =>
      tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    [tags]
  );

  const filteredSuggestions = useMemo(
    () =>
      tagSuggestions
        .filter(
          (s) =>
            s &&
            !tagList.includes(s) &&
            s
              .toLowerCase()
              .includes(tags.split(",").pop()?.trim().toLowerCase() || "")
        )
        .slice(0, 6),
    [tagSuggestions, tagList, tags]
  );

  const handleTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const inputTagList = input
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    if (inputTagList.length <= TAG_LIMIT) {
      setTags(input);
      setError("");
      setActiveSuggestion(-1);
    } else {
      setError(`You can add up to ${TAG_LIMIT} tags only.`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!filteredSuggestions.length) return;
    if (e.key === "ArrowDown") {
      setActiveSuggestion((prev: number) =>
        prev < filteredSuggestions.length - 1 ? prev + 1 : 0
      );
      e.preventDefault();
    } else if (e.key === "ArrowUp") {
      setActiveSuggestion((prev: number) =>
        prev > 0 ? prev - 1 : filteredSuggestions.length - 1
      );
      e.preventDefault();
    } else if (e.key === "Enter" && activeSuggestion >= 0) {
      const s = filteredSuggestions[activeSuggestion];
      if (s) {
        setTags((prev: string) => {
          const currentTagList = prev
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean);
          if (currentTagList.length < TAG_LIMIT) {
            setError("");
            return prev ? prev.replace(/\s*,?$/, ", ") + s : s;
          } else {
            setError(`You can add up to ${TAG_LIMIT} tags only.`);
            return prev;
          }
        });
        setActiveSuggestion(-1);
      }
      e.preventDefault();
    }
  };

  const addSuggestion = (s: string) => {
    setTags((prev) => {
      const currentTagList = prev
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
      if (currentTagList.length < TAG_LIMIT) {
        setError("");
        return prev ? prev.replace(/\s*,?$/, ", ") + s : s;
      } else {
        setError(`You can add up to ${TAG_LIMIT} tags only.`);
        return prev;
      }
    });
    setActiveSuggestion(-1);
  };

  return (
    <div>
      <Input
        value={tags}
        onChange={handleTagChange}
        onKeyDown={handleKeyDown}
        placeholder="e.g. react, typescript"
        disabled={disabled}
      />

      {tagSuggestions.length > 0 && filteredSuggestions.length > 0 && (
        <div className="mt-1 flex flex-wrap gap-2">
          {filteredSuggestions.map((s, idx) => (
            <button
              key={s}
              type="button"
              className={`bg-muted text-xs rounded px-2 py-0.5 hover:bg-primary/10 ${
                activeSuggestion === idx ? "ring-2 ring-primary" : ""
              }`}
              onClick={() => addSuggestion(s)}
              tabIndex={-1}
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
