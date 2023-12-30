/* eslint-disable @typescript-eslint/no-explicit-any */
import { configValue } from "../src/configValue";
import { REQUIRED, TransformerFunc, ValidatorFunc } from "../src/types";

// A test type for a custom transformer
type MyType = { one: number; two: string };

const testValidator =
  (pass: boolean): ValidatorFunc<any> =>
  (): string | void => {
    if (!pass) {
      return "This is an error";
    }
  };

describe("configValue function", () => {
  beforeEach(() => {
    process.env.TEST_STRING = "test";
    process.env.TEST_NUM = "123";
    process.env.TEST_TRUE = "true";
    process.env.TEST_FALSE = "false";
    process.env.TEST_1 = "1";
    process.env.TEST_0 = "0";
    process.env.EMPTY_STRING = "";
  });

  test("string", () => {
    // (envVar: string | string[]): string | undefined;
    expect(configValue("TEST_STRING")).toBe("test");
    expect(configValue("NON_EXISTENT")).toBe(undefined);

    // (envVar: string | string[], defaultOrRequired: DefOrReq<string>): string;
    expect(configValue("TEST_STRING", "my-default")).toBe("test");
    expect(configValue("NON_EXISTENT", "my-default")).toBe("my-default");
    expect(configValue("TEST_STRING", REQUIRED)).toBe("test");
    expect(configValue("NON_EXISTENT", REQUIRED)).toMatch(/^::ERROR::/);

    // (envVar: string | string[], validator: ValidatorArg<string>): string | undefined | ConfigError;
    expect(configValue("TEST_STRING", testValidator(true))).toBe("test");
    expect(configValue("NON_EXISTENT", testValidator(true))).toBe(undefined);
    expect(configValue("TEST_STRING", testValidator(false))).toMatch(/^::ERROR::/);
    expect(configValue("NON_EXISTENT", testValidator(false))).toMatch(/^::ERROR::/);
    expect(configValue("TEST_STRING", [testValidator(true)])).toBe("test");
    expect(configValue("NON_EXISTENT", [testValidator(true)])).toBe(undefined);
    expect(configValue("TEST_STRING", [testValidator(false)])).toMatch(/^::ERROR::/);
    expect(configValue("NON_EXISTENT", [testValidator(false)])).toMatch(/^::ERROR::/);

    // (envVar: string | string[], required: typeof REQUIRED, validator: ValidatorArg<string>): string | ConfigError;
    expect(configValue("TEST_STRING", REQUIRED, testValidator(true))).toBe("test");
    expect(configValue("NON_EXISTENT", REQUIRED, testValidator(true))).toMatch(/^::ERROR::/);
    expect(configValue("TEST_STRING", REQUIRED, testValidator(false))).toMatch(/^::ERROR::/);
    expect(configValue("NON_EXISTENT", REQUIRED, testValidator(false))).toMatch(/^::ERROR::/);
    expect(configValue("TEST_STRING", REQUIRED, [testValidator(true)])).toBe("test");
    expect(configValue("NON_EXISTENT", REQUIRED, [testValidator(true)])).toMatch(/^::ERROR::/);
    expect(configValue("TEST_STRING", REQUIRED, [testValidator(false)])).toMatch(/^::ERROR::/);
    expect(configValue("NON_EXISTENT", REQUIRED, [testValidator(false)])).toMatch(/^::ERROR::/);

    // (envVar: string | string[], defaultValue: string, validator: ValidatorArg<string>): string;
    expect(configValue("TEST_STRING", "my-default", testValidator(true))).toBe("test");
    expect(configValue("NON_EXISTENT", "my-default", testValidator(true))).toBe("my-default");
    expect(configValue("TEST_STRING", "my-default", testValidator(false))).toMatch(/^::ERROR::/);
    expect(configValue("NON_EXISTENT", "my-default", testValidator(false))).toMatch(/^::ERROR::/);
    expect(configValue("TEST_STRING", "my-default", [testValidator(true)])).toBe("test");
    expect(configValue("NON_EXISTENT", "my-default", [testValidator(true)])).toBe("my-default");
    expect(configValue("TEST_STRING", "my-default", [testValidator(false)])).toMatch(/^::ERROR::/);
    expect(configValue("NON_EXISTENT", "my-default", [testValidator(false)])).toMatch(/^::ERROR::/);

    // (envVar: string | string[], t: 'str'): string | undefined;
    expect(configValue("TEST_STRING", "str")).toBe("test");
    expect(configValue("NON_EXISTENT", "str")).toBe(undefined);

    // (envVar: string | string[], t: 'str', defaultOrRequired: DefOrReq<string>): string;
    expect(configValue("TEST_STRING", "str", "my-default")).toBe("test");
    expect(configValue("TEST_STRING", "str", REQUIRED)).toBe("test");
    expect(configValue("NON_EXISTENT", "str", "my-default")).toBe("my-default");
    expect(configValue("NON_EXISTENT", "str", REQUIRED)).toMatch(/^::ERROR::/);

    // (envVar: string | string[], t: 'str', validator: ValidatorArg<string>): string | undefined | ConfigError;
    expect(configValue("TEST_STRING", "str", testValidator(true))).toBe("test");
    expect(configValue("NON_EXISTENT", "str", testValidator(true))).toBe(undefined);
    expect(configValue("TEST_STRING", "str", testValidator(false))).toMatch(/^::ERROR::/);
    expect(configValue("NON_EXISTENT", "str", testValidator(false))).toMatch(/^::ERROR::/);
    expect(configValue("TEST_STRING", "str", [testValidator(true)])).toBe("test");
    expect(configValue("NON_EXISTENT", "str", [testValidator(true)])).toBe(undefined);
    expect(configValue("TEST_STRING", "str", [testValidator(false)])).toMatch(/^::ERROR::/);
    expect(configValue("NON_EXISTENT", "str", [testValidator(false)])).toMatch(/^::ERROR::/);

    // (envVar: string | string[], t: 'str', required: typeof REQUIRED, validator: ValidatorArg<string>): string | ConfigError;
    expect(configValue("TEST_STRING", "str", REQUIRED, testValidator(true))).toBe("test");
    expect(configValue("NON_EXISTENT", "str", REQUIRED, testValidator(true))).toMatch(/^::ERROR::/);
    expect(configValue("TEST_STRING", "str", REQUIRED, testValidator(false))).toMatch(/^::ERROR::/);
    expect(configValue("NON_EXISTENT", "str", REQUIRED, testValidator(false))).toMatch(/^::ERROR::/);
    expect(configValue("TEST_STRING", "str", REQUIRED, [testValidator(true)])).toBe("test");
    expect(configValue("NON_EXISTENT", "str", REQUIRED, [testValidator(true)])).toMatch(/^::ERROR::/);
    expect(configValue("TEST_STRING", "str", REQUIRED, [testValidator(false)])).toMatch(/^::ERROR::/);
    expect(configValue("NON_EXISTENT", "str", REQUIRED, [testValidator(false)])).toMatch(/^::ERROR::/);

    // (envVar: string | string[], t: 'str', defaultValue: string, validator: ValidatorArg<string>): string | ConfigError;
    expect(configValue("TEST_STRING", "str", "my-default", testValidator(true))).toBe("test");
    expect(configValue("NON_EXISTENT", "str", "my-default", testValidator(true))).toMatch("my-default");
    expect(configValue("TEST_STRING", "str", "my-default", testValidator(false))).toMatch(/^::ERROR::/);
    expect(configValue("NON_EXISTENT", "str", "my-default", testValidator(false))).toMatch(/^::ERROR::/);
    expect(configValue("TEST_STRING", "str", "my-default", [testValidator(true)])).toBe("test");
    expect(configValue("NON_EXISTENT", "str", "my-default", [testValidator(true)])).toMatch("my-default");
    expect(configValue("TEST_STRING", "str", "my-default", [testValidator(false)])).toMatch(/^::ERROR::/);
    expect(configValue("NON_EXISTENT", "str", "my-default", [testValidator(false)])).toMatch(/^::ERROR::/);
  });

  test("number", () => {
    // (envVar: string | string[], t: 'num'): number | undefined | ConfigError;
    expect(configValue("TEST_NUM", "num")).toBe(123);
    expect(configValue("NON_EXISTENT", "num")).toBe(undefined);
    expect(configValue("TEST_STRING", "num")).toMatch(/^::ERROR::/);

    // (envVar: string | string[], t: 'num', defaultOrRequired: DefOrReq<number>): number | ConfigError;
    expect(configValue("TEST_NUM", "num", 456)).toBe(123);
    expect(configValue("NON_EXISTENT", "num", 456)).toBe(456);
    expect(configValue("TEST_STRING", "num", 456)).toMatch(/^::ERROR::/);
    expect(configValue("TEST_NUM", "num", REQUIRED)).toBe(123);
    expect(configValue("NON_EXISTENT", "num", REQUIRED)).toMatch(/^::ERROR::/);
    expect(configValue("TEST_STRING", "num", REQUIRED)).toMatch(/^::ERROR::/);

    // (envVar: string | string[], t: 'num', validator: ValidatorArg<number>): number | ConfigError;
    expect(configValue("TEST_NUM", "num", testValidator(true))).toBe(123);
    expect(configValue("NON_EXISTENT", "num", testValidator(true))).toBe(undefined);
    expect(configValue("TEST_STRING", "num", testValidator(true))).toMatch(/^::ERROR::/);
    expect(configValue("TEST_NUM", "num", testValidator(false))).toMatch(/^::ERROR::/);
    expect(configValue("NON_EXISTENT", "num", testValidator(false))).toMatch(/^::ERROR::/);
    expect(configValue("TEST_STRING", "num", testValidator(false))).toMatch(/^::ERROR::/);
    expect(configValue("TEST_NUM", "num", [testValidator(true)])).toBe(123);
    expect(configValue("NON_EXISTENT", "num", [testValidator(true)])).toBe(undefined);
    expect(configValue("TEST_STRING", "num", [testValidator(true)])).toMatch(/^::ERROR::/);
    expect(configValue("TEST_NUM", "num", [testValidator(false)])).toMatch(/^::ERROR::/);
    expect(configValue("NON_EXISTENT", "num", [testValidator(false)])).toMatch(/^::ERROR::/);
    expect(configValue("TEST_STRING", "num", [testValidator(false)])).toMatch(/^::ERROR::/);

    // (envVar: string | string[], t: 'num', required: typeof REQUIRED, validator: ValidatorArg<number>): number | ConfigError;
    expect(configValue("TEST_NUM", "num", REQUIRED, testValidator(true))).toBe(123);
    expect(configValue("NON_EXISTENT", "num", REQUIRED, testValidator(true))).toMatch(/^::ERROR::/);
    expect(configValue("TEST_STRING", "num", REQUIRED, testValidator(true))).toMatch(/^::ERROR::/);
    expect(configValue("TEST_NUM", "num", REQUIRED, testValidator(false))).toMatch(/^::ERROR::/);
    expect(configValue("NON_EXISTENT", "num", REQUIRED, testValidator(false))).toMatch(/^::ERROR::/);
    expect(configValue("TEST_STRING", "num", REQUIRED, testValidator(false))).toMatch(/^::ERROR::/);
    expect(configValue("TEST_NUM", "num", REQUIRED, [testValidator(true)])).toBe(123);
    expect(configValue("NON_EXISTENT", "num", REQUIRED, [testValidator(true)])).toMatch(/^::ERROR::/);
    expect(configValue("TEST_STRING", "num", REQUIRED, [testValidator(true)])).toMatch(/^::ERROR::/);
    expect(configValue("TEST_NUM", "num", REQUIRED, [testValidator(false)])).toMatch(/^::ERROR::/);
    expect(configValue("NON_EXISTENT", "num", REQUIRED, [testValidator(false)])).toMatch(/^::ERROR::/);
    expect(configValue("TEST_STRING", "num", REQUIRED, [testValidator(false)])).toMatch(/^::ERROR::/);

    // (envVar: string | string[], t: 'num', defaultValue: number, validator: ValidatorArg<number>): number | ConfigError;
    expect(configValue("TEST_NUM", "num", 456, testValidator(true))).toBe(123);
    expect(configValue("NON_EXISTENT", "num", 456, testValidator(true))).toBe(456);
    expect(configValue("TEST_STRING", "num", 456, testValidator(true))).toMatch(/^::ERROR::/);
    expect(configValue("TEST_NUM", "num", 456, testValidator(false))).toMatch(/^::ERROR::/);
    expect(configValue("NON_EXISTENT", "num", 456, testValidator(false))).toMatch(/^::ERROR::/);
    expect(configValue("TEST_STRING", "num", 456, testValidator(false))).toMatch(/^::ERROR::/);
    expect(configValue("TEST_NUM", "num", 456, [testValidator(true)])).toBe(123);
    expect(configValue("NON_EXISTENT", "num", 456, [testValidator(true)])).toBe(456);
    expect(configValue("TEST_STRING", "num", 456, [testValidator(true)])).toMatch(/^::ERROR::/);
    expect(configValue("TEST_NUM", "num", 456, [testValidator(false)])).toMatch(/^::ERROR::/);
    expect(configValue("NON_EXISTENT", "num", 456, [testValidator(false)])).toMatch(/^::ERROR::/);
    expect(configValue("TEST_STRING", "num", 456, [testValidator(false)])).toMatch(/^::ERROR::/);
  });

  test("boolean", () => {
    // (envVar: string | string[], t: 'bool'): boolean | undefined | ConfigError;
    expect(configValue("TEST_TRUE", "bool")).toBe(true);
    expect(configValue("TEST_FALSE", "bool")).toBe(false);
    expect(configValue("TEST_1", "bool")).toBe(true);
    expect(configValue("TEST_0", "bool")).toBe(false);
    expect(configValue("NON_EXISTENT", "bool")).toBe(undefined);
    expect(configValue("TEST_STRING", "bool")).toMatch(/^::ERROR::/);

    // (envVar: string | string[], t: 'bool', defaultOrRequired: DefOrReq<boolean>): boolean | ConfigError;
    expect(configValue("TEST_TRUE", "bool", REQUIRED)).toBe(true);
    expect(configValue("NON_EXISTENT", "bool", REQUIRED)).toMatch(/^::ERROR::/);
    expect(configValue("TEST_STRING", "bool", REQUIRED)).toMatch(/^::ERROR::/);
    expect(configValue("TEST_TRUE", "bool", false)).toBe(true);
    expect(configValue("NON_EXISTENT", "bool", false)).toBe(false);
    expect(configValue("TEST_STRING", "bool", false)).toMatch(/^::ERROR::/);

    // (envVar: string | string[], t: 'bool', validator: ValidatorArg<boolean>): boolean | undefined | ConfigError;
    expect(configValue("TEST_TRUE", "bool", testValidator(true))).toBe(true);
    expect(configValue("NON_EXISTENT", "bool", testValidator(true))).toBe(undefined);
    expect(configValue("TEST_STRING", "bool", testValidator(true))).toMatch(/^::ERROR::/);
    expect(configValue("TEST_TRUE", "bool", testValidator(false))).toMatch(/^::ERROR::/);
    expect(configValue("NON_EXISTENT", "bool", testValidator(false))).toMatch(/^::ERROR::/);
    expect(configValue("TEST_STRING", "bool", testValidator(false))).toMatch(/^::ERROR::/);
    expect(configValue("TEST_TRUE", "bool", [testValidator(true)])).toBe(true);
    expect(configValue("NON_EXISTENT", "bool", [testValidator(true)])).toBe(undefined);
    expect(configValue("TEST_STRING", "bool", [testValidator(true)])).toMatch(/^::ERROR::/);
    expect(configValue("TEST_TRUE", "bool", [testValidator(false)])).toMatch(/^::ERROR::/);
    expect(configValue("NON_EXISTENT", "bool", [testValidator(false)])).toMatch(/^::ERROR::/);
    expect(configValue("TEST_STRING", "bool", [testValidator(false)])).toMatch(/^::ERROR::/);

    // (envVar: string | string[], t: 'bool', required: typeof REQUIRED, validator: ValidatorArg<boolean>): boolean | ConfigError;
    expect(configValue("TEST_TRUE", "bool", REQUIRED, testValidator(true))).toBe(true);
    expect(configValue("NON_EXISTENT", "bool", REQUIRED, testValidator(true))).toMatch(/^::ERROR::/);
    expect(configValue("TEST_STRING", "bool", REQUIRED, testValidator(true))).toMatch(/^::ERROR::/);
    expect(configValue("TEST_TRUE", "bool", REQUIRED, testValidator(false))).toMatch(/^::ERROR::/);
    expect(configValue("NON_EXISTENT", "bool", REQUIRED, testValidator(false))).toMatch(/^::ERROR::/);
    expect(configValue("TEST_STRING", "bool", REQUIRED, testValidator(false))).toMatch(/^::ERROR::/);
    expect(configValue("TEST_TRUE", "bool", REQUIRED, [testValidator(true)])).toBe(true);
    expect(configValue("NON_EXISTENT", "bool", REQUIRED, [testValidator(true)])).toMatch(/^::ERROR::/);
    expect(configValue("TEST_STRING", "bool", REQUIRED, [testValidator(true)])).toMatch(/^::ERROR::/);
    expect(configValue("TEST_TRUE", "bool", REQUIRED, [testValidator(false)])).toMatch(/^::ERROR::/);
    expect(configValue("NON_EXISTENT", "bool", REQUIRED, [testValidator(false)])).toMatch(/^::ERROR::/);
    expect(configValue("TEST_STRING", "bool", REQUIRED, [testValidator(false)])).toMatch(/^::ERROR::/);

    // (envVar: string | string[], t: 'bool', defaultValue: boolean, validator: ValidatorArg<boolean>): boolean | ConfigError;
    expect(configValue("TEST_TRUE", "bool", false, testValidator(true))).toBe(true);
    expect(configValue("NON_EXISTENT", "bool", false, testValidator(true))).toBe(false);
    expect(configValue("TEST_STRING", "bool", false, testValidator(true))).toMatch(/^::ERROR::/);
    expect(configValue("TEST_TRUE", "bool", false, testValidator(false))).toMatch(/^::ERROR::/);
    expect(configValue("NON_EXISTENT", "bool", false, testValidator(false))).toMatch(/^::ERROR::/);
    expect(configValue("TEST_STRING", "bool", false, testValidator(false))).toMatch(/^::ERROR::/);
    expect(configValue("TEST_TRUE", "bool", false, [testValidator(true)])).toBe(true);
    expect(configValue("NON_EXISTENT", "bool", false, [testValidator(true)])).toBe(false);
    expect(configValue("TEST_STRING", "bool", false, [testValidator(true)])).toMatch(/^::ERROR::/);
    expect(configValue("TEST_TRUE", "bool", false, [testValidator(false)])).toMatch(/^::ERROR::/);
    expect(configValue("NON_EXISTENT", "bool", false, [testValidator(false)])).toMatch(/^::ERROR::/);
    expect(configValue("TEST_STRING", "bool", false, [testValidator(false)])).toMatch(/^::ERROR::/);
  });

  test("custom", () => {
    const myType: TransformerFunc<MyType> = (val: string | undefined, varname: string) => {
      if (!val) {
        return undefined;
      }
      try {
        // Normally you would validate but for testing we're skipping that and just returning whatever
        return JSON.parse(val) as MyType;
      } catch (e) {
        return `::ERROR::${varname}::Invalid JSON string passed: ${e.message}`;
      }
    };

    const obj: MyType = { one: 1, two: "two" };
    const defMyType: MyType = { one: 3, two: "four" };

    // eslint-disable-next-line no-process-env
    process.env.MY_TYPE = JSON.stringify(obj);

    // <T>(envVar: string | string[], t: { transform: TransformerFunc<T> }): T | undefined | ConfigError;
    expect(configValue("MY_TYPE", { transform: myType })).toStrictEqual(obj);
    expect(configValue("NON_EXISTENT", { transform: myType })).toBe(undefined);
    expect(configValue("TEST_STRING", { transform: myType })).toMatch(/^::ERROR::/);

    // <T>(envVar: string | string[], t: { transform: TransformerFunc<T> }, defaultOrRequired: DefOrReq<T>): T | ConfigError;
    expect(configValue("MY_TYPE", { transform: myType }, defMyType)).toStrictEqual(obj);
    expect(configValue("NON_EXISTENT", { transform: myType }, defMyType)).toStrictEqual(defMyType);
    expect(configValue("TEST_STRING", { transform: myType }, defMyType)).toMatch(/^::ERROR::/);
    expect(configValue("MY_TYPE", { transform: myType }, REQUIRED)).toStrictEqual(obj);
    expect(configValue("NON_EXISTENT", { transform: myType }, REQUIRED)).toMatch(/^::ERROR::/);
    expect(configValue("TEST_STRING", { transform: myType }, REQUIRED)).toMatch(/^::ERROR::/);

    // <T>(envVar: string | string[], t: { transform: TransformerFunc<T> }, validator: ValidatorArg<T>): T | undefined | ConfigError;
    expect(configValue("MY_TYPE", { transform: myType }, testValidator(true))).toStrictEqual(obj);
    expect(configValue("NON_EXISTENT", { transform: myType }, testValidator(true))).toBe(undefined);
    expect(configValue("TEST_STRING", { transform: myType }, testValidator(true))).toMatch(/^::ERROR::/);
    expect(configValue("MY_TYPE", { transform: myType }, testValidator(false))).toMatch(/^::ERROR::/);
    expect(configValue("NON_EXISTENT", { transform: myType }, testValidator(false))).toMatch(/^::ERROR::/);
    expect(configValue("TEST_STRING", { transform: myType }, testValidator(false))).toMatch(/^::ERROR::/);
    expect(configValue("MY_TYPE", { transform: myType }, [testValidator(true)])).toStrictEqual(obj);
    expect(configValue("NON_EXISTENT", { transform: myType }, [testValidator(true)])).toBe(undefined);
    expect(configValue("TEST_STRING", { transform: myType }, [testValidator(true)])).toMatch(/^::ERROR::/);
    expect(configValue("MY_TYPE", { transform: myType }, [testValidator(false)])).toMatch(/^::ERROR::/);
    expect(configValue("NON_EXISTENT", { transform: myType }, [testValidator(false)])).toMatch(/^::ERROR::/);
    expect(configValue("TEST_STRING", { transform: myType }, [testValidator(false)])).toMatch(/^::ERROR::/);

    // <T>(envVar: string | string[], t: { transform: TransformerFunc<T> }, required: typeof REQUIRED, validator: ValidatorArg<T>): T | ConfigError;
    expect(configValue("MY_TYPE", { transform: myType }, REQUIRED, testValidator(true))).toStrictEqual(obj);
    expect(configValue("NON_EXISTENT", { transform: myType }, REQUIRED, testValidator(true))).toMatch(/^::ERROR::/);
    expect(configValue("TEST_STRING", { transform: myType }, REQUIRED, testValidator(true))).toMatch(/^::ERROR::/);
    expect(configValue("MY_TYPE", { transform: myType }, REQUIRED, testValidator(false))).toMatch(/^::ERROR::/);
    expect(configValue("NON_EXISTENT", { transform: myType }, REQUIRED, testValidator(false))).toMatch(/^::ERROR::/);
    expect(configValue("TEST_STRING", { transform: myType }, REQUIRED, testValidator(false))).toMatch(/^::ERROR::/);
    expect(configValue("MY_TYPE", { transform: myType }, REQUIRED, [testValidator(true)])).toStrictEqual(obj);
    expect(configValue("NON_EXISTENT", { transform: myType }, REQUIRED, [testValidator(true)])).toMatch(/^::ERROR::/);
    expect(configValue("TEST_STRING", { transform: myType }, REQUIRED, [testValidator(true)])).toMatch(/^::ERROR::/);
    expect(configValue("MY_TYPE", { transform: myType }, REQUIRED, [testValidator(false)])).toMatch(/^::ERROR::/);
    expect(configValue("NON_EXISTENT", { transform: myType }, REQUIRED, [testValidator(false)])).toMatch(/^::ERROR::/);
    expect(configValue("TEST_STRING", { transform: myType }, REQUIRED, [testValidator(false)])).toMatch(/^::ERROR::/);

    // <T>(envVar: string | string[], t: { transform: TransformerFunc<T> }, defaultValue: T, validator: ValidatorArg<T>): T | ConfigError;
    expect(configValue("MY_TYPE", { transform: myType }, defMyType, testValidator(true))).toStrictEqual(obj);
    expect(configValue("NON_EXISTENT", { transform: myType }, defMyType, testValidator(true))).toStrictEqual(defMyType);
    expect(configValue("TEST_STRING", { transform: myType }, defMyType, testValidator(true))).toMatch(/^::ERROR::/);
    expect(configValue("MY_TYPE", { transform: myType }, defMyType, testValidator(false))).toMatch(/^::ERROR::/);
    expect(configValue("NON_EXISTENT", { transform: myType }, defMyType, testValidator(false))).toMatch(/^::ERROR::/);
    expect(configValue("TEST_STRING", { transform: myType }, defMyType, testValidator(false))).toMatch(/^::ERROR::/);
    expect(configValue("MY_TYPE", { transform: myType }, defMyType, [testValidator(true)])).toStrictEqual(obj);
    expect(configValue("NON_EXISTENT", { transform: myType }, defMyType, [testValidator(true)])).toStrictEqual(
      defMyType
    );
    expect(configValue("TEST_STRING", { transform: myType }, defMyType, [testValidator(true)])).toMatch(/^::ERROR::/);
    expect(configValue("MY_TYPE", { transform: myType }, defMyType, [testValidator(false)])).toMatch(/^::ERROR::/);
    expect(configValue("NON_EXISTENT", { transform: myType }, defMyType, [testValidator(false)])).toMatch(/^::ERROR::/);
    expect(configValue("TEST_STRING", { transform: myType }, defMyType, [testValidator(false)])).toMatch(/^::ERROR::/);
  });

  test("handles arrays of env vars", () => {
    process.env.THREE = "3";
    process.env.FOUR = "4";
    expect(configValue(["ONE", "TWO", "THREE"], "num", 5)).toBe(3);
    expect(configValue(["FOUR", "THREE", "TWO", "ONE"], "num", 5)).toBe(4);
    expect(configValue(["TWO", "ONE"], "num", 5)).toBe(5);
  });
});
