const People = require('../models/people.js')
const brcypt = require('bcrypt')
const jwt = require('jsonwebtoken')

module.exports = {
    registerRoute: async (req, res) => {
        try {

            // Check if a person with the given idNumber already exists
            const existingPerson = await People.findOne({ idNumber: req.body.idNumber });
            if (existingPerson) {
                return res.status(400).send("User already registered with this ID number, Sign In!");
            }

            // hash password
            const salt = await brcypt.genSalt(10)
            const hashPassword = await brcypt.hash(req.body.password, salt)

            // Add new User
            const newPerson = new People({
                // profileImage: req.body.profileImage,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                idNumber: req.body.idNumber,
                dateOfBirth: req.body.dateOfBirth,
                age: req.body.age,
                citizenship: req.body.citizenship,
                gender: req.body.gender,
                licenseNumber: req.body.licenseNumber,
                valid: req.body.valid,
                issued: req.body.issued,
                code: req.body.code,
                vehicleRestriction: req.body.vehicleRestriction,
                firstIssue: req.body.firstIssue,
                email: req.body.email,
                // signiture: req.body.signiture,
                password: hashPassword,

            })
            await newPerson.save()
            res.status(200).send('New User Added Successfully')
        } catch (error) {
            return res.status(500).send("Intenal Server Error")
        }
    },
    loginRoute: async (req, res) => {
        try {
            const existingPerson = await People.findOne({ idNumber: req.body.idNumber });

            if(!existingPerson) {
                return res.status(404).send("User is not found")
            }

            const passwordCheck = await brcypt.compare(req.body.password, existingPerson.password)
            if(!passwordCheck) {
                return res.status(401).send('Password is Incorrect')
            }

            const token = jwt.sign({
                id: existingPerson._id,
            }, process.env.JWT_SECRET, {expiresIn: "10m"})

            res.cookie("access_token", token, {httpOnly: true, secure: true, sameSite: "Strict"});
            res.status(200).json({
                status: 200,
                message: "Login Success",
                data: existingPerson
            })

        } catch (error) {
            console.error(error)
            return res.status(500).send("Internal Server Error")
        }
    }
        
}