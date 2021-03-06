'use strict'

const nock = require('nock')
nock.enableNetConnect(['localhost', '127.0.0.1'])
const appHelper = require('./helpers/app')
const logger = require('../src/common').log
const logHelper = require('./helpers/log')

describe('Health', function () {
  beforeEach(function () {
    appHelper.create(this)
  })

  logHelper(logger)

  describe('GET /health', function () {
    it('should return 200', function * () {
      yield this.request()
        .get('/health')
        .expect(200)
        .end()
    })
  })
})
