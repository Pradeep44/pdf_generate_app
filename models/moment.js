const mongoose = require('mongoose')
const shortid = require('shortid')

const Schema = mongoose.Schema

const momentSchema = new Schema({
    shortid:{
        type:String,
        default: shortid.generate
    },
    institution:{
        type:Schema.Types.ObjectId,
        ref:"institution"
    },
    title:{
        type:String
    },
    description:{
        type:String
    },
    createdBy:{
        type:Schema.Types.ObjectId,
        ref:"teacher"
    }
},
{timestamps:true})

module.exports = mongoose.model('Moment', momentSchema)