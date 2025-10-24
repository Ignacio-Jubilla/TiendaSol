import request from "supertest";
import express from "express";
import asyncHandler from "express-async-handler";
import { jest } from "@jest/globals";

import { PedidoService } from "../services/PedidoService.js";
import { PedidosController } from "../controllers/PedidosController.js";

// ---- Mocks ----
const mockPedidoRepo = {
  save: jest.fn(),
  findById: jest.fn(),
  update: jest.fn(),
};

const mockProductosRepo = {
  findById: jest.fn()
};

const mockUsuarioRepo = {
  findById: jest.fn()
};

// Mock productos
mockProductosRepo.findById.mockResolvedValue({
  _id: "prod1",
  estaDisponible: jest.fn().mockReturnValue(true)
});

// Service y Controller
const pedidoService = new PedidoService(mockPedidoRepo, mockUsuarioRepo, mockProductosRepo);
const pedidosController = new PedidosController(pedidoService);

// Router de pruebas (PATCH para cancelar)
const pedidosRouter = express.Router();
pedidosRouter.post("/", asyncHandler(async (req, res) => pedidosController.crearPedido(req, res)));
pedidosRouter.patch("/:id/cancelado", asyncHandler(async (req, res) => pedidosController.cancelarPedido(req, res)));
pedidosRouter.patch("/:id/enviado", asyncHandler(async (req, res) => pedidosController.marcarEnviado(req, res)));

// App de tests
const app = express();
app.use(express.json());
app.use("/api/pedidos", pedidosRouter);

// ---- Tests ----
describe("Pedidos - Integración", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Crear pedido exitosamente", async () => {
    const body = {
      compradorId: "64f8c0a1e1d2a9b123456789",
      items: [{ productoId: "prod1", cantidad: 2, precioUnitario: 100 }],
      moneda: "USD",
      calle: "Calle Falsa",
      altura: "123",
      codigoPostal: "1000",
      ciudad: "Ciudad",
      provincia: "Provincia",
      pais: "Pais"
    };

    const mockPedido = { ...body, _id: "pedido1" };
    mockPedidoRepo.save.mockResolvedValue(mockPedido);
    mockUsuarioRepo.findById.mockResolvedValue({ _id: body.compradorId, name: "Juan" });

    const res = await request(app)
      .post("/api/pedidos")
      .send(body)
      .set("Content-Type", "application/json");

    expect(res.status).toBe(201);
    expect(res.body._id).toBe("pedido1");
    expect(mockPedidoRepo.save).toHaveBeenCalled();
    expect(mockUsuarioRepo.findById).toHaveBeenCalledWith(body.compradorId);
  });

  test("Error al crear pedido sin comprador", async () => {
    const body = {
      items: [{ productoId: "prod1", cantidad: 2, precioUnitario: 100 }],
      moneda: "USD",
      calle: "Calle Falsa",
      altura: "123",
      codigoPostal: "1000",
      ciudad: "Ciudad",
      provincia: "Provincia",
      pais: "Pais"
    };

    const res = await request(app)
      .post("/api/pedidos")
      .send(body)
      .set("Content-Type", "application/json");

    expect(res.status).toBe(400);
    expect(res.body[0].message).toContain("Id de comprador no válido");
  });

  test("Cancelar pedido exitosamente", async () => {
    const pedidoId = "64f8c0a1e1d2a9b12345678a";
    const motivo = "Cliente canceló";

    mockPedidoRepo.findById.mockResolvedValue({ _id: pedidoId, estado: "CONFIRMADO", comprador: "usuario1", historialEstados: [], total: 100 });
    mockUsuarioRepo.findById.mockResolvedValue({ _id: "usuario1" });
    mockPedidoRepo.update.mockResolvedValue(true);

    const res = await request(app)
      .patch(`/api/pedidos/${pedidoId}/cancelado`)
      .send({ motivo })
      .set("Content-Type", "application/json");

    expect(res.status).toBe(200);
    expect(res.body.estado).toBe("CANCELADO");
    expect(res.body.motivo).toBe(motivo);
  });

  test("Error al cancelar pedido sin motivo", async () => {
    const pedidoId = "64f8c0a1e1d2a9b12345678a";

    const res = await request(app)
      .patch(`/api/pedidos/${pedidoId}/cancelado`)
      .send({})
      .set("Content-Type", "application/json");

    expect(res.status).toBe(400);
    expect(res.body[0].message).toContain("Motivo es obligatorio");
  });

  test("Error al crear pedido con items vacíos", async () => {
    const body = {
      compradorId: "64f8c0a1e1d2a9b123456789",
      items: [],
      moneda: "USD",
      calle: "Calle Falsa",
      altura: "123",
      codigoPostal: "1000",
      ciudad: "Ciudad",
      provincia: "Provincia",
      pais: "Pais"
    };

    const res = await request(app)
      .post("/api/pedidos")
      .send(body)
      .set("Content-Type", "application/json");

    expect(res.status).toBe(400);
    expect(res.body[0].message).toContain("Debe haber al menos un item");
  });
});