const chai = require('chai');
const ConnectionCounter = require('../ConnectionCounter');

const { expect } = chai;

describe('ConnectionCounter', () => {
  let counter;

  beforeEach(() => {
    counter = new ConnectionCounter();
  });

  describe('.connect', () => {
    it('increments the count by 1 each time', () => {
      const key = 'hello';

      counter.connect(key);
      counter.connect(key);

      expect(counter.count(key)).to.equal(2);
    });
  });

  describe('.has', () => {
    context('when the count is greater than 0', () => {
      it('returns true', () => {
        counter.connect('hello');

        expect(counter.has('hello')).to.be.true;
      });
    });

    context('when the count is less than or equal to 0', () => {
      it('returns false', () => {
        expect(counter.has('hello')).to.be.false;
      });
    });
  });

  describe('.disconnect', () => {
    context('when the counter does not have the key', () => {
      it('does nothing', () => {
        counter.disconnect('hello');

        expect(counter.has('hello')).to.be.false;
      });
    });

    context('when the counter has a key', () => {
      it('decrements the count by 1', () => {
        counter.connect('hello');
        counter.connect('hello');

        counter.disconnect('hello');

        expect(counter.count('hello')).to.equal(1);
      });
    });

    context('when the count of the key is 1', () => {
      it('removes the key', () => {
        counter.connect('hello');

        counter.disconnect('hello');

        expect(counter.has('hello')).to.be.false;
      });
    });
  });
});
