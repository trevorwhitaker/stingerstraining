
const express = require('express')
const path = require('path');

const app = express()

app.use(express.static(path.join(__dirname, 'client-src', 'build')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'client-src', 'build', 'index.html'));
})

app.get('/test', (req, res) => {
  res.json({poop: 'poop'})
})

app.listen(process.env.PORT || 8080, () => {
  console.log('Server started on ', process.env.PORT || '8080',)
});