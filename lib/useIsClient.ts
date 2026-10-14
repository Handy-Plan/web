import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * True after hydration. Gates `createPortal(…, document.body)`: overlays must
 * live outside the page's animated wrappers, because a transform/filter on an
 * ancestor turns `position: fixed` into "relative to that ancestor".
 */
export function useIsClient() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
