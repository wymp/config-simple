import { ConfigError } from "./types";

type CleanFrozenConfig<T> = T extends object
  ? { readonly [K in keyof T]: CleanFrozenConfig<T[K]> }
  : Exclude<T, ConfigError>;

type ConfigResult<T> =
  | { t: "success"; value: CleanFrozenConfig<T> }
  | {
      t: "error";
      errors: string[];
      value: CleanFrozenConfig<T>;
    };

/**
 * Validate a configuration object and return a frozen copy.
 *
 * @example
 * ```ts
 * export const config = validate(configDef);
 * export const dirtyConfig = validate(configDef, 'dont-throw');
 * ```
 *
 * In the first form, this function will throw an error if the configuration is invalid. In the second form, it will
 * return a `ConfigResult` object that can be inspected for errors.
 *
 * NOTE: THE 'ERROR' SIDE OF THE RESPONSE FROM THE SECOND FORM IS DANGEROUS. We want the option to not throw on config
 * errors, but we also don't want to have to use type-guards to handle bad config throughout our entire codebase. This
 * type is a dangerous compromise that allows us to blindly use values as if they were valid, while knowing that they
 * may not be.
 */
export function validate<T>(obj: T): CleanFrozenConfig<T>;
export function validate<T>(obj: T, behavior: "dont-throw"): ConfigResult<T>;
export function validate<T>(obj: T, behavior?: "dont-throw"): CleanFrozenConfig<T> | ConfigResult<T> {
  const result = reportConfigResult(obj);
  if (behavior === "dont-throw") {
    return result;
  }
  if (result.t === "error") {
    throw new Error(`Invalid configuration: \n\n  * ${result.errors.join("\n  * ")}`);
  }
  return result.value;
}

const reportConfigResult = <T>(obj: T, path: string[] = []): ConfigResult<T> => {
  const errors: string[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const response: any = Array.isArray(obj) ? [...obj] : { ...obj };
  for (const k in response) {
    if (Object.prototype.hasOwnProperty.call(response, k)) {
      const val = response[k];
      if (typeof val === "string" && val.startsWith("::ERROR::")) {
        const match = val.match(/^::ERROR::(?:([^:]+)::)?(.*)$/);
        const key = [...path, k].join(".");
        const varname = match?.[1] ? ` (${match[1]})` : "";
        const messages = match?.[2] ? match[2].split("|") : ["Invalid value (unknown error)"];
        if (messages.length === 1) {
          errors.push(`${key}${varname}: ${messages[0]}`);
        } else {
          errors.push(`${key}${varname}:\n    * ${messages.join("\n    * ")}`);
        }
      } else {
        if (response[k] && typeof response[k] === "object") {
          const result = reportConfigResult(response[k], [...path, k]);
          if (result.t === "error") {
            errors.push(...result.errors);
          }
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          response[k] = result.value as any;
        }
      }
    }
  }

  if (errors.length > 0) {
    return { t: "error", errors, value: Object.freeze(response) as CleanFrozenConfig<T> };
  } else {
    return { t: "success", value: Object.freeze(response) as CleanFrozenConfig<T> };
  }
};
