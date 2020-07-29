const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the following arguments: node mongo.js <password> <name> >number>')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url =
  `mongodb+srv://phonebook-app-user:${password}@cluster0.euwbo.mongodb.net/phonebook?retryWrites=true&w=majority`

console.log(`Connecting to DB`)
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const personSchema = new mongoose.Schema({
  name: String,
  number: Number
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
    name: name,
    number: number
})

if (process.argv.length > 3) {
    person.save().then(result => {
        console.log(`added ${name} ${number} to phonebook`)
        mongoose.connection.close()
      })
} else {
    console.log(`Printing contents of phonebook`)
    Person.find({}).then(result => {
        result.forEach(person => {
            console.log(person)
        })
        mongoose.connection.close()
    })
    
}
