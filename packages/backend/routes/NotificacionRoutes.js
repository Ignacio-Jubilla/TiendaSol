import express from 'express'
import asyncHandler from 'express-async-handler'

const notificacionesRouter = express.Router()
import { NotificacionesController } from '../controllers/NotificacionesController.js'
import { NotificacionService } from '../services/NotificacionService.js'
import { NotificacionesRepository } from '../models/repositories/NotificacionesRepository.js'
import { UsuarioRepository } from '../models/repositories/UsuariosRepository.js'

const usuarioRepository = new UsuarioRepository()
const notificacionesRepository = new NotificacionesRepository()
const notificacionService = new NotificacionService(notificacionesRepository, usuarioRepository)
const notificacionesController = new NotificacionesController(notificacionService)

notificacionesRouter.get('/', asyncHandler(async (req, res) => {
    return await notificacionesController.obtenerNotificaciones(req, res)
}))

notificacionesRouter.patch('/:id/leida', asyncHandler(async (req, res) => {
    return await notificacionesController.marcarNotificacionLeida(req, res)
}))

export default notificacionesRouter