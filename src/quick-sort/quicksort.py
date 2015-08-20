import random
import unittest
from unittest import TestCase

def quicksort(items):
    if len(items) < 2:
        return items
    pivot = random.choice(items)
    lesser = [item for item in items if item < pivot]
    not_lesser = [item for item in items if item >= pivot]
    not_lesser.remove(pivot)
    return quicksort(lesser) + [pivot] + quicksort(not_lesser)

class QuickSortTests(TestCase):
    def test_empty_lists_are_sorted(self):
        self.assertEqual(quicksort([]), [])

    def test_lists_with_one_element_are_sorted(self):
        self.assertEqual(quicksort([1]), [1])

    def test_lists_with_two_elements_are_sorted(self):
        self.assertEqual(quicksort([2, 1]), [1, 2])

    def test_lists_with_three_elements_are_sorted(self):
        self.assertEqual(quicksort([2, 1, 3]), [1, 2, 3])

    def test_lists_with_four_elements_are_sorted(self):
        self.assertEqual(quicksort([2, 4, 1, 3]), [1, 2, 3, 4])

    def test_lists_with_duplicate_elements_are_sorted(self):
        self.assertEqual(quicksort([2, 4, 1, 3, 4]), [1, 2, 3, 4, 4])

if __name__ == '__main__':
    unittest.main()
