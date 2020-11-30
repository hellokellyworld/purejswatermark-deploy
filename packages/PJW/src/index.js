import configure from  "../../custom/src/index.js" //'@PJW/custom';

import types from "../../types/src/index.js" //'@PJW/types';
import plugins from "../../plugins/src/index.js"//'@PJW/plugins';

export default configure({
  types: [types],
  plugins: [plugins]
});
