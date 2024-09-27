const math = require('./math');

describe('add function', () => {
  test('adds two positive numbers correctly', () => {
    expect(math.add(2, 3)).toBe(5);
  });

  test('adds a positive and a negative number correctly', () => {
    expect(math.add(5, -3)).toBe(2);
  });

  test('adds two negative numbers correctly', () => {
    expect(math.add(-10, -5)).toBe(-15);
  });

  test('adds zero and a number correctly', () => {
    expect(math.add(0, 8)).toBe(8);
  });

  test('adds two decimal numbers correctly', () => {
    expect(math.add(1.5, 2.3)).toBeCloseTo(3.8);
  });
});