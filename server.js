const express = require('express')
const path = require('path')
const Rollbar = require('rollbar')
let rollbar = new Rollbar({
    accessToken: 'f58476424a6642dfb72af56571521d8c',
    captureUncaught: true,
    captureUnhandledRejections: true
})

const app = express()
let students = []

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'))
    rollbar.info('html file served successfully')
})

app.post('/api/student', (req, res) => {
    let {name} = req.body
    name = name.trim()
    students.push(name)
    rollbar.log('student added successfully', {author: 'riley', type: 'manual'})
})

const port = process.env.PORT || 4545

app.listen(port, () => console.log(`running on port: ${port}`))