import getGlobalThis from "../../src/runtime/getGlobalThis";

describe("getGlobalThis", () => {
  it("should work", () => {
    expect(getGlobalThis).toEqual(globalThis);
  });
});
