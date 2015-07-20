import * as util from "./util.js";

describe("util.range()", () => {
  it("should work with one argument", () => {
    util.range(3).should.eql([0, 1, 2]);
  });

  it("should work with two arguments", () => {
    util.range(3, 5).should.eql([3, 4]);
  });
});

describe("util.svgPathFromPoints()", () => {
  it("should work", () => {
    util.svgPathFromPoints([{x: 0, y: 0}, {x: 1, y: 1}])
      .should.eql("M 0,0 L 1,1");
  });
});
