import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import ticketRoutes from "./routes/ticket.routes.js";
import seatRoutes from "./routes/seat.routes.js";

const app = express();
const PORT = Number(process.env.PORT ?? 3001);

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/ticket", ticketRoutes);
app.use("/api/seats", seatRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
