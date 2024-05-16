// Express
const express = require('express')
const app = express()

// Routes

// middleware
app.use(express.json())

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
app.listen('1717', ()=> {
    connectToMongoDb()
    console.log('Sever runnnng...')
})