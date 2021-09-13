const mongoose = require('mongoose')
const schema = new mongoose.Schema({
  title: { type: String },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AdminUser'
  },
  categories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category'
    }
  ],
  cover: { type: String },
  desc: { type: String },
  isPublic: { type: Boolean },
  state: { type: Number },
  body: { type: String }
}, {
  timestamps: true
})

module.exports = mongoose.model('Post', schema)