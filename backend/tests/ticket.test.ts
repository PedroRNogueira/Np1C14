import { beforeEach, describe, expect, it } from "vitest";
import { register } from "../src/services/auth.service.js";
import { claimTicket, hasTicket, consumeTicket } from "../src/services/ticket.service.js";
import { resetStore } from "../src/store/data.store.js";

beforeEach(() => {
  resetStore();
});

describe("ticket.service", () => {
  it("cria ticket para usuário sem ticket", () => {
    const user = register("alice", "123");
    claimTicket(user.id);
    expect(hasTicket(user.id)).toBe(true);
  });

  it("retorna hasTicket:true após claim", () => {
    const user = register("alice", "123");
    claimTicket(user.id);
    expect(hasTicket(user.id)).toBe(true);
  });

  it("retorna hasTicket:false para usuário sem ticket", () => {
    const user = register("alice", "123");
    expect(hasTicket(user.id)).toBe(false);
  });

  it("rejeita claim de usuário com ticket ativo", () => {
    const user = register("alice", "123");
    claimTicket(user.id);
    expect(() => claimTicket(user.id)).toThrow("User already has an active ticket");
  });

  it("rejeita claim de usuário inexistente", () => {
    expect(() => claimTicket("user-inexistente")).toThrow("User not found");
  });

  it("retorna false para ticket de usuário inexistente", () => {
    expect(hasTicket("user-inexistente")).toBe(false);
  });
});
