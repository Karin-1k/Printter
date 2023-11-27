const invoiceModel = require('../models/invoice.model');
const thermalPrint = require('./thermalPrint');

class printerController {
    addNew = () => {
        return (req, res) => {
            const invoice = req.body
            thermalPrint('POS-80', invoice).then((result) => {
                res.send(result)
            }).catch((err) => {
                console.log(err);
                res.status(403).send({
                    message: "something with wrong"
                })
            });
        }
    }
}

module.exports = new printerController()