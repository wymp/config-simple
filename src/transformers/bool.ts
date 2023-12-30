import { Transformer } from "../types";

/** A standard boolean transformer */
export const bool: Transformer<boolean> = {
  transform: (val: string | undefined, varname: string) => {
    if (!val) {
      return undefined;
    }
    val = val.toLowerCase();
    if (val === "true" || val === "1") {
      return true;
    }
    if (val === "false" || val === "0") {
      return false;
    }
    return `::ERROR::${varname}::This value must look like a boolean ('true', 'false', '0' or '1'). You provided '${val}'`;
  },
};
