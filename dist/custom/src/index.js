"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = configure;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _index = _interopRequireWildcard(require("../../core/src/index.js"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

//'@PJW/core';
function configure(configuration) {
  var PJWInstance = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _index["default"];
  var PJWConfig = {
    hasAlpha: {},
    encoders: {},
    decoders: {},
    "class": {},
    constants: {}
  };

  function addToConfig(newConfig) {
    Object.entries(newConfig).forEach(function (_ref) {
      var _ref2 = (0, _slicedToArray2["default"])(_ref, 2),
          key = _ref2[0],
          value = _ref2[1];

      PJWConfig[key] = _objectSpread(_objectSpread({}, PJWConfig[key]), value);
    });
  }

  function addImageType(typeModule) {
    var type = typeModule();

    if (Array.isArray(type.mime)) {
      _index.addType.apply(void 0, (0, _toConsumableArray2["default"])(type.mime));
    } else {
      Object.entries(type.mime).forEach(function (mimeType) {
        return _index.addType.apply(void 0, (0, _toConsumableArray2["default"])(mimeType));
      });
    }

    delete type.mime;
    addToConfig(type);
  }

  function addPlugin(pluginModule) {
    var plugin = pluginModule(_index.PJWEvChange) || {};

    if (!plugin["class"] && !plugin.constants) {
      // Default to class function
      addToConfig({
        "class": plugin
      });
    } else {
      addToConfig(plugin);
    }
  }

  if (configuration.types) {
    configuration.types.forEach(addImageType);
    PJWInstance.decoders = _objectSpread(_objectSpread({}, PJWInstance.decoders), PJWConfig.decoders);
    PJWInstance.encoders = _objectSpread(_objectSpread({}, PJWInstance.encoders), PJWConfig.encoders);
    PJWInstance.hasAlpha = _objectSpread(_objectSpread({}, PJWInstance.hasAlpha), PJWConfig.hasAlpha);
  }

  if (configuration.plugins) {
    configuration.plugins.forEach(addPlugin);
  }

  (0, _index.addPJWMethods)(PJWConfig["class"], PJWInstance);
  (0, _index.addConstants)(PJWConfig.constants, PJWInstance);
  return _index["default"];
}

module.exports = exports.default;
//# sourceMappingURL=index.js.map