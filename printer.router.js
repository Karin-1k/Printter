const controller = require('./printer.controller')
const express = require('express')
const app = express()


app.post('/print-invoice', controller.addNew())



module.exports = app