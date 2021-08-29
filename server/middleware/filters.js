module.exports = option => {
  return async (req, res, next) => {
    res.send('test')
    await next()
  }
}