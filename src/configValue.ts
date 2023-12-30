import { Transformers } from "./transformers/transformers";
import { ConfigError, REQUIRED, Transformer, ValidatorFunc } from "./types";
import { isConfigError } from "./utils";
import { required as requiredValidator } from "./validators/required";

type ValidatorArg<T> = ValidatorFunc<T> | ValidatorFunc<T>[];
type DefOrReq<T> = T | typeof REQUIRED;

/** @see {@link configValue} */
export interface ConfigValueFunc {
  (envVarName: string | string[]): string | undefined;
  (envVarName: string | string[], defaultOrRequired: DefOrReq<string>): string | ConfigError;
  (envVarName: string | string[], validator: ValidatorArg<string>): string | undefined | ConfigError;
  (envVarName: string | string[], required: typeof REQUIRED, validator: ValidatorArg<string>): string | ConfigError;
  (envVarName: string | string[], defaultValue: string, validator: ValidatorArg<string>): string;
  (envVarName: string | string[], t: "str"): string | undefined;
  (envVarName: string | string[], t: "str", defaultOrRequired: DefOrReq<string>): string | ConfigError;
  (envVarName: string | string[], t: "str", validator: ValidatorArg<string>): string | undefined | ConfigError;
  (
    envVarName: string | string[],
    t: "str",
    required: typeof REQUIRED,
    validator: ValidatorArg<string>
  ): string | ConfigError;
  (
    envVarName: string | string[],
    t: "str",
    defaultValue: string,
    validator: ValidatorArg<string>
  ): string | ConfigError;
  (envVarName: string | string[], t: "num"): number | undefined | ConfigError;
  (envVarName: string | string[], t: "num", defaultOrRequired: DefOrReq<number>): number | ConfigError;
  (envVarName: string | string[], t: "num", validator: ValidatorArg<number>): number | ConfigError;
  (
    envVarName: string | string[],
    t: "num",
    required: typeof REQUIRED,
    validator: ValidatorArg<number>
  ): number | ConfigError;
  (
    envVarName: string | string[],
    t: "num",
    defaultValue: number,
    validator: ValidatorArg<number>
  ): number | ConfigError;
  (envVarName: string | string[], t: "bool"): boolean | undefined | ConfigError;
  (envVarName: string | string[], t: "bool", defaultOrRequired: DefOrReq<boolean>): boolean | ConfigError;
  (envVarName: string | string[], t: "bool", validator: ValidatorArg<boolean>): boolean | undefined | ConfigError;
  (
    envVarName: string | string[],
    t: "bool",
    required: typeof REQUIRED,
    validator: ValidatorArg<boolean>
  ): boolean | ConfigError;
  (
    envVarName: string | string[],
    t: "bool",
    defaultValue: boolean,
    validator: ValidatorArg<boolean>
  ): boolean | ConfigError;
  <T>(envVarName: string | string[], t: Transformer<T>): T | undefined | ConfigError;
  <T>(envVarName: string | string[], t: Transformer<T>, defaultOrRequired: DefOrReq<T>): T | ConfigError;
  <T>(envVarName: string | string[], t: Transformer<T>, validator: ValidatorArg<T>): T | undefined | ConfigError;
  <T>(
    envVarName: string | string[],
    t: Transformer<T>,
    required: typeof REQUIRED,
    validator: ValidatorArg<T>
  ): T | ConfigError;
  <T>(envVarName: string | string[], t: Transformer<T>, defaultValue: T, validator: ValidatorArg<T>): T | ConfigError;
}

/**
 * Get a value with the given specification. The standard transformers available are 'str', 'num' and 'bool'. You can
 * also pass a custom transformer function (see {@link TransformerFunc}) as well a validator function or array of
 * validator functions. (Import the {@link Validators | `Validators`} library from
 * this library to explore the bundled validators or write your own by implementing {@link ValidatorFunc}.)
 *
 * The most common usage of this will be the following (see more examples below for advanced usage in context):
 *
 * ```ts
 * // Get a possibly-undefined string from the SOME_VAR environment variable
 * configValue('SOME_VAR');
 *
 * // Get a string with a default value of 'some default' from the SOME_VAR environment variable
 * configValue('SOME_VAR', 'some default');
 *
 * // Get a possibly-undefined number from the SOME_VAR environment variable
 * configValue('SOME_VAR', 'num');
 *
 * // Get a number with a default value of 5 from SOME_VAR
 * configValue('SOME_VAR', 'num', 5);
 *
 * // Get a required string from SOME_VAR with no default (note: `REQUIRED` is a special imported symbol from this
 * // library)
 * configValue('SOME_VAR', REQUIRED);
 *
 * // Get a required number from SOME_VAR with no default
 * configValue('SOME_VAR', 'num', REQUIRED);
 * ```
 *
 * @example
 * Following is a more real-world example of how this might all be used in context
 *
 * ```ts
 * const configDef = {
 *   port: configValue('PORT', 'num', 3000),
 *   hiPort: configValue('PORT', 'num', 30_000, hiport),
 *   host: configValue('HOST', 'str', 'http://localhost', hostValidator),
 *   db: {
 *     url: configValue('DB_URL', 'str', 'postgres://postgres@localhost:5432'),
 *     migrateOnStart: configValue('DB_MIGRATE_ON_START', 'bool', false),
 *   },
 *   signatureSecret: configValue('SIGNATURE_SECRET', 'str', [required, exactLength(32), hex]),
 *   secondsToWaitForThing: configValue('SECONDS_TO_WAIT_FOR_THING', 'num', required),
 * }
 *
 * export const config = validate(configDef);
 * ```
 *
 * NOTE: This function uses any-casts. This is because the underlying transformer functions are overloaded and require
 * _either_ one argument configuration _or_ the other, which gets messy in a function like this. Since this function is
 * itself properly overloaded, it's safe to use any-casts to solve this here.
 */
