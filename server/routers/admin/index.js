module.exports = app => {
  const express = require('express')
  const assert = require('http-assert')
  const multer = require('multer')
  const bcrypt = require('bcryptjs')
  const jwt = require('jsonwebtoken')
  // models
  const AdminUser = require('../../models/AdminUser')
  const Category = require('../../models/Category')
  const Post = require('../../models/Post')
  // middleware
  const authMiddleware = require('../../middleware/auth')
  const resourceMiddleware = require('../../middleware/resource')

  const router = express.Router({
    mergeParams: true
  })

  const getObject = obj => {
    try {
      return JSON.parse(obj)
    } catch {
      return obj || {}
    }
  }
  const getArray = arr => {
    try {
      return JSON.parse(arr)
    } catch {
      return arr || []
    }
  }

  router.get('/', async (req, res) => {
    const {
      where = {},
      sort = {},
      populate = '',
      select = '',
      page = 1,
      limit = 0
    } = req.query
    const result = await req.Model
      .find(getObject(where))
      .sort(getObject(sort))
      .populate(getArray(populate))
      .select(select)
      .skip(limit * (page - 1))
      .limit(parseInt(limit))
    const total = await req.Model.find(getObject(where)).countDocuments()
    res.send({
      result,
      total
    })
  })

  router.post('/', async (req, res) => {
    const data = await req.Model.create(req.body)
    res.send(data)
  })


  router.delete('/:id', async (req, res) => {
    await req.Model.findByIdAndDelete(req.params.id)
    res.send({
      success: true
    })
  })

  router.put('/:id', async (req, res) => {
    const data = await req.Model.findByIdAndUpdate(req.params.id, req.body)
    res.send(data)
  })

  router.get('/:id', async (req, res) => {
    const {
      populate = '',
      select = ''
    } = req.query
    let data = {}
    if (req.params.id === 'current_user') {
      data = req.user
    } else {
      data = await req.Model
        .findById(req.params.id)
        .populate(getArray(populate))
        .select(select)
    }
    res.send(data)
  })

  // CRUD
  app.use('/admin/api/rest/:resource', authMiddleware({ model: AdminUser }), resourceMiddleware(), router)

  // upload
  const upload = multer({ dest: __dirname + '/../../uploads' })
  app.post('/admin/api/upload', authMiddleware({ model: AdminUser }), upload.single('file'), async (req, res) => {
    const file = req.file
    file.url = `http://localhost:3000/uploads/${file.filename}`
    res.send(file)
  })

  // login
  app.post('/admin/api/login', async (req, res) => {
    const { username, password } = req.body
    const user = await AdminUser.findOne({ username }).select('+password')
    assert(user, 422, '用户不存在')
    const isValid = bcrypt.compareSync(password, user.password)
    assert(isValid, 422, '密码错误')
    const token = jwt.sign({ id: user._id }, app.get('jwtSecrte'))
    res.send(token)
  })

  // error interception
  app.use(async (err, req, res, next) => {
    if (err.errors) {
      if (err.errors.name.kind === 'unique') {
        err.message = `“${err.errors.name.value}” 已存在，请重新命名！`
      }
    }
    res.status(err.status || 500).send({
      massage: err.message
    })
  })
}