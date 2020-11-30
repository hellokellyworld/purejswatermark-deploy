"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var PJW = require('../PJW/src/index.js');

var defaultOptions = {
  ratio: 0.6,
  opacity: 0.6,
  dstPath: './watermark.jpg',
  text: 'PJW-watermark',
  textSize: 1
};
var SizeEnum = Object.freeze({
  1: PJW.FONT_SANS_8_BLACK,
  2: PJW.FONT_SANS_10_BLACK,
  3: PJW.FONT_SANS_12_BLACK,
  4: PJW.FONT_SANS_14_BLACK,
  5: PJW.FONT_SANS_16_BLACK,
  6: PJW.FONT_SANS_32_BLACK,
  7: PJW.FONT_SANS_64_BLACK,
  8: PJW.FONT_SANS_128_BLACK
});
var ErrorTextSize = new Error("Text size must range from 1 - 8");
var ErrorScaleRatio = new Error("Scale Ratio must be less than one!");
var ErrorOpacity = new Error("Opacity must be less than one!");

var getDimensions = function getDimensions(H, W, h, w, ratio) {
  var hh, ww;

  if (H / W < h / w) {
    //GREATER HEIGHT
    hh = ratio * H;
    ww = hh / h * w;
  } else {
    //GREATER WIDTH
    ww = ratio * W;
    hh = ww / w * h;
  }

  return [hh, ww];
};

var checkOptions = function checkOptions(options) {
  options = _objectSpread(_objectSpread({}, defaultOptions), options);

  if (options.ratio > 1) {
    throw ErrorScaleRatio;
  }

  if (options.opacity > 1) {
    throw ErrorOpacity;
  }

  return options;
};
/**
 * @param {String} mainImage - Path of the image to be watermarked
 * @param {Object} options
 * @param {String} options.text     - String to be watermarked
 * @param {Number} options.textSize - Text size ranging from 1 to 8
 * @param {String} options.dstPath  - Destination path where image is to be exported
 */


module.exports.addTextWatermark = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(mainImage, options) {
    var main, maxHeight, maxWidth, font, X, Y, finalImage, mime;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            options = checkOptions(options);
            _context.next = 4;
            return PJW.read(mainImage);

          case 4:
            main = _context.sent;
            maxHeight = main.getHeight();
            maxWidth = main.getWidth();

            if (!Object.keys(SizeEnum).includes(String(options.textSize))) {
              _context.next = 24;
              break;
            }

            _context.next = 10;
            return PJW.loadFont(SizeEnum[options.textSize]);

          case 10:
            font = _context.sent;
            X = 0, Y = 0;
            _context.next = 14;
            return main.print(font, X, Y, {
              text: options.text,
              alignmentX: PJW.HORIZONTAL_ALIGN_CENTER,
              alignmentY: PJW.VERTICAL_ALIGN_MIDDLE
            }, maxWidth, maxHeight);

          case 14:
            finalImage = _context.sent;
            finalImage.quality(100);
            _context.next = 18;
            return finalImage.getMIME();

          case 18:
            mime = _context.sent;
            _context.next = 21;
            return finalImage.getBase64Async(mime, function (err, data) {
              if (err) {
                throw err;
              }
            }).then(function (bufferData) {
              return bufferData;
            })["catch"](function (err) {
              throw err;
            });

          case 21:
            return _context.abrupt("return", _context.sent);

          case 24:
            throw ErrorTextSize;

          case 25:
            _context.next = 30;
            break;

          case 27:
            _context.prev = 27;
            _context.t0 = _context["catch"](0);
            throw _context.t0;

          case 30:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 27]]);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();
/**
 * @param {String} mainImage - Path of the image to be watermarked
 * @param {String} watermarkImage - Path of the watermark image to be applied
 * @param {Object} options
 * @param {Float} options.ratio     - Ratio in which the watermark is overlaid
 * @param {Float} options.opacity   - Value of opacity of the watermark image during overlay
 * @param {String} options.dstPath  - Destination path where image is to be exported
 */


var addWatermark = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(mainImage, watermarkImage, options) {
    var main, watermark, _getDimensions, _getDimensions2, newHeight, newWidth, positionX, positionY, mime;

    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            options = checkOptions(options);
            _context2.next = 4;
            return PJW.read(mainImage);

          case 4:
            main = _context2.sent;
            _context2.next = 8;
            return PJW.read(watermarkImage);

          case 8:
            watermark = _context2.sent;
            _getDimensions = getDimensions(main.getHeight(), main.getWidth(), watermark.getHeight(), watermark.getWidth(), options.ratio), _getDimensions2 = (0, _slicedToArray2["default"])(_getDimensions, 2), newHeight = _getDimensions2[0], newWidth = _getDimensions2[1];
            watermark.resize(newWidth, newHeight);
            positionX = (main.getWidth() - newWidth) / 2; //Centre aligned

            positionY = (main.getHeight() - newHeight) / 2; //Centre aligned

            watermark.opacity(options.opacity);
            main.composite(watermark, positionX, positionY, PJW.HORIZONTAL_ALIGN_CENTER | PJW.VERTICAL_ALIGN_MIDDLE);
            main.quality(100); //.write(options.dstPath);

            _context2.next = 18;
            return main.getMIME();

          case 18:
            mime = _context2.sent;
            _context2.next = 22;
            return main.getBase64Async(mime).then(function (bufferData) {
              return bufferData; //newResult.src = bufferData;
            })["catch"](function (err) {
              throw err;
            });

          case 22:
            return _context2.abrupt("return", _context2.sent);

          case 25:
            _context2.prev = 25;
            _context2.t0 = _context2["catch"](0);
            throw _context2.t0;

          case 28:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[0, 25]]);
  }));

  return function addWatermark(_x3, _x4, _x5) {
    return _ref2.apply(this, arguments);
  };
}();

module.exports.addWatermark = addWatermark;
//# sourceMappingURL=index.js.map