import { required, requiredForEnvs, requiredIf } from "../../src/validators/required";

describe('"required" validators', () => {
  describe("required", () => {
    test("returns an error if the value is undefined", () => {
      expect(required(undefined)).not.toBeUndefined();
    });
    test("does not return an error if the value is not undefined", () => {
      expect(required("")).toBeUndefined();
      expect(required("str")).toBeUndefined();
      expect(required(true)).toBeUndefined();
      expect(required(false)).toBeUndefined();
      expect(required(null)).toBeUndefined();
      expect(required(0)).toBeUndefined();
      expect(required(1)).toBeUndefined();
      expect(required({ one: 1 })).toBeUndefined();
    });
  });

  describe("requiredForEnvs", () => {
    test("returns an error if the value is undefined and the env is in the list", () => {
      expect(requiredForEnvs("test", ["test", "prod", "stage"])(undefined)).not.toBeUndefined();
    });
    test("does not return an error if the value is undefined and the env is not in the list", () => {
      expect(requiredForEnvs("test", ["prod", "stage"])(undefined)).toBeUndefined();
    });
    test("does not return an error if the value is not undefined", () => {
      expect(requiredForEnvs("test", ["test", "prod", "stage"])("")).toBeUndefined();
      expect(requiredForEnvs("test", ["test", "prod", "stage"])("str")).toBeUndefined();
      expect(requiredForEnvs("test", ["test", "prod", "stage"])(true)).toBeUndefined();
      expect(requiredForEnvs("test", ["test", "prod", "stage"])(false)).toBeUndefined();
      expect(requiredForEnvs("test", ["test", "prod", "stage"])(null)).toBeUndefined();
      expect(requiredForEnvs("test", ["test", "prod", "stage"])(0)).toBeUndefined();
      expect(requiredForEnvs("test", ["test", "prod", "stage"])(1)).toBeUndefined();
      expect(requiredForEnvs("test", ["test", "prod", "stage"])({ one: 1 })).toBeUndefined();

      expect(requiredForEnvs("test", ["prod", "stage"])("")).toBeUndefined();
      expect(requiredForEnvs("test", ["prod", "stage"])("str")).toBeUndefined();
      expect(requiredForEnvs("test", ["prod", "stage"])(true)).toBeUndefined();
      expect(requiredForEnvs("test", ["prod", "stage"])(false)).toBeUndefined();
      expect(requiredForEnvs("test", ["prod", "stage"])(null)).toBeUndefined();
      expect(requiredForEnvs("test", ["prod", "stage"])(0)).toBeUndefined();
      expect(requiredForEnvs("test", ["prod", "stage"])(1)).toBeUndefined();
      expect(requiredForEnvs("test", ["prod", "stage"])({ one: 1 })).toBeUndefined();
    });
  });

  describe("requiredIf", () => {
    test("returns an error if the value is undefined and the condition is true", () => {
      expect(requiredIf(true)(undefined)).not.toBeUndefined();
    });
    test("does not return an error if the value is undefined and the condition is not true", () => {
      expect(requiredIf(false)(undefined)).toBeUndefined();
    });
    test("does not return an error if the value is not undefined", () => {
      expect(requiredIf(true)("")).toBeUndefined();
      expect(requiredIf(true)("str")).toBeUndefined();
      expect(requiredIf(true)(true)).toBeUndefined();
      expect(requiredIf(true)(false)).toBeUndefined();
      expect(requiredIf(true)(null)).toBeUndefined();
      expect(requiredIf(true)(0)).toBeUndefined();
      expect(requiredIf(true)(1)).toBeUndefined();
      expect(requiredIf(true)({ one: 1 })).toBeUndefined();

      expect(requiredIf(false)("")).toBeUndefined();
      expect(requiredIf(false)("str")).toBeUndefined();
      expect(requiredIf(false)(true)).toBeUndefined();
      expect(requiredIf(false)(false)).toBeUndefined();
      expect(requiredIf(false)(null)).toBeUndefined();
      expect(requiredIf(false)(0)).toBeUndefined();
      expect(requiredIf(false)(1)).toBeUndefined();
      expect(requiredIf(false)({ one: 1 })).toBeUndefined();
    });
  });
});
