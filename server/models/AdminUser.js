const mongoose = require('mongoose')
const beautifyUnique = require('mongoose-beautiful-unique-validation')
const bcrypt = require('bcryptjs')
const schema = new mongoose.Schema({
  username: {
    type: String,
    unique: true
  },
  nickname: {
    type: String,
    unique: true
  },
  password: {
    type: String,
    select: false,
    set (val) {
      return bcrypt.hashSync(val, 10)
    }
  },
  avatar: { type: String },
  site: {
    title: { type: String },
    ico: { type: String },
    logo: { type: String },
    color: { type: String }
  }
})
schema.plugin(beautifyUnique)
module.exports = mongoose.model('AdminUser', schema)