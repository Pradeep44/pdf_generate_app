const mongoose = require('mongoose');
const shortid = require('shortid');
const Schema = mongoose.Schema;
const facultySchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    institution: {
      type: Schema.Types.ObjectId,
      ref: "institution"
    },
    shortid: {
      type: String,
      default: shortid.generate
    },
    hasYears: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Faculty', facultySchema);
