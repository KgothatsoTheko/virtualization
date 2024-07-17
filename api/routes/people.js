const express = require('express')
const router = express.Router()
const peopleController = require('../controller/peopleController')
const mongoose = require('mongoose')
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage })

router.get('/', peopleController.defaultRoute)
router.post('/register', peopleController.registerRoute)
router.post('/login', peopleController.loginRoute)
// File upload route
router.post('/upload/:idNumber', upload.single('file'), peopleController.uploadFile);
// File retrieval route
router.get('/file/:id', peopleController.getFile);


module.exports = router