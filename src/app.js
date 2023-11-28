require('./adapter')
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');

require('dotenv').config();

const middlewares = require('./middlewares');
const api = require('./api');

const app = express();
app.use(morgan('dev'));
app.use(helmet());
app.use(express.json());

app.use(cors({
  origin: '*',
}));

app.get('/', (req, res) => {
  res.json({
    message: '🦄🌈✨👋🌎🌍🌏✨🌈🦄',
    user: req.user,
  });
});

app.use('/api/v1', api);
app.use(middlewares.notFound);
// app.use(middlewares.errorHandler);

// app.use(middlewares.verifyToken);

module.exports = app;
