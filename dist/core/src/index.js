"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addConstants = addConstants;
exports.addPJWMethods = addPJWMethods;
exports.PJWEvMethod = PJWEvMethod;
exports.PJWEvChange = PJWEvChange;
Object.defineProperty(exports, "addType", {
  enumerable: true,
  get: function get() {
    return MIME.addType;
  }
});
exports["default"] = void 0;

var _construct2 = _interopRequireDefault(require("@babel/runtime/helpers/construct"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var _events = _interopRequireDefault(require("events"));

var _index = require("../../utils/src/index.js");

var _anyBase = _interopRequireDefault(require("any-base"));

var _mkdirp = _interopRequireDefault(require("mkdirp"));

var _request = _interopRequireDefault(require("./request"));

var _composite = _interopRequireDefault(require("./composite"));

var _promisify = _interopRequireDefault(require("./utils/promisify"));

var MIME = _interopRequireWildcard(require("./utils/mime"));

var _imageBitmap = require("./utils/image-bitmap");

var constants = _interopRequireWildcard(require("./constants"));

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

var alphabet = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$_'; // an array storing the maximum string length of hashes at various bases
// 0 and 1 do not exist as possible hash lengths

var maxHashLength = [NaN, NaN];

for (var i = 2; i < 65; i++) {
  var maxHash = (0, _anyBase["default"])(_anyBase["default"].BIN, alphabet.slice(0, i))(new Array(64 + 1).join('1'));
  maxHashLength.push(maxHash.length);
} // no operation


function noop() {} // error checking methods


function isArrayBuffer(test) {
  return Object.prototype.toString.call(test).toLowerCase().indexOf('arraybuffer') > -1;
} // Prepare a Buffer object from the arrayBuffer. Necessary in the browser > node conversion,
// But this function is not useful when running in node directly


function bufferFromArrayBuffer(arrayBuffer) {
  var buffer = Buffer.alloc(arrayBuffer.byteLength);
  var view = new Uint8Array(arrayBuffer);

  for (var _i = 0; _i < buffer.length; ++_i) {
    buffer[_i] = view[_i];
  }

  return buffer;
}

function loadFromURL(options, cb) {
  (0, _request["default"])(options, function (err, response, data) {
    if (err) {
      return cb(err);
    }

    if ('headers' in response && 'location' in response.headers) {
      options.url = response.headers.location;
      return loadFromURL(options, cb);
    }

    if ((0, _typeof2["default"])(data) === 'object' && Buffer.isBuffer(data)) {
      return cb(null, data);
    }

    var msg = 'Could not load Buffer from <' + options.url + '> ' + '(HTTP: ' + response.statusCode + ')';
    return new Error(msg);
  });
}

function loadBufferFromPath(src, cb) {
  if (_fs["default"] && typeof _fs["default"].readFile === 'function' && !src.match(/^(http|ftp)s?:\/\/./)) {
    _fs["default"].readFile(src, cb);
  } else {
    loadFromURL({
      url: src
    }, cb);
  }
}

function isRawRGBAData(obj) {
  return obj && (0, _typeof2["default"])(obj) === 'object' && typeof obj.width === 'number' && typeof obj.height === 'number' && (Buffer.isBuffer(obj.data) || obj.data instanceof Uint8Array || typeof Uint8ClampedArray === 'function' && obj.data instanceof Uint8ClampedArray) && (obj.data.length === obj.width * obj.height * 4 || obj.data.length === obj.width * obj.height * 3);
}

function makeRGBABufferFromRGB(buffer) {
  if (buffer.length % 3 !== 0) {
    throw new Error('Buffer length is incorrect');
  }

  var rgbaBuffer = Buffer.allocUnsafe(buffer.length / 3 * 4);
  var j = 0;

  for (var _i2 = 0; _i2 < buffer.length; _i2++) {
    rgbaBuffer[j] = buffer[_i2];

    if ((_i2 + 1) % 3 === 0) {
      rgbaBuffer[++j] = 255;
    }

    j++;
  }

  return rgbaBuffer;
}

var emptyBitmap = {
  data: null,
  width: null,
  height: null
};
/**
 * PJW constructor (from a file)
 * @param path a path to the image
 * @param {function(Error, PJW)} cb (optional) a function to call when the image is parsed to a bitmap
 */

/**
 * PJW constructor (from a url with options)
 * @param options { url, otherOptions}
 * @param {function(Error, PJW)} cb (optional) a function to call when the image is parsed to a bitmap
 */

/**
 * PJW constructor (from another PJW image or raw image data)
 * @param image a PJW image to clone
 * @param {function(Error, PJW)} cb a function to call when the image is parsed to a bitmap
 */

/**
 * PJW constructor (from a Buffer)
 * @param data a Buffer containing the image data
 * @param {function(Error, PJW)} cb a function to call when the image is parsed to a bitmap
 */

/**
 * PJW constructor (to generate a new image)
 * @param w the width of the image
 * @param h the height of the image
 * @param {function(Error, PJW)} cb (optional) a function to call when the image is parsed to a bitmap
 */

/**
 * PJW constructor (to generate a new image)
 * @param w the width of the image
 * @param h the height of the image
 * @param background color to fill the image with
 * @param {function(Error, PJW)} cb (optional) a function to call when the image is parsed to a bitmap
 */

var PJW = /*#__PURE__*/function (_EventEmitter) {
  (0, _inherits2["default"])(PJW, _EventEmitter);

  var _super = _createSuper(PJW);

  // An object representing a bitmap in memory, comprising:
  //  - data: a buffer of the bitmap data
  //  - width: the width of the image in pixels
  //  - height: the height of the image in pixels
  // Default colour to use for new pixels
  // Default MIME is PNG
  // Exif data for the image
  // Whether Transparency supporting formats will be exported as RGB or RGBA
  function PJW() {
    var _this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    (0, _classCallCheck2["default"])(this, PJW);
    _this = _super.call(this);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "bitmap", emptyBitmap);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_background", 0x00000000);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_originalMime", PJW.MIME_PNG);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_exif", null);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_rgba", true);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "writeAsync", function (path) {
      return (0, _promisify["default"])(_this.write, (0, _assertThisInitialized2["default"])(_this), path);
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "getBase64Async", function (mime) {
      return (0, _promisify["default"])(_this.getBase64, (0, _assertThisInitialized2["default"])(_this), mime);
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "getBuffer", _imageBitmap.getBuffer);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "getBufferAsync", _imageBitmap.getBufferAsync);
    var PJWInstance = (0, _assertThisInitialized2["default"])(_this);
    var cb = noop;

    if (isArrayBuffer(args[0])) {
      args[0] = bufferFromArrayBuffer(args[0]);
    }

    function finish() {
      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      var err = args[0];
      var evData = err || {};
      evData.methodName = 'constructor';
      setTimeout(function () {
        var _cb;

        // run on next tick.
        if (err && cb === noop) {
          PJWInstance.emitError('constructor', err);
        } else if (!err) {
          PJWInstance.emitMulti('constructor', 'initialized');
        }

        (_cb = cb).call.apply(_cb, [PJWInstance].concat(args));
      }, 1);
    }

    if (typeof args[0] === 'number' && typeof args[1] === 'number' || parseInt(args[0], 10) && parseInt(args[1], 10)) {
      // create a new image
      var w = parseInt(args[0], 10);
      var h = parseInt(args[1], 10);
      cb = args[2]; // with a hex color

      if (typeof args[2] === 'number') {
        _this._background = args[2];
        cb = args[3];
      } // with a css color


      if (typeof args[2] === 'string') {
        _this._background = PJW.cssColorToHex(args[2]);
        cb = args[3];
      }

      if (typeof cb === 'undefined') {
        cb = noop;
      }

      if (typeof cb !== 'function') {
        return (0, _possibleConstructorReturn2["default"])(_this, _index.throwError.call((0, _assertThisInitialized2["default"])(_this), 'cb must be a function', finish));
      }

      _this.bitmap = {
        data: Buffer.alloc(w * h * 4),
        width: w,
        height: h
      };

      for (var _i3 = 0; _i3 < _this.bitmap.data.length; _i3 += 4) {
        _this.bitmap.data.writeUInt32BE(_this._background, _i3);
      }

      finish(null, (0, _assertThisInitialized2["default"])(_this));
    } else if ((0, _typeof2["default"])(args[0]) === 'object' && args[0].url) {
      cb = args[1] || noop;

      if (typeof cb !== 'function') {
        return (0, _possibleConstructorReturn2["default"])(_this, _index.throwError.call((0, _assertThisInitialized2["default"])(_this), 'cb must be a function', finish));
      }

      loadFromURL(args[0], function (err, data) {
        if (err) {
          return _index.throwError.call((0, _assertThisInitialized2["default"])(_this), err, finish);
        }

        _this.parseBitmap(data, args[0].url, finish);
      });
    } else if (args[0] instanceof PJW) {
      // clone an existing PJW
      var original = args[0];
      cb = args[1];

      if (typeof cb === 'undefined') {
        cb = noop;
      }

      if (typeof cb !== 'function') {
        return (0, _possibleConstructorReturn2["default"])(_this, _index.throwError.call((0, _assertThisInitialized2["default"])(_this), 'cb must be a function', finish));
      }

      _this.bitmap = {
        data: Buffer.from(original.bitmap.data),
        width: original.bitmap.width,
        height: original.bitmap.height
      };
      _this._quality = original._quality;
      _this._deflateLevel = original._deflateLevel;
      _this._deflateStrategy = original._deflateStrategy;
      _this._filterType = original._filterType;
      _this._rgba = original._rgba;
      _this._background = original._background;
      _this._originalMime = original._originalMime;
      finish(null, (0, _assertThisInitialized2["default"])(_this));
    } else if (isRawRGBAData(args[0])) {
      var imageData = args[0];
      cb = args[1] || noop;
      var isRGBA = imageData.width * imageData.height * 4 === imageData.data.length;
      var buffer = isRGBA ? Buffer.from(imageData.data) : makeRGBABufferFromRGB(imageData.data);
      _this.bitmap = {
        data: buffer,
        width: imageData.width,
        height: imageData.height
      };
      finish(null, (0, _assertThisInitialized2["default"])(_this));
    } else if (typeof args[0] === 'string') {
      // read from a path
      var path = args[0];
      cb = args[1];

      if (typeof cb === 'undefined') {
        cb = noop;
      }

      if (typeof cb !== 'function') {
        return (0, _possibleConstructorReturn2["default"])(_this, _index.throwError.call((0, _assertThisInitialized2["default"])(_this), 'cb must be a function', finish));
      }

      loadBufferFromPath(path, function (err, data) {
        if (err) {
          return _index.throwError.call((0, _assertThisInitialized2["default"])(_this), err, finish);
        }

        _this.parseBitmap(data, path, finish);
      });
    } else if ((0, _typeof2["default"])(args[0]) === 'object' && Buffer.isBuffer(args[0])) {
      // read from a buffer
      var data = args[0];
      cb = args[1];

      if (typeof cb !== 'function') {
        return (0, _possibleConstructorReturn2["default"])(_this, _index.throwError.call((0, _assertThisInitialized2["default"])(_this), 'cb must be a function', finish));
      }

      _this.parseBitmap(data, null, finish);
    } else {
      // Allow client libs to add new ways to build a PJW object.
      // Extra constructors must be added by `PJW.appendConstructorOption()`
      cb = args[args.length - 1];

      if (typeof cb !== 'function') {
        // TODO: try to solve the args after cb problem.
        cb = args[args.length - 2];

        if (typeof cb !== 'function') {
          cb = noop;
        }
      }

      var extraConstructor = PJW.__extraConstructors.find(function (c) {
        return c.test.apply(c, args);
      });

      if (extraConstructor) {
        new Promise(function (resolve, reject) {
          var _extraConstructor$run;

          return (_extraConstructor$run = extraConstructor.run).call.apply(_extraConstructor$run, [(0, _assertThisInitialized2["default"])(_this), resolve, reject].concat(args));
        }).then(function () {
          return finish(null, (0, _assertThisInitialized2["default"])(_this));
        })["catch"](finish);
      } else {
        return (0, _possibleConstructorReturn2["default"])(_this, _index.throwError.call((0, _assertThisInitialized2["default"])(_this), 'No matching constructor overloading was found. ' + 'Please see the docs for how to call the PJW constructor.', finish));
      }
    }

    return _this;
  }
  /**
   * Parse a bitmap with the loaded image types.
   *
   * @param {Buffer} data raw image data
   * @param {string} path optional path to file
   * @param {function(Error, PJW)} finish (optional) a callback for when complete
   * @memberof PJW
   */


  (0, _createClass2["default"])(PJW, [{
    key: "parseBitmap",
    value: function parseBitmap(data, path, finish) {
      _imageBitmap.parseBitmap.call(this, data, null, finish);
    }
    /**
     * Sets the type of the image (RGB or RGBA) when saving in a format that supports transparency (default is RGBA)
     * @param {boolean} bool A Boolean, true to use RGBA or false to use RGB
     * @param {function(Error, PJW)} cb (optional) a callback for when complete
     * @returns {PJW} this for chaining of methods
     */

  }, {
    key: "rgba",
    value: function rgba(bool, cb) {
      if (typeof bool !== 'boolean') {
        return _index.throwError.call(this, 'bool must be a boolean, true for RGBA or false for RGB', cb);
      }

      this._rgba = bool;

      if ((0, _index.isNodePattern)(cb)) {
        cb.call(this, null, this);
      }

      return this;
    }
    /**
     * Emit for multiple listeners
     * @param {string} methodName name of the method to emit an error for
     * @param {string} eventName name of the eventName to emit an error for
     * @param {object} data to emit
     */

  }, {
    key: "emitMulti",
    value: function emitMulti(methodName, eventName) {
      var data = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      data = Object.assign(data, {
        methodName: methodName,
        eventName: eventName
      });
      this.emit('any', data);

      if (methodName) {
        this.emit(methodName, data);
      }

      this.emit(eventName, data);
    }
  }, {
    key: "emitError",
    value: function emitError(methodName, err) {
      this.emitMulti(methodName, 'error', err);
    }
    /**
     * Get the current height of the image
     * @return {number} height of the image
     */

  }, {
    key: "getHeight",
    value: function getHeight() {
      return this.bitmap.height;
    }
    /**
     * Get the current width of the image
     * @return {number} width of the image
     */

  }, {
    key: "getWidth",
    value: function getWidth() {
      return this.bitmap.width;
    }
    /**
     * Nicely format PJW object when sent to the console e.g. console.log(image)
     * @returns {string} pretty printed
     */

  }, {
    key: "inspect",
    value: function inspect() {
      return '<PJW ' + (this.bitmap === emptyBitmap ? 'pending...' : this.bitmap.width + 'x' + this.bitmap.height) + '>';
    }
    /**
     * Nicely format PJW object when converted to a string
     * @returns {string} pretty printed
     */

  }, {
    key: "toString",
    value: function toString() {
      return '[object PJW]';
    }
    /**
     * Returns the original MIME of the image (default: "image/png")
     * @returns {string} the MIME
     */

  }, {
    key: "getMIME",
    value: function getMIME() {
      var mime = this._originalMime || PJW.MIME_PNG;
      return mime;
    }
    /**
     * Returns the appropriate file extension for the original MIME of the image (default: "png")
     * @returns {string} the file extension
     */

  }, {
    key: "getExtension",
    value: function getExtension() {
      var mime = this.getMIME();
      return MIME.getExtension(mime);
    }
    /**
     * Writes the image to a file
     * @param {string} path a path to the destination file
     * @param {function(Error, PJW)} cb (optional) a function to call when the image is saved to disk
     * @returns {PJW} this for chaining of methods
     */

  }, {
    key: "write",
    value: function write(path, cb) {
      var _this2 = this;

      if (!_fs["default"] || !_fs["default"].createWriteStream) {
        throw new Error('Cant access the filesystem. You can use the getBase64 method.');
      }

      if (typeof path !== 'string') {
        return _index.throwError.call(this, 'path must be a string', cb);
      }

      if (typeof cb === 'undefined') {
        cb = noop;
      }

      if (typeof cb !== 'function') {
        return _index.throwError.call(this, 'cb must be a function', cb);
      }

      var mime = MIME.getType(path) || this.getMIME();

      var pathObj = _path["default"].parse(path);

      if (pathObj.dir) {
        _mkdirp["default"].sync(pathObj.dir);
      }

      this.getBuffer(mime, function (err, buffer) {
        if (err) {
          return _index.throwError.call(_this2, err, cb);
        }

        var stream = _fs["default"].createWriteStream(path);

        stream.on('open', function () {
          stream.write(buffer);
          stream.end();
        }).on('error', function (err) {
          return _index.throwError.call(_this2, err, cb);
        });
        stream.on('finish', function () {
          cb.call(_this2, null, _this2);
        });
      });
      return this;
    }
  }, {
    key: "getBase64",

    /**
     * Converts the image to a base 64 string
     * @param {string} mime the mime type of the image data to be created
     * @param {function(Error, PJW)} cb a Node-style function to call with the buffer as the second argument
     * @returns {PJW} this for chaining of methods
     */
    value: function () {
      var _getBase = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(mime, cb) {
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (mime === PJW.AUTO) {
                  // allow auto MIME detection
                  mime = this.getMIME();
                }

                if (!(typeof mime !== 'string')) {
                  _context.next = 3;
                  break;
                }

                return _context.abrupt("return", _index.throwError.call(this, 'mime must be a string', cb));

              case 3:
                if (!(typeof cb !== 'function')) {
                  _context.next = 5;
                  break;
                }

                return _context.abrupt("return", _index.throwError.call(this, 'cb must be a function', cb));

              case 5:
                _context.next = 7;
                return this.getBuffer(mime, function (err, data) {
                  if (err) {
                    return _index.throwError.call(this, err, cb);
                  }

                  var src = 'data:' + mime + ';base64,' + data.toString('base64');
                  cb.call(this, null, src);
                });

              case 7:
                return _context.abrupt("return", this);

              case 8:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function getBase64(_x, _x2) {
        return _getBase.apply(this, arguments);
      }

      return getBase64;
    }()
  }, {
    key: "getPixelIndex",

    /**
     * Returns the offset of a pixel in the bitmap buffer
     * @param {number} x the x coordinate
     * @param {number} y the y coordinate
     * @param {string} edgeHandling (optional) define how to sum pixels from outside the border
     * @param {number} cb (optional) a callback for when complete
     * @returns {number} the index of the pixel or -1 if not found
     */
    value: function getPixelIndex(x, y, edgeHandling, cb) {
      var xi;
      var yi;

      if (typeof edgeHandling === 'function' && typeof cb === 'undefined') {
        cb = edgeHandling;
        edgeHandling = null;
      }

      if (!edgeHandling) {
        edgeHandling = PJW.EDGE_EXTEND;
      }

      if (typeof x !== 'number' || typeof y !== 'number') {
        return _index.throwError.call(this, 'x and y must be numbers', cb);
      } // round input


      x = Math.round(x);
      y = Math.round(y);
      xi = x;
      yi = y;

      if (edgeHandling === PJW.EDGE_EXTEND) {
        if (x < 0) xi = 0;
        if (x >= this.bitmap.width) xi = this.bitmap.width - 1;
        if (y < 0) yi = 0;
        if (y >= this.bitmap.height) yi = this.bitmap.height - 1;
      }

      if (edgeHandling === PJW.EDGE_WRAP) {
        if (x < 0) {
          xi = this.bitmap.width + x;
        }

        if (x >= this.bitmap.width) {
          xi = x % this.bitmap.width;
        }

        if (y < 0) {
          xi = this.bitmap.height + y;
        }

        if (y >= this.bitmap.height) {
          yi = y % this.bitmap.height;
        }
      }

      var i = this.bitmap.width * yi + xi << 2; // if out of bounds index is -1

      if (xi < 0 || xi >= this.bitmap.width) {
        i = -1;
      }

      if (yi < 0 || yi >= this.bitmap.height) {
        i = -1;
      }

      if ((0, _index.isNodePattern)(cb)) {
        cb.call(this, null, i);
      }

      return i;
    } // /**
    //  * Returns the hex colour value of a pixel
    //  * @param {number} x the x coordinate
    //  * @param {number} y the y coordinate
    //  * @param {function(Error, PJW)} cb (optional) a callback for when complete
    //  * @returns {number} the color of the pixel
    //  */
    // getPixelColor(x, y, cb) {
    //   if (typeof x !== 'number' || typeof y !== 'number')
    //     return throwError.call(this, 'x and y must be numbers', cb);
    //   // round input
    //   x = Math.round(x);
    //   y = Math.round(y);
    //   const idx = this.getPixelIndex(x, y);
    //   const hex = this.bitmap.data.readUInt32BE(idx);
    //   if (isNodePattern(cb)) {
    //     cb.call(this, null, hex);
    //   }
    //   return hex;
    // }
    // getPixelColour = this.getPixelColor;
    // /**
    //  * Returns the hex colour value of a pixel
    //  * @param {number} hex color to set
    //  * @param {number} x the x coordinate
    //  * @param {number} y the y coordinate
    //  * @param {function(Error, PJW)} cb (optional) a callback for when complete
    //  * @returns {number} the index of the pixel or -1 if not found
    //  */
    // setPixelColor(hex, x, y, cb) {
    //   if (
    //     typeof hex !== 'number' ||
    //     typeof x !== 'number' ||
    //     typeof y !== 'number'
    //   )
    //     return throwError.call(this, 'hex, x and y must be numbers', cb);
    //   // round input
    //   x = Math.round(x);
    //   y = Math.round(y);
    //   const idx = this.getPixelIndex(x, y);
    //   this.bitmap.data.writeUInt32BE(hex, idx);
    //   if (isNodePattern(cb)) {
    //     cb.call(this, null, this);
    //   }
    //   return this;
    // }
    // setPixelColour = this.setPixelColor;
    // /**
    //  * Determine if the image contains opaque pixels.
    //  * @return {boolean} hasAlpha whether the image contains opaque pixels
    //  */
    // hasAlpha() {
    //   for (let yIndex = 0; yIndex < this.bitmap.height; yIndex++) {
    //     for (let xIndex = 0; xIndex < this.bitmap.width; xIndex++) {
    //       const idx = (this.bitmap.width * yIndex + xIndex) << 2;
    //       const alpha = this.bitmap.data[idx + 3];
    //       if (alpha !== 0xff) {
    //         return true;
    //       }
    //     }
    //   }
    //   return false;
    // }

    /**
     * Iterate scan through a region of the bitmap
     * @param {number} x the x coordinate to begin the scan at
     * @param {number} y the y coordinate to begin the scan at
     * @param w the width of the scan region
     * @param h the height of the scan region
     * @returns {IterableIterator<{x: number, y: number, idx: number, image: PJW}>}
     */

  }, {
    key: "scanIterator",
    value: function scanIterator(x, y, w, h) {
      if (typeof x !== 'number' || typeof y !== 'number') {
        return _index.throwError.call(this, 'x and y must be numbers');
      }

      if (typeof w !== 'number' || typeof h !== 'number') {
        return _index.throwError.call(this, 'w and h must be numbers');
      }

      return (0, _index.scanIterator)(this, x, y, w, h);
    }
  }]);
  return PJW;
}(_events["default"]);

