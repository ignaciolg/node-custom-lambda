// Test that global requires work
const aws4 = require('aws4')

const interval = setInterval(console.log, 100, 'ping')

exports.handler = function (event, context) {
  console.log(process.version)
  console.log(process.execPath)
  console.log(process.execArgv)
  console.log(process.argv)
  console.log(process.cwd())
  console.log(process.env)
  console.log(event)
  console.log(context)
  console.log(context.getRemainingTimeInMillis())
  console.log(aws4)
  return Promise.resolve({ some: 'obj!' })
}

exports.handler2 = function (event, context) {
  setTimeout(context.done, 100, null, { some: 'obj!' })
}

exports.handler3 = function (event, context) {
  setTimeout(context.succeed, 100, { some: 'obj!' })
}

exports.handler4 = function (event, context) {
  setTimeout(context.fail, 100, new Error('This error should be logged'))
}

exports.handler5 = function (event, context, cb) {
  setTimeout(cb, 100, null, { some: 'obj!' })
  setTimeout(clearInterval, 100, interval)
}

exports.handler6 = function (event, context, cb) {
  context.callbackWaitsForEmptyEventLoop = false
  setTimeout(cb, 100, null, { some: 'obj!' })
}
