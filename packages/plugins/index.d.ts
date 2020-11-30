import blit from '@PJW/plugin-blit';
import blur from '@PJW/plugin-blur';
import circle from '@PJW/plugin-circle';
import color from '@PJW/plugin-color';
import contain from '@PJW/plugin-contain';
import cover from '@PJW/plugin-cover';
import crop from '@PJW/plugin-crop';
import displace from '@PJW/plugin-displace';
import dither from '@PJW/plugin-dither';
import fisheye from '@PJW/plugin-fisheye';
import flip from '@PJW/plugin-flip';
import gaussian from '@PJW/plugin-gaussian';
import invert from '@PJW/plugin-invert';
import mask from '@PJW/plugin-mask';
import normalize from '@PJW/plugin-normalize';
import print from '@PJW/plugin-print';
import resize from '@PJW/plugin-resize';
import rotate from '@PJW/plugin-rotate';
import scale from '@PJW/plugin-scale';
import shadow from '@PJW/plugin-shadow';
import threshold from '@PJW/plugin-threshold';

type BlitRet = ReturnType<typeof blit>;
type BlurRet = ReturnType<typeof blur>;
type CircleRet = ReturnType<typeof circle>;
type ColorRet = ReturnType<typeof color>;
type ContainRet = ReturnType<typeof contain>;
type CoverRet = ReturnType<typeof cover>;
type CropRet = ReturnType<typeof crop>;
type DisplaceRet = ReturnType<typeof displace>;
type DitherRet = ReturnType<typeof dither>;
type FlipRet = ReturnType<typeof flip>;
type FisheyeRet = ReturnType<typeof fisheye>;
type GaussianRet = ReturnType<typeof gaussian>;
type InvertRet = ReturnType<typeof invert>;
type MaskRet = ReturnType<typeof mask>;
type NormalizeRet = ReturnType<typeof normalize>;
type PrintRet = ReturnType<typeof print>;
type ResizeRet = ReturnType<typeof resize>;
type RotateRet = ReturnType<typeof rotate>;
type ScaleRet = ReturnType<typeof scale>;
type ShadowRet = ReturnType<typeof shadow>;
type ThresholdRet = ReturnType<typeof threshold>;

/**
 * This is made union and not intersection to avoid issues with
 * `IllformedPlugin` and `WellFormedPlugin` when using typings with PJW
 * generic
 *
 * In reality, this should be an intersection but our type data isn't
 * clever enough to figure out what's a class and what's not/etc
 */
type Plugins =
  | BlitRet
  | BlurRet
  | CircleRet
  | ColorRet
  | ContainRet
  | CoverRet
  | CropRet
  | DisplaceRet
  | DitherRet
  | FlipRet
  | FisheyeRet
  | GaussianRet
  | InvertRet
  | MaskRet
  | NormalizeRet
  | PrintRet
  | ResizeRet
  | RotateRet
  | ScaleRet
  | ShadowRet
  | ThresholdRet;

export default function(): Plugins;
