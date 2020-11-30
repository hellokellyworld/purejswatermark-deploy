import { mergeDeep } from 'timm';

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


import print from "../../plugin-print/src/index.js"//'@PJW/plugin-print';
import resize from "../../plugin-resize/src/index.js"//'@PJW/plugin-resize';
import color from "../../plugin-color/src/index.js"//'@PJW/plugin-color';
import blit from "../../plugin-blit/src/index.js"//'@PJW/plugin-blit';

const plugins = [
  blit,
  color,
  print,
  resize,

  // blur,
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

export default PJWEvChange => {
  const initializedPlugins = plugins.map(pluginModule => {
    let plugin = pluginModule(PJWEvChange) || {};

    if (!plugin.class && !plugin.constants) {
      // Default to class function
      plugin = { class: plugin };
    }

    return plugin;
  });

  return mergeDeep(...initializedPlugins);
};
