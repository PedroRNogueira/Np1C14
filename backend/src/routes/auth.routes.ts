import { Router } from "express";
import { register, login } from "../services/auth.service.js";

const router = Router();

router.post("/register", (req, res) => {
  try {
    const { username, password } = req.body;
    const result = register(username, password);
    res.status(201).json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    if (message.includes("already exists")) {
      res.status(409).json({ error: message });
    } else {
      res.status(400).json({ error: message });
    }
  }
});

router.post("/login", (req, res) => {
  try {
    const { username, password } = req.body;
    const result = login(username, password);
    res.status(200).json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(401).json({ error: message });
  }
});

export default router;
