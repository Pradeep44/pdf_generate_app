const mongoose = require('mongoose');
const shortid = require('shortid')
const Schema = mongoose.Schema;

const studentSchema = new Schema({
    institution:{
        type:Schema.Types.ObjectId,
        required: true,
        ref:"institution"
    },
    studentId:{
        type: String
    },
    name:{
        type: String,
        required: true
    },
    email:{
        type: String
    },
    contactNum:{
        type: Number
    },
    address:{
        type: String
    }, 
    shortid:{
        type: String,
        default: shortid.generate
    },
    guardians:{
        type:Array
    },
    academics:{
        type: Array
    }
},
{ timestamps: true});

module.exports = mongoose.model('Student',studentSchema);