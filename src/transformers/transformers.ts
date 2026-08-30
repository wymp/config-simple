import { bool } from "./bool.js";
import { csvToArray } from "./csvToArray.js";
import { num } from "./num.js";
import { str } from "./str.js";

/**
 * A library of transformer functions that are bundled with this library. Note: It is generally easier to use the string
 * aliases to access these functions (e.g., `configValue('MY_VAR', 'num')` instead of importing and using them
 * directly.)
 */
export const Transformers = { bool, csvToArray, num, str };
