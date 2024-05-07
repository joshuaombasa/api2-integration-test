const Boat = require('../models/boat')

const boatsData = [
  {
    name: 'boat1',
    price: 100,
    type: 'basic',
  },
  {
    name: 'boat2',
    price: 200,
    type: 'luxury',
  },
  {
    name: 'boat3',
    price: 300,
    type: 'classic',
  },
]

const boatsInDb = async () => {
  const boats = await Boat.find({})
  return boats.map(boat => boat.toJSON())
}

const nonExistentId = async () => {
  const boatObject = new Boat({
    name: 'boat4',
    price: 400,
    type: 'royal',
  })

  const savedBoat = await boatObject.save()
  await Boat.findByIdAndDelete(savedBoat.id)
  return savedBoat.id.toString()
}

const validBoatData = {
  name: 'boat5',
  price: 500,
  type: 'sub',
}

const invalidBoatData = {
  name: 'boat5',
  type: 'sub',
}

module.exports = { boatsData, boatsInDb, nonExistentId, validBoatData , invalidBoatData}