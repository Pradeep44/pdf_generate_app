const mongoose = require('mongoose');
const shortid = require('shortid');

const Schema = mongoose.Schema;

const teacherSchema = new Schema({
    shortid:{
        type:String,
        default: shortid.generate
    },
    institution:{
        type:Schema.Types.ObjectId
    },
    name:{
        type:String
    },
    linking:{
        user:{
            type:Schema.Types.ObjectID
        }
    }
},
{timestamps:true})

module.exports = mongoose.model('Teacher',teacherSchema)