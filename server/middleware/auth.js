module.exports = option => {
  const assert = require('http-assert')
  const jwt = require('jsonwebtoken')

  return async (req, res, next) => {
    const token = String(req.headers.authorization || '').split(' ').pop()
    assert(token, 401, '')
    const { id } = jwt.verify(token, req.app.get('jwtSecrte'))
    assert(id, 401, '')
    req.user = await option.model.findById(id)
    assert(req.user, 401, '')
    await next()
  }
}