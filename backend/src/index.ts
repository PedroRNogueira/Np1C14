import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import ticketRoutes from "./routes/ticket.routes.js";
import seatRoutes from "./routes/seat.routes.js";

const app = express();
const PORT = Number(process.env.PORT ?? 3001);
const HOST = process.env.HOST ?? "0.0.0.0";

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/ticket", ticketRoutes);
app.use("/api/seats", seatRoutes);

app.listen(PORT, HOST, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
});
