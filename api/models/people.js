const mongoose = require('mongoose')
const Schema = require('mongoose')

const File = new mongoose.Schema({
    filename: { type: String, required: true },
    id: { type: String, required: true },
    contentType: { type: String, required: true },
    fileId: { type: String, required: true },
    length: { type: Number, required: true }
})

const people = mongoose.Schema ({
    firstName: {type: String},
    lastName: {type: String},
    idNumber: {type: String, required:true},
    dateOfBirth: {type: String},
    age: {type: Number},
    citizenship: {type: String},
    gender: {type: String},
    licenseNumber: {type: String},
    valid: {type: String},
    issued: {type: String},
    code: {type: String},
    vehicleRestriction: {type: Number},
    firstIssue: {type: String},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: false,},
})

module.exports = mongoose.model('People', people)