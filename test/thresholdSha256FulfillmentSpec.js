'use strict'

const assert = require('chai').assert
const condition = require('..')

describe('ThresholdSha256Fulfillment', function () {
  const ex = {
    emptySha256: 'cf:1:1:AA',
    tinySha256: 'cf:1:1:AQA',
    edSha256_1: 'cf:1:10:IHahWSBEpuT1ESZbynOmBNkLBSnR32Ar4woZqSV2YNH1QK7Gq2qRIq_w99y5Zn_2ExNolHMrbnjCb1tnMQHiZ_4uK2X6TVPa1HihraZNUP0d_bfZSSDcPhpWSmR7HLo1YAE'
  }

  testFromFulfillments(
    [
      ex.emptySha256
    ],
    1,
    'cf:1:8:AQEBAQEA',
    'cc:1:9:vM9AH5sVJ-OTnSVZljFwlr4uhJ__YipcXbePy5YNCzs:38'
  )

  testFromFulfillments(
    [
      ex.edSha256_1,
      ex.tinySha256
    ],
    1,
    'cf:1:8:AQIBAQEBAAABECBOjidMY5uDWyCspCSAf4ydktj1wT-JZXJGHITSC3lnSEI',
    'cc:1:19:nZmVGIs9eijAg38QI6i1K1OoPJ35zSpMN4WYBOkj_cY:107'
  )

  testFromFulfillments(
    [
      ex.tinySha256,
      ex.edSha256_1
    ],
    1,
    'cf:1:8:AQIBAQEBAAABECBOjidMY5uDWyCspCSAf4ydktj1wT-JZXJGHITSC3lnSEI',
    'cc:1:19:nZmVGIs9eijAg38QI6i1K1OoPJ35zSpMN4WYBOkj_cY:107'
  )

  testFromFulfillments(
    [
      ex.tinySha256,
      ex.edSha256_1
    ],
    2,
    'cf:1:8:AgIBAQEBAAEBECB2oVkgRKbk9REmW8pzpgTZCwUp0d9gK-MKGakldmDR9UCuxqtqkSKv8PfcuWZ_9hMTaJRzK254wm9bZzEB4mf-Litl-k1T2tR4oa2mTVD9Hf232Ukg3D4aVkpkexy6NWAB',
    'cc:1:19:M7FD09UBgnDjpBF0vX1Tl83P8DG4Z4-UP-iETfgbHUs:75'
  )

  function testFromFulfillments (fulfillments, threshold, fulfillmentUri, conditionUri) {
    describe('with ' + fulfillments.length + ' subfulfillments', function () {
      it('generates the correct fulfillment uri', function () {
        const f = new condition.ThresholdSha256Fulfillment()
        f.setThreshold(threshold)
        for (let sub of fulfillments) {
          f.addSubfulfillment(condition.fromFulfillmentUri(sub))
        }
        const uri = f.serializeUri()

        assert.equal(uri, fulfillmentUri)
      })

      it('generates the correct condition uri', function () {
        const f = new condition.ThresholdSha256Fulfillment()
        f.setThreshold(threshold)
        for (let sub of fulfillments) {
          f.addSubfulfillment(condition.fromFulfillmentUri(sub))
        }
        const uri = f.getCondition().serializeUri()

        assert.equal(uri, conditionUri)
      })
    })
  }
})
