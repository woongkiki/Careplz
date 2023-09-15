import {Box, HStack, Modal} from 'native-base';
import React, {useState, useEffect} from 'react';
import {TouchableOpacity, Image, StyleSheet} from 'react-native';
import {Calendar, LocaleConfig} from 'react-native-calendars';
import {DefText} from '../../common/BOOTSTRAP';
import {colorSelect, fweight} from '../../common/StyleCommon';
import {BASE_URL} from '../../Utils/APIConstant';

Date.prototype.format = function (f) {
  if (!this.valueOf()) return ' ';

  var weekName = [
    '일요일',
    '월요일',
    '화요일',
    '수요일',
    '목요일',
    '금요일',
    '토요일',
  ];
  var d = this;

  return f.replace(/(yyyy|yy|MM|dd|E|hh|mm|ss|a\/p)/gi, function ($1) {
    switch ($1) {
      case 'yyyy':
        return d.getFullYear();
      case 'yy':
        return (d.getFullYear() % 1000).zf(2);
      case 'MM':
        return (d.getMonth() + 1).zf(2);
      case 'dd':
        return d.getDate().zf(2);
      case 'E':
        return weekName[d.getDay()];
      case 'HH':
        return d.getHours().zf(2);
      case 'hh':
        return ((h = d.getHours() % 12) ? h : 12).zf(2);
      case 'mm':
        return d.getMinutes().zf(2);
      case 'ss':
        return d.getSeconds().zf(2);
      case 'a/p':
        return d.getHours() < 12 ? '오전' : '오후';
      default:
        return $1;
    }
  });
};

String.prototype.string = function (len) {
  var s = '',
    i = 0;
  while (i++ < len) {
    s += this;
  }
  return s;
};
String.prototype.zf = function (len) {
  return '0'.string(len - this.length) + this;
};
Number.prototype.zf = function (len) {
  return this.toString().zf(len);
};

const CalendarComponent = props => {
  const {
    navigation,
    onDayPress,
    markedDates,
    nowMonth,
    dateTitle,
    user_lang,
    minDate,
  } = props;

  const [lang, setLang] = useState(user_lang != 0 ? 'en' : 'ko');

  let today = new Date();
  let todayText = today.format('yyyy-MM-dd');
  let oneYearLater = new Date(today.setFullYear(today.getFullYear() + 1)); // 1년후
  let oneAfter = oneYearLater.format('yyyy-MM-dd');

  //포맷 변경
  LocaleConfig.locales['ko'] = {
    monthNames: [
      '1월',
      '2월',
      '3월',
      '4월',
      '5월',
      '6월',
      '7월',
      '8월',
      '9월',
      '10월',
      '11월',
      '12월',
    ],
    monthNamesShort: [
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      '10',
      '11',
      '12',
    ],
    dayNames: [
      '일요일',
      '월요일',
      '화요일',
      '수요일',
      '목요일',
      '금요일',
      '토요일',
    ],
    dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
    today: '오늘',
  };

  LocaleConfig.locales['en'] = {
    monthNames: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'Jun',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ],
    monthNamesShort: [
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      '10',
      '11',
      '12',
    ],
    dayNames: [
      'SUNDAY',
      'MONDAY',
      'TUESDAY',
      'WEDNESDAY',
      'THURSDAY',
      'FRIDAY',
      'SATURDAT',
    ],
    dayNamesShort: ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'],
    today: '오늘',
  };

  LocaleConfig.defaultLocale = lang;

  return (
    <Box>
      {dateTitle != '' && (
        <HStack
          alignItems={'center'}
          pt="20px"
          pb="20px"
          borderBottomWidth={1}
          borderBottomColor="#757575">
          <Image
            source={{uri: BASE_URL + '/images/calendarIcon.png'}}
            style={{
              width: 20,
              height: 20,
              resizeMode: 'stretch',
              marginRight: 10,
            }}
          />
          <DefText
            text={dateTitle}
            style={[fweight.bold, {lineHeight: user_lang == 9 ? 30 : 21}]}
          />
        </HStack>
      )}
      <Calendar
        onMonthChange={e => console.log(e.dateString.substring(0, 7))}
        style={{marginHorizontal: -5}}
        current={todayText}
        minDate={minDate != '' ? minDate : todayText}
        maxDate={oneAfter}
        onDayPress={onDayPress}
        markingType={'custom'}
        markedDates={markedDates}
        hideExtraDays={true}
        monthFormat={'yyyy. MM'}
        theme={{
          selectedDayBackgroundColor: colorSelect.pink_de,
          selectedDayTextColor: '#fff',
          arrowColor: '#73788B',
          dayTextColor: '#73788B',
          textSectionTitleColor: colorSelect.navy,
          textSectionTitleDisabledColor: '#000',
          todayTextColor: '#73788B',
          // textDayFontFamily : Font.SCoreDreamR,
          // textMonthFontFamily: Font.SCoreDreamR,
          // textDayHeaderFontFamily : Font.SCoreDreamR ,
          textDayFontWeight: '400',
          textMonthFontWeight: 'bold',
          textDayHeaderFontWeight: 'bold',
          textDayFontSize: 15,
          textMonthFontSize: 15,
          textDayHeaderFontSize: lang == 'ko' ? 14 : 13,
          monthTextColor: colorSelect.navy,
          'stylesheet.calendar.header': {
            week: {
              marginHorizontal: 0,
              paddingHorizontal: 10,
              flexDirection: 'row',
              justifyContent: 'space-between',
              borderBottomWidth: 1,
              borderBottomColor: '#73788B',
              paddingVertical: 10,
            },
          },
        }}
      />
    </Box>
  );
};

export default CalendarComponent;
