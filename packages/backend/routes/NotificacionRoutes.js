import express from 'express'
import asyncHandler from 'express-async-handler'

const notificacionesRouter = express.Router()
import { NotificacionesController } from '../controllers/NotificacionesController.js'
import { NotificacionService } from '../services/NotificacionService.js'
import { NotificacionesRepository } from '../models/repositories/NotificacionesRepository.js'

const notificacionesRepository = new NotificacionesRepository()
const notificacionService = new NotificacionService(notificacionesRepository)
const notificacionesController = new NotificacionesController(notificacionService)

notificacionesRouter.get('/', asyncHandler(async (req, res) => {
    notificacionesController.obtenerNotificaciones(req, res)
}))

notificacionesRouter.put('/:id/leida', asyncHandler(async (req, res) => {
    notificacionesController.marcarNotificacionLeida(req, res)
}))

export default notificacionesRouter