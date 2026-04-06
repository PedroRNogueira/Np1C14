import { Router } from "express";
import { claimTicket, hasTicket } from "../services/ticket.service.js";

const router = Router();

router.get("/status", (req, res) => {
  const userId = req.query.userId as string;
  const result = hasTicket(userId);
  res.status(200).json({ hasTicket: result });
});

router.post("/claim", (req, res) => {
  try {
    const { userId } = req.body;
    claimTicket(userId);
    res.status(201).json({ message: "Ticket claimed" });
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
