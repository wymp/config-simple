import { ConfigError } from "./types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isConfigError = (val: any): val is ConfigError =>
  Boolean(val && typeof val === "string" && val.startsWith("::ERROR::"));
