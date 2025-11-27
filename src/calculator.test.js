import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  computeMonthlyPayment,
  computePrincipalFromPayment,
  computeInterestRate,
  computeTermMonths,
  formatDuration,
} from './calculator.js';

describe('calculator helpers', () => {
  it('computes monthly payment with positive rate', () => {
    const payment = computeMonthlyPayment({ principal: 300000, annualRate: 6, termYears: 30 });
    assert.ok(payment > 0);
    assert.equal(Number(payment.toFixed(2)), 1798.65);
  });

  it('computes monthly payment for shorter terms', () => {
    const payment = computeMonthlyPayment({ principal: 300000, annualRate: 6, termYears: 15 });
    assert.equal(Number(payment.toFixed(2)), 2531.57);
  });

  it('computes principal from payment', () => {
    const principal = computePrincipalFromPayment({ payment: 1800, annualRate: 6, termYears: 30 });
    assert.ok(principal > 0);
    assert.equal(Number(principal.toFixed(0)), 300225);
  });

  it('computes interest rate from payment', () => {
    const rate = computeInterestRate({ principal: 200000, payment: 1500, termYears: 30 });
    assert.ok(rate > 0);
    assert.equal(Number(rate.toFixed(2)), 8.23);
  });

  it('computes payoff duration', () => {
    const months = computeTermMonths({ principal: 200000, annualRate: 4.5, payment: 1013.37 });
    assert.equal(months, 361);
  });

  it('formats duration', () => {
    assert.equal(formatDuration(361), '30 years 1 month');
    assert.equal(formatDuration(1), '0 years 1 month');
  });
});
