class LinkedList {
  constructor() {
    this.head = new Node();
    this.tail = this.head;
  }
  add(input) {
    const newNode = new Node(input);
    this.tail.next = newNode;
    this.tail = newNode;
  }
  removeFirst() {
    if (this.tail !== this.head) {
      this.head.next = this.head.next.next;
    }
  }
  isEmpty() {
    return this.tail === this.head;
  }
}
class Node {
  constructor(value = null) {
    this.value = value;
    this.next = null;
  }
}
