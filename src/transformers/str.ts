import { Transformer } from "../types.js";

/** A standard string transformer */
export const str: Transformer<string> = {
  transform: (val: string | undefined) => val || undefined,
};
