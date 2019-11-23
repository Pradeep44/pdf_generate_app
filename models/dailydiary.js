const mongoose = require('mongoose')
const shortid = require('shortid')

const Schema = mongoose.Schema

const diarySchema = new Schema({
    shortid: {
        type: String,
        default: shortid.generate
    },
    student: {
        type: Schema.Types.ObjectId,
        ref: "student"
    },
    signed: {
        type: Boolean
    },
    date: {
        type: Date
    }
},{
  timestamps:true  
})

module.exports = mongoose.model("Dailydiary", diarySchema)