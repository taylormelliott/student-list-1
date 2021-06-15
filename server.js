const express = require('express')
const path = require('path')
const Rollbar = require('rollbar')
let rollbar = new Rollbar({
    accessToken: 'f58476424a6642dfb72af56571521d8c',
    captureUncaught: true,
    captureUnhandledRejections: true
})

const app = express()
app.use(express.json())
let students = []

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'))
    rollbar.info('html file served successfully')
})

app.post('/api/student', (req, res) => {
    let {name} = req.body
    name = name.trim()

    const index = students.findIndex((studentName) => {
        studentName === name
    })

    try {
        if (index === -1 && name !== '') {
            students.push(name)
            rollbar.log('student added successfully', {author: 'riley', type: 'manual'})
            res.status(200).send(students)
        } else if (name === '') {
            rollbar.error('no name given')
            res.status(400).send('must provide a name')
        } else {
            rollbar.error('student already exists')
            res.status(400).send('that student already exists')
        }
    } catch (err) {
        rollbar.error(err)
    }
})

const port = process.env.PORT || 4545

app.use(rollbar.errorHandler())

app.listen(port, () => console.log(`running on port: ${port}`))