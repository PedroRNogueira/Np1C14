import { getStore, saveStore } from "../store/data.store.js";
import { Ticket } from "../types/index.js";

export function claimTicket(userId: string): void {
  const store = getStore();

  const user = store.users.find((u) => u.id === userId);
  if (!user) {
    throw new Error("User not found");
  }

  const existingTicket = store.tickets.find((t) => t.userId === userId);
  if (existingTicket) {
    throw new Error("User already has an active ticket");
  }

  const ticket: Ticket = { userId };
  store.tickets.push(ticket);
  saveStore();
}

export function hasTicket(userId: string): boolean {
  const store = getStore();
  return store.tickets.some((t) => t.userId === userId);
}

export function consumeTicket(userId: string): void {
  const store = getStore();
  store.tickets = store.tickets.filter((t) => t.userId !== userId);
  saveStore();
}
