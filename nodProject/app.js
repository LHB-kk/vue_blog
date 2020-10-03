var app = require('koa')()
  , logger = require('koa-logger')
  , json = require('koa-json')
  , views = require('koa-views')
  , onerror = require('koa-onerror');

var index = require('./routes/index');
var users = require('./routes/users');
const  session = require('koa-generic-session')
const redisStore = require('koa-redis')
// error handler
onerror(app);

// global middlewares
app.use(views('views', {
  root: __dirname + '/views',
  default: 'jade'
}));
app.use(require('koa-bodyparser')());
app.use(json());
app.use(logger());

app.use(function *(next){
  var start = new Date;
  yield next;
  var ms = new Date - start;
  console.log('%s %s - %s', this.method, this.url, ms);
});

app.use(require('koa-static')(__dirname + '/public'));

// routes definition
app.use(index.routes(), index.allowedMethods());
app.use(users.routes(), users.allowedMethods());

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});


// session配置
app.keys['lhb123']
app.use(session({
  // 配置cookie
  cookie:{
    path:'/',
    httpOnly:true,
    maxAge:24 * 60 * 60 * 100
  },

  // 配置redis
  store:redisStore({
    all:'127.0.0.1:6379'    //写死本地redis
  })
}))
module.exports = app;
