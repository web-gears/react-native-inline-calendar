import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Calendar from '../src/Calendar';

const mockItems = {
  '2025-07-15': {
    items: [
      { title: 'Meeting', description: 'Team standup', timeStart: { hour: 10, minute: 0 }, timeEnd: { hour: 11, minute: 0 } },
    ],
    style: { backgroundColor: 'red' },
  },
};

describe('Calendar', () => {
  describe('rendering', () => {
    it('renders without crashing with default props', () => {
      const { getByText } = render(
        <Calendar initialDate={new Date(2025, 6, 15)} />
      );
      expect(getByText('July 2025')).toBeTruthy();
    });

    it('renders week day headers with EEE format', () => {
      const { getByText } = render(
        <Calendar initialDate={new Date(2025, 6, 15)} />
      );
      expect(getByText('Mon')).toBeTruthy();
      expect(getByText('Sun')).toBeTruthy();
    });

    it('renders days of the month', () => {
      const { getByText } = render(
        <Calendar initialDate={new Date(2025, 6, 15)} />
      );
      expect(getByText('15')).toBeTruthy();
      expect(getByText('31')).toBeTruthy();
    });

    it('renders with custom header date format', () => {
      const { getByText } = render(
        <Calendar
          initialDate={new Date(2025, 6, 15)}
          headerDateFormat="MM/yyyy"
        />
      );
      expect(getByText('07/2025')).toBeTruthy();
    });

    it('hides header when hideHeader is true', () => {
      const { queryByText } = render(
        <Calendar
          initialDate={new Date(2025, 6, 15)}
          hideHeader={true}
        />
      );
      expect(queryByText('July 2025')).toBeNull();
    });

    it('hides week days when hideWeekDays is true', () => {
      const { queryByText } = render(
        <Calendar
          initialDate={new Date(2025, 6, 15)}
          hideWeekDays={true}
        />
      );
      expect(queryByText('Mon')).toBeNull();
    });
  });

  describe('date selection', () => {
    it('calls onDateSelect when a day is pressed', () => {
      const onDateSelect = jest.fn();
      const initialDate = new Date(2025, 6, 15);
      const { getByText } = render(
        <Calendar
          initialDate={initialDate}
          minDate={new Date(2025, 0, 1)}
          onDateSelect={onDateSelect}
        />
      );
      fireEvent.press(getByText('20'));
      expect(onDateSelect).toHaveBeenCalledTimes(1);
      const selectedDate = onDateSelect.mock.calls[0][0];
      expect(selectedDate.getDate()).toBe(20);
      expect(selectedDate.getMonth()).toBe(6);
    });
  });

  describe('navigation', () => {
    it('navigates to next month when next arrow is pressed', () => {
      const { getByText } = render(
        <Calendar
          initialDate={new Date(2025, 6, 15)}
          weekMode={false}
        />
      );
      expect(getByText('July 2025')).toBeTruthy();
      fireEvent.press(getByText('>'));
      expect(getByText('August 2025')).toBeTruthy();
    });

    it('navigates to previous month when prev arrow is pressed', () => {
      const { getByText } = render(
        <Calendar
          initialDate={new Date(2025, 6, 15)}
          weekMode={false}
        />
      );
      fireEvent.press(getByText('<'));
      expect(getByText('June 2025')).toBeTruthy();
    });
  });

  describe('week mode', () => {
    it('renders in week mode when weekMode is true', () => {
      const { getByText } = render(
        <Calendar
          initialDate={new Date(2025, 6, 15)}
          weekMode={true}
        />
      );
      expect(getByText('July 2025')).toBeTruthy();
    });
  });

  describe('agenda', () => {
    it('renders agenda items when items are provided', () => {
      const { getByText } = render(
        <Calendar
          initialDate={new Date(2025, 6, 15)}
          selectedDate={new Date(2025, 6, 15)}
          items={mockItems}
          showAgenda={true}
        />
      );
      expect(getByText('Meeting')).toBeTruthy();
      expect(getByText('Team standup')).toBeTruthy();
    });

    it('shows empty list message when no items for selected date', () => {
      const { getByText } = render(
        <Calendar
          initialDate={new Date(2025, 6, 15)}
          selectedDate={new Date(2025, 6, 15)}
          items={{}}
          showAgenda={true}
        />
      );
      expect(getByText(/No items for this date/)).toBeTruthy();
    });
  });
});
