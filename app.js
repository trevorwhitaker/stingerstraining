const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const fileUpload = require('express-fileupload');
require('dotenv').config();

const app = express()

// middleware
app.use(express.static(path.join(__dirname, 'client-src', 'build')));
app.use(express.json());
app.use(fileUpload());
app.use("/users", require("./routes/userRouter"));
app.use("/drills", require("./routes/drillRouter"));
app.use("/categories", require("./routes/categoryRouter"));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'client-src', 'build', 'index.html'));
})

app.get('/test', (req, res) => {
  res.json({poop: 'poop'})
})

app.listen(process.env.PORT || 8080, () => {
  console.log('Server started on ', process.env.PORT || '8080',)
});

mongoose.connect(process.env.MONGODB_CONN_STRING, {
  useNewUrlParser: true, 
  useUnifiedTopology: true,
  useCreateIndex: true
}, (err) => {
  if (err) {
    throw new Error(err);
  }
  console.log("Mongodb connected");
});
