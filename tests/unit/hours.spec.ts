import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { formatClockMinutes, weekDayInZone, weekSchedule } from '../../src/lib/hours.ts';

describe('formatClockMinutes', () => {
  it('formats a closing time after midnight on the clock', () => {
    assert.equal(formatClockMinutes(690), '11:30');
    assert.equal(formatClockMinutes(1560), '02:00');
  });
});

describe('weekSchedule', () => {
  it('lists the seven days and leaves closed days empty', () => {
    const week = weekSchedule([
      { weekDay: 'MONDAY', opensAtMinutes: 660, closesAtMinutes: 1380 },
      { weekDay: 'SATURDAY', opensAtMinutes: 720, closesAtMinutes: 1560 },
    ]);

    assert.equal(week.length, 7);
    assert.deepEqual(week[0], { weekDay: 'MONDAY', ranges: ['11:00 – 23:00'] });
    assert.deepEqual(week[5], { weekDay: 'SATURDAY', ranges: ['12:00 – 02:00'] });
    assert.deepEqual(week[6], { weekDay: 'SUNDAY', ranges: [] });
  });

  it('orders several services of the same day', () => {
    const week = weekSchedule([
      { weekDay: 'TUESDAY', opensAtMinutes: 1140, closesAtMinutes: 1380 },
      { weekDay: 'TUESDAY', opensAtMinutes: 690, closesAtMinutes: 870 },
    ]);

    assert.deepEqual(week[1]?.ranges, ['11:30 – 14:30', '19:00 – 23:00']);
  });
});

describe('weekDayInZone', () => {
  it('uses the restaurant timezone', () => {
    // Samedi 23:30 UTC : déjà dimanche à Paris, encore samedi à Abidjan.
    const instant = new Date('2026-10-03T23:30:00Z');
    assert.equal(weekDayInZone(instant, 'Africa/Abidjan'), 'SATURDAY');
    assert.equal(weekDayInZone(instant, 'Europe/Paris'), 'SUNDAY');
  });

  it('falls back to UTC on an unknown timezone', () => {
    assert.equal(weekDayInZone(new Date('2026-10-03T12:00:00Z'), 'Nowhere/Invalid'), 'SATURDAY');
  });
});
