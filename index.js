const router = require('./components/index.js')
const db = require('./models')
const express = require('express')

const app = express()
app.use('/api/v1/app', router)
const startApp = () => {
    let port = 4000
    app.listen(port, console.log('server start'))
}
startApp()