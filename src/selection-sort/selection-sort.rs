use std::i32;

fn selection_sort(array: &mut [i32]) -> &mut [i32] {
  return selection_sort_helper(array, 0);
}

fn selection_sort_helper(array: &mut [i32], i: usize) -> &mut [i32] {
  if i == array.len() {
    return array;
  }
  let mut min = i32::MAX;
  let mut min_index: usize = 0;
  for j in i..array.len() {
    if array[j] <= min {
      min = array[j];
      min_index = j;
    }
  }
  array[min_index] = array[i];
  array[i] = min;
  return selection_sort_helper(array, i + 1);
}

#[test]
fn it_sorts_empty_array() {
  assert_eq!(selection_sort(&mut[]), &[]);
}

#[test]
fn it_does_nothing_to_already_sorted_arrays() {
  assert_eq!(selection_sort(&mut[1,2,3]), &[1,2,3]);
}

#[test]
fn it_sorts_arrays_of_length_two() {
  assert_eq!(selection_sort(&mut[2,1]), &[1,2]);  
}

#[test]
fn it_sorts_arrays_of_length_three() {
  assert_eq!(selection_sort(&mut[1,3,2]), &[1,2,3]);
  assert_eq!(selection_sort(&mut[3,2,1]), &[1,2,3]);
  assert_eq!(selection_sort(&mut[3,1,2]), &[1,2,3]);
  assert_eq!(selection_sort(&mut[2,1,3]), &[1,2,3]);
}

#[test]
fn it_sorts_arrays_with_duplicate_values() {
  assert_eq!(selection_sort(&mut[2,4,1,3,4]), &[1,2,3,4,4]);
}
