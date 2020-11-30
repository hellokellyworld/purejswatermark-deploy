"use strict";

/* eslint-env worker */

/* global PJW */
importScripts('../lib/PJW.min.js');
self.addEventListener('message', function (e) {
  PJW.read(e.data).then(function (lenna) {
    lenna.resize(256, PJW.AUTO) // resize
    .quality(60) // set JPEG quality
    .greyscale() // set greyscale
    .getBase64(PJW.AUTO, function (err, src) {
      if (err) throw err;
      self.postMessage(src);
      self.close();
    });
  });
});
//# sourceMappingURL=jimp-worker.js.map