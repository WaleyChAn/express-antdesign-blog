module.exports = app => {
  const express = require('express')
  const assert = require('http-assert')
  const router = express.Router({
    mergeParams: true
  })

  router.get('/', async (req, res) => {
    const data = await req.Model.find()
    res.send(data)
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
    const data = await req.Model.findById(req.params.id)
    res.send(data)
  })

  // CRUD
  const inflection = require('inflection')
  app.use('/admin/api/rest/:resource', async (req, res, next) => {
    const modelName = inflection.classify(req.params.resource)
    const Model = require(`../../models/${modelName}`)
    req.Model = Model
    next()
  }, router)

  // upload
  const multer = require('multer')
  const upload = multer({ dest: __dirname + '/../../uploads' })
  app.post('/admin/api/upload', upload.single('file'), async (req, res) => {
    const file = req.file
    file.url = `http://localhost:3000/uploads/${file.name}`
    res.send(file)
  })

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