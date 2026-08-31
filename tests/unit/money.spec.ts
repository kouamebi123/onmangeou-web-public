import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { displayMoney, formatFcfa } from '../../src/lib/money.ts';

describe('formatFcfa', () => {
  it('formats thousands with a regular space', () => {
    assert.equal(formatFcfa('12500'), '12 500 FCFA');
  });

  it('keeps small integers without grouping', () => {
    assert.equal(formatFcfa('3500'), '3 500 FCFA');
    assert.equal(formatFcfa('900'), '900 FCFA');
  });

  it('rejects non-integer input', () => {
    assert.equal(formatFcfa('12.5'), '');
    assert.equal(formatFcfa('12 500'), '');
  });
});

describe('displayMoney', () => {
  it('prefers the API formatted value', () => {
    assert.equal(displayMoney({ amount: '12500', formatted: '12?500?FCFA' }), '12?500?FCFA');
  });

  it('falls back to local integer formatting', () => {
    assert.equal(displayMoney({ amount: '12500' }), '12 500 FCFA');
  });
});
