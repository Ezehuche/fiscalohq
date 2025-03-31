/*
  eslint-disable no-console --
  * Required for logging errors
*/

type Result<T, E = Error> = { ok: true; data: T } | { ok: false; error: E };

let isInitializing = false;
let isInitialized = false;
// Load the SDK, return the result
const loadFormbricksSDK = async (apiHostParam: string): Promise<Result<void>> => {
  if (!window.fiscalo) {
    const scriptTag = document.createElement("script");
    scriptTag.type = "text/javascript";
    scriptTag.src = `${apiHostParam}/js/fiscalo.umd.cjs`;
    scriptTag.async = true;
    const getFormbricks = async (): Promise<void> =>
      new Promise<void>((resolve, reject) => {
        const timeoutId = setTimeout(() => {
          reject(new Error(`Fiscalo SDK loading timed out`));
        }, 10000);
        scriptTag.onload = () => {
          clearTimeout(timeoutId);
          resolve();
        };
        scriptTag.onerror = () => {
          clearTimeout(timeoutId);
          reject(new Error(`Failed to load Fiscalo SDK`));
        };
      });
    document.head.appendChild(scriptTag);
    try {
      await getFormbricks();
      return { ok: true, data: undefined };
    } catch (error) {
      const err = error as { message?: string };
      return {
        ok: false,
        error: new Error(err.message ?? `Failed to load Fiscalo SDK`),
      };
    }
  }
  return { ok: true, data: undefined };
};

const functionsToProcess: { prop: string; args: unknown[] }[] = [];

export const loadFormbricksToProxy = async (prop: string, ...args: unknown[]): Promise<void> => {
  // all of this should happen when not initialized:
  if (!isInitialized) {
    // We need to still support init for backwards compatibility
    // but we should log a warning that the init method is deprecated
    if (prop === "setup") {
      if (isInitializing) {
        console.warn("🧱 Fiscalo - Warning: Fiscalo is already initializing.");
        return;
      }
      // reset the initialization state
      isInitializing = true;
      const argsTyped = args[0] as { appUrl: string; environmentId: string };
      const { appUrl, environmentId } = argsTyped;

      if (!appUrl) {
        console.error("🧱 Fiscalo - Error: appUrl is required");
        return;
      }

      if (!environmentId) {
        console.error("🧱 Fiscalo - Error: environmentId is required");
        return;
      }

      const loadSDKResult = await loadFormbricksSDK(appUrl);
      if (loadSDKResult.ok) {
        if (window.fiscalo) {
          const formbricksInstance = window.fiscalo;
          // @ts-expect-error -- Required for dynamic function calls
          void formbricksInstance.setup(...args);
          isInitializing = false;
          isInitialized = true;
          // process the queued functions
          for (const { prop: functionProp, args: functionArgs } of functionsToProcess) {
            if (typeof formbricksInstance[functionProp as keyof typeof formbricksInstance] !== "function") {
              console.error(`🧱 Fiscalo - Error: Method ${functionProp} does not exist on fiscalo`);
              continue;
            }
            // @ts-expect-error -- Required for dynamic function calls
            (formbricksInstance[functionProp] as unknown)(...functionArgs);
          }
        }
      }
    } else {
      console.warn(
        "🧱 Fiscalo - Warning: Fiscalo not initialized. This method will be queued and executed after initialization."
      );

      functionsToProcess.push({ prop, args });
    }
  } else if (window.fiscalo) {
    // Access the default export for initialized state too
    const formbricksInstance = window.fiscalo;
    type Formbricks = typeof formbricksInstance;
    type FunctionProp = keyof Formbricks;
    const functionPropTyped = prop as FunctionProp;
    // @ts-expect-error -- Required for dynamic function calls
    await formbricksInstance[functionPropTyped](...args);
  }
};
