import { bool } from "./bool";
import { csvToArray } from "./csvToArray";
import { num } from "./num";
import { str } from "./str";

/**
 * A library of transformer functions that are bundled with this library. Note: It is generally easier to use the string
 * aliases to access these functions (e.g., `configValue('MY_VAR', 'num')` instead of importing and using them
 * directly.)
 */
export const Transformers = { bool, csvToArray, num, str };
