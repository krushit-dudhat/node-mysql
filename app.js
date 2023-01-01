const express = require('express');
const cors = require('cors');
const logger = require('morgan');
const db = require('./connection/db.conn');
const router = require('./routes/index');
const path = require('path');
const { routeErrorHandler, errorHandler } = require('./helpers/error-handler');
const { envConst } = require('./helpers/constant');

const app = express();
(async () => {
  await db.connect();
  if (envConst.NODE_ENV === 'development') {
    await db.dropTable();
    await db.createTable();
    await db.seedTable();
  } else {
    await db.createTable();
  }
})();

app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '50mb' }));
app.use(logger('dev'));

// set ejs view engine.
app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, './views'));

// router(app);
app.use(routeErrorHandler);
app.use(errorHandler);

module.exports = app;