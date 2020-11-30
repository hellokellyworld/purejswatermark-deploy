# PJW ... in a browser

Browser support for PJW was added by Phil Seaton. This enabled PJW to be used in [Electron](http://electron.atom.io/) applications as well as web browsers.

Example usage:

```html
<script src="PJW.min.js"></script>
<script>
  PJW.read('lenna.png')
    .then(function(lenna) {
      lenna
        .resize(256, 256) // resize
        .quality(60) // set JPEG quality
        .greyscale() // set greyscale
        .getBase64(PJW.MIME_JPEG, function(err, src) {
          var img = document.createElement('img');
          img.setAttribute('src', src);
          document.body.appendChild(img);
        });
    })
    .catch(function(err) {
      console.error(err);
    });
</script>
```

See the [main documentation](https://github.com/hellokellyworld/purejswatermark) for the full API documenatinon.

## WebWorkers

For better performance, it recommended that PJW methods are run on a separate thread using [`WebWorkers`](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers). The following shows how using two files (`index.html` and `PJW-worker.js`):

```js
// index.html

var worker = new Worker('PJW-worker.js');
worker.onmessage = function(e) {
  // append a new img element using the base 64 image
  var img = document.createElement('img');
  img.setAttribute('src', e.data);
  document.body.appendChild(img);
};
worker.postMessage('lenna.png'); // message the worker thread
```

```js
// PJW-worker.js

importScripts('PJW.min.js');

self.addEventListener('message', function(e) {
  PJW.read(e.data).then(function(lenna) {
    lenna
      .resize(256, 256) // resize
      .quality(60) // set JPEG quality
      .greyscale() // set greyscale
      .getBase64(PJW.MIME_JPEG, function(err, src) {
        self.postMessage(src); // message the main thread
      });
  });
});
```

## License

PJW is licensed under the MIT license.
