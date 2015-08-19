function insertionSort(array, startIndex) {
  if (typeof(startIndex) == 'undefined')
    startIndex = 0;

  if (startIndex >= array.length)
    return array;

  for (let i = startIndex; i > 0 && array[i] < array[i - 1]; i--) {
    let temp = array[i];
    array[i] = array[i - 1];
    array[i - 1] = temp;
  }

  return insertionSort(array, startIndex + 1);
}

export {insertionSort as default};
