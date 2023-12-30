/* eslint-disable @typescript-eslint/no-explicit-any */
import { ConfigError } from "../src/types";
import { validate } from "../src/validate";

describe("validate", () => {
  test("should return the same object if there are no errors", () => {
    const obj = { a: 1, b: "2", c: { d: 3 } };
    expect(validate(obj)).toStrictEqual(obj);
  });

  test("should throw an error if there are errors", () => {
    const obj = { a: 1, b: "2", c: { d: "::ERROR::bad" }, e: "::ERROR::more bad" };
    expect(() => validate(obj)).toThrowErrorMatchingSnapshot();
  });

  test('should return a ConfigResult if there are errors and behavior is "dont-throw"', () => {
    const obj = {
      a: 1 as number | ConfigError,
      b: "2" as string | undefined | ConfigError,
      c: {
        d: "::ERROR::bad" as boolean | undefined | ConfigError,
      },
    };
    expect(validate(obj, "dont-throw")).toMatchSnapshot();
  });

  test("should return a deeply frozen object", () => {
    const obj = { a: 1, b: "2", c: { d: 3 } };
    const result = validate(obj);
    expect(Object.isFrozen(result)).toBe(true);
    expect(Object.isFrozen(result.c)).toBe(true);
  });

  test("should return both object path and env var name in error", () => {
    const obj = {
      a: 1 as number | ConfigError,
      b: "2" as string | undefined | ConfigError,
      c: {
        d: "::ERROR::MY_ENV_VAR::bad" as boolean | undefined | ConfigError,
      },
    };
    const result = validate(obj, "dont-throw");
    expect((result as any).errors?.[0]).toMatch(/\bc.d\b/);
    expect((result as any).errors?.[0]).toMatch(/\bMY_ENV_VAR\b/);
  });

  test("handles multiple errors per key", () => {
    const obj = { a: "::ERROR::MY_ENV_VAR::bad|worse|worst" };
    expect(() => validate(obj)).toThrowErrorMatchingSnapshot();
  });

  test("should return arrays as arrays", () => {
    const obj = { a: [1, 2, 3] };
    expect(Array.isArray(validate(obj).a)).toBe(true);
  });
});
