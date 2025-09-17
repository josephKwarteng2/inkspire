import { useUserRole } from "@/context/UserRoleContext";
import type { UserRole } from "@/context/UserRoleContext";

const roles: UserRole[] = ["admin", "reader"];

export function UserRoleDropdown({ className }: { className?: string }) {
  const { role, setRole } = useUserRole();
  return (
    <select
      className={
        className ||
        "rounded border px-2 py-1 text-sm bg-background text-foreground border-border focus:outline-none focus:ring-2 focus:ring-primary"
      }
      value={role}
      onChange={(e) => setRole(e.target.value as UserRole)}
      aria-label="Change user role"
    >
      {roles.map((r) => (
        <option key={r} value={r}>
          {r.charAt(0).toUpperCase() + r.slice(1)}
        </option>
      ))}
    </select>
  );
}
