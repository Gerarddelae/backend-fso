require("dotenv").config()
const express = require("express")
const morgan = require("morgan")
const cors = require("cors")
const app = express()

const Person = require("./models/person")

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" })
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" })
}

app.use(express.json())
app.use(cors())
app.use(express.static("build"))

morgan.token("data", (req) => {
  const { body } = req

  return JSON.stringify(body)
})
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :data")
)

let persons = []

app.get("/", (request, response) => {
  response.send("<h1>hola mundo!</h1>")
})

app.get("/info", (request, response, next) => {
  Person.countDocuments({}).then(result => {
    response.send(
      `Phonebook has info for ${
        result
      } people <br><br> ${new Date().toString()}`)
  }
  ).catch(error => next(error))
})

app.post("/api/persons", (request, response, next) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "content missing",
    })
  }

  if (persons.some((person) => person.name === body.name)) {
    return response.status(400).json({
      error: "content missing",
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save().then((savedPerson) => {
    response.json(savedPerson)
  }).catch(error => next(error))
})

app.get("/api/persons", (request, response) => {
  Person.find({}).then((person) => {
    response.json(person)
  })
})

app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person)
      } else {
        response.status(400).end()
      }
    })
    .catch((error) => next(error))
})

app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch((error) => next(error))
})

app.put("/api/persons/:id", (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number,
    id: request.params.id,
  }

  Person.findByIdAndUpdate(request.params.id, person, {
    runValidators: true,
    context: "query",
    new: true,
  })
    .then((updatedPerson) => {
      response.json(updatedPerson)
    })
    .catch((error) => next(error))
})

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
