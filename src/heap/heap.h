#define MAX_HEAP_SIZE 2048
#define HEAP_KEY unsigned char
#define HEAP struct Heap *

struct Heap;

extern HEAP heap_create();
extern void heap_destroy(HEAP h);
extern unsigned int heap_size(HEAP h);
extern void heap_push(HEAP h, HEAP_KEY value);
extern HEAP_KEY heap_pop(HEAP h);
extern void heap_print(HEAP h);
