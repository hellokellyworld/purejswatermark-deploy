import {PJW} from './PJW';

export function addConstants(
  constants: [string, string | number],
  PJWInstance?: PJW
): void;
export function addPJWMethods(
  methods: [string, Function],
  PJWInstance?: PJW
): void;
export function PJWEvMethod(
  methodName: string,
  evName: string,
  method: Function
): void;
export function PJWEvChange(methodName: string, method: Function): void;
export function addType(mime: string, extensions: string[]): void;
