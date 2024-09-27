const myutil = require('../src/utils/myutil.js');

describe('add function', () => {
  test('should add two positive numbers correctly', () => {
    expect(myutil.add(3, 4)).toBe(7);
  });

  test('should add a negative and a positive number correctly', () => {
    expect(myutil.add(-5, 3)).toBe(-2);
  });

  test('should add two negative numbers correctly', () => {
    expect(myutil.add(-10, -7)).toBe(-17);
  });
});

describe('subtract function', () => {
  test('should subtract two positive numbers correctly', () => {
    expect(myutil.subtract(10, 4)).toBe(6);
  });

  test('should subtract a negative from a positive number correctly', () => {
    expect(myutil.subtract(8, -3)).toBe(11);
  });

  test('should subtract two negative numbers correctly', () => {
    expect(myutil.subtract(-5, -3)).toBe(-2);
  });
});