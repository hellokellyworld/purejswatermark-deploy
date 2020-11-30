"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _timm = require("timm");

var _index = _interopRequireDefault(require("../../plugin-print/src/index.js"));

var _index2 = _interopRequireDefault(require("../../plugin-resize/src/index.js"));

var _index3 = _interopRequireDefault(require("../../plugin-color/src/index.js"));

var _index4 = _interopRequireDefault(require("../../plugin-blit/src/index.js"));

// import blit from '@PJW/plugin-blit';
// import blur from '@PJW/plugin-blur';
// import circle from '@PJW/plugin-circle';
// import color from '@PJW/plugin-color';
// import contain from '@PJW/plugin-contain';
// import cover from '@PJW/plugin-cover';
// import crop from '@PJW/plugin-crop';
// import displace from '@PJW/plugin-displace';
// import dither from '@PJW/plugin-dither';
// import fisheye from '@PJW/plugin-fisheye';
// import flip from '@PJW/plugin-flip';
// import gaussian from '@PJW/plugin-gaussian';
// import invert from '@PJW/plugin-invert';
// import mask from '@PJW/plugin-mask';
// import normalize from '@PJW/plugin-normalize';
// import rotate from '@PJW/plugin-rotate';
// import scale from '@PJW/plugin-scale';
// import shadow from '@PJW/plugin-shadow';
// import threshold from '@PJW/plugin-threshold';
//'@PJW/plugin-print';
//'@PJW/plugin-resize';
//'@PJW/plugin-color';
//'@PJW/plugin-blit';
var plugins = [_index4["default"], _index3["default"], _index["default"], _index2["default"] // blur,
// circle,
// contain,
// cover,
// crop,
// displace,
// dither,
// fisheye,
// flip,
// gaussian,
// invert,
// mask,
// normalize,
// rotate,
// scale,
// shadow,
// threshold
];

var _default = function _default(PJWEvChange) {
  var initializedPlugins = plugins.map(function (pluginModule) {
    var plugin = pluginModule(PJWEvChange) || {};

    if (!plugin["class"] && !plugin.constants) {
      // Default to class function
      plugin = {
        "class": plugin
      };
    }

    return plugin;
  });
  return _timm.mergeDeep.apply(void 0, (0, _toConsumableArray2["default"])(initializedPlugins));
};

exports["default"] = _default;
module.exports = exports.default;
//# sourceMappingURL=index.js.map