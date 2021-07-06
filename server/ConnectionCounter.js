class ConnectionCounter {
  constructor() {
    this.map = new Map();
  }

  has(key) {
    return this.map.has(key);
  }

  disconnect(key) {
    const finalCount = this.count(key) - 1;

    if (finalCount <= 0) {
      this.map.delete(key);
    } else {
      this.map.set(key, this.count(key) - 1);
    }
  }

  connect(key) {
    this.map.set(key, this.count(key) + 1);
  }

  count(key) {
    if (this.map.get(key)) {
      return this.map.get(key);
    } else {
      return 0;
    }
  }
}

module.exports = ConnectionCounter;
