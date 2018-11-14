import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  calendarWrapper: {
  },
  calendarWrapperAgenda: {
    flex: 1,
  },
  calendar: {
    backgroundColor: '#fff',
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    zIndex: 1
  },
  headerTitle: {
    alignContent: 'center',
    textAlign: 'center',
    flex: 1
  },
  headerNavigation: {
    paddingHorizontal: 20
  },
  weekDays: {
    paddingVertical: 5,
    flexDirection: 'row'
  },
  weekDay: {
    textAlign: 'center',
    flex: 1
  },
  week: {
    flexDirection: 'row'
  },
  day: {
    flex: 1,
    position: 'relative',
    paddingVertical: 7,
    borderRadius: 7
  },
  dayTextWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayText: {
    textAlign: 'center',
  },
  dayDisabled: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: 7,
  },
  dayDisabledText: {
    textAlign: 'center',
    color: '#ccc'
  },
  daySelected: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: 7,
    backgroundColor: 'skyblue',
  },
  daySelectedText: {
    textAlign: 'center',
  },
  expander: {
    backgroundColor: 'skyblue',
    width: 50,
    height: 4,
    borderRadius: 2,
    margin: 5
  },
  expanderAndroid: {
    borderColor: 'skyblue',
    width: 40,
    height: 17,
  },
  expanderAndroidInner: {
    height: 1.5,
    marginVertical: 4,
    marginHorizontal: 6,
    backgroundColor: 'skyblue'
  },
  expanderWrapper: {
    borderColor: 'transparent',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayItem: {
    position: 'absolute',
    bottom: -4,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'skyblue'
  },
  agendaWrapper: {
    backgroundColor: '#fff'
  }
})