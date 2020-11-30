"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _index = _interopRequireDefault(require("../../custom/src/index.js"));

var _index2 = _interopRequireDefault(require("../../types/src/index.js"));

var _index3 = _interopRequireDefault(require("../../plugins/src/index.js"));

//'@PJW/custom';
//'@PJW/types';
//'@PJW/plugins';
var _default = (0, _index["default"])({
  types: [_index2["default"]],
  plugins: [_index3["default"]]
});

exports["default"] = _default;
module.exports = exports.default;
//# sourceMappingURL=index.js.map