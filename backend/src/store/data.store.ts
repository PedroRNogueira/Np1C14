import fs from "fs";
import path from "path";
import { StoreData } from "../types/index.js";

const DATA_FILE = path.resolve("data.json");

const ROWS = ["A", "B", "C", "D", "E", "F"];
const COLS = 8;

function generateSeats(): StoreData["seats"] {
  const seats: StoreData["seats"] = [];
  for (const row of ROWS) {
    for (let i = 1; i <= COLS; i++) {
      seats.push({ id: `${row}${i}`, row, number: i, status: "free" });
    }
  }
  return seats;
}

function loadFromFile(): StoreData | null {
  try {
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(raw) as StoreData;
  } catch {
    return null;
  }
}

function saveToFile(data: StoreData): void {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
}

let store: StoreData = {
  users: [],
  tickets: [],
  seats: generateSeats(),
};

const loaded = loadFromFile();
if (loaded) {
  if (loaded.users.length > 0) store.users = loaded.users;
  if (loaded.tickets?.length > 0) store.tickets = loaded.tickets;
  if (loaded.seats.some((s) => s.status === "occupied")) {
    store.seats = loaded.seats;
  }
}

export function getStore(): StoreData {
  return store;
}

export function saveStore(): void {
  saveToFile(store);
}

export function resetStore(): void {
  store.users = [];
  store.tickets = [];
  store.seats = generateSeats();
}
