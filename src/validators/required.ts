import { ConfigError, ValidatorFunc } from "../types";

/** NOTE: This is intended to be an INTERNAL validator function */
export const required = <T>(val: T | undefined | ConfigError): string | void => {
  if (val === undefined) {
    return `This value is required`;
  }
};

/** Produces an error if the given value is not set for the given environments */
export const requiredForEnvs =
  <T>(env: string, requiredEnvs: string[]): ValidatorFunc<T> =>
  (val: T | undefined | ConfigError) => {
    if (requiredEnvs.includes(env)) {
      return required(val);
    }
  };

/** Produces an error if the given value is not set and the given condition evaluates to true */
export const requiredIf =
  <T>(condition: boolean): ValidatorFunc<T> =>
  (val: T | undefined | ConfigError) => {
    if (condition) {
      return required(val);
    }
  };
