const express = require('express')
const router = express.Router()
const peopleController = require('../controller/peopleController')

router.post('/register', peopleController.registerRoute)
router.post('/login', peopleController.loginRoute)

module.exports = router