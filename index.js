const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const { response } = require('express')
const Person = require('./models/person')

const app = express()
app.use(express.static('build'))
app.use(cors())
app.use(express.json())

morgan.token('body', req => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/', (request, response ) => {
    response.send('<p>Hello World</p>')
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then(person => {
            if (person) {
                response.json(person)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => {
            console.log(error)
            next(error)
        })

})
app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.get('/info', (request, response) => {
    Person.find({}).then(person => {
        response
        .send(`<p>Phonebook currently has ${person.length} contacts as of <br /> ${new Date()}</p>`)})
})


app.delete('/api/persons/:id', (request, response) => {
    Person.findByIdAndDelete(request.params.id).then(result => {
        response.status(204).end()
    })
    
})

app.post('/api/persons', (request, response, next) => {
    const body = request.body
    const person = new Person({
        name: body.name,
        number: body.number
    })
    person.save()
        .then(result => response.json(result)) 
        .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body
    const person = {
        name: body.name,
        number: body.number
    }
    Person.findByIdAndUpdate(request.params.id, person, {new: true})
        .then(result => {
            console.log(`Contact named ${body.name} already exists in phonebook`)
            response.json(result)
        })
        .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
    console.log(error)
    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
      } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
      }
    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001

app.listen(PORT, () => console.log("app started"))