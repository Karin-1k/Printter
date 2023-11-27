const express = require('express')
const app = express()
const port = 3000

var bodyParser = require('body-parser')
app.use(bodyParser.json())


const printer = require('./printer.router')
app.use('/printer', printer)

app.listen(port, () => {
    console.log("prort "+port);
})