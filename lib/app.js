const cookieParser = require('cookie-parser');

const express = require('express');

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', require('./controllers/user.js'));

app.use(require('./middleware/not-found.js'));
app.use(require('./middleware/error.js'));

module.exports = app;
