const express = require('express')
const router = express.Router()
const peopleController = require('../controller/peopleController')
const mongoose = require('mongoose')
const multer = require('multer');


    const storage = multer.memoryStorage();
    const upload = multer({ storage })

router.post('/register', peopleController.registerRoute)
router.post('/login', peopleController.loginRoute)
router.post('/upload', upload.any(), peopleController.uploadFile);


module.exports = router