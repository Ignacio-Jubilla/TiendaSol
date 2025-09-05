import "dotenv/config";
import express from "express";
import cors from "cors";
import { PedidosRouter } from "./controllers/PedidosController";
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
      : true,
  }),
);

app.use("/api/pedidos", PedidosRouter)

app.get("/hello", (req, res) => {
  res.json({ message: "hello world" });
});

app.listen(process.env.SERVER_PORT, () => {
  console.log(`Backend escuchando en puerto ${process.env.SERVER_PORT}`);
});
