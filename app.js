const express = require('express')
const sls = require('serverless-http')
const app = express()
const mongoose = require('mongoose')

const pdfGenerateRequestController = require('./controller/pdfGenerator')
const dailyActivityRouter = require('./controller/dailyActivityReportGenerator')

mongoose.connect(process.env.mongoUri, {
  user:process.env.mongoUser,
  pass:process.env.mongoPassword
})

app.get('/',pdfGenerateRequestController);
app.get('/activities',dailyActivityRouter);



module.exports.server = sls(app)