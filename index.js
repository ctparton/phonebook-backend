const express = require('express')
const { response } = require('express')
const app = express()

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

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {
    response.send(`<p>Phonebook currently has ${persons.length} contacts as of <br /> ${new Date()}</p>`)
})

const PORT = 3001

app.listen(PORT, () => console.log("app started"))