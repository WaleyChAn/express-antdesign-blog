const mongoose = require('mongoose')
const beautifyUnique = require('mongoose-beautiful-unique-validation')
const schema = new mongoose.Schema({
  catID: { type: String },
  name: {
    type: String,
    unique: true
  },
  color: { type: String }
})
schema.plugin(beautifyUnique)
module.exports = mongoose.model('Category', schema)