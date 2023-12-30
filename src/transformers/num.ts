import { Transformer } from "../types";

/** A standard number transformer */
export const num: Transformer<number> = {
  transform: (val: string | undefined, varname: string) => {
    if (!val) {
      return undefined;
    }
    const n = Number(val);
    if (isNaN(n)) {
      return `::ERROR::${varname}::This value must be a number. You passed ${val}`;
    }
    return n;
  },
};
