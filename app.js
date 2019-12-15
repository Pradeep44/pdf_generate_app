const express = require('express')
const sls = require('serverless-http')
var cors = require('cors')
const app = express()
const mongoose = require('mongoose')

const pdfGenerateRequestController = require('./controller/pdfGenerator')
const dailyActivityRouter = require('./controller/dailyActivityReportGenerator')
const genericCardRequestRouter = require('./controller/genericCardGenerator')

mongoose.connect(process.env.mongoUri, {
  user:process.env.mongoUser,
  pass:process.env.mongoPassword
})

app.use(cors())

app.get('/',pdfGenerateRequestController);
app.get('/activities',dailyActivityRouter);
app.get('/genericcard', genericCardRequestRouter);


module.exports.server = sls(app)