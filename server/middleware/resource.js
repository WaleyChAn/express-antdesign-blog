module.exports = option => {
  const inflection = require('inflection')

  return async (req, res, next) => {
    const modelName = inflection.classify(req.params.resource)
    const Model = require(`../models/${modelName}`)
    req.modelName = modelName
    req.Model = Model
    next()
  }
}