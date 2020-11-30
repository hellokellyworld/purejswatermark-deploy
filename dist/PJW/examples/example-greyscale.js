"use strict";

/* eslint-disable no-console, import/no-extraneous-dependencies */
var PJW = require('PJW');

var url = 'https://upload.wikimedia.org/wikipedia/commons/0/01/Bot-Test.jpg';
PJW.read(url).then(function (image) {
  image.greyscale().getBuffer(PJW.MIME_JPEG, onBuffer);
})["catch"](function (error) {
  console.error(error);
});

function onBuffer(err, buffer) {
  if (err) throw err;
  console.log(buffer);
}
//# sourceMappingURL=example-greyscale.js.map