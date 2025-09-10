const unknownEndpoint = (request, response) => {
  //the last middleware, this is why it doesn't have next()
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (err , req, res, next) => {
  return res.status(500).json({error: err.message})
  next(err)
}

export default{
  unknownEndpoint,
  errorHandler
}