import type Formbricks from "@formbricks/js-core";
import { loadFormbricksToProxy } from "./lib/load-formbricks";

type TFormbricks = typeof Formbricks;
declare global {
  interface Window {
    fiscalo: TFormbricks | undefined;
  }
}

const formbricksProxyHandler: ProxyHandler<TFormbricks> = {
  get(_target, prop, _receiver) {
    return (...args: unknown[]) => loadFormbricksToProxy(prop as string, ...args);
  },
};

const fiscalo: TFormbricks = new Proxy({} as TFormbricks, formbricksProxyHandler);

// eslint-disable-next-line import/no-default-export -- Required for UMD
export default fiscalo;
