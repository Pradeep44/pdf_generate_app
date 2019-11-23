const mongoose = require('mongoose')
const shortid = require('shortid')

const Schema = mongoose.Schema

const activitiesSchema = new Schema({
    shortid:{
        type:String,
        default: shortid.generate
    },
    tags:{
        type: Array
    },
    resources:{
        type: Array
    },
    type:{
        type:Schema.Types.ObjectId,
        ref:"tagtypes"
    },
    groups:{
        type: Array
    },
    records:{
        type: Array
    },
    student:{
        type: Schema.Types.ObjectId
    },
    subject:{
        type: Schema.Types.ObjectId
    },
    createdBy:{
        type:Schema.Types.ObjectId,
        ref:"teacher"
    }
},
{timestamps: true})

module.exports = mongoose.model('Activities',activitiesSchema)