function normalizeBaseUrl(url: string): string {
  return url.replace(/\/$/, "");
}

const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();
const BASE_URL = import.meta.env.DEV
  ? "/api"
  : configuredApiUrl
    ? normalizeBaseUrl(configuredApiUrl)
    : "";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  if (!BASE_URL) {
    throw new Error("VITE_API_URL is not configured for the production frontend.");
  }

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