function addConstants(constants) {
  var PJWInstance = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : PJW;
  Object.entries(constants).forEach(function (_ref) {
    var _ref2 = (0, _slicedToArray2["default"])(_ref, 2),
        name = _ref2[0],
        value = _ref2[1];

    PJWInstance[name] = value;
  });
}

function addPJWMethods(methods) {
  var PJWInstance = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : PJW;
  Object.entries(methods).forEach(function (_ref3) {
    var _ref4 = (0, _slicedToArray2["default"])(_ref3, 2),
        name = _ref4[0],
        value = _ref4[1];

    PJWInstance.prototype[name] = value;
  });
}

addConstants(constants);
addPJWMethods({
  composite: _composite["default"]
});
PJW.__extraConstructors = [];
/**
 * Allow client libs to add new ways to build a PJW object.
 * @param {string} name identify the extra constructor.
 * @param {function} test a function that returns true when it accepts the arguments passed to the main constructor.
 * @param {function} run where the magic happens.
 */

PJW.appendConstructorOption = function (name, test, run) {
  PJW.__extraConstructors.push({
    name: name,
    test: test,
    run: run
  });
};
/**
 * Read an image from a file or a Buffer. Takes the same args as the constructor
 * @returns {Promise} a promise
 */


PJW.read = function () {
  for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
    args[_key3] = arguments[_key3];
  }

  return new Promise(function (resolve, reject) {
    (0, _construct2["default"])(PJW, args.concat([function (err, image) {
      if (err) reject(err);else resolve(image);
    }]));
  });
};

