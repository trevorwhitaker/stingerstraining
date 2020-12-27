const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const fileUpload = require('express-fileupload');
const constants = require('./util/constants');
const morgan = require('morgan');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const auth = require("./middleware/auth");

require('dotenv').config();

const app = express()

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

const sessionStore = new MongoStore({
  mongooseConnection: mongoose.connection,
  collection: 'sessions'
});

// middleware
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: process.env.JWT_SECRET,
  store: sessionStore,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24,
    sameSite: true,
    secure: (process.env.IS_PROD == 'true')
  }
}));
app.use(morgan('tiny'));
app.use(express.json());
app.use(fileUpload());
app.use(express.static(path.join(__dirname, 'client-src', 'build')));

// API routes
app.use("/users", require("./routes/userRouter"));
app.use("/drills", require("./routes/drillRouter"));
app.use("/categories", require("./routes/categoryRouter"));

// File routes
app.use(constants.videoApi, express.static(path.join(path.resolve(), constants.videoDir)));
app.use(constants.thumbnailApi, express.static(path.join(path.resolve(), constants.thumbnailDir)));

// Front end js file
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client-src', 'build', 'index.html'));
})

app.listen(process.env.PORT || 8080, () => {
  console.log('Server started on ', process.env.PORT || '8080',)
});
