const mongoose = require('mongoose');
const shortid = require('shortid');
const Schema = mongoose.Schema;

const institutionSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    type:{
        type:String,
        required:true
    },
    address:{
        type:String,
        
    },
    facultyName:{
        type:String,
    },
    yearName:{
        type:String,
    },
    groupName:{
        type:String,
    },
    shortid:{
        type:String,
        default: shortid.generate
    },
    preference:{
        type:String
    }
},
{timestamps: true});

module.exports = mongoose.model('Institution',institutionSchema);