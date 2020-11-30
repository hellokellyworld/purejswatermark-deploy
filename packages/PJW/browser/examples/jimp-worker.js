/* eslint-env worker */
/* global PJW */

importScripts('../lib/PJW.min.js');

self.addEventListener('message', e => {
  PJW.read(e.data).then(lenna => {
    lenna
      .resize(256, PJW.AUTO) // resize
      .quality(60) // set JPEG quality
      .greyscale() // set greyscale
      .getBase64(PJW.AUTO, (err, src) => {
        if (err) throw err;
        self.postMessage(src);
        self.close();
      });
  });
});
