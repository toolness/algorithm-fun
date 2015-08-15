class BTree<T: Comparable> {
  var value: T?
  var left: BTree<T>?
  var right: BTree<T>?
  func contains(value: T) -> Bool {
    if self.value == nil {
      return false
    }
    if self.value! == value {
      return true
    }
    if value < self.value! {
      if self.left == nil {
        return false
      }
      return self.left!.contains(value)
    } else {
      if self.right == nil {
        return false
      }
      return self.right!.contains(value)
    }
  }
  private func appendToLeft(tree: BTree<T>) {
    if self.left == nil {
      self.left = tree
    } else {
      self.left!.appendToLeft(tree)
    }
  }
  private func appendToRight(tree: BTree<T>) {
    if self.right == nil {
      self.right = tree
    } else {
      self.right!.appendToRight(tree)
    }
  }
  func remove(value: T) {
    if self.value! == value {
      self.value = nil
      if self.left != nil {
        self.value = self.left!.value
        if self.right != nil {
          self.left!.appendToRight(self.right!)
        }
        self.right = self.left!.right
        self.left = self.left!.left
      } else if self.right != nil {
        self.value = self.right!.value
        if self.left != nil {
          self.right!.appendToLeft(self.left!)
        }
        self.left = self.right!.left
        self.right = self.right!.right
      }
    } else {
      if value < self.value! {
        self.left!.remove(value)
      } else {
        self.right!.remove(value)
      }
    }
  }
  func add(value: T) {
    if self.value == nil {
      self.value = value
    } else {
      if value < self.value! {
        if self.left == nil {
          self.left = BTree<T>()
        }
        self.left!.add(value)
      } else {
        if self.right == nil {
          self.right = BTree<T>()
        }
        self.right!.add(value)
      }
    }
  }
}

func testContains() {
  var t = BTree<Int>()

  assert(!t.contains(5))

  t.add(5)
  t.add(2)
  t.add(4)

  assert(t.contains(5))
  assert(t.contains(2))
  assert(t.contains(4))
  assert(!t.contains(3))
}

func testAdd() {
  var t = BTree<Int>()

  t.add(5);
  assert(t.value! == 5);

  t.add(2);
  assert(t.left!.value! == 2);

  t.add(1);
  assert(t.left!.left!.value! == 1);

  t.add(4);
  assert(t.left!.right!.value! == 4);
}

func testRemove() {
  var t = BTree<Int>()

  t.add(5)
  t.remove(5)

  assert(t.value == nil)
  assert(!t.contains(5))

  t.add(5)
  t.add(6)
  t.remove(5)
  assert(t.value! == 6)
  assert(t.left == nil)
  assert(t.right == nil)

  t.add(4)
  t.add(7)
  t.add(5)
  t.remove(6)
  assert(t.value! == 4)
  assert(t.left == nil)
  assert(t.right!.value! == 5)
  assert(t.right!.right!.value! == 7)
}

testContains()
testAdd()
testRemove()

print("All tests passed.\n")
