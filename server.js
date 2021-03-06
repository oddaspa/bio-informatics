const Koa = require('koa');
const path = require('path');
const serve = require('koa-static');
const cors = require('@koa/cors');
const Router = require('koa-router');
const logger = require('koa-logger');
const bodyParser = require('koa-bodyparser');
const PORT = process.env.PORT || 8080;

const app = new Koa();

// enable CORS (y)
app.use(cors());

// log all events to the terminal
app.use(logger());

app.use(bodyParser());

// instantiate our new Router
const jasparRouter = new Router();

// require our external routes and pass in the router
require('./routes/jaspar.js')({ jasparRouter });

// tells the router to use all the routes that are on the object
app.use(jasparRouter.routes());
app.use(jasparRouter.allowedMethods());

if (process.env.NODE_ENV === 'production') {
  app.use(serve(path.resolve(__dirname, 'client/build')));
}

// tells the server to listen to events on the 8080 port
app.listen(PORT);
module.exports = app;
