var mongoose = require('mongoose')
var schema = mongoose.Schema

var ProcessSchema = new schema({
    _id: Number,
    name: String,
    type: String
})

module.exports = mongoose.model('process', ProcessSchema)