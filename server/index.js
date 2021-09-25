const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const app = express()

dotenv.config()
app.use(cors())
app.use(express.json())
app.use('/', express.static(__dirname + '/public/web'))
app.use('/admin', express.static(__dirname + '/public/admin'))
app.use('/uploads', express.static(__dirname + '/uploads'))

app.set('jwtSecrte', process.env.SERVER_JWT_SECRET)
app.set('aliConfig', {
  region: process.env.SERVER_ALI_REGION,
  accessKeyId: process.env.SERVER_ALI_ACCESS_KEY_ID,
  accessKeySecret: process.env.SERVER_ALI_ACCESS_KEY_SECRET,
  bucket: process.env.SERVER_ALI_BUCKET
})

require('./plugins/db')(app)
require('./routers/admin')(app)
require('./routers/web')(app)

app.listen(3000, () => {
  console.log('http://localhost:3000')
})