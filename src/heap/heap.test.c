#include <stdio.h>
#include <stdlib.h>

#include "heap.h"

#define ASSERT(x) if (!(x)) { \
  printf("ASSERTION FAILURE FOR " #x " AT LINE %d.\n", __LINE__); \
  exit(1); \
} else { \
  printf("Success: " #x " at line %d.\n", __LINE__); \
}

int main() {
  HEAP h;

  h = heap_create();
  ASSERT(heap_size(h) == 0);
  heap_push(h, 1);
  ASSERT(heap_size(h) == 1);
  ASSERT(heap_pop(h) == 1);
  ASSERT(heap_size(h) == 0);
  heap_destroy(h);

  h = heap_create();
  heap_push(h, 1);
  heap_push(h, 5);
  heap_push(h, 2);
  heap_push(h, 4);
  heap_push(h, 100);
  heap_push(h, 3);
  heap_push(h, 6);
  ASSERT(heap_size(h) == 7);
  ASSERT(heap_pop(h) == 100);
  ASSERT(heap_pop(h) == 6);
  ASSERT(heap_pop(h) == 5);
  ASSERT(heap_pop(h) == 4);
  ASSERT(heap_pop(h) == 3);
  ASSERT(heap_pop(h) == 2);
  ASSERT(heap_pop(h) == 1);
  ASSERT(heap_size(h) == 0);
  heap_destroy(h);

  printf("Done.\n");
  return 0;
}
