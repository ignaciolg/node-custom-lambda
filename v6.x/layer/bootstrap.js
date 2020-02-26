console.log( process.version );
function _typeof(obj) {
  "@babel/helpers - typeof";
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    _typeof = function _typeof(obj) {
      return obj &&
        typeof Symbol === "function" &&
        obj.constructor === Symbol &&
        obj !== Symbol.prototype
        ? "symbol"
        : typeof obj;
    };
  }
  return _typeof(obj);
}

function _slicedToArray(arr, i) {
  return (
    _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest()
  );
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance");
}

function _iterableToArrayLimit(arr, i) {
  if (
    !(
      Symbol.iterator in Object(arr) ||
      Object.prototype.toString.call(arr) === "[object Arguments]"
    )
  ) {
    return;
  }
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;
  try {
    for (
      var _i = arr[Symbol.iterator](), _s;
      !(_n = (_s = _i.next()).done);
      _n = true
    ) {
      _arr.push(_s.value);
      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }
  return _arr;
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

const http = require('http')

var RUNTIME_PATH = "/2018-06-01/runtime";
var CALLBACK_USED = Symbol("CALLBACK_USED");
var _process$env = process.env,
  AWS_LAMBDA_FUNCTION_NAME = _process$env.AWS_LAMBDA_FUNCTION_NAME,
  AWS_LAMBDA_FUNCTION_VERSION = _process$env.AWS_LAMBDA_FUNCTION_VERSION,
  AWS_LAMBDA_FUNCTION_MEMORY_SIZE =
    _process$env.AWS_LAMBDA_FUNCTION_MEMORY_SIZE,
  AWS_LAMBDA_LOG_GROUP_NAME = _process$env.AWS_LAMBDA_LOG_GROUP_NAME,
  AWS_LAMBDA_LOG_STREAM_NAME = _process$env.AWS_LAMBDA_LOG_STREAM_NAME,
  LAMBDA_TASK_ROOT = _process$env.LAMBDA_TASK_ROOT,
  _HANDLER = _process$env._HANDLER,
  AWS_LAMBDA_RUNTIME_API = _process$env.AWS_LAMBDA_RUNTIME_API;

var _AWS_LAMBDA_RUNTIME_A = AWS_LAMBDA_RUNTIME_API.split(":"),
  _AWS_LAMBDA_RUNTIME_A2 = _slicedToArray(_AWS_LAMBDA_RUNTIME_A, 2),
  HOST = _AWS_LAMBDA_RUNTIME_A2[0],
  PORT = _AWS_LAMBDA_RUNTIME_A2[1];

start();

function start() {
  var handler;
  return Promise.resolve()
    .then(function() {
      return Promise.resolve()
        .then(function() {
          handler = getHandler();
        })
        .catch(function(e) {
          return Promise.resolve()
            .then(function() {
              return initError(e);
            })
            .then(function() {
              return process.exit(1);
            });
        });
    })
    .then(function() {
      tryProcessEvents(handler);
    });
}

function tryProcessEvents(handler) {
  return Promise.resolve()
    .then(function() {
      return Promise.resolve()
        .then(function() {
          return processEvents(handler);
        })
        .catch(function(e) {
          console.error(e);
          return process.exit(1);
        });
    })
    .then(function() {});
}

function processEvents(handler) {
  function _recursive() {
    var _test;

    return Promise.resolve()
      .then(function() {
        _test = true;

        if (_test) {
          return Promise.resolve()
            .then(function() {
              return nextInvocation();
            })
            .then(function(_resp) {
              _ref = _resp;
              event = _ref.event;
              context = _ref.context;
              result = void 0;
              return Promise.resolve()
                .then(function() {
                  return handler(event, context);
                })
                .then(function(_resp) {
                  result = _resp;
                })
                .catch(function(e) {
                  return Promise.resolve()
                    .then(function() {
                      return invokeError(e, context);
                    })
                    .then(function() {
                      return _recursive();
                    });
                });
            })
            .then(function() {
              callbackUsed = context[CALLBACK_USED];
              return invokeResponse(result, context);
            });
        }
      })
      .then(function() {
        if (_test && callbackUsed && context.callbackWaitsForEmptyEventLoop) {
          return process.prependOnceListener("beforeExit", function() {
            return tryProcessEvents(handler);
          });
        } else {
          if (_test) {
            return _recursive();
          }
        }
      });
  }

  var _ref, event, context, result, callbackUsed, _temp;

  return Promise.resolve()
    .then(function() {
      return _recursive();
    })
    .then(function(_resp) {
      _temp = _resp;

      if (_temp !== _recursive) {
        return _temp;
      }
    });
}

function initError(err) {
  return postError("".concat(RUNTIME_PATH, "/init/error"), err);
}

function nextInvocation() {
  var res, deadlineMs, context, event;
  return Promise.resolve()
    .then(function() {
      return request({
        path: "".concat(RUNTIME_PATH, "/invocation/next")
      });
    })
    .then(function(_resp) {
      res = _resp;

      if (res.statusCode !== 200) {
        throw new Error(
          "Unexpected /invocation/next response: ".concat(JSON.stringify(res))
        );
      }

      if (res.headers["lambda-runtime-trace-id"]) {
        process.env._X_AMZN_TRACE_ID = res.headers["lambda-runtime-trace-id"];
      } else {
        delete process.env._X_AMZN_TRACE_ID;
      }

      deadlineMs = +res.headers["lambda-runtime-deadline-ms"];
      context = {
        awsRequestId: res.headers["lambda-runtime-aws-request-id"],
        invokedFunctionArn: res.headers["lambda-runtime-invoked-function-arn"],
        logGroupName: AWS_LAMBDA_LOG_GROUP_NAME,
        logStreamName: AWS_LAMBDA_LOG_STREAM_NAME,
        functionName: AWS_LAMBDA_FUNCTION_NAME,
        functionVersion: AWS_LAMBDA_FUNCTION_VERSION,
        memoryLimitInMB: AWS_LAMBDA_FUNCTION_MEMORY_SIZE,
        getRemainingTimeInMillis: function getRemainingTimeInMillis() {
          return deadlineMs - Date.now();
        },
        callbackWaitsForEmptyEventLoop: true
      };

      if (res.headers["lambda-runtime-client-context"]) {
        context.clientContext = JSON.parse(
          res.headers["lambda-runtime-client-context"]
        );
      }

      if (res.headers["lambda-runtime-cognito-identity"]) {
        context.identity = JSON.parse(
          res.headers["lambda-runtime-cognito-identity"]
        );
      }

      event = JSON.parse(res.body);
      return {
        event: event,
        context: context
      };
    });
}

function invokeResponse(result, context) {
  var res;
  return Promise.resolve()
    .then(function() {
      return request({
        method: "POST",
        path: ""
          .concat(RUNTIME_PATH, "/invocation/")
          .concat(context.awsRequestId, "/response"),
        body: JSON.stringify(result === undefined ? null : result)
      });
    })
    .then(function(_resp) {
      res = _resp;

      if (res.statusCode !== 202) {
        throw new Error(
          "Unexpected /invocation/response response: ".concat(
            JSON.stringify(res)
          )
        );
      }
    });
}

function invokeError(err, context) {
  return postError(
    ""
      .concat(RUNTIME_PATH, "/invocation/")
      .concat(context.awsRequestId, "/error"),
    err
  );
}

function postError(path, err) {
  var lambdaErr, res;
  return Promise.resolve()
    .then(function() {
      lambdaErr = toLambdaErr(err);
      return request({
        method: "POST",
        path: path,
        headers: {
          "Content-Type": "application/json",
          "Lambda-Runtime-Function-Error-Type": lambdaErr.errorType
        },
        body: JSON.stringify(lambdaErr)
      });
    })
    .then(function(_resp) {
      res = _resp;

      if (res.statusCode !== 202) {
        throw new Error(
          "Unexpected ".concat(path, " response: ").concat(JSON.stringify(res))
        );
      }
    });
}

function getHandler() {
  var appParts = _HANDLER.split(".");

  if (appParts.length !== 2) {
    throw new Error("Bad handler ".concat(_HANDLER));
  }

  var _appParts = _slicedToArray(appParts, 2),
    modulePath = _appParts[0],
    handlerName = _appParts[1]; // Let any errors here be thrown as-is to aid debugging

  var app = require(LAMBDA_TASK_ROOT + "/" + modulePath);

  var userHandler = app[handlerName];

  if (userHandler == null) {
    throw new Error(
      "Handler '"
        .concat(handlerName, "' missing on module '")
        .concat(modulePath, "'")
    );
  } else if (typeof userHandler !== "function") {
    throw new Error(
      "Handler '"
        .concat(handlerName, "' from '")
        .concat(modulePath, "' is not a function")
    );
  }

  return function(event, context) {
    return new Promise(function(resolve, reject) {
      context.succeed = resolve;
      context.fail = reject;

      context.done = function(err, data) {
        return err ? reject(err) : resolve(data);
      };

      var callback = function callback(err, data) {
        context[CALLBACK_USED] = true;
        context.done(err, data);
      };

      var result;

      try {
        result = userHandler(event, context, callback);
      } catch (e) {
        return reject(e);
      }

      if (result != null && typeof result.then === "function") {
        result.then(resolve, reject);
      }
    });
  };
}

function request(options) {
  options.host = HOST;
  options.port = PORT;
  return new Promise(function(resolve, reject) {
    var req = http.request(options, function(res) {
      var bufs = [];
      res.on("data", function(data) {
        return bufs.push(data);
      });
      res.on("end", function() {
        return resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: Buffer.concat(bufs).toString()
        });
      });
      res.on("error", reject);
    });
    req.on("error", reject);
    req.end(options.body);
  });
}

function toLambdaErr(err) {
  var name = err.name,
    message = err.message,
    stack = err.stack;
  return {
    errorType: name || _typeof(err),
    errorMessage: message || "" + err,
    stackTrace: (stack || "").split("\n").slice(1)
  };
}
