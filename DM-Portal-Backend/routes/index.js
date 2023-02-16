let express = require('express')
let router = express.Router()
let { serverIndex } = require('../controllers/indexController')

router.get('/', serverIndex) // Renders home page

module.exports = router