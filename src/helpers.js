import React from 'react';
import dateFns from 'date-fns';
import { View, Text, TouchableOpacity } from 'react-native'

export const defaultEmptyListRenderer = (day) => {
  return <Text>No items for this date ({dateFns.format(day, 'MM/DD/YYYY')})</Text>
}

export const defaultItemRenderer = (dayEvents, selectedDate, itemClickHandler) => {
  const itemStyles = {
    listItem: {
      flexDirection: 'row',
      paddingVertical: 10,
      borderBottomColor: '#efefef',
      borderBottomWidth: 1
    },
    time: {
      paddingHorizontal: 5,
      color: '#ccc'
    }
  }
  const timeFormat = 'hh:mm'
  return dayEvents.items && dayEvents.items.map((item, i) => {
    const timeStart = dateFns.setMinutes(dateFns.setHours(selectedDate, item.timeStart.hour), item.timeStart.minute)
    const timeEnd = dateFns.setMinutes(dateFns.setHours(selectedDate, item.timeEnd.hour), item.timeEnd.minute)
    return (
    <TouchableOpacity key={i} onPress={() => itemClickHandler(item, selectedDate)}>
      <View style={itemStyles.listItem}>
        <Text style={itemStyles.time}>
          {dateFns.format(timeStart, timeFormat)} - {dateFns.format(timeEnd, timeFormat)}
        </Text>
        <Text>{item.title}</Text>
        <Text>{item.description}</Text>
      </View>
    </TouchableOpacity>
    )}
  )
}