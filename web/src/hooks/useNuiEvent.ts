import { onCleanup, createEffect } from "solid-js";

export const noop = () => {};

interface NuiMessageData<T = unknown> {
  type: string;
  data: T;
}

type NuiHandlerSignature<T> = (data: T) => void;

export const useNuiEvent = <T = unknown>(
  type: string,
  handler: (data: T) => void,
) => {
  let savedHandler: NuiHandlerSignature<T> = noop;

  createEffect(() => {
    savedHandler = handler;
  });

  createEffect(() => {
    const eventListener = (event: MessageEvent<NuiMessageData<T>>) => {
      const { type: eventAction, data } = event.data;

      if (savedHandler && eventAction === type) {
        savedHandler(data);
      }
    };

    window.addEventListener("message", eventListener);

    onCleanup(() => {
      window.removeEventListener("message", eventListener);
    });
  });
};