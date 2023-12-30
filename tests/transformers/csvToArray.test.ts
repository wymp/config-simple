import { csvToArray } from "../../src/transformers/csvToArray";

describe(`csvToArray Transformer`, () => {
  test(`should return undefined if the value is undefined`, () => {
    expect(csvToArray.transform(undefined, "MY_VAR")).toBeUndefined();
  });

  test(`should return undefined if the value is an empty string`, () => {
    expect(csvToArray.transform("", "MY_VAR")).toBeUndefined();
  });

  test(`should return an array of strings if the value is a comma-separated string`, () => {
    expect(csvToArray.transform("a,b,c", "MY_VAR")).toEqual(["a", "b", "c"]);
  });

  test(`should return an array of trimmed strings if the value is a comma-separated string with spaces`, () => {
    expect(csvToArray.transform("a, b, c", "MY_VAR")).toEqual(["a", "b", "c"]);
  });

  test(`should return a single-element array if string has no commas`, () => {
    expect(csvToArray.transform("aaaaa bbbbb", "MY_VAR")).toEqual(["aaaaa bbbbb"]);
  });
});
