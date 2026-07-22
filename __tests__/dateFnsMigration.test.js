import * as dateFns from 'date-fns';

describe('date-fns v2 migration', () => {
  const baseDate = new Date(2025, 6, 15, 10, 30);

  describe('format tokens', () => {
    it('formats day of month with d (was D in v1)', () => {
      expect(dateFns.format(baseDate, 'd')).toBe('15');
      expect(dateFns.format(new Date(2025, 0, 5), 'd')).toBe('5');
    });

    it('formats abbreviated day name with EEE', () => {
      const result = dateFns.format(baseDate, 'EEE');
      expect(result).toBe('Tue');
    });

    it('formats month name with MMMM and year with yyyy', () => {
      expect(dateFns.format(baseDate, 'MMMM yyyy')).toBe('July 2025');
    });

    it('formats full ISO date with yyyy-MM-dd', () => {
      expect(dateFns.format(baseDate, 'yyyy-MM-dd')).toBe('2025-07-15');
    });

    it('formats US date with MM/dd/yyyy', () => {
      expect(dateFns.format(baseDate, 'MM/dd/yyyy')).toBe('07/15/2025');
    });

    it('formats time with hh:mm', () => {
      expect(dateFns.format(baseDate, 'hh:mm')).toBe('10:30');
    });
  });

  describe('date manipulation functions', () => {
    it('addMonths works correctly', () => {
      const result = dateFns.addMonths(new Date(2025, 0, 31), 1);
      expect(dateFns.getMonth(result)).toBe(1);
      expect(dateFns.getDate(result)).toBe(28);
    });

    it('subMonths works correctly', () => {
      const result = dateFns.subMonths(new Date(2025, 1, 28), 1);
      expect(dateFns.getMonth(result)).toBe(0);
    });

    it('addWeeks works correctly', () => {
      const result = dateFns.addWeeks(new Date(2025, 6, 15), 2);
      expect(dateFns.getDate(result)).toBe(29);
    });

    it('subWeeks works correctly', () => {
      const result = dateFns.subWeeks(new Date(2025, 6, 15), 1);
      expect(dateFns.getDate(result)).toBe(8);
    });

    it('addDays works correctly', () => {
      const result = dateFns.addDays(new Date(2025, 6, 15), 3);
      expect(dateFns.getDate(result)).toBe(18);
    });

    it('startOfWeek works with weekStartsOn option', () => {
      const result = dateFns.startOfWeek(new Date(2025, 6, 15), { weekStartsOn: 1 });
      expect(dateFns.getDay(result)).toBe(1);
      expect(dateFns.getDate(result)).toBe(14);
    });

    it('endOfWeek works correctly with explicit weekStartsOn', () => {
      const result = dateFns.endOfWeek(new Date(2025, 6, 15), { weekStartsOn: 0 });
      expect(dateFns.getDay(result)).toBe(6);
    });

    it('startOfMonth and endOfMonth work correctly', () => {
      const start = dateFns.startOfMonth(new Date(2025, 6, 15));
      const end = dateFns.endOfMonth(new Date(2025, 6, 15));
      expect(dateFns.getDate(start)).toBe(1);
      expect(dateFns.getDate(end)).toBe(31);
    });

    it('startOfDay works correctly', () => {
      const result = dateFns.startOfDay(new Date(2025, 6, 15, 14, 30));
      expect(dateFns.getHours(result)).toBe(0);
      expect(dateFns.getMinutes(result)).toBe(0);
    });
  });

  describe('comparison functions', () => {
    it('isSameMonth works correctly', () => {
      expect(dateFns.isSameMonth(new Date(2025, 6, 15), new Date(2025, 6, 20))).toBe(true);
      expect(dateFns.isSameMonth(new Date(2025, 6, 15), new Date(2025, 7, 1))).toBe(false);
    });

    it('isSameDay works correctly', () => {
      expect(dateFns.isSameDay(new Date(2025, 6, 15), new Date(2025, 6, 15))).toBe(true);
      expect(dateFns.isSameDay(new Date(2025, 6, 15), new Date(2025, 6, 16))).toBe(false);
    });

    it('isBefore works correctly', () => {
      expect(dateFns.isBefore(new Date(2025, 6, 14), new Date(2025, 6, 15))).toBe(true);
      expect(dateFns.isBefore(new Date(2025, 6, 16), new Date(2025, 6, 15))).toBe(false);
    });
  });

  describe('difference functions', () => {
    it('differenceInWeeks works correctly', () => {
      const result = dateFns.differenceInWeeks(new Date(2025, 7, 1), new Date(2025, 6, 1));
      expect(result).toBe(4);
    });

    it('differenceInMonths works correctly', () => {
      const result = dateFns.differenceInMonths(new Date(2025, 9, 1), new Date(2025, 6, 1));
      expect(result).toBe(3);
    });

    it('differenceInCalendarDays works correctly', () => {
      const result = dateFns.differenceInCalendarDays(new Date(2025, 7, 1), new Date(2025, 6, 1));
      expect(result).toBe(31);
    });
  });

  describe('setter functions used by helpers', () => {
    it('setHours and setMinutes work correctly', () => {
      const base = new Date(2025, 6, 15);
      const result = dateFns.setMinutes(dateFns.setHours(base, 14), 45);
      expect(dateFns.getHours(result)).toBe(14);
      expect(dateFns.getMinutes(result)).toBe(45);
    });
  });

  describe('Date cloning (replaces v1 parse)', () => {
    it('new Date(date) creates an independent copy', () => {
      const original = new Date(2025, 6, 15, 10, 30);
      const clone = new Date(original);
      clone.setFullYear(2030);
      expect(original.getFullYear()).toBe(2025);
      expect(clone.getFullYear()).toBe(2030);
    });
  });
});
