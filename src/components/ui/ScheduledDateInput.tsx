import { Input } from "@/components/ui/input";

interface ScheduledDateInputProps {
  scheduledDate: string;
  setScheduledDate: (date: string) => void;
}

export const ScheduledDateInput: React.FC<ScheduledDateInputProps> = ({
  scheduledDate,
  setScheduledDate,
}) => (
  <div>
    <label className="block text-sm font-bold mb-1">
      Scheduled Date & Time
    </label>
    <Input
      type="datetime-local"
      value={scheduledDate}
      onChange={(e) => setScheduledDate(e.target.value)}
      required
    />
  </div>
);
