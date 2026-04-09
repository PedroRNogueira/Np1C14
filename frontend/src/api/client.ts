const DEFAULT_PRODUCTION_API_URL = "https://cinema-app-backend-pedrornogueira.onrender.com/api";

function normalizeBaseUrl(url: string): string {
  return url.replace(/\/$/, "");
}

const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();
const BASE_URL = normalizeBaseUrl(
  configuredApiUrl || (import.meta.env.DEV ? "/api" : DEFAULT_PRODUCTION_API_URL),
);

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Request failed");
  }
  return data;
}

export function registerReq(username: string, password: string) {
  return request<{ id: string; username: string }>("/auth/register", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}

export function loginReq(username: string, password: string) {
  return request<{ id: string; username: string }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}

export function getTicketStatus(userId: string) {
  return request<{ hasTicket: boolean }>(`/ticket/status?userId=${userId}`);
}

export function claimTicketReq(userId: string) {
  return request<{ message: string }>("/ticket/claim", {
    method: "POST",
    body: JSON.stringify({ userId }),
  });
}

export function getSeats() {
  return request<SeatData[]>("/seats");
}

export function reserveSeatReq(seatId: string, userId: string) {
  return request<{ message: string }>(`/seats/${seatId}/reserve`, {
    method: "POST",
    body: JSON.stringify({ userId }),
  });
}

export interface SeatData {
  id: string;
  row: string;
  number: number;
  status: "free" | "occupied";
  reservedBy?: string;
}
