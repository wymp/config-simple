import { Transformer } from "../types";

/** A standard string transformer */
export const str: Transformer<string> = {
  transform: (val: string | undefined) => val || undefined,
};
