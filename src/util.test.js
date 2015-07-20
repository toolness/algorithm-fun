import * as util from "./util.js";

describe("util.range()", () => {
  it("should work with one argument", () => {
    util.range(3).should.eql([0, 1, 2]);
  });

  it("should work with two arguments", () => {
    util.range(3, 5).should.eql([3, 4]);
  });
});
