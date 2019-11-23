const mongoose = require('mongoose');
const shortid = require('shortid');
const Schema = mongoose.Schema;

const attendanceSchema = new Schema({
    state:{
        type: String
    },
    student:{
        type: Schema.Types.ObjectId,
        ref: "student"
    },
    createdBy:{
        type: Schema.Types.ObjectId,
        ref: "teacher"
    },
    shortid:{
        type: String,
        default:shortid.generate
    }
},
{timestamps: true})

module.exports = mongoose.model('Attendancerecord', attendanceSchema)