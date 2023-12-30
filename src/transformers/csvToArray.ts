import { Transformer } from "../types";

export const csvToArray: Transformer<string[]> = {
  transform: (val: string | undefined) => {
    if (val) {
      return val.split(/ *, */);
    }
    return undefined;
  },
};