PJW.create = PJW.read; // /**
//  * A static helper method that converts RGBA values to a single integer value
//  * @param {number} r the red value (0-255)
//  * @param {number} g the green value (0-255)
//  * @param {number} b the blue value (0-255)
//  * @param {number} a the alpha value (0-255)
//  * @param {function(Error, PJW)} cb (optional) A callback for when complete
//  * @returns {number} an single integer colour value
//  */
// PJW.rgbaToInt = function(r, g, b, a, cb) {
//   if (
//     typeof r !== 'number' ||
//     typeof g !== 'number' ||
//     typeof b !== 'number' ||
//     typeof a !== 'number'
//   ) {
//     return throwError.call(this, 'r, g, b and a must be numbers', cb);
//   }
//   if (r < 0 || r > 255) {
//     return throwError.call(this, 'r must be between 0 and 255', cb);
//   }
//   if (g < 0 || g > 255) {
//     throwError.call(this, 'g must be between 0 and 255', cb);
//   }
//   if (b < 0 || b > 255) {
//     return throwError.call(this, 'b must be between 0 and 255', cb);
//   }
//   if (a < 0 || a > 255) {
//     return throwError.call(this, 'a must be between 0 and 255', cb);
//   }
//   r = Math.round(r);
//   b = Math.round(b);
//   g = Math.round(g);
//   a = Math.round(a);
//   const i =
//     r * Math.pow(256, 3) +
//     g * Math.pow(256, 2) +
//     b * Math.pow(256, 1) +
//     a * Math.pow(256, 0);
//   if (isNodePattern(cb)) {
//     cb.call(this, null, i);
//   }
//   return i;
// };
// /**
//  * A static helper method that converts RGBA values to a single integer value
//  * @param {number} i a single integer value representing an RGBA colour (e.g. 0xFF0000FF for red)
//  * @param {function(Error, PJW)} cb (optional) A callback for when complete
//  * @returns {object} an object with the properties r, g, b and a representing RGBA values
//  */
// PJW.intToRGBA = function(i, cb) {
//   if (typeof i !== 'number') {
//     return throwError.call(this, 'i must be a number', cb);
//   }
//   const rgba = {};
//   rgba.r = Math.floor(i / Math.pow(256, 3));
//   rgba.g = Math.floor((i - rgba.r * Math.pow(256, 3)) / Math.pow(256, 2));
//   rgba.b = Math.floor(
//     (i - rgba.r * Math.pow(256, 3) - rgba.g * Math.pow(256, 2)) /
//       Math.pow(256, 1)
//   );
//   rgba.a = Math.floor(
//     (i -
//       rgba.r * Math.pow(256, 3) -
//       rgba.g * Math.pow(256, 2) -
//       rgba.b * Math.pow(256, 1)) /
//       Math.pow(256, 0)
//   );
//   if (isNodePattern(cb)) {
//     cb.call(this, null, rgba);
//   }
//   return rgba;
// };
// /**
//  * Converts a css color (Hex, 8-digit (RGBA) Hex, RGB, RGBA, HSL, HSLA, HSV, HSVA, Named) to a hex number
//  * @param {string} cssColor a number
//  * @returns {number} a hex number representing a color
//  */
// PJW.cssColorToHex = function(cssColor) {
//   cssColor = cssColor || 0; // 0, null, undefined, NaN
//   if (typeof cssColor === 'number') return Number(cssColor);
//   return parseInt(tinyColor(cssColor).toHex8(), 16);
// };

