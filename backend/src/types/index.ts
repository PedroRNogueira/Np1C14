export interface User {
  id: string;
  username: string;
  password: string;
}

export interface Ticket {
  userId: string;
}

export type SeatStatus = "free" | "occupied";

export interface Seat {
  id: string;
  row: string;
  number: number;
  status: SeatStatus;
  reservedBy?: string;
}

export interface StoreData {
  users: User[];
  tickets: Ticket[];
  seats: Seat[];
}
