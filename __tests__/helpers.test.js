import React from 'react';
import { render } from '@testing-library/react-native';
import { defaultEmptyListRenderer, defaultItemRenderer } from '../src/helpers';

describe('helpers', () => {
  describe('defaultEmptyListRenderer', () => {
    it('renders the no items message with formatted date', () => {
      const date = new Date(2025, 6, 15);
      const { getByText } = render(defaultEmptyListRenderer(date));
      expect(getByText(/No items for this date/)).toBeTruthy();
      expect(getByText(/07\/15\/2025/)).toBeTruthy();
    });
  });

  describe('defaultItemRenderer', () => {
    const mockDayEvents = {
      items: [
        {
          title: 'Morning standup',
          description: 'Daily sync',
          timeStart: { hour: 9, minute: 30 },
          timeEnd: { hour: 10, minute: 0 },
        },
        {
          title: 'Lunch',
          description: 'Team lunch',
          timeStart: { hour: 12, minute: 0 },
          timeEnd: { hour: 13, minute: 0 },
        },
      ],
    };
    const selectedDate = new Date(2025, 6, 15);
    const itemClickHandler = jest.fn();

    it('renders all items with titles and descriptions', () => {
      const { getByText } = render(
        defaultItemRenderer(mockDayEvents, selectedDate, itemClickHandler)
      );
      expect(getByText('Morning standup')).toBeTruthy();
      expect(getByText('Daily sync')).toBeTruthy();
      expect(getByText('Lunch')).toBeTruthy();
      expect(getByText('Team lunch')).toBeTruthy();
    });

    it('formats start and end times correctly', () => {
      const { getByText } = render(
        defaultItemRenderer(mockDayEvents, selectedDate, itemClickHandler)
      );
      expect(getByText('09:30 - 10:00')).toBeTruthy();
      expect(getByText('12:00 - 01:00')).toBeTruthy();
    });
  });
});