/**
 * Limits a number to between 0 or 255
 * @param {number} n a number
 * @returns {number} the number limited to between 0 or 255
 */

PJW.limit255 = function (n) {
  n = Math.max(n, 0);
  n = Math.min(n, 255);
  return n;
};
/**
 * Diffs two images and returns
 * @param {PJW} img1 a PJW image to compare
 * @param {PJW} img2 a PJW image to compare
 * @param {number} threshold (optional) a number, 0 to 1, the smaller the value the more sensitive the comparison (default: 0.1)
 * @returns {object} an object { percent: percent similar, diff: a PJW image highlighting differences }
 */
// PJW.diff = function(img1, img2, threshold = 0.1) {
//   if (!(img1 instanceof PJW) || !(img2 instanceof PJW))
//     return throwError.call(this, 'img1 and img2 must be an PJW images');
//   const bmp1 = img1.bitmap;
//   const bmp2 = img2.bitmap;
//   if (bmp1.width !== bmp2.width || bmp1.height !== bmp2.height) {
//     if (bmp1.width * bmp1.height > bmp2.width * bmp2.height) {
//       // img1 is bigger
//       img1 = img1.cloneQuiet().resize(bmp2.width, bmp2.height);
//     } else {
//       // img2 is bigger (or they are the same in area)
//       img2 = img2.cloneQuiet().resize(bmp1.width, bmp1.height);
//     }
//   }
//   if (typeof threshold !== 'number' || threshold < 0 || threshold > 1) {
//     return throwError.call(this, 'threshold must be a number between 0 and 1');
//   }
//   const diff = new PJW(bmp1.width, bmp1.height, 0xffffffff);
//   const numDiffPixels = pixelMatch(
//     bmp1.data,
//     bmp2.data,
//     diff.bitmap.data,
//     diff.bitmap.width,
//     diff.bitmap.height,
//     { threshold }
//   );
//   return {
//     percent: numDiffPixels / (diff.bitmap.width * diff.bitmap.height),
//     image: diff
//   };
// };

