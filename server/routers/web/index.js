module.exports = app => {
  const express = require('express')
  // middleware
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
    const data = await req.Model
      .find(getObject(where))
      .sort(getObject(sort))
      .populate(getObject(populate))
      .select(select)
      .skip(limit * (page - 1))
      .limit(parseInt(limit))
    res.send(data)
  })

  router.get('/:id', async (req, res) => {
    const {
      populate = '',
      select = ''
    } = req.query
    const data = await req.Model
      .findById(req.params.id)
      .populate(getObject(populate))
      .select(select)
    res.send(data)
  })

  // CRUD
  app.use('/web/api/rest/:resource', resourceMiddleware(), router)


  // error interception
  app.use(async (err, req, res, next) => {
    res.status(err.status || 500).send({
      massage: err.message
    })
  })
}