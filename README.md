# react-native-inline-calendar
React Native component that renders selectable monthly calendar or week stripe with agenda for selected date

# Installation
Run in your terminal:
```javascript
yarn add react-native-inline-calendar
```
or
```javascript
npm install react-native-inline-calendar --save
```

Then add to your application as
```javascript
import { Calendar } from react-native-inline-calendar
```

# Usage

You can see usage example in this [Expo demo](https://snack.expo.io/@ger_exciter/react-native-inline-calendar)

# Params

| Param name    | Type        | Default value | Description |
| ------------- | ----------- | ------------- | ----------- |
| weekMode  | boolean         | false | enable week stripe mode |
| disableWeekToggle | boolean | false | disable toggle from week stripe to month view |
| scrollable  | boolean       | false | scrollable or not |
| weekStartsOn  | number      | 0 | Index of the first week day, i.e. 0 - Sunday, 1 - Monday, etc. |
| showAgenda  | boolean       | true | show agenda list under the calendar (_items_ property) |
| scrollByOne | boolean       | true | scroll by one page or with momentum |
| animatedScrollTo  | boolean | true | animate initial scroll |
| hideHeader  | boolean       | false | Hide/show month header |
| hideWeekDays  | boolean     | false | Hide/show week days names |
| showArrows  | boolean       | true  | Hide/show navigation arrows |
| minMonthsToScroll | number  | 0 | number of months in the past available for scroll |
| maxMonthsToScroll | number  | 1 | number of months in the future available for scroll |
| initialDate | date          | new Date | initial date |
| minDate | date              | new Date | if set, all dates earlier than that will be disabled |
| headerDateFormat            | string  | Date format for header |
| selectedDate  | date        | initialDate or now | date, initially selected |
| currentDate | date          | initialDate or now | current date |
| items | object              | null | agenda items in map format (see below) |
| dataUpdated | timestamp     | null | timestamp of last data refresh to update calendar cache. Required for dinamic data updates |
| emptyListRenderer | function | defaultEmptyListRenderer | what should be rendered if agenda is empty for selected date |
| itemRenderer | function     | defaultItemRenderer | agenda item renderer |
| itemClickHandler | function | void | agenda item click handler |
| onDateSelect | function     | void | date select handler, doesn't prevent rendering date's agenda, runs after selected date state is updated |
| styles | object             | defaultStyles | custom styles that can be applied to the component. Import defaultStyles for the reference |

Agenda items data format:
```javascript
{
  'YYYY-MM-DD': {
    style: object,
    items: [ object ] 
  } 
} 
```