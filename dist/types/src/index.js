"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _timm = require("timm");

var _index = _interopRequireDefault(require("../../type-jpeg/src/index.js"));

var _index2 = _interopRequireDefault(require("../../type-png/src/index.js"));

var _index3 = _interopRequireDefault(require("../../type-bmp/src/index.js"));

var _index4 = _interopRequireDefault(require("../../type-tiff/src/index.js"));

var _index5 = _interopRequireDefault(require("../../type-gif/src/index.js"));

//'@PJW/jpeg';
//'@PJW/png';
//'@PJW/bmp';
//'@PJW/tiff';
//'@PJW/gif';
var _default = function _default() {
  return (0, _timm.mergeDeep)((0, _index["default"])(), (0, _index2["default"])(), (0, _index3["default"])(), (0, _index4["default"])(), (0, _index5["default"])());
};

exports["default"] = _default;
module.exports = exports.default;
//# sourceMappingURL=index.js.map