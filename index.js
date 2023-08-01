const express = require('express')
const app = express()


app.get('/', (request, response) => {
  response.send('<h1>hola mundo!</h1>')
})

// app.get('/api/notes', (request, response) => {
//   response.json(notes)
// })

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})