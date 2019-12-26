const express = require('express')
const sls = require('serverless-http')
var cors = require('cors')
const app = express()
const mongoose = require('mongoose')

const pdfGenerateRequestController = require('./controller/pdfGenerator')
const dailyActivityRouter = require('./controller/dailyActivityReportGenerator')
const genericCardRequestRouter = require('./controller/genericCardGenerator')
const unlinkedGuardianPhoneListRouter = require('./controller/unlinkedGuardianPhoneList')
const inactiveGuardianPhoneListRouter = require('./controller/inactiveGuardianPhoneList')



mongoose.connect(process.env.mongoUri, {
  user:process.env.mongoUser,
  pass:process.env.mongoPassword
})

app.use(cors())
app.use(express.static('public'))

app.get('/',pdfGenerateRequestController);
app.get('/activities',dailyActivityRouter);
app.get('/genericcard', genericCardRequestRouter);
app.get('/students/unlinkedguardianphonenumber', unlinkedGuardianPhoneListRouter);
app.get('/students/inactiveguardianphonenumber', inactiveGuardianPhoneListRouter);

module.exports.server = sls(app)