/**
 * Calculates the hamming distance of two images based on their perceptual hash
 * @param {PJW} img1 a PJW image to compare
 * @param {PJW} img2 a PJW image to compare
 * @returns {number} a number ranging from 0 to 1, 0 means they are believed to be identical
 */
// PJW.distance = function(img1, img2) {
//   const phash = new ImagePHash();
//   const hash1 = phash.getHash(img1);
//   const hash2 = phash.getHash(img2);
//   return phash.distance(hash1, hash2);
// };

/**
 * Calculates the hamming distance of two images based on their perceptual hash
 * @param {hash} hash1 a pHash
 * @param {hash} hash2 a pHash
 * @returns {number} a number ranging from 0 to 1, 0 means they are believed to be identical
 */
// PJW.compareHashes = function(hash1, hash2) {
//   const phash = new ImagePHash();
//   return phash.distance(hash1, hash2);
// };

/**
 * Compute color difference
 * 0 means no difference, 1 means maximum difference.
 * @param {number} rgba1:    first color to compare.
 * @param {number} rgba2:    second color to compare.
 * Both parameters must be an color object {r:val, g:val, b:val, a:val}
 * Where `a` is optional and `val` is an integer between 0 and 255.
 * @returns {number} float between 0 and 1.
 */
// PJW.colorDiff = function(rgba1, rgba2) {
//   const pow = n => Math.pow(n, 2);
//   const { max } = Math;
//   const maxVal = 255 * 255 * 3;
//   if (rgba1.a !== 0 && !rgba1.a) {
//     rgba1.a = 255;
//   }
//   if (rgba2.a !== 0 && !rgba2.a) {
//     rgba2.a = 255;
//   }
//   return (
//     (max(pow(rgba1.r - rgba2.r), pow(rgba1.r - rgba2.r - rgba1.a + rgba2.a)) +
//       max(pow(rgba1.g - rgba2.g), pow(rgba1.g - rgba2.g - rgba1.a + rgba2.a)) +
//       max(pow(rgba1.b - rgba2.b), pow(rgba1.b - rgba2.b - rgba1.a + rgba2.a))) /
//     maxVal
//   );
// };

