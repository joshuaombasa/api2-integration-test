const boatsRouter = require('express').Router()
const Boat = require('../models/boat')

boatsRouter.get('/', async (request, response, next) => {

  try {
    const boats = await Boat.find({})
    response.json(boats)
  } catch (error) {
    next(error)
  }
})

boatsRouter.get('/:id', async (request, response, next) => {

  try {
    const boat = await Boat.findById(request.params.id)
    if (!boat) {
      return response.sendStatus(404)
    }
    response.json(boat)
  } catch (error) {
    next(error)
  }
})

boatsRouter.post('/', async (request, response, next) => {

  const { name, price, type } = request.body
  const boatObject = new Boat({ name, price, type })
  try {
    const savedBoat = await boatObject.save()
    response.status(201).json({ savedBoat })
  } catch (error) {
    next(error)
  }
})

boatsRouter.put('/', async (request, response, next) => {

  const { name, price, type } = request.body

  try {
    const updatedUser = await Boat.findByIdAndUpdate(
      request.params.id,
      { name, price, type },
      { new: true })
    response.status(200).json({ updatedUser })
  } catch (error) {
    next(error)
  }
})

boatsRouter.delete('/:id', async (request, response, next) => {
  
  try {
    await Boat.findByIdAndDelete(request.params.id)
    response.sendStatus(204)
  } catch (error) {
    next(error)
  }
})

module.exports = boatsRouter