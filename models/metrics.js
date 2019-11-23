const mongoose = require('mongoose')

const Schema = mongoose.Schema

const metricsSchema = new Schema({
    students:{
        type: Number
    },
    linked_percentage:{
        type: String
    },
    active_percentage:{
        type: String
    },
    moments:{
        type: Number
    },
    other_activities:{
        type: Number
    },
    notifications_per_student:{
        type: Number
    },
    timeframe:{
        type: Schema.Types.ObjectId,
        ref:"timeframe"
    },
    institution:{
        type: Schema.Types.ObjectId,
        ref:"institution"
    }
})

module.exports = mongoose.model('Metrics', metricsSchema)
