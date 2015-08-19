import mergeSort from "./index.js";

describe("mergeSort()", () => {
  it("should sort arrays of length 0", () => {
    mergeSort([]).should.eql([]);
  });

  it("should sort arrays of length 1", () => {
    mergeSort([1]).should.eql([1]);
  });

  it("should sort arrays of length > 1", () => {
    mergeSort([3, 1, 2]).should.eql([1, 2, 3]);
    mergeSort([3, 1, 2, 4]).should.eql([1, 2, 3, 4]);
  });

  it("should do nothing to sorted arrays", () => {
    mergeSort([1, 2, 3]).should.eql([1, 2, 3]);
  });
});
