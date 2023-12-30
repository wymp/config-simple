/** A special symbol indicating that the given value is required */
export const REQUIRED = Symbol.for("required");

/** A type indicating an error. You can return this from a custom transformer function as well */
export type ConfigError = `::ERROR::${string}`;

/**
 * Any function conforming to this interface may be passed to the `configValue` function to transform the value of a given
 * config key.
 *
 * @example
 * ```ts
 * const myType = ((val: string | undefined, varname: string) => {
 *   if (!val) {
 *     if (def === REQUIRED) {
 *       return `::ERROR::${varname}::This value is required`;
 *     }
 *     return def;
 *   }
 *   try {
 *     // Normally you would validate but for testing we're skipping that and just returning whatever
 *     return JSON.parse(val) as MyType;
 *   } catch (e: any) {
 *     return `::ERROR::${varname}::Invalid JSON string passed: ${e.message}`;
 *   }
 * }) as TransformerFunction<MyType>;
 *
 * // ...
 *
 * const configDef = {
 *   myType: configValue('MY_TYPE', myType, REQUIRED),
 *   // ...
 * }
 * ```
 */
export type TransformerFunc<T> = (val: string | undefined, varname: string) => T | undefined | ConfigError;

/**
 * A transformer. See {@link TransformerFunc} for more details.
 */
export type Transformer<T> = { transform: TransformerFunc<T> };

/**
 * To implement a custom validator, just implement a function that takes the value to be validated and returns either
 * undefined or an error of error strings.
 */
export type ValidatorFunc<T> = (val: T | undefined) => void | string | string[];
