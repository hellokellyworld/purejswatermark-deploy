"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseBitmap = parseBitmap;
exports.getBuffer = getBuffer;
exports.getBufferAsync = getBufferAsync;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _fileType = _interopRequireDefault(require("file-type"));

var _exifParser = _interopRequireDefault(require("exif-parser"));

var _index = require("../../../utils/src/index.js");

var constants = _interopRequireWildcard(require("../constants"));

var MIME = _interopRequireWildcard(require("./mime"));

var _promisify = _interopRequireDefault(require("./promisify"));

//'@PJW/utils';
function getMIMEFromBuffer(buffer, path) {
  var fileTypeFromBuffer = (0, _fileType["default"])(buffer);

  if (fileTypeFromBuffer) {
    // If fileType returns something for buffer, then return the mime given
    return fileTypeFromBuffer.mime;
  }

  if (path) {
    // If a path is supplied, and fileType yields no results, then retry with MIME
    // Path can be either a file path or a url
    return MIME.getType(path);
  }

  return null;
}
/*
 * Obtains image orientation from EXIF metadata.
 *
 * @param img {PJW} a PJW image object
 * @returns {number} a number 1-8 representing EXIF orientation,
 *          in particular 1 if orientation tag is missing
 */


function getExifOrientation(img) {
  return img._exif && img._exif.tags && img._exif.tags.Orientation || 1;
}
/**
 * Returns a function which translates EXIF-rotated coordinates into
 * non-rotated ones.
 *
 * Transformation reference: http://sylvana.net/jpegcrop/exif_orientation.html.
 *
 * @param img {PJW} a PJW image object
 * @returns {function} transformation function for transformBitmap().
 */


function getExifOrientationTransformation(img) {
  var w = img.getWidth();
  var h = img.getHeight();

  switch (getExifOrientation(img)) {
    case 1:
      // Horizontal (normal)
      // does not need to be supported here
      return null;

    case 2:
      // Mirror horizontal
      return function (x, y) {
        return [w - x - 1, y];
      };

    case 3:
      // Rotate 180
      return function (x, y) {
        return [w - x - 1, h - y - 1];
      };

    case 4:
      // Mirror vertical
      return function (x, y) {
        return [x, h - y - 1];
      };

    case 5:
      // Mirror horizontal and rotate 270 CW
      return function (x, y) {
        return [y, x];
      };

    case 6:
      // Rotate 90 CW
      return function (x, y) {
        return [y, h - x - 1];
      };

    case 7:
      // Mirror horizontal and rotate 90 CW
      return function (x, y) {
        return [w - y - 1, h - x - 1];
      };

    case 8:
      // Rotate 270 CW
      return function (x, y) {
        return [w - y - 1, x];
      };

    default:
      return null;
  }
}
/*
 * Transforms bitmap in place (moves pixels around) according to given
 * transformation function.
 *
 * @param img {PJW} a PJW image object, which bitmap is supposed to
 *        be transformed
 * @param width {number} bitmap width after the transformation
 * @param height {number} bitmap height after the transformation
 * @param transformation {function} transformation function which defines pixel
 *        mapping between new and source bitmap. It takes a pair of coordinates
 *        in the target, and returns a respective pair of coordinates in
 *        the source bitmap, i.e. has following form:
 *        `function(new_x, new_y) { return [src_x, src_y] }`.
 */


function transformBitmap(img, width, height, transformation) {
  // Underscore-prefixed values are related to the source bitmap
  // Their counterparts with no prefix are related to the target bitmap
  var _data = img.bitmap.data;
  var _width = img.bitmap.width;
  var data = Buffer.alloc(_data.length);

  for (var x = 0; x < width; x++) {
    for (var y = 0; y < height; y++) {
      var _transformation = transformation(x, y),
          _transformation2 = (0, _slicedToArray2["default"])(_transformation, 2),
          _x = _transformation2[0],
          _y = _transformation2[1];

      var idx = width * y + x << 2;

      var _idx = _width * _y + _x << 2;

      var pixel = _data.readUInt32BE(_idx);

      data.writeUInt32BE(pixel, idx);
    }
  }

  img.bitmap.data = data;
  img.bitmap.width = width;
  img.bitmap.height = height;
}
/*
 * Automagically rotates an image based on its EXIF data (if present).
 * @param img {PJW} a PJW image object
 */


function exifRotate(img) {
  if (getExifOrientation(img) < 2) return;
  var transformation = getExifOrientationTransformation(img);
  var swapDimensions = getExifOrientation(img) > 4;
  var newWidth = swapDimensions ? img.bitmap.height : img.bitmap.width;
  var newHeight = swapDimensions ? img.bitmap.width : img.bitmap.height;
  transformBitmap(img, newWidth, newHeight, transformation);
} // parses a bitmap from the constructor to the PJW bitmap property


function parseBitmap(data, path, cb) {
  var mime = getMIMEFromBuffer(data, path);

  if (typeof mime !== 'string') {
    return cb(new Error('Could not find MIME for Buffer <' + path + '>'));
  }

  this._originalMime = mime.toLowerCase();

  try {
    var _mime = this.getMIME();

    if (this.constructor.decoders[_mime]) {
      this.bitmap = this.constructor.decoders[_mime](data);
    } else {
      return _index.throwError.call(this, 'Unsupported MIME type: ' + _mime, cb);
    }
  } catch (error) {
    return cb.call(this, error, this);
  }

  try {
    this._exif = _exifParser["default"].create(data).parse();
    exifRotate(this); // EXIF data
  } catch (error) {
    /* meh */
  }

  cb.call(this, null, this);
  return this;
}

function compositeBitmapOverBackground(PJW, image) {
  return new PJW(image.bitmap.width, image.bitmap.height, image._background).composite(image, 0, 0).bitmap;
}
/**
 * Converts the image to a buffer
 * @param {string} mime the mime type of the image buffer to be created
 * @param {function(Error, PJW)} cb a Node-style function to call with the buffer as the second argument
 * @returns {PJW} this for chaining of methods
 */


function getBuffer(_x2, _x3) {
  return _getBuffer.apply(this, arguments);
}

function _getBuffer() {
  _getBuffer = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(mime, cb) {
    var buffer;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (mime === constants.AUTO) {
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
            mime = mime.toLowerCase();

            if (this._rgba && this.constructor.hasAlpha[mime]) {
              this.bitmap.data = Buffer.from(this.bitmap.data);
            } else {
              // when format doesn't support alpha
              // composite onto a new image so that the background shows through alpha channels
              this.bitmap.data = compositeBitmapOverBackground(this.constructor, this).data;
            }

            if (!this.constructor.encoders[mime]) {
              _context.next = 14;
              break;
            }

            _context.next = 10;
            return this.constructor.encoders[mime](this);

          case 10:
            buffer = _context.sent;
            //Kelly and Tom added await
            cb.call(this, null, buffer);
            _context.next = 15;
            break;

          case 14:
            cb.call(this, 'Unsupported MIME type: ' + mime);

          case 15:
            return _context.abrupt("return", this);

          case 16:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));
  return _getBuffer.apply(this, arguments);
}

function getBufferAsync(mime) {
  return (0, _promisify["default"])(getBuffer, this, mime);
}
//# sourceMappingURL=image-bitmap.js.map