/**
 * Helper to create PJW methods that emit events before and after its execution.
 * @param {string} methodName   The name to be appended to PJW prototype.
 * @param {string} evName       The event name to be called.
 *                     It will be prefixed by `before-` and emitted when on method call.
 *                     It will be appended by `ed` and emitted after the method run.
 * @param {function} method       A function implementing the method itself.
 * It will also create a quiet version that will not emit events, to not
 * mess the user code with many `changed` event calls. You can call with
 * `methodName + "Quiet"`.
 *
 * The emitted event comes with a object parameter to the listener with the
 * `methodName` as one attribute.
 */


function PJWEvMethod(methodName, evName, method) {
  var evNameBefore = 'before-' + evName;
  var evNameAfter = evName.replace(/e$/, '') + 'ed';

  PJW.prototype[methodName] = function () {
    var wrappedCb;

    for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      args[_key4] = arguments[_key4];
    }

    var cb = args[method.length - 1];
    var PJWInstance = this;

    if (typeof cb === 'function') {
      wrappedCb = function wrappedCb() {
        for (var _len5 = arguments.length, args = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
          args[_key5] = arguments[_key5];
        }

        var err = args[0],
            data = args[1];

        if (err) {
          PJWInstance.emitError(methodName, err);
        } else {
          PJWInstance.emitMulti(methodName, evNameAfter, (0, _defineProperty2["default"])({}, methodName, data));
        }

        cb.apply(this, args);
      };

      args[args.length - 1] = wrappedCb;
    } else {
      wrappedCb = false;
    }

    this.emitMulti(methodName, evNameBefore);
    var result;

    try {
      result = method.apply(this, args);

      if (!wrappedCb) {
        this.emitMulti(methodName, evNameAfter, (0, _defineProperty2["default"])({}, methodName, result));
      }
    } catch (error) {
      error.methodName = methodName;
      this.emitError(methodName, error);
    }

    return result;
  };

  PJW.prototype[methodName + 'Quiet'] = method;
}
/**
 * Creates a new image that is a clone of this one.
 * @param {function(Error, PJW)} cb (optional) A callback for when complete
 * @returns the new image
 */


