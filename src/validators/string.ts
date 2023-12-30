import { ValidatorFunc } from "../types";

export const exactLen =
  (len: number): ValidatorFunc<string> =>
  (val: string | undefined): string | void => {
    if (val && val.length !== len) {
      return `Value must be exactly ${len} characters long`;
    }
  };

export const httpHost: ValidatorFunc<string> = (val: string | undefined): string | void => {
  if (val && !val.match(/^https?:\/\//)) {
    return "Value must start with http:// or https://";
  }
};

export const match =
  (pattern: RegExp | string): ValidatorFunc<string> =>
  (val: string | undefined): string | void => {
    if (val) {
      if (!val.match(pattern)) {
        return `Value must match pattern '${pattern}'`;
      }
    }
  };

export const maxLen =
  (max: number): ValidatorFunc<string> =>
  (val: string | undefined): string | void => {
    if (val && val.length > max) {
      return `Value must be at most ${max} characters long`;
    }
  };

export const minLen =
  (min: number): ValidatorFunc<string> =>
  (val: string | undefined): string | void => {
    if (val && val.length < min) {
      return `Value must be at least ${min} characters long`;
    }
  };

/** Validate that the given value is one of the given options */
export const oneOf =
  (values: string[]): ValidatorFunc<string> =>
  (val: string | undefined): string | void => {
    if (val && !values.includes(val)) {
      return `Value must be one of '${values.join(`', '`)}'`;
    }
  };
