import { useState } from "react";
import { Member, User } from "../types";
import { saveUser } from "../utils/storage";

interface LoginProps {
  members: Member[];
  onLogin: (user: User) => void;
}

export default function Login({ members, onLogin }: LoginProps) {
  const [username, setUsername] = useState<string>("");
  const [role, setRole] = useState<"admin" | "manager" | "member">("member");

  const handleLogin = () => {
    if (username.trim()) {
      if (role === "admin" && username !== "admin") {
        alert('Only "admin" can log in as admin');
        return;
      }
      if (role !== "admin" && !members.find((m) => m.name === username)) {
        alert("Username must match a registered member");
        return;
      }
      const user: User = { username, role };
      saveUser(user);
      onLogin(user);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4 sm:p-6 bg-white rounded-xl shadow-lg max-w-md mx-auto">
      <h2 className="text-lg sm:text-xl font-semibold">Login</h2>
      <input
        type="text"
        value={username}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setUsername(e.target.value)
        }
        placeholder="Username"
        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
      />
      <select
        value={role}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
          setRole(e.target.value as "admin" | "manager" | "member")
        }
        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
      >
        <option value="admin">Admin</option>
        <option value="manager">Manager</option>
        <option value="member">Member</option>
      </select>
      <button
        onClick={handleLogin}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm sm:text-base"
      >
        Login
      </button>
    </div>
  );
}
