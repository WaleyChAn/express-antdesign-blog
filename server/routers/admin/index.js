module.exports = app => {
  const express = require('express')
  const assert = require('http-assert')
  const multer = require('multer')
  const MAO = require('multer-aliyun-oss')
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
      return obj
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
      .populate(getObject(populate))
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
        .populate(getObject(populate))
        .select(select)
    }
    res.send(data)
  })

  // CRUD
  app.use('/admin/api/rest/:resource', authMiddleware({ model: AdminUser }), resourceMiddleware(), router)

  // upload
  // const upload = multer({ dest: __dirname + '/../../uploads' })
  const upload = multer({
    storage: MAO({
      config: app.get('aliConfig')
    })
  })
  app.post('/admin/api/upload', authMiddleware({ model: AdminUser }), upload.single('file'), async (req, res) => {
    const file = req.file
    // file.url = `http://localhost:3000/uploads/${file.filename}`
    res.send(file)
  })

  // login
  app.post('/admin/api/login', async (req, res) => {
    const { username, password } = req.body
    const user = await AdminUser.findOne({ username }).select('+password')
    assert(user, 422, '???????????????')
    const isValid = bcrypt.compareSync(password, user.password)
    assert(isValid, 422, '????????????')
    const token = jwt.sign({ id: user._id }, app.get('jwtSecrte'))
    res.send(token)
  })

  // error interception
  app.use(async (err, req, res, next) => {
    if (err.errors) {
      if (err.errors.name.kind === 'unique') {
        err.message = `???${err.errors.name.value}??? ??????????????????????????????`
      }
    }
    res.status(err.status || 500).send({
      massage: err.message
    })
  })
}