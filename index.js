const router = require('./components/index.js')
const db = require('./models')
const express = require('express')
const errorHandlerMiddleware = require('./middleware/error-handler.js')
// const bodyparser = require('body-parser')
const cors = require("cors")
const app = express()
// app.use(bodyparser())
app.use(express.json())
app.use(cors({
    origin: "*",
    exposedHeaders: ["Set-Cookie"],
}))
app.use('/api/v1/app', router)
app.use(errorHandlerMiddleware)
const startApp = () => {
    let port = 4000
    app.listen(port, console.log('server start'))
}
startApp()