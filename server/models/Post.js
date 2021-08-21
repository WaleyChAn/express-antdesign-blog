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
  body: { type: String }
}, {
  timestamps: true
})

module.exports = mongoose.model('Post', schema)