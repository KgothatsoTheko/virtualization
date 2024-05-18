const mongoose = require('mongoose')
const Schema = require('mongoose')

const people = mongoose.Schema ({
    // profileImage: {
    //     type: String, required: false, default: "https://th.bing.com/th/id/OIP.Ln_qrnMeEWlR-sIzaHn2fAHaHa?rs=1&pid=ImgDetMain"
    // },

    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    idNumber: {
        type: String, required:true
    },
    dateOfBirth: {
        type: String
    },
    age: {
        type: Number
    },
    citizenship: {
        type: String
    },
    gender: {
        type: String
    },
    licenseNumber: {
        type: String
    },

    valid: {
        type: String
    },

    issued: {
        type: String
    },

    code: {
        type: String
    },

    vehicleRestriction: {
        type: Number
    },

    firstIssue: {
        type: String
    },

    email: {
        type: String, required: true, unique: true
    },
    // signiture: {
    //     type: String, required: false,
    // },
    password: {
        type: String, required: false,
    },
})

module.exports = mongoose.model('People', people)