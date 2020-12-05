
const express = require('express')
const path = require('path');

const app = express()

app.use(express.static(path.join(__dirname, 'client-src', 'build')));

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/test', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.json({poop: 'poop'});
})

app.get('/home', function (req, res) {
  res.sendFile(path.join(__dirname, 'client-src', 'build', 'index.html'));
});

app.listen(process.env.PORT || 8080, () => {
  console.log('Server started on ', process.env.PORT || '8080',)
});