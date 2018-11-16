import React from 'react';
import PropTypes from 'prop-types'
import dateFns from 'date-fns';
import { View, Text, Animated, TouchableOpacity, TouchableHighlight, ScrollView, Dimensions, PanResponder, Platform } from 'react-native'

import defaultStyles from './calendarStyles'
import { defaultEmptyListRenderer, defaultItemRenderer } from './helpers'
let styles = defaultStyles

class Calendar extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      pan: new Animated.ValueXY(),
      viewPortWidth: Dimensions.get('window').width,
      //Configurable through props:
      weekMode: props.weekMode || false,
      scrollable: props.scrollable || false,
      selectedDate: props.initialDate || new Date(),
      currentDate: props.initialDate || new Date(),
    }

    // Initialize PanResponder with move handling
    const maxPanReaction = 15;
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (e, gesture) => {
        this.state.pan.setValue({x: 0, y: gesture.dy})
      },
      onPanResponderRelease: (e, gesture) => {
        Animated.spring(this.state.pan, {
          toValue: { x: 0, y: 0 },
          friction: 5
        }).start();
        if (gesture.dy > maxPanReaction) {
          this.toggleWeekMode(false)
        }
        if (gesture.dy < -maxPanReaction) {
          this.toggleWeekMode(true)
        }
      }
    });
    this.state.pan.setValue({x: 0, y: 0})
    
    this.renderHeader = this.renderHeader.bind(this)
    this.prevMonth = this.prevMonth.bind(this)
    this.nextMonth = this.nextMonth.bind(this)
    this.renderWeekDays = this.renderWeekDays.bind(this)
    this.renderDays = this.renderDays.bind(this)
    this.onDateSelect = this.onDateSelect.bind(this)
    this.scrollTo = this.scrollTo.bind(this)
    this.toggleWeekMode = this.toggleWeekMode.bind(this)
    this.renderItems = this.renderItems.bind(this)
    this.renderCalendarBody = this.renderCalendarBody.bind(this)
    this.getCurrentMonthByOffset = this.getCurrentMonthByOffset.bind(this)
  }

  static defaultProps = {
    weekStartsOn: 0,
    showAgenda: true,
    scrollByOne: true,
    animatedScrollTo: true,
    hideHeader: false,
    hideWeekDays: false,
    showArrows: true,
    minMonthsToScroll: 0,
    maxMonthsToScroll: 1,
    minDate: new Date(),
    headerDateFormat: 'MMMM YYYY',
    initialDate: new Date(),
    currentMonth: new Date(),
    items: {},
    dataUpdated: null,
    itemClickHandler: () => {},
    onDateSelect: () => {}
  }

  static getDerivedStateFromProps(props, state) {
    const ignoreProps = ['scrollable', 'weekMode', 'styles', 'currentMonth', 'currentDate', 'selectedDate']
    if (props.styles) {
      styles = props.styles
    }
    const newState = {...state}
    Object.keys(props).forEach(key => {
      if(!ignoreProps.includes(key))
        newState[key] = props[key]
    })
    return newState
  }

  renderHeader(currentDate) {
    const showArrows = !this.state.scrollable && this.state.showArrows;
    const prevArrow = this.props.prevArrow || <Text>{'<'}</Text>
    const nextArrow = this.props.nextArrow || <Text>{'>'}</Text>
    return <View style={{flexDirection: 'row'}}>
      {showArrows && <TouchableHighlight onPress={this.prevMonth} style={styles.headerNavigation}>{prevArrow}</TouchableHighlight>}
      <Text style={styles.headerTitle}>{dateFns.format(currentDate || this.state.currentDate, this.state.headerDateFormat)}</Text>
      {showArrows && <TouchableHighlight onPress={this.nextMonth} style={styles.headerNavigation}>{nextArrow}</TouchableHighlight>}
    </View>
  }

  prevMonth() {
    this.setState(prevState => ({
      currentDate: prevState.weekMode ? dateFns.subWeeks(prevState.currentDate, 1) : dateFns.subMonths(prevState.currentDate, 1)
    }))
  }

  nextMonth() {
    this.setState(prevState => ({
      currentDate: prevState.weekMode ? dateFns.addWeeks(prevState.currentDate, 1) : dateFns.addMonths(prevState.currentDate, 1)
    }))
  }

  renderWeekDays() {
    const days = [];
    let startDate = dateFns.startOfWeek(this.state.currentDate, { weekStartsOn: this.state.weekStartsOn });
    for (let i = 0; i < 7; i++) {
      days.push(
        <Text key={i} style={styles.weekDay}>
          {dateFns.format(dateFns.addDays(startDate, i), 'dd')}
        </Text>
      );
    }
    return <View style={styles.weekDays}>{days}</View>;
  }

  renderDays(currentDate = this.state.currentDate) {
    const { selectedDate, minDate, items } = this.state;
    const minDateStart = minDate && dateFns.startOfDay(minDate);
    const monthStart = dateFns.startOfMonth(currentDate);
    const monthEnd = dateFns.endOfMonth(monthStart);
    const startDate = dateFns.startOfWeek(monthStart, { weekStartsOn: this.state.weekStartsOn });
    const endDate = this.state.weekMode ? dateFns.endOfWeek(currentDate) : dateFns.endOfWeek(monthEnd);
    const dateFormat = 'D';
    const rows = [];
    let days = [];
    let day = this.state.weekMode ? dateFns.startOfWeek(currentDate, { weekStartsOn: this.state.weekStartsOn }) : startDate;
    let formattedDate = '';
    let j = 0;
    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = dateFns.format(day, dateFormat);
        const cloneDay = day;
        const restrictedDate = minDateStart && dateFns.isBefore(day, minDateStart);
        let style = [styles.day]
        let textStyle = [styles.dayText]
        if(!this.state.weekMode && !dateFns.isSameMonth(day, monthStart) || restrictedDate){
          style.push(styles.dayDisabled)
          textStyle.push(styles.dayDisabledText)
        }
        if(dateFns.isSameDay(day, selectedDate)){
          style.push(styles.daySelected)
          textStyle.push(styles.daySelectedText)
        }
        const itemsForTheDay = items[dateFns.format(day, 'YYYY-MM-DD')];
        days.push(
          <TouchableOpacity style={style} key={i} activeOpacity={restrictedDate ? 1 : 0.2}
            onPress={restrictedDate ? null : () => this.onDateSelect(dateFns.parse(cloneDay))}
          >
            <View style={styles.dayTextWrapper}>
              <Text style={textStyle}>{formattedDate}</Text>
              {itemsForTheDay && <View style={[styles.dayItem, itemsForTheDay.style]}></View>}
            </View>
          </TouchableOpacity>
        );
        day = dateFns.addDays(day, 1);
      }
      rows.push(
        <View style={styles.week} key={j++}>
          {days}
        </View>
      );
      days = [];
    }
    return rows;
  }

  toggleWeekMode(mode = !this.state.weekMode) {
    this.setState({
      weekMode: mode,
      scrolledToDate: false
    })
  }

  onDateSelect(date) {
    this.setState({ selectedDate: date, currentMonth: date})
    this.props.onDateSelect(date)
  }

  renderItems() {
    const { selectedDate, items } = this.state
    const renderer = this.props.itemRenderer || defaultItemRenderer
    const emptyListRenderer = this.props.emptyListRenderer || defaultEmptyListRenderer
    const dayEvents = items[dateFns.format(selectedDate, 'YYYY-MM-DD')]
    return dayEvents && dayEvents.items.length ? renderer(dayEvents, selectedDate, this.props.itemClickHandler) : emptyListRenderer(selectedDate)
  }

  scrollTo(){
    let start = dateFns.startOfWeek(dateFns.startOfMonth(dateFns.subMonths(this.state.currentDate, Math.abs(this.state.minMonthsToScroll))),
      { weekStartsOn: this.state.weekStartsOn })
    let diff = this.state.weekMode ?
      dateFns.differenceInWeeks(this.state.selectedDate, start) :
      dateFns.differenceInMonths(this.state.selectedDate, start);
    setTimeout(() => 
      this.scrollView && this.scrollView.scrollTo({
        x: Math.round(diff) * this.state.viewPortWidth,
        animated: this.state.animatedScrollTo
      })
    , 1) // fix for Android - 'scrollview can scroll only when its size < content's size 2'
    const viewPortWidth = Dimensions.get('window').width
    this.setState({ 
      scrolledToDate: true,
      viewPortWidth,
      animatedScrollTo: false,
      currentMonth: this.getCurrentMonthByOffset(Math.round(diff) * viewPortWidth)
    })
  }

  componentDidUpdate() {
    if (this.state.scrollable && this.scrollView && !this.state.scrolledToDate) {
      this.scrollTo()
    }
  }

  renderCalendarBody(dates) {
    return dates.map((date, i) => 
      <View key={i} style={{width: this.state.viewPortWidth}}>
        {this.state.hideWeekDays || this.renderWeekDays()}
        {this.renderDays(date)}
      </View>
    )
  }

  getCurrentMonthByOffset (xOffset) {
    const diff = Math.round(xOffset/this.state.viewPortWidth);
    let start = dateFns.startOfWeek(dateFns.startOfMonth(dateFns.subMonths(this.state.currentDate, Math.abs(this.state.minMonthsToScroll))),
      { weekStartsOn: this.state.weekStartsOn })
    const currentPeriodStart = this.state.weekMode ?
      dateFns.addWeeks(start, diff) :
      dateFns.addMonths(start, diff)
    const currentPeriodEnd = this.state.weekMode ?
      dateFns.endOfWeek(currentPeriodStart) :
      dateFns.endOfWeek(dateFns.subWeeks(dateFns.addMonths(currentPeriodStart, 1), 1))
    const currentMonth = this.state.selectedDate >= currentPeriodStart && this.state.selectedDate <= currentPeriodEnd ?
      this.state.selectedDate :
      dateFns.addDays(currentPeriodStart, Math.round(dateFns.differenceInCalendarDays(currentPeriodEnd, currentPeriodStart) / 2))
    return currentMonth
  }

  renderCached(dates) {
    if (this.selectedDate !== this.state.selectedDate || 
        this.itemsCount !== Object.keys(this.state.items).length ||
        this.viewPortWidth !== this.state.viewPortWidth ||
        this.dataUpdated !== this.state.dataUpdated) {
      this.weekCalendar = null
      this.monthCalendar = null
      this.dataUpdated = this.state.dataUpdated
      this.itemsCount = Object.keys(this.state.items).length
      this.viewPortWidth = this.state.viewPortWidth
      this.selectedDate = this.state.selectedDate
    }
    if ( this.state.weekMode ) {
      if (!this.weekCalendar) {
        this.weekCalendar = this.renderCalendarBody(dates)
      } 
    } else {
      if (!this.monthCalendar) {
        this.monthCalendar = this.renderCalendarBody(dates)
      }
    }
    return this.state.weekMode ? this.weekCalendar : this.monthCalendar;
  }

  render() {
    const { minMonthsToScroll, maxMonthsToScroll, weekMode, scrollByOne, showAgenda, currentDate, currentMonth } = this.state
    const panStyle = {
      transform: this.state.pan.getTranslateTransform()
    }
    const scrollByOneSetup = scrollByOne ? {
      decelerationRate: 0,
      snapToInterval: this.state.viewPortWidth,
      snapToAlignment: 'center'
    } : {}
    const dates = []
    if (weekMode) {
      const maxWeek = dateFns.endOfMonth(dateFns.addMonths(this.state.currentDate, maxMonthsToScroll))
      let week = dateFns.startOfMonth(dateFns.subMonths(this.state.currentDate, Math.abs(minMonthsToScroll)))
      while(week <= maxWeek){
        dates.push(week);
        week = dateFns.addWeeks(week, 1)
      }
    } else {
      for(let i = minMonthsToScroll; i <= maxMonthsToScroll; i++){
        dates.push(dateFns.addMonths(this.state.currentDate, i))
      }
    }
    return (
      <View style={[styles.calendarWrapper, showAgenda && styles.calendarWrapperAgenda]} onLayout={(event) => {
          const width = event.nativeEvent.layout.width;
          if (this.state.viewPortWidth !== width) {
            this.setState({ viewPortWidth: width })
            if (this.state.scrollable){
              this.scrollTo()
            }
          }
        }}>
        <Animated.View style={[styles.calendar, panStyle]}>
          {this.state.scrollable ?
            <React.Fragment>
              {this.state.hideHeader || this.renderHeader(currentMonth)}
              <ScrollView 
                ref={(c) => this.scrollView = c}
                scrollEventThrottle={16}
                horizontal
                pagingEnabled
                onMomentumScrollEnd={event => this.setState({
                  currentMonth: this.getCurrentMonthByOffset(event.nativeEvent.contentOffset.x)
                })}
                {...scrollByOneSetup}
                showsHorizontalScrollIndicator={false}>
                {this.renderCached.call(this, dates)}
              </ScrollView>
            </React.Fragment>
            :
            <React.Fragment>
              {this.state.hideHeader || this.renderHeader()}
              {this.renderCalendarBody([currentDate])}
            </React.Fragment>
          }
          {this.props.weekMode && !this.props.disableWeekToggle &&
            <Animated.View 
              {...this.panResponder.panHandlers}
              style={[styles.expanderWrapper]}>
              {Platform.OS === 'ios' ?
                <View style={styles.expander}></View>
                :
                <View style={styles.expanderAndroid}>
                  <View style={styles.expanderAndroidInner}>
                    <View style={styles.expanderAndroidInner}>
                      <View style={styles.expanderAndroidInner}></View>
                    </View>
                  </View>
                </View>
              }
            </Animated.View>
          }
        </Animated.View>
        {showAgenda && this.state.items &&
          <Animated.View style={[styles.agendaWrapper, panStyle]}>
            {this.renderItems()}
          </Animated.View>
        }
      </View>
    )
  }
}

Calendar.propTypes = {
  weekMode: PropTypes.bool,
  disableWeekToggle: PropTypes.bool,
  scrollable: PropTypes.bool,
  weekStartsOn: PropTypes.number,
  showAgenda: PropTypes.bool,
  scrollByOne: PropTypes.bool,
  animatedScrollTo: PropTypes.bool,
  hideHeader: PropTypes.bool,
  hideWeekDays: PropTypes.bool,
  showArrows: PropTypes.bool,
  minMonthsToScroll: PropTypes.number,
  maxMonthsToScroll: PropTypes.number,
  minDate: PropTypes.object,
  initialDate: PropTypes.object,
  headerDateFormat: PropTypes.string,
  selectedDate: PropTypes.object,
  currentDate: PropTypes.object,
  items: PropTypes.object,
  dataUpdated: PropTypes.number,
  emptyListRenderer: PropTypes.func,
  itemRenderer: PropTypes.func,
  itemClickHandler: PropTypes.func,
  onDateSelect: PropTypes.func,
  styles: PropTypes.object,
}

export default Calendar;