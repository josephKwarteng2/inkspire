import * as React from "react";
import { Input } from "@/components/ui/input";

interface InlineEditProps {
  value: string;
  onSave: (val: string) => void;
  className?: string;
}

const InlineEdit: React.FC<InlineEditProps> = ({
  value,
  onSave,
  className,
}) => {
  const [editing, setEditing] = React.useState(false);
  const [val, setVal] = React.useState(value);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    setVal(value);
  }, [value]);

  React.useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editing]);

  const handleSave = () => {
    if (val !== value) onSave(val);
    setEditing(false);
  };

  return editing ? (
    <Input
      ref={inputRef}
      value={val}
      onChange={(e) => setVal(e.target.value)}
      onBlur={handleSave}
      onKeyDown={(e) => {
        if (e.key === "Enter") handleSave();
        if (e.key === "Escape") setEditing(false);
      }}
      className={className}
    />
  ) : (
    <span
      className={className + " cursor-pointer hover:underline"}
      onClick={() => setEditing(true)}
      title="Click to edit"
    >
      {value}
    </span>
  );
};

export default InlineEdit;