export const configValue: ConfigValueFunc = <T>(
  envVarNameArr: string | string[],
  defOrReqOrTransOrVal?: string | typeof REQUIRED | "str" | "num" | "bool" | Transformer<T> | ValidatorArg<T>,
  defOrReqOrValidator?: ValidatorArg<T> | T | typeof REQUIRED,
  validatorArg?: ValidatorArg<T>
) => {
  const { defaultValue, envVarName, required, transformer, validators } = processArgs(
    envVarNameArr,
    defOrReqOrTransOrVal,
    defOrReqOrValidator,
    validatorArg
  );

  // If required, add our special `required` validator to the validators stack
  if (required) {
    validators.unshift(requiredValidator);
  }

  // Get and transform the value
  let val = transformer(process.env[envVarName], envVarName) as T | undefined | ConfigError;

  // If we don't have a value but do have a default, set our value to that
  if (val === undefined && defaultValue !== undefined) {
    val = defaultValue as T;
  }

  // If the transformation worked, pass the value through our validators
  if (!isConfigError(val) && validators?.length) {
    const errors: string[] = [];
    for (const validator of validators) {
      const newErrors = validator(val);
      if (newErrors) {
        errors.push(...(Array.isArray(newErrors) ? newErrors : [newErrors]));
      }
    }

    if (errors.length > 0) {
      val = `::ERROR::${envVarName}::${errors.join("|")}`;
    }
  }

  // Return whatever we've got
  return val;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isCustomTransformer = <T>(obj: any): obj is Transformer<T> =>
  obj && typeof obj === "object" && typeof obj.transform === "function";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isValidatorArg = <T>(obj: any): obj is ValidatorArg<T> => typeof obj === "function" || Array.isArray(obj);

/**
 * Do some super-intense argument analysis to figure out what's what here and return a normalized set of arguments.
 *
 * God help ye who wanders here............
 */
const processArgs = <T>(
  envVarNameArr: string | string[],
  defOrReqOrTransOrVal?: string | typeof REQUIRED | "str" | "num" | "bool" | Transformer<T> | ValidatorArg<T>,
  defOrReqOrValidator?: ValidatorArg<T> | T | typeof REQUIRED,
  validatorArg?: ValidatorArg<T>
) => {
  // Get the best env var to use
  const envVarName = Array.isArray(envVarNameArr)
    ? envVarNameArr.find((v) => process.env[v] !== undefined) || envVarNameArr[0]!
    : envVarNameArr;

  const required = defOrReqOrTransOrVal === REQUIRED || defOrReqOrValidator === REQUIRED;

  // Get the transformer function to use
  const transformer = isCustomTransformer<T>(defOrReqOrTransOrVal)
    ? defOrReqOrTransOrVal.transform
    : typeof defOrReqOrTransOrVal === "string" && defOrReqOrTransOrVal in Transformers
      ? Transformers[defOrReqOrTransOrVal as keyof typeof Transformers].transform
      : Transformers.str.transform;

  // Get and normalize validators, if there are any
  const validators = validatorArg
    ? Array.isArray(validatorArg)
      ? validatorArg
      : [validatorArg]
    : isValidatorArg<T>(defOrReqOrValidator)
      ? typeof defOrReqOrValidator === "function"
        ? [defOrReqOrValidator]
        : defOrReqOrValidator
      : isValidatorArg<T>(defOrReqOrTransOrVal)
        ? typeof defOrReqOrTransOrVal === "function"
          ? [defOrReqOrTransOrVal]
          : defOrReqOrTransOrVal
        : [];

  // Get the default value, if specified
  const defaultValue =
    defOrReqOrTransOrVal !== REQUIRED &&
    !isValidatorArg(defOrReqOrTransOrVal) &&
    !isCustomTransformer<T>(defOrReqOrTransOrVal) &&
    !((defOrReqOrTransOrVal as string) in Transformers)
      ? (defOrReqOrTransOrVal as T | undefined)
      : defOrReqOrValidator !== undefined && !isValidatorArg(defOrReqOrValidator) && defOrReqOrValidator !== REQUIRED
        ? (defOrReqOrValidator as T)
        : undefined;

  // Return everything all bundled up
  return {
    defaultValue,
    envVarName,
    required,
    transformer,
    validators,
  };
};
