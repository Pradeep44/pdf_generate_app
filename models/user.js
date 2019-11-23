const mongoose = require('mongoose')
const shortid = require('shortid')

const Schema = mongoose.Schema;

const userSchema = new Schema({
    shortid:{
        type: String,
        default: shortid.generate
    },
    institution:{
        type: Schema.Types.ObjectId,
        ref:"institution"
    },
    emailVerified:{
        type: Boolean
    },
    role:{
        type: String
    },
    email:{
        type: String
    },
    name:{
        type: String
    },
    password:{
        type: String
    },
    linkedAccounts:{
        type: Object
    },
    devices:{
        type: Array
    },
    lastActive:{
        type: Date
    }
},{
    timestamps: true
})

module.exports = mongoose.model('User', userSchema)