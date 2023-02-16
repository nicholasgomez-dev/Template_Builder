const express = require('express')
const path = require('path')
const cors = require('cors')
const app = express();
const authMiddleware = require('./middleware/authMiddleware');
const siteDataController = require('./controllers/siteDataController')
require('dotenv').config();

// CORS Setup
app.use(cors());
app.options('*', cors()) // include before other routes for preflight 



// Body Parsing
app.use(express.json({limit: '1mb'}))
app.use(express.urlencoded({
    extended: true
}))

// Routes 
app.use('/gatsby/:site_id', siteDataController.getSiteDataForGatsbyBuild); //temporary for gatsby call outside of auth
// app.use('/gatsby-test/:site_id', siteDataController.getSiteDataDirectlyForGatsbyBuild); //temporary for gatsby call outside of auth
app.use('/api*', authMiddleware.verifyJWT);

app.use('/', require('./routes/index.js')); // Index / Home Page Router
app.use('/api/templates', require('./routes/templates')); // template router
app.use('/api/sites', require('./routes/siteData')); //site router
app.use('/api/inventory', require('./routes/inventoryData'));//inventory data router
app.use('/api/images/upload', require('./routes/uploadImage')); //s3 image uploader
app.use('/api/images/fetch', require('./routes/fetchImages'));

// Server start
app.listen(process.env.PORT, () => console.log('Started on Port: ' + process.env.PORT))
