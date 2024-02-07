// Uncomment the code below and write your tests
import {
  throwError,
  throwCustomError,
  resolveValue,
  MyAwesomeError,
  rejectCustomError,
} from './index';

describe('resolveValue', () => {
  test('should resolve provided value', async () => {
    const result = await resolveValue('Hello World');
    expect(result).toBe('Hello World');
  });
});

describe('throwError', () => {
  test('should throw error with provided message', () => {
    const errorMessage = 'Test Error';
    expect(() => throwError(errorMessage)).toThrow(errorMessage);
  });

  test('should throw error with default message if message is not provided', () => {
    const defaultError = 'Oops';
    expect(() => throwError()).toThrow(defaultError);
  });
});

describe('throwCustomError', () => {
  test('should throw custom error', () => {
    expect(() => throwCustomError()).toThrow(MyAwesomeError);
  });
});

describe('rejectCustomError', () => {
  test('should reject custom error', async () => {
    await expect(rejectCustomError()).rejects.toThrow(MyAwesomeError);
  });
});
