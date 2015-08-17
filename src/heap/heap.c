#include <stdio.h>
#include <stdlib.h>

#include "heap.h"

#define ROOT 1
#define PARENT(k) (k >> 1)
#define LEFT_CHILD(k) (k << 1)
#define RIGHT_CHILD(k) ((k << 1) + 1)

struct Heap {
  HEAP_KEY heap[MAX_HEAP_SIZE];
  unsigned int size;
};

extern HEAP heap_create() {
  HEAP h = (HEAP) malloc(sizeof(struct Heap));
  h->size = 0;
  return h;
}

extern void heap_destroy(HEAP h) {
  free(h);
}

extern unsigned int heap_size(HEAP h) {
  return h->size;
}

static void bubble_up(HEAP h, int k) {
  HEAP_KEY kValue = h->heap[k];

  if (k == ROOT) return;
  if (kValue > h->heap[PARENT(k)]) {
    h->heap[k] = h->heap[PARENT(k)];
    h->heap[PARENT(k)] = kValue;
    bubble_up(h, PARENT(k));
  }
}

extern void heap_push(HEAP h, HEAP_KEY value) {
  int k = ROOT + h->size++;
  h->heap[k] = value;
  bubble_up(h, k);
}

static void bubble_down(HEAP h, int k) {
  int kLeft = LEFT_CHILD(k);
  int kRight = RIGHT_CHILD(k);
  int kDomChild = -1;
  int kValue = h->heap[k];
  int kLeftValue = h->heap[kLeft];
  int kRightValue = h->heap[kRight];
  int kDomChildValue;

  if (kLeft <= h->size) {
    if (kRight <= h->size) {
      if (kLeftValue > kRightValue) {
        kDomChild = kLeft;
        kDomChildValue = kLeftValue;
      } else {
        kDomChild = kRight;
        kDomChildValue = kRightValue;
      }
    } else {
      kDomChild = kLeft;
      kDomChildValue = kLeftValue;
    }
  }

  if (kDomChild != -1 && kDomChildValue > kValue) {
    h->heap[kDomChild] = kValue;
    h->heap[k] = kDomChildValue;
    bubble_down(h, kDomChild);
  }
}

extern HEAP_KEY heap_pop(HEAP h) {
  int rootValue = h->heap[ROOT];
  int k = ROOT + --h->size;
  h->heap[ROOT] = h->heap[k];
  bubble_down(h, ROOT);

  return rootValue;
}

extern void heap_print(HEAP h) {
  int i;

  for (i = 1; i <= h->size; i++) {
    printf("%d ", h->heap[i]);
  }
  printf("\n");
}
