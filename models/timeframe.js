const mongoose = require('mongoose')

const Schema = mongoose.Schema

const timeframeSchema = new Schema({
    type:{
        type: String
    },
    start_date:{
        type: Date
    },
    end_date:{
        type: Date
    }
})

module.exports = mongoose.model('Timeframe', timeframeSchema,'timeframe')