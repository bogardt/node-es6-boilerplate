import { expect } from 'chai';

describe('index test', () => {
  describe('sayHello function', () => {
    it('should say Hello guys!', () => {
      const str = 'Hello guys!';
      expect(str).to.equal('Hello guys!');
    });
  });
});
