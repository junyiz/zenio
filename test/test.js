const co = require('co')
const expect = require('chai').expect
const server = require('./support/server.js')
const uri = server.uri
const zenio = require('../lib/zenio')

describe('zenio', function () {
  it('get', function (done) {
    co(async function () {
      let res = await zenio.get(uri)
      expect(res).to.be.equal('/')
      done()
    })
  })

  it('head', function (done) {
    co(async function () {
      let res = await zenio.head(uri)
      expect(res).to.be.equal('')
      done()
    })
  })

  it('post', function (done) {
    co(async function () {
      let res = await zenio.post(uri, {
        name: 'junyiz'
      })
      res = JSON.parse(res)
      expect(res.name).to.be.equal('junyiz')
      done()
    })
  })

  it('post json', function (done) {
    co(async function () {
      let res = await zenio.post(uri, {
        name: 'junyiz'
      }, {
        'Content-Type': 'application/json'
      })
      res = JSON.parse(res)
      expect(res.name).to.be.equal('junyiz')
      done()
    })
  })

  it('put', function (done) {
    co(async function () {
      let res = await zenio.put(uri, {
        name: 'junyiz'
      })
      res = JSON.parse(res)
      expect(res.name).to.be.equal('junyiz')
      done()
    })
  })

  it('patch', function (done) {
    co(async function () {
      let res = await zenio.patch(uri, {
        name: 'junyiz'
      })
      res = JSON.parse(res)
      expect(res.name).to.be.equal('junyiz')
      done()
    })
  })

  it('delete', function (done) {
    co(async function () {
      let res = await zenio.delete(uri, {
        name: 'junyiz'
      })
      expect(res).to.be.equal('DELETE')
      done()
    })
  })
})
