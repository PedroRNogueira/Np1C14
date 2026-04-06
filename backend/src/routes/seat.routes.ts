import { Router } from "express";
import { getAllSeats, reserveSeat } from "../services/seat.service.js";

const router = Router();

router.get("/", (_req, res) => {
  const seats = getAllSeats();
  res.status(200).json(seats);
});

router.post("/:id/reserve", (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    reserveSeat(id, userId);
    res.status(200).json({ message: "Seat reserved" });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    if (message.includes("not found")) {
      res.status(404).json({ error: message });
    } else {
      res.status(400).json({ error: message });
    }
  }
});

export default router;
