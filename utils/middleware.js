const logger = require('../utils/logger')

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:', request.path)
  logger.info('Body:', request.body)
  logger.info('___')
  next()
}

const unknownEndpointHandler = (request, response, next) => {
  return response.status(404).json({ erros: [{ message: 'Unknown endpoint' }] })
  next()
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).json({ erros: [{ message: error.message }] })
  }

  if (error.name === 'ValidationError') {
    return response.status(400).json({ erros: [{ message: error.message }] })
  }

  response.status(400).json({ erros: [{ message: 'Something went wrong.' }] })
}

module.exports = { requestLogger, unknownEndpointHandler, errorHandler }