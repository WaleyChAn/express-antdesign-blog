const mongoose = require('mongoose')
const schema = new mongoose.Schema({
  adID: {
    type: String
  },
  type: {
    type: Number
  },
  site: {
    title: { type: String },
    cover: { type: String },
    url: { type: String }
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  }
})
module.exports = mongoose.model('Ad', schema)