require('dotenv').config()
const mongoose = require('mongoose')
mongoose.set('useFindAndModify', false)

const conn = process.env.MONGO_URI

console.log(`Connecting to DB`)
mongoose
    .connect(conn, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(result => {console.log(`Connection to ${conn} successful`)})
    .catch(error => console.log(`${error} connection unsuccessful`))

const personSchema = new mongoose.Schema({
  name: String,
  number: Number
})

personSchema.set('toJSON', {
    transform: (document, returnedObject)  => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v 
    }
})

module.exports = mongoose.model('Person', personSchema)