const http = require('http')
const https = require('https')
const urlParse = require('url').parse
const qsStringify = require('querystring').stringify
const iconv = require('iconv-lite')
let options = {
  host: '',
  json: false,
  timeout: 30000,
  encoding: 'utf8'
}

function isRedirect(code) {
  return code === 300 ||
    code === 301 ||
    code === 302 ||
    code === 303 ||
    code === 305 ||
    code === 307 ||
    code === 308;
}

/**
 *  @param {Object} params
 */
function createParams(params) {
  let ret = []

  for (let i in params) {
    ret.push(i + '=' + encodeURIComponent(params[i]))
  }

  return ret.join('&')
}

/**
 *  @param {String} url
 *  @param {String} method  GET | HEAD | POST | PUT | PATCH | DELETE
 *  @param {Object} headers
 */
function createOptions(url, method, headers) {
  url = urlParse(url)

  return {
    hostname: url.hostname,
    port: url.protocol == 'https:' ? url.port || 443 : url.port || 80,
    path: url.path,
    method: method,
    headers: Object.assign({
      'Content-Type': 'application/x-www-form-urlencoded'
    }, headers)
  }
}
/**
 *  @param {String} method  GET | HEAD | POST | PUT | PATCH | DELETE
 */
function zenio(method) {
  return (url, params, headers) => {
    return new Promise((resolve, reject) => {
      let redirect = 0
      io(url, params, headers)
      function io(url, params, headers) {
        let result, req, abort, opts, reqeust

        url = url.startsWith('http') ? url : (options.host || 'http://') + url
        reqeust = url.startsWith('https') ? https.request : http.request

        function done() {
          if (options.json) {
            try {
              result = JSON.parse(result)
            } catch (e) {
              error(e)
            }
          }
          resolve(result)
        }

        function error(e) {
          clearTimeout(abort)
          reject(e)
        }

        if ((method == 'GET' || method == 'HEAD') && typeof params === 'object' && params !== null) {
          url += (url.indexOf('?') > -1 ? '&' : '?') + createParams(params)
        }

        opts = createOptions(url, method, headers)

        if (options.json && opts.headers.accept === undefined) {
          opts.headers.accept = 'application/json'
        }

        if (method == 'POST' || method == 'PUT' || method == 'PATCH') {
          if (typeof params === 'object' && params !== null) {
            if (/application\/json/.test(opts.headers['Content-Type'])) {
              params = JSON.stringify(params)
            } else {
              params = qsStringify(params)
            }
            opts.headers['Content-Length'] = Buffer.byteLength(params)
          } else {
            opts.headers['Content-Length'] = 0
          }
        }

        abort = setTimeout(() => {
          req && req.abort()
          error(new Error(url + ' timeout'))
        }, options.timeout)

        req = reqeust(opts, res => {
          let buf = [], size = 0, code = res.statusCode

          clearTimeout(abort)
          if (isRedirect(code) && 'location' in res.headers && redirect < 10) {
            io(res.headers.location, params, headers)
            return;
          }

          res.on('data', chunk => {
            buf.push(chunk)
            size += chunk.length
          }).on('end', () => {
            result = iconv.decode(Buffer.concat(buf, size), options.encoding)

            if (code >= 200 && code <= 299) {
              done()
            } else {
              error(new Error('statusCode=' + code + '\n' + result))
            }
          })
        })

        req.on('error', error)

        if ((method == 'POST' || method == 'PUT' || method == 'PATCH') && params) {
          req.write(params)
        }

        req.end()
      }
    })
  }
}

zenio.methods = ['get', 'head', 'post', 'put', 'patch', 'delete']

zenio.setOptions = (opts) => {
  options = Object.assign(options, opts || {})
}

zenio.methods.forEach(method => {
  zenio[method] = zenio(method.toUpperCase())
})

module.exports = zenio
