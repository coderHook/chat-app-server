const express = require('express')
const Sse = require('json-sse')
const bodyParser = require('body-parser')
const cors = require('cors')
const Message = require('./messages/model')

const app = express()

//allow cors
app.use(cors())

const jsonParser = bodyParser.json()
app.use(jsonParser)

// this acts as our database
const messages = [
  'Hello',
  'Can you see this?'
]

//serialize the data
const json = JSON.stringify(messages) // turn the array into a single string
const stream = new Sse(json) //When someone connects send this message in a string.

function onStream(request, response){
  stream.init(request, response) //this connects the client to the server
}

app.get('/stream', onStream)

function onMessage(request, response, next) {
  const { message } = request.body

  messages.push(message);

  const json = JSON.stringify(messages)

  //update the initial data
  stream.updateInit(json);

  //Notify all the clients.
  stream.send(json)

  //send Response

  console.log('what is message?', message)

  Message
    .create({ message })
    .then(res => {
      response.status(201).send(res)
    })
    .catch(err => next(err))

  // return response.status(201).send(message)
}

app.post('/message', onMessage)

const port = process.env.PORT || 5000

function onListen(){
  console.log(`Listening on port ${port}`)
}

app.listen(port, onListen)