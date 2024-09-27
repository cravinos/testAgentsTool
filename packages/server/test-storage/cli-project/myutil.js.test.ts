const myutil = require('../myutil');

describe('add function', () => {
  test('adds two positive numbers correctly', () => {
    expect(myutil.add(2, 3)).toBe(5);
  });

  test('adds a positive and a negative number correctly', () => {
    expect(myutil.add(5, -3)).toBe(2);
  });

  test('adds two negative numbers correctly', () => {
    expect(myutil.add(-7, -2)).toBe(-9);
  });
});

describe('subtract function', () => {
  test('subtracts two positive numbers correctly', () => {
    expect(myutil.subtract(5, 2)).toBe(3);
  });

  test('subtracts a negative number from a positive number correctly', () => {
    expect(myutil.subtract(8, -3)).toBe(11);
  });

  test('subtracts two negative numbers correctly', () => {
    expect(myutil.subtract(-5, -2)).toBe(-3);
  });
});