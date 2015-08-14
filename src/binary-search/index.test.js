import binarySearch from "./index";

describe("binarySearch()", () => {
  it("should find value when it is median", () => {
    binarySearch([1,2,3,4,5], 3).should.equal(2);
  });

  it("should find value when it is first entry", () => {
    binarySearch([1,2,3,4,5], 1).should.equal(0);
  });

  it("should find value when it is second entry", () => {
    binarySearch([1,2,3,4,5], 2).should.equal(1);
    binarySearch([1,2,3,4], 2).should.equal(1);
  });

  it("should find value when it is second to last entry", () => {
    binarySearch([1,2,3,4,5], 4).should.equal(3);
  });

  it("should find value when it is last entry", () => {
    binarySearch([1,2,3,4,5], 5).should.equal(4);
  });

  it("should find value when it is the only entry", () => {
    binarySearch([3], 3).should.equal(0);
  });

  it("should return -1 when value isn't found in array of size 1", () => {
    binarySearch([1], 3).should.equal(-1);
  });

  it("should return -1 when array is empty", () => {
    binarySearch([], 3).should.equal(-1);
  });
});
