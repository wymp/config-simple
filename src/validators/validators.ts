import { requiredForEnvs, requiredIf } from "./required.js";
import { exactLen, httpHost, match, maxLen, minLen, oneOf } from "./string.js";

/**
 * A library of bundled validators that you may use in your config definitions. You can also write your own validators
 * by implementing the {@link ValidatorFunc} interface.
 */
export const Validators = {
  exactLen,
  httpHost,
  match,
  maxLen,
  minLen,
  oneOf,
  requiredForEnvs,
  requiredIf,
};
