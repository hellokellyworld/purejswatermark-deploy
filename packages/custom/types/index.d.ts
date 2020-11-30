// TypeScript Version: 3.1
// See the `PJW` package index.d.ts for why the version is not 2.8
import {
  FunctionRet,
  PJW,
  PJWPlugin,
  PJWType,
  GetIntersectionFromPlugins,
  GetIntersectionFromPluginsStatics,
  PJWConstructors
} from '@PJW/core';

type PJWInstance<
  TypesFuncArr extends FunctionRet<PJWType> | undefined,
  PluginFuncArr extends FunctionRet<PJWPlugin> | undefined,
  J extends PJWConstructors
> = J & GetIntersectionFromPluginsStatics<Exclude<TypesFuncArr | PluginFuncArr, undefined>> & {
  prototype: PJWType & GetIntersectionFromPlugins<Exclude<TypesFuncArr | PluginFuncArr, undefined>>
};

declare function configure<
  TypesFuncArr extends FunctionRet<PJWType> | undefined = undefined,
  PluginFuncArr extends FunctionRet<PJWPlugin> | undefined = undefined,
  J extends PJWConstructors = PJWConstructors
>(
  configuration: {
    types?: TypesFuncArr;
    plugins?: PluginFuncArr;
  },
  PJWInstance?: J
  // Since PJWInstance is required, we want to use the default `PJW` type
): PJWInstance<TypesFuncArr, PluginFuncArr, J>;

export default configure;
