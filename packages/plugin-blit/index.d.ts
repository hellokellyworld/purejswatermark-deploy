import { PJW, ImageCallback } from '@PJW/core';

interface Blit {
  blit(src: PJW, x: number, y: number, cb?: ImageCallback<this>): this;
  blit(
    src: PJW,
    x: number,
    y: number,
    srcx: number,
    srcy: number,
    srcw: number,
    srch: number,
    cb?: ImageCallback<this>
  ): this;
}

export default function(): Blit;
