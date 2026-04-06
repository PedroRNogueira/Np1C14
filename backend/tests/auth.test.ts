import { beforeEach, describe, expect, it } from "vitest";
import { register, login } from "../src/services/auth.service.js";
import { resetStore } from "../src/store/data.store.js";

beforeEach(() => {
  resetStore();
});

describe("auth.service", () => {
  describe("register", () => {
    it("cria usuário com sucesso", () => {
      const result = register("alice", "123");
      expect(result).toHaveProperty("id");
      expect(result.username).toBe("alice");
    });

    it("gera IDs únicos para cada usuário", () => {
      const r1 = register("alice", "111");
      const r2 = register("bob", "222");
      expect(r1.id).not.toBe(r2.id);
    });

    it("rejeita username duplicado", () => {
      register("alice", "123");
      expect(() => register("alice", "456")).toThrow("Username already exists");
    });

    it("rejeita username vazio", () => {
      expect(() => register("", "123")).toThrow("Username cannot be empty");
    });

    it("rejeita password vazio", () => {
      expect(() => register("alice", "")).toThrow("Password cannot be empty");
    });
  });

  describe("login", () => {
    it("retorna usuário com credenciais corretas", () => {
      register("alice", "123");
      const result = login("alice", "123");
      expect(result).toHaveProperty("id");
      expect(result.username).toBe("alice");
    });

    it("rejeita credenciais inválidas", () => {
      register("alice", "123");
      expect(() => login("alice", "errado")).toThrow("Invalid credentials");
      expect(() => login("naoexiste", "123")).toThrow("Invalid credentials");
    });
  });
});
