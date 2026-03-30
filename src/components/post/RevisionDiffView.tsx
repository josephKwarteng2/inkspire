import React from "react";

function diffText(a: string, b: string) {
  if (a === b) return <span>{a}</span>;

  const aLines = a.split(/\r?\n/);
  const bLines = b.split(/\r?\n/);
  const result: React.ReactNode[] = [];
  let i = 0,
    j = 0;
  while (i < aLines.length || j < bLines.length) {
    if (aLines[i] === bLines[j]) {
      result.push(
        <span key={i + "-" + j}>
          {aLines[i]}
          <br />
        </span>
      );
      i++;
      j++;
    } else if (aLines[i] && (!bLines[j] || !bLines.includes(aLines[i]))) {
      result.push(
        <span key={i + "-r"} className="bg-red-100 text-red-700 line-through">
          {aLines[i]}
          <br />
        </span>
      );
      i++;
    } else if (bLines[j] && (!aLines[i] || !aLines.includes(bLines[j]))) {
      result.push(
        <span key={j + "-a"} className="bg-green-100 text-green-700">
          {bLines[j]}
          <br />
        </span>
      );
      j++;
    } else {
      result.push(
        <span key={i + "-" + j}>
          {aLines[i] || bLines[j]}
          <br />
        </span>
      );
      i++;
      j++;
    }
  }
  return <span>{result}</span>;
}

export function RevisionDiffView({
  revision,
  current,
}: {
  revision: import("@/types/post").PostRevision;
  current: import("@/types/post").Post | null;
}) {
  if (!current) return null;
  const fields = [
    { label: "Title", key: "title" },
    { label: "Slug", key: "slug" },
    { label: "Author", key: "author" },
    { label: "Status", key: "status" },
    { label: "Category", key: "category" },
    { label: "Tags", key: "tags" },
    { label: "Content", key: "content" },
  ];
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs text-muted-foreground mb-2">
        <span>Revision ID: {revision.id}</span>
        <span>
          {revision.updatedAt
            ? new Date(revision.updatedAt).toLocaleString()
            : new Date(revision.createdAt).toLocaleString()}
        </span>
      </div>
      {fields.map(({ label, key }) => {
        let revVal = (revision as any)[key];
        let curVal = (current as any)[key];
        if (key === "tags") {
          revVal = (revVal || []).join(", ");
          curVal = (curVal || []).join(", ");
        }
        if (key === "content") {
          return (
            <div key={key}>
              <span className="font-semibold">{label}:</span>
              <div className="mt-1 p-2 bg-background border rounded text-xs whitespace-pre-line">
                {diffText(revVal, curVal)}
              </div>
            </div>
          );
        }
        const changed = revVal !== curVal;
        return (
          <div key={key}>
            <span className="font-semibold">{label}:</span>{" "}
            <span
              className={
                changed
                  ? "bg-yellow-100 text-yellow-800 px-1 rounded"
                  : undefined
              }
            >
              {revVal}
            </span>
            {changed && (
              <span className="ml-2 text-xs text-muted-foreground">
                (current: {curVal})
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
