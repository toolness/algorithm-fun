function merge(a, b) {
  if (a.length) {
    if (b.length) {
      if (a[0] < b[0]) {
        return [a[0]].concat(merge(a.slice(1), b));
      } else {
        return [b[0]].concat(merge(a, b.slice(1)));
      }
    } else {
      return a;
    }
  } else if (b.length) {
    return b;
  }
}

function mergeSort(array) {
  if (array.length < 2)
    return array;

  let midpoint = array.length >> 1;

  return merge(
    mergeSort(array.slice(0, midpoint)),
    mergeSort(array.slice(midpoint))
  );
}

export {mergeSort as default};
