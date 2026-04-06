import { beforeEach, describe, expect, it } from "vitest";
import { register } from "../src/services/auth.service.js";
import { claimTicket, hasTicket } from "../src/services/ticket.service.js";
import { getAllSeats, reserveSeat } from "../src/services/seat.service.js";
import { resetStore } from "../src/store/data.store.js";

beforeEach(() => {
  resetStore();
});

describe("seat.service", () => {
  it("retorna 48 poltronas livres inicialmente", () => {
    const seats = getAllSeats();
    expect(seats).toHaveLength(48);
    expect(seats.every((s) => s.status === "free")).toBe(true);
  });

  it("reserva poltrona livre com ticket válido", () => {
    const user = register("alice", "123");
    claimTicket(user.id);
    reserveSeat("A1", user.id);
    const seats = getAllSeats();
    const seat = seats.find((s) => s.id === "A1")!;
    expect(seat.status).toBe("occupied");
  });

  it("consume o ticket após reserva bem-sucedida", () => {
    const user = register("alice", "123");
    claimTicket(user.id);
    reserveSeat("A1", user.id);
    expect(hasTicket(user.id)).toBe(false);
  });

  it("permite claim de ticket após consumir ticket anterior", () => {
    const user = register("alice", "123");
    claimTicket(user.id);
    reserveSeat("A1", user.id);
    expect(() => claimTicket(user.id)).not.toThrow();
    expect(hasTicket(user.id)).toBe(true);
  });

  it("rejeita reserva sem ticket", () => {
    const user = register("alice", "123");
    expect(() => reserveSeat("A1", user.id)).toThrow("User has no active ticket");
  });

  it("rejeita poltrona já ocupada", () => {
    const user = register("alice", "123");
    claimTicket(user.id);
    reserveSeat("A1", user.id);
    const user2 = register("bob", "456");
    claimTicket(user2.id);
    expect(() => reserveSeat("A1", user2.id)).toThrow("Seat is already occupied");
  });

  it("rejeita seatId inexistente", () => {
    const user = register("alice", "123");
    claimTicket(user.id);
    expect(() => reserveSeat("Z9", user.id)).toThrow("Seat not found");
  });
});
