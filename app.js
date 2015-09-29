'use strict'

const co = require('co')
const pairs = require('./controllers/pairs')
const quote = require('./controllers/quote')
const settlements = require('./controllers/settlements')
const notifications = require('./controllers/notifications')
const compress = require('koa-compress')
const serve = require('koa-static')
const route = require('koa-route')
const errorHandler = require('@ripple/five-bells-shared/middlewares/error-handler')
const koa = require('koa')
const path = require('path')
const log = require('./services/log')
const backend = require('./services/backend')
const logger = require('koa-mag')
const config = require('./services/config')
const subscriber = require('./services/subscriber')
const app = module.exports = koa()

// Logger
app.use(logger())
app.use(errorHandler({log: log('error-handler')}))

app.use(route.get('/pairs', pairs.getCollection))

app.use(route.put('/settlements/:uuid', settlements.put))

app.use(route.get('/quote', quote.get))

app.use(route.post('/notifications', notifications.post))

app.use(route.get('/', function *() {
  this.body = 'Hello, I am a 5 Bells trader'
}))

// Serve static files
app.use(serve(path.join(__dirname, 'public')))

// Compress
app.use(compress())

if (!module.parent) {
  app.listen(config.server.port)

  log('app').info('trader listening on ' + config.server.bind_ip + ':' +
    config.server.port)
  log('app').info('public at ' + config.server.base_uri)
  for (let pair of config.tradingPairs) {
    log('app').info('pair', pair)
  }

  // Start a coroutine that connects to the backend and
  // subscribes to all the ledgers in the background
  co(function * () {
    yield backend.connect()

    yield subscriber.subscribePairs(config.tradingPairs)
  }).catch(function (err) {
    log('app').error(typeof err === 'object' && err.stack || err)
  })
}