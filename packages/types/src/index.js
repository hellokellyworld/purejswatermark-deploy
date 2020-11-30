import { mergeDeep } from 'timm';

import jpeg from "../../type-jpeg/src/index.js"//'@PJW/jpeg';
import png from"../../type-png/src/index.js" //'@PJW/png';
import bmp from "../../type-bmp/src/index.js"//'@PJW/bmp';
import tiff from "../../type-tiff/src/index.js"//'@PJW/tiff';
import gif from "../../type-gif/src/index.js"//'@PJW/gif';

export default () => mergeDeep(jpeg(), png(), bmp(), tiff(), gif());
