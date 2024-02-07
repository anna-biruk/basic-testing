// Uncomment the code below and write your tests
import {
  BankAccount,
  InsufficientFundsError,
  SynchronizationFailedError,
  TransferFailedError,
} from './index';

import lodash from 'lodash';
const mockRandom = jest.fn();
lodash.random = mockRandom;

describe('BankAccount', () => {
  test('should create account with initial balance', () => {
    const initialBalance = 100;
    const account = new BankAccount(initialBalance);
    expect(account.getBalance()).toBe(initialBalance);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    const initialBalance = 50;
    const account = new BankAccount(initialBalance);
    const withdrawalAmount = 75;
    expect(() => {
      account.withdraw(withdrawalAmount);
    }).toThrow(InsufficientFundsError);
  });

  test('should throw error when transferring more than balance', () => {
    const initialBalance = 100;
    const account1 = new BankAccount(initialBalance);
    const account2 = new BankAccount(50);

    const transferAmount = 150;

    expect(() => {
      account1.transfer(transferAmount, account2);
    }).toThrow(InsufficientFundsError);

    expect(account1.getBalance()).toBe(initialBalance);
    expect(account2.getBalance()).toBe(50);
  });

  test('should throw error when transferring to the same account', () => {
    const initialBalance = 100;
    const account1 = new BankAccount(initialBalance);
    expect(() => {
      account1.transfer(50, account1);
    }).toThrow(TransferFailedError);

    expect(account1.getBalance()).toBe(initialBalance);
  });

  test('should deposit money', () => {
    const initialBalance = 100;
    const account = new BankAccount(initialBalance);
    account.deposit(50);
    expect(account.getBalance()).toBe(initialBalance + 50);
  });

  test('should withdraw money', () => {
    const initialBalance = 100;
    const account = new BankAccount(initialBalance);
    account.withdraw(50);
    expect(account.getBalance()).toBe(initialBalance - 50);
  });

  test('should transfer money', () => {
    const initialBalance = 100;
    const account1 = new BankAccount(initialBalance);
    const account2 = new BankAccount(50);
    account1.transfer(50, account2);
    expect(account1.getBalance()).toBe(initialBalance - 50);
    expect(account2.getBalance()).toBe(50 + 50);
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    const account = new BankAccount(0);
    mockRandom.mockReturnValue(60);
    const balance = await account.fetchBalance();

    expect(typeof balance).toBe('number');
  });

  test('should set new balance if fetchBalance returned number', async () => {
    const account = new BankAccount(0);

    mockRandom.mockReturnValue(60);

    await account.synchronizeBalance();
    expect(mockRandom).toHaveBeenCalled();
    expect(account.getBalance()).toBe(60);
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    const account = new BankAccount(0);
    account.fetchBalance = jest.fn().mockReturnValue(null);

    expect(account.fetchBalance()).toBe(null);
    await expect(async () => {
      await account.synchronizeBalance();
    }).rejects.toThrow(SynchronizationFailedError);
  });
});
