<div align ="center">
  <img width="400" height="400"
    src="https://github.com/hellokellyworld/purejswatermark-js-example/blob/master/public/image.jpeg">
  <h1>purejswatermark</h1>
  <p>Watermark program based on pure Javascript, inspired by Jimp and made succinct.</p>
</div>

## Installation

```sh
npm install purejswatermark
```

## To build

```sh
npm run build
```

## Import

```sh
import watermark from 'purejswatermark/dist/watermark';
```

## Basic Usage

```json
    const imageWithWatermark = await watermark.addWatermark(
      "Original Image Path",
      "Watermark Path"
    );

    const imageWithTextWatermark = await watermark.addTextWatermark(
      "Original Image Path",
      {text: "Your text-watermark content", textSize: 8}
    );
```

## Article from the Author

Read [Adding watermark using pure javascript with a simple Node.js package — purejswatermark](https://kelly-kang.medium.com/adding-watermark-using-pure-javascript-with-a-simple-node-js-package-purejswatermark-8351d60aef8f)

## Demo -- Javascript front-end

See example:https://github.com/hellokellyworld/purejswatermark-js-example

## Demo -- Typescipt front-end

Upcoming

## Supported Image Types

- [bmp](./packages/type-bmp)
- [jpeg](./packages/type-jpeg)
- [png](./packages/type-png)

## License

purejswatermark is licensed under the MIT license. Open Sans is licensed under the Apache license

## Acknowledgement

This package is created based on Jimp https://www.npmjs.com/package/jimp, but focuses on watermarking.

## Future Work

- 1.Text color
- 2.Text position
- 3.Support of tiff and gif
- 4.Write to disk with cli tools
- 5.Support of UTF-8 fonts
- 6.Repeating pattern with spacing
- 7.Text opacity
