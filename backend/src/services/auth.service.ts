import { getStore, saveStore } from "../store/data.store.js";
import { User } from "../types/index.js";

export function register(username: string, password: string): { id: string; username: string } {
  if (!username || username.trim() === "") {
    throw new Error("Username cannot be empty");
  }
  if (!password || password.trim() === "") {
    throw new Error("Password cannot be empty");
  }

  const store = getStore();

  const existing = store.users.find((u) => u.username === username);
  if (existing) {
    throw new Error("Username already exists");
  }

  const id = `user-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  const user: User = { id, username, password };
  store.users.push(user);
  saveStore();

  return { id, username };
}

export function login(username: string, password: string): { id: string; username: string } {
  const store = getStore();

  const user = store.users.find((u) => u.username === username);
  if (!user || user.password !== password) {
    throw new Error("Invalid credentials");
  }

  return { id: user.id, username: user.username };
}