PJWEvMethod('clone', 'clone', function (cb) {
  var clone = new PJW(this);

  if ((0, _index.isNodePattern)(cb)) {
    cb.call(clone, null, clone);
  }

  return clone;
});
/**
 * Simplify PJWEvMethod call for the common `change` evName.
 * @param {string} methodName name of the method
 * @param {function} method to watch changes for
 */

function PJWEvChange(methodName, method) {
  PJWEvMethod(methodName, 'change', method);
}
/**
 * Sets the type of the image (RGB or RGBA) when saving as PNG format (default is RGBA)
 * @param b A Boolean, true to use RGBA or false to use RGB
 * @param {function(Error, PJW)} cb (optional) a callback for when complete
 * @returns {PJW} this for chaining of methods
 */


PJWEvChange('background', function (hex, cb) {
  if (typeof hex !== 'number') {
    return _index.throwError.call(this, 'hex must be a hexadecimal rgba value', cb);
  }

  this._background = hex;

  if ((0, _index.isNodePattern)(cb)) {
    cb.call(this, null, this);
  }

  return this;
});
/**
 * Scans through a region of the bitmap, calling a function for each pixel.
 * @param {number} x the x coordinate to begin the scan at
 * @param {number} y the y coordinate to begin the scan at
 * @param w the width of the scan region
 * @param h the height of the scan region
 * @param f a function to call on even pixel; the (x, y) position of the pixel
 * and the index of the pixel in the bitmap buffer are passed to the function
 * @param {function(Error, PJW)} cb (optional) a callback for when complete
 * @returns {PJW} this for chaining of methods
 */

