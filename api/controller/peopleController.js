const People = require('../models/people.js')
const brcypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const sendMail = require('../sendMail.js')
const { Readable } = require("stream")

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

            const payload = { ...req.body };
            // payload['fileId'] = pictureId;
            payload.password = hashPassword
            const newPerson = new People(payload)
            const result = await newPerson.save()
            const mailOptions = {
                from: {
                    name: "Kgothatso Theko",
                    address: "kgothatsotheko7@gmail.com"
                },
                to: payload.toString(),
                subject: "New Account Created",
                text: "Account successfully created",
                html: `<b>Your profile has successfully been created. Awaiting Verification.</b>`,
            };
            sendMail(mailOptions);
            res.status(201).send(result)

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
    },
    uploadFile: async (req, res) => {
        const { files } = req;

        let { fieldname, originalname, mimetype, buffer } = files[0]
        let newFile = new File({
            filename: originalname,
            contentType: mimetype,
            length: buffer.length,
            fileId: pictureId,
        })

        try {
            const uploadStream = bucket.openUploadStream(fieldname)
            const readBuffer = new Readable();
            readBuffer.push(buffer)
            readBuffer.push(null)

            const isUploaded = await new Promise((resolve, reject) => {
                readBuffer.pipe(uploadStream)
                    .on("finish", resolve("successfull"))
                    .on("error", reject("error occured while creating stream"))
            })

            newFile.id = uploadStream.id
            const savingResults = await newFile.save();
            if (!savingResults) {
                res.status(404).send("error occured while saving our work")
            }
            res.send({ file: savingResults, message: "file uploaded successfully" })
        } catch (error) {
            console.log('error', error)
        }
    },
    getFile: (req, res) => {
        const { id } = req.params;
        let downloadStream = bucket.openDownloadStream(new mongoose.Types.ObjectId(id))
        downloadStream.on("file", (file) => {
            res.set("Content-Type", file.contentType)
        })
        downloadStream.pipe(res)
    },
        
}