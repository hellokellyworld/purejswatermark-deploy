import { DecoderFn } from '@PJW/core';

interface Gif {
  mime: {
    'image/gif': string[]
  }

  constants: {
    MIME_GIF: 'image/gif';
  }

  decoders: {
    'image/gif': DecoderFn
  }
}

export default function(): Gif;
