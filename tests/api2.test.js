const mongoose = require('mongoose')
const app = require('../app')
const supertest = require('supertest')
const helper = require('./test-helper')
const Boat = require('../models/boat')
const api = supertest(app)

beforeEach(async () => {
  await Boat.deleteMany({})
  for (let boat of helper.boatsData) {
    const boatObject = new Boat(boat)
    await boatObject.save()
  }
})

describe('when there are intially some boats', () => {
  test('boats are returned as JS0N', async () => {
    const response = await api.get('/api/boats')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all boats are returned', async () => {
    const response = await api.get('/api/boats')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body).toHaveLength(helper.boatsData.length)
  })

  test('a specific boat is within the returned boats', async () => {
    const boatsInDb = await helper.boatsInDb()
    const response = await api.get('/api/boats')
      .expect(200)
      .expect('Content-Type', /application\/json/)
    const names = response.body.map(boat => boat.name)
    expect(names).toContain(helper.boatsData[0].name)
  })
})

describe('fetching a single boat', () => {
  test('succeeds when given a valid id', async () => {
    const boatsInDb = await helper.boatsInDb()
    const response = await api.get(`/api/boats/${boatsInDb[0].id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

  })

  test('fails with statuscode 404 when given a nonexistent id', async () => {
    const nonExistentId = await helper.nonExistentId()
    const response = await api.get(`/api/boats/${nonExistentId}`)
      .expect(404)

  })

  test('fails with statuscode 400 when given a invalidId', async () => {
    const invalidId = 0
    const response = await api.get(`/api/boats/${invalidId}`)
      .expect(400)

  })
})

describe('addition of a new boat', () => {
  test('works when given valid data', async () => {
    const boatsAtStart = await helper.boatsInDb()
    const response = await api.post('/api/boats')
      .send(helper.validBoatData)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    const boatsAtEnd = await helper.boatsInDb()
    expect(boatsAtEnd).toHaveLength(boatsAtStart.length + 1)
  })

  test('fails with status code 400 when given invalid data', async () => {
    const boatsAtStart = await helper.boatsInDb()
    const response = await api.post('/api/boats')
      .send(helper.invalidBoatData)
      .expect(400)
    const boatsAtEnd = await helper.boatsInDb()
    expect(boatsAtEnd).toHaveLength(boatsAtStart.length)
  })
})

describe('deleting a boat', () => {
  test('succeeds given an id', async () => {
    const boatsAtStart = await helper.boatsInDb()
    await api.delete(`/api/boats/${boatsAtStart[0].id}`)
      .expect(204)
    const boatsAtEnd = await helper.boatsInDb()
    expect(boatsAtEnd).toHaveLength(boatsAtStart.length - 1)
  })
})

afterAll(async () => {
  mongoose.connection.close()
})