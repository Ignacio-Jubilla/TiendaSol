import "dotenv/config";
import cors from "cors";
import express from "express";
import { PedidosRouter } from "./controllers/PedidosController.js";
const app = express();
import middleware from "./utils/middleware.js";
import config from "./utils/config.js";

app.use(express.json());
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
      : true,
  }),
);

app.use("/api/pedidos", PedidosRouter)
app.get("/api/health", (req,res) =>{
    res.status(200).json({
        status: "ok",
        message: "Tienda sol API Health Check EXITOSO",
        timestamp: new Date().toLocaleString()
    });
});

app.get("/hello", (req, res) => {
  res.json({ message: "hello world" });
});

app.use(middleware.errorHandler)
app.use(middleware.unknownEndpoint)

const PORT = config.PORT;
app.listen(PORT, () => {
  console.log(`Backend escuchando en puerto ${PORT}`);
});
