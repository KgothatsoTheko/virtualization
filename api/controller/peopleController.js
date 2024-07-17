const People = require('../models/people.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sendMail = require('../sendMail.js');
const { Readable } = require('stream');
const { MongoClient, GridFSBucket } = require('mongodb');
const mongoose = require('mongoose');
const multer = require('multer');

// Initialize multer for file handling
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Initialize GridFSBucket after MongoDB connection is established
mongoose.connection.on('connected', () => {
  const client = new MongoClient(process.env.MONGO_URL);
  client.connect().then(() => {
    bucket = new GridFSBucket(client.db(), {
      bucketName: 'uploads'
    });
    console.log('GridFSBucket initialized');
  }).catch(err => {
    console.error('Error initializing GridFSBucket', err);
  });
});

let bucket;

module.exports = {
  defaultRoute: async (req, res) => {
    res.send('Welcome to SA Database');
  },
  registerRoute: async (req, res) => {
    try {
      // Check if a person with the given idNumber already exists
      const existingPerson = await People.findOne({ idNumber: req.body.idNumber });
      if (existingPerson) {
        return res.status(400).send("User already registered with this ID number, Sign In!");
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(req.body.password, salt);

      const payload = { ...req.body };
      payload.password = hashPassword;
      const newPerson = new People(payload);
      const result = await newPerson.save();
      const mailOptions = {
        from: {
          name: "Kgothatso Theko",
          address: "kgothatsotheko7@gmail.com"
        },
        to: payload.email.toString(),
        subject: "RSA Virtualization Profile Created",
        text: "Account successfully created",
        html: `<h3>Welcome ${payload.fullForeName.toString()},</h3>
          <blockquote>Your profile has successfully been created. Awaiting verification and validating your information with South African Government Department of Home Affairs (DHA) and Transport.</blockquote><br/>
          <footer> KTK Virtualization™️. All rights reserved.</footer>`,
      };
      sendMail(mailOptions);
      res.status(201).send(result);

    } catch (error) {
      return res.status(500).send("Internal Server Error");
    }
  },
  loginRoute: async (req, res) => {
    try {
      const existingPerson = await People.findOne({ idNumber: req.body.idNumber });

      if (!existingPerson) {
        return res.status(404).send("User is not found");
      }

      const passwordCheck = await bcrypt.compare(req.body.password, existingPerson.password);
      if (!passwordCheck) {
        return res.status(401).send('Password is Incorrect');
      }

      const token = jwt.sign({
        id: existingPerson._id,
      }, process.env.JWT_SECRET, { expiresIn: "10m" });

      res.cookie("access_token", token, { httpOnly: true, secure: true, sameSite: "Strict" });
      res.status(200).json({
        status: 200,
        message: "Login Success",
        data: existingPerson
      });

    } catch (error) {
      console.error(error);
      return res.status(500).send("Internal Server Error");
    }
  },
  uploadFile: async (req, res) => {
    try {
      const existingPerson = await People.findOne({ idNumber: req.params.idNumber });
      if (!existingPerson) {
        return res.status(404).send("User not found");
      }

      const { fieldname, originalname, mimetype, buffer } = req.file;

      const uploadStream = bucket.openUploadStream(originalname, {
        contentType: mimetype,
        metadata: { user: req.params.idNumber }
      });

      const readBuffer = new Readable();
      readBuffer.push(buffer);
      readBuffer.push(null);

      readBuffer.pipe(uploadStream)
        .on('error', (err) => res.status(500).send("Error uploading file"))
        .on('finish', async () => {
          const newFile = {
            filename: originalname,
            id: uploadStream.id.toString(),
            contentType: mimetype,
            length: buffer.length,
            fileId: new Date().getTime().toString(),
          };

          existingPerson.file = newFile;
          await existingPerson.save();

          res.status(201).send({
            message: "File uploaded successfully",
            file: newFile
          });
        });

    } catch (error) {
      console.log('error', error);
      res.status(500).send("Internal Server Error");
    }
  },
  getFile: (req, res) => {
    const { id } = req.params;

    // Validate the ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send("Invalid file ID");
    }

    // Stream the file from GridFS
    const downloadStream = bucket.openDownloadStream(new mongoose.Types.ObjectId(id));

    // Error handling for file not found
    downloadStream.on('error', (err) => {
        if (err.code === 'ENOENT') {
            return res.status(404).send("File not found");
        }
        return res.status(500).send("Internal Server Error");
    });

    // Set the content type and pipe the file to the response
    downloadStream.on('file', (file) => {
        res.set('Content-Type', file.contentType);
    });

    // Stream the file data to the response
    downloadStream.pipe(res);
  },
};