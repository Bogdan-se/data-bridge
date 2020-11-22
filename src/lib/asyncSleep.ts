export const asyncSleep = (timeout: number) =>
  new Promise((resolve) => setTimeout(resolve, timeout, true));
