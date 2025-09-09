import { useState, useEffect } from "react";

interface User {
  id: string;
  name: string;
}

// Default users
const defaultUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
  },
  {
    id: "2",
    name: "Jane Smith",
  },
  {
    id: "3",
    name: "Mike Johnson",
  },
];

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const storedUsers = localStorage.getItem("blogUsers");
        if (storedUsers) {
          setUsers(JSON.parse(storedUsers));
          return;
        }
      } catch (error) {
        console.warn("Failed to load users from localStorage:", error);
      }
    }

    setUsers(defaultUsers);
  }, []);

  return users;
}
