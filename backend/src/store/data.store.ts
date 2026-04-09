import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { StoreData } from "../types/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DEFAULT_DATA_FILE = path.resolve(__dirname, "../../data.json");
const DATA_FILE = process.env.DATA_FILE_PATH
  ? path.resolve(process.cwd(), process.env.DATA_FILE_PATH)
  : DEFAULT_DATA_FILE;

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
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
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
