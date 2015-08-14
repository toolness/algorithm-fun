// This is the first time I've used C++ in like 1834 years so it
// probably really sucks.

#include <stdio.h>
#include <cstdlib>

#define ASSERT(x) if (!(x)) { \
  printf("ASSERTION FAILURE FOR " #x " AT LINE %d.\n", __LINE__); \
  std::exit(1); \
} else { \
  printf("Success: " #x " at line %d.\n", __LINE__); \
}

template<typename T> struct ListNode {
  T data;
  ListNode *next;
  ListNode(T value, ListNode<T> *nextNode) {
    next = nextNode;
    data = value;
  }
  ~ListNode() {
    if (next) {
      delete next;
    }
  }
  int getLength() {
    if (!next) {
      return 0;
    }
    return 1 + next->getLength();
  }
  T getIndex(int index) {
    if (index == 0) {
      return data;
    }
    return next->getIndex(index - 1);
  }
  void delIndex(int index) {
    if (index == 0) {
      ListNode<T> *temp = next;
      next = next->next;
      temp->next = 0;
      delete temp;
    } else {
      next->delIndex(index - 1);
    }
  }
};

template<typename T> struct List {
  ListNode<T> *first;
  List() {
    first = 0;
  }
  ~List() {
    if (first) {
      delete first;
    }
  }
  int getLength() {
    if (!first) {
      return 0;
    }
    return 1 + first->getLength();
  }
  T getIndex(int index) {
    return first->getIndex(index);
  }
  void delIndex(int index) {
    if (index == 0) {
      ListNode<T> *temp = first;
      first = first->next;
      temp->next = 0;
      delete temp;
    } else {
      first->delIndex(index - 1);
    }
  }
  void unshift(T value) {
    first = new ListNode<T>(value, first);
  }
};

int main() {
  printf("Testing List...\n");
  printf("Size of ListNode<int> is %lu.\n", sizeof(ListNode<int>));

  {
    // Ensure destructor w/ empty list works.
    List<int> n;
  }

  {
    List<int> n;
    n.unshift(1);
    n.unshift(2);
    n.unshift(3);
    ASSERT(n.getLength() == 3);
    ASSERT(n.getIndex(0) == 3);
    ASSERT(n.getIndex(1) == 2);
    ASSERT(n.getIndex(2) == 1);

    n.delIndex(1);
    ASSERT(n.getLength() == 2);
    ASSERT(n.getIndex(0) == 3);

    n.delIndex(0);
    ASSERT(n.getLength() == 1);
  }

  printf("Done.\n");
  return 0;
}
