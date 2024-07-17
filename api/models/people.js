const mongoose = require('mongoose')
const Schema = require('mongoose')

const File = new mongoose.Schema({
    filename: { type: String, required: true },
    id: { type: String, required: true },
    contentType: { type: String, required: true },
    fileId: { type: String, required: true },
    length: { type: Number, required: true }
})

const License = new mongoose.Schema({
    licenseNumber: {type: String},
    valid: {type: String},
    issued: {type: String},
    code: {type: String},
    vehicleRestriction: {type: Number},
    firstIssued: {type: String},
})

const people = mongoose.Schema ({
    fullForeName: {type: String},
    lastName: {type: String},
    idNumber: {type: String, required:false},
    dateOfBirth: {type: String},
    age: {type: Number},
    citizenship: {type: String},
    gender: {type: String},
    license: License,
    email: {type: String, required: false, unique: true},
    password: {type: String, required: false},
    file: File,
})

module.exports = mongoose.model('People', people)