PJWEvChange('scan', function (x, y, w, h, f, cb) {
  if (typeof x !== 'number' || typeof y !== 'number') {
    return _index.throwError.call(this, 'x and y must be numbers', cb);
  }

  if (typeof w !== 'number' || typeof h !== 'number') {
    return _index.throwError.call(this, 'w and h must be numbers', cb);
  }

  if (typeof f !== 'function') {
    return _index.throwError.call(this, 'f must be a function', cb);
  }

  var result = (0, _index.scan)(this, x, y, w, h, f);

  if ((0, _index.isNodePattern)(cb)) {
    cb.call(this, null, result);
  }

  return result;
});

if (process.env.ENVIRONMENT === 'BROWSER') {
  // For use in a web browser or web worker

  /* global self */
  var gl;

  if (typeof window !== 'undefined' && (typeof window === "undefined" ? "undefined" : (0, _typeof2["default"])(window)) === 'object') {
    gl = window;
  }

  if (typeof self !== 'undefined' && (typeof self === "undefined" ? "undefined" : (0, _typeof2["default"])(self)) === 'object') {
    gl = self;
  }

  gl.PJW = PJW;
  gl.Buffer = Buffer;
}

var _default = PJW;
exports["default"] = _default;
//# sourceMappingURL=index.js.map