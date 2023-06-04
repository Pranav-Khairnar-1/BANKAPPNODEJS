const router = require('./components/index.js')
const db = require('./models')
const express = require('express')
const errorHandlerMiddleware = require('./middleware/error-handler.js')
// const bodyparser = require('body-parser')
const app = express()
// app.use(bodyparser())
app.use(express.json())
app.use('/api/v1/app', router)
app.use(errorHandlerMiddleware)
const startApp = () => {
    let port = 3000
    app.listen(port, console.log('server start'))
}
startApp()