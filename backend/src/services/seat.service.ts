import { getStore, saveStore } from "../store/data.store.js";
import { hasTicket, consumeTicket } from "./ticket.service.js";

export function getAllSeats() {
  return getStore().seats;
}

export function reserveSeat(seatId: string, userId: string): void {
  const store = getStore();

  const user = store.users.find((u) => u.id === userId);
  if (!user) {
    throw new Error("User not found");
  }

  const seat = store.seats.find((s) => s.id === seatId);
  if (!seat) {
    throw new Error("Seat not found");
  }

  if (seat.status === "occupied") {
    throw new Error("Seat is already occupied");
  }

  if (!hasTicket(userId)) {
    throw new Error("User has no active ticket");
  }

  seat.status = "occupied";
  seat.reservedBy = userId;
  consumeTicket(userId);
  saveStore();
}
