const mongoose = require('mongoose')
const shortid = require('shortid');

const Schema = mongoose.Schema;

const guardianSchema = new Schema({
    shortid:{
        type:String,
        default: shortid.generate
    },
    institution:{
        type:Schema.Types.ObjectId,
        required: true,
        ref:"institution"
    },
    name:{
        type:String
    },
    mobileNumber:{
        type:Number
    },
    linking:{
        token:{
            status:{
                type: String
            },
            code:{
                type: String
            },
            user:{
                type:Schema.Types.ObjectId,
                ref:"user"
            }
        }
    }
},
{timestamps: true});

module.exports = mongoose.model('Guardian',guardianSchema);