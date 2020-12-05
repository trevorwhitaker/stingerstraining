
const express = require('express')
const app = express()
const port = 3009

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/test', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.json({poop: 'poop'});
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})