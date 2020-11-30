import PJW, {
  addType,
  addPJWMethods,
  addConstants,
  PJWEvChange
} from "../../core/src/index.js" //'@PJW/core';

export default function configure(configuration, PJWInstance = PJW) {
  const PJWConfig = {
    hasAlpha: {},
    encoders: {},
    decoders: {},
    class: {},
    constants: {}
  };

  function addToConfig(newConfig) {
    Object.entries(newConfig).forEach(([key, value]) => {
      PJWConfig[key] = {
        ...PJWConfig[key],
        ...value
      };
    });
  }

  function addImageType(typeModule) {
    const type = typeModule();

    if (Array.isArray(type.mime)) {
      addType(...type.mime);
    } else {
      Object.entries(type.mime).forEach(mimeType => addType(...mimeType));
    }

    delete type.mime;
    addToConfig(type);
  }

  function addPlugin(pluginModule) {
    const plugin = pluginModule(PJWEvChange) || {};
    if (!plugin.class && !plugin.constants) {
      // Default to class function
      addToConfig({ class: plugin });
    } else {
      addToConfig(plugin);
    }
  }

  if (configuration.types) {
    configuration.types.forEach(addImageType);

    PJWInstance.decoders = {
      ...PJWInstance.decoders,
      ...PJWConfig.decoders
    };
    PJWInstance.encoders = {
      ...PJWInstance.encoders,
      ...PJWConfig.encoders
    };
    PJWInstance.hasAlpha = {
      ...PJWInstance.hasAlpha,
      ...PJWConfig.hasAlpha
    };
  }

  if (configuration.plugins) {
    configuration.plugins.forEach(addPlugin);
  }

  addPJWMethods(PJWConfig.class, PJWInstance);
  addConstants(PJWConfig.constants, PJWInstance);

  return PJW;
}
