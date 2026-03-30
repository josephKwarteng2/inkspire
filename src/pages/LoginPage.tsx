import React from "react";
import { useNavigate } from "react-router-dom";
import { useUserRole } from "@/context/UserRoleContext";
import type { UserRole } from "@/context/UserRoleContext";

const roles: UserRole[] = ["admin", "reader"];

export default function LoginPage() {
  const { setRole } = useUserRole();
  const [selectedRole, setSelectedRole] = React.useState<UserRole>("reader");
  const [username, setUsername] = React.useState("");
  const navigate = useNavigate();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setRole(selectedRole);
    localStorage.setItem("username", username);
    if (selectedRole === "admin") {
      navigate("/admin/dashboard", { replace: true });
    } else {
      navigate("/", { replace: true });
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <form
        onSubmit={handleSubmit}
        className="bg-card p-8 rounded-lg shadow-md w-full max-w-sm flex flex-col gap-6 border border-border"
      >
        <h2 className="text-2xl font-bold mb-2 text-center">Sign In</h2>
        <div>
          <label htmlFor="username" className="block text-sm font-medium mb-1">
            Username
          </label>
          <input
            className="w-full px-3 py-2 border border-border rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="Enter your name"
          />
        </div>
        <div>
          <label htmlFor="role" className="block text-sm font-medium mb-1">
            Role
          </label>
          <select
            className="w-full px-3 py-2 border border-border rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value as UserRole)}
          >
            {roles.map((r) => (
              <option key={r} value={r}>
                {r.charAt(0).toUpperCase() + r.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-primary text-primary-foreground rounded font-semibold hover:bg-primary/90 transition"
        >
          Sign In
        </button>
      </form>
    </div>
  );
}
