class BTree<T: Comparable> {
  var value: T?
  weak var parent: BTree<T>?
  var left: BTree<T>?
  var right: BTree<T>?
  private func detachChild(child: BTree<T>) {
    if (self.left === child) {
      self.left = nil
    } else {
      assert(self.right === child)
      self.right = nil
    }
  }
  func toArray() -> [T] {
    var out: [T] = []
    if let left = self.left {
      out += left.toArray()
    }
    if let value = self.value {
      out += [value]
    }
    if let right = self.right {
      out += right.toArray()
    }
    return out
  }
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
  func remove(value: T) {
    let myValue = self.value!
    if myValue == value {
      if (self.left == nil && self.right == nil) {
        // We're a leaf.
        self.value = nil
        if self.parent != nil {
          self.parent!.detachChild(self)
        }
      } else {
        if (self.right == nil) {
          // We're not a leaf, but we don't have an immediate successor.
          self.value = self.left!.value
          self.right = self.left!.right
          self.left = self.left!.left
        } else {
          // We have an immediate successor.
          var curr = self.right!
          while curr.left != nil {
            curr = curr.left!
          }
          self.value = curr.value
          curr.parent!.detachChild(curr)
        }
      }
    } else {
      if value < myValue {
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
          self.left!.parent = self
        }
        self.left!.add(value)
      } else {
        if self.right == nil {
          self.right = BTree<T>()
          self.right!.parent = self
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

  t.add(5)
  assert(t.value! == 5)

  t.add(2)
  assert(t.left!.value! == 2)

  t.add(1)
  assert(t.left!.left!.value! == 1)

  t.add(4)
  assert(t.left!.right!.value! == 4)
}

func testRemove() {
  var t = BTree<Int>()

  t.add(5)
  t.remove(5)
  assert(t.value == nil)
  assert(!t.contains(5))

  t = BTree<Int>()
  t.add(5)
  t.add(4)
  t.remove(4)
  assert(t.value! == 5)
  assert(t.left == nil)

  t = BTree<Int>()
  t.add(5)
  t.add(6)
  t.remove(5)
  assert(t.value! == 6)
  assert(t.left == nil)
  assert(t.right == nil)

  t = BTree<Int>()
  t.add(6)
  t.add(4)
  t.add(7)
  t.add(5)
  t.remove(6)
  assert(t.value! == 7)
  assert(t.left!.value! == 4)
  assert(t.right == nil)

  t = BTree<Int>()
  t.add(5)
  t.add(7)
  t.add(6)
  t.remove(5)
  assert(t.value! == 6)
  assert(t.right!.value! == 7)
  assert(t.right!.left == nil)

  t = BTree<Int>()
  t.add(5)
  t.add(4)
  t.add(3)
  t.remove(5)
  assert(t.value! == 4)
  assert(t.left!.value! == 3)
}

func testToArray() {
  var t = BTree<Int>()

  assert(t.toArray() == [])

  t.add(6)
  t.add(4)
  t.add(7)
  t.add(5)

  assert(t.toArray() == [4, 5, 6, 7])
}

testContains()
testAdd()
testRemove()
testToArray()

print("All tests passed.\n")
