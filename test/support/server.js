const koa = require('koa')
const koaBody = require('koa-body')
const app = new koa()
const port = 5000

app.use(koaBody())

app.use(ctx => {
  let method = ctx.method, body = ''

  if (method == 'GET') {
    body = ctx.path
  } else if (method == 'HEAD') {
    body = ''
  } else if (method == 'POST') {
    body = ctx.request.body
  } else if (method == 'PUT') {
    body = ctx.request.body
  } else if (method == 'PATCH') {
    body = ctx.request.body
  } else if (method == 'DELETE') {
    body = 'DELETE'
  }
  ctx.body = body
})

app.listen(port)

exports.uri = 'http://localhost:' + port
