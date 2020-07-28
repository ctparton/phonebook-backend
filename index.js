const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const { response } = require('express')

const app = express()
app.use(cors())
app.use(express.json())

morgan.token('body', req => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
    {
        name: "Callum",
        number: "078050500",
        id: 1
    }
]
app.get('/', (request, response ) => {
    response.send('<p>Hello World</p>')
})

app.get('/api/persons/:id', (request, response) => {
    id = Number(request.params.id) // Converted to number for comparisons
    contact = persons.find(person => person.id === id)
    if (contact) {
        response.json(contact)
    } else {
        response.status(404).end()
    }

})
app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {
    response.send(`<p>Phonebook currently has ${persons.length} contacts as of <br /> ${new Date()}</p>`)
})

app.delete('/api/persons/:id', (request, response) => {
    id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const generateId = () => {
        min = Math.ceil(0);
        max = Math.floor(persons.length * 5000);
        return Math.floor(Math.random() * (max - min)) + min;
    }
    const body = request.body
    if (!body.name || !body.number) {
        return response.status(400).json({
            error: "request body must contain name and number"
        })
    } else if (persons.find(person => person.name === body.name)) {
        return response.status(400).json({
            error: `Contact named ${body.name} already exists in phonebook`
        })
    }
    const newContact = {...body, id: generateId()}
    persons = persons.concat(newContact)
    response.json(newContact)

})

const PORT = 3001

app.listen(PORT, () => console.log("app started"))