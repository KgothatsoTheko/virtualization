// Express
const express = require('express')
const app = express()

// Routes
const routes = require('./routes/people')

// middleware
app.use(express.json())
app.use(routes)

// cors
const cors = require('cors')
const corsOption = {
    origin: 'http://localhost:4200',
    optionSuccessStatus: 200
}
app.use(cors(corsOption))

// ENV
const dotenv = require('dotenv')
dotenv.config()

// mongoose
const mongoose = require('mongoose')

const connectToMongoDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log("Server connected to MongoDb")
    } catch (error) {
        throw(error)
    }
}

// Listen to server
const PORT = 1717
app.listen(PORT, ()=> {
    connectToMongoDb()
    console.log(`Sever runnnng on port ${PORT}...`)
})