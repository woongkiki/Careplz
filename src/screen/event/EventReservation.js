import React, {useEffect, useState} from 'react';
import {Box, HStack, VStack} from 'native-base';
import {TouchableOpacity, ScrollView, StyleSheet, Image} from 'react-native';
import {DefButton, DefText} from '../../common/BOOTSTRAP';
import Header from '../../components/Header';
import {
  colorSelect,
  deviceSize,
  fsize,
  fweight,
} from '../../common/StyleCommon';
import {Calendar, LocaleConfig} from 'react-native-calendars';
import moment from 'moment';
import XDate from 'xdate';
import BoxLine from '../../components/BoxLine';
import {BASE_URL} from '../../Utils/APIConstant';
import {reservationTime} from '../../ArrayData';
import ToastMessage from '../../components/ToastMessage';
import CalendarComponent from '../../components/datepicker/CalendarComponent';
import TimePickersComponents from '../../components/timepicker/TimePickersComponents';
import {connect} from 'react-redux';
import {actionCreators as UserAction} from '../../redux/module/action/UserAction';
import Api from '../../Api';
import Loading from '../../components/Loading';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const EventReservation = props => {
  const {navigation, route, userInfo, user_lang} = props;
  const {params} = route;

  console.log('params', params);

  const [pageText, setPageText] = useState('');

  const appPageApi = () => {
    //user_lang != null ? user_lang?.cidx : userInfo?.cidx
    Api.send(
      'app_page',
      {
        cidx: user_lang != null ? user_lang?.cidx : userInfo?.cidx,
        code: 'hospitalReserTime',
      },
      args => {
        let resultItem = args.resultItem;
        let arrItems = args.arrItems;

        if (resultItem.result === 'Y' && arrItems) {
          console.log('진료예약 시간선택 언어 리스트: ', resultItem, arrItems);
          setPageText(arrItems.text);
        } else {
          console.log('진료예약 시간선택 언어 리스트 실패!', resultItem);
        }
      },
    );
  };

  useEffect(() => {
    appPageApi();
  }, []);

  const [selectDates, setSelectDate] = useState('');
  const [showDate, setShowDate] = useState('');
  //달력 날짜 선택
  const selectDate = date => {
    const dates = {};
    const sDate = new XDate(date);

    //console.log(sDate.toString('yyyy-MM-dd'));
    dates[sDate.toString('yyyy-MM-dd')] = {
      selected: true,
      selectedColor: colorSelect.pink_de,
    };

    setShowDate(date); //날짜에 표시용
    setNowMonth(date);
    setSelectDate(dates); //달력에 날짜 선택함 표시
  };

  const [loading, setLoading] = useState(false);
  //시간 데이터
  const [selectTime, setSelectTime] = useState([]);
  const [nowMonth, setNowMonth] = useState('');
  const [dateStatus, setDateStatus] = useState([]);
  const [timeList, setTimeList] = useState([]);

  const dateApi = async () => {
    // await setLoading(true);
    //user_lang != null ? user_lang.cidx : userInfo?.cidx,
    //event_reservation01
    await Api.send(
      'event_newReservation01',
      {
        idx: params.idx,
        cidx: user_lang != null ? user_lang.cidx : userInfo?.cidx,
        id: userInfo?.id,
        date: nowMonth,
      },
      args => {
        let resultItem = args.resultItem;
        let arrItems = args.arrItems;

        if (resultItem.result === 'Y' && arrItems) {
          console.log('이벤트 날짜 가져오기', arrItems);
          setDateStatus(arrItems.date);
          timeSave(arrItems.time);
        } else {
          console.log('이벤트 날짜 가져오기 실패!', resultItem);
        }
      },
    );
    //await setLoading(false);
  };

  const timeSave = time => {
    let timeArr = Object.keys(time);
    let timeStatusArr = Object.values(time);

    let times = [];

    timeArr.map((item, index) => {
      //return times.push({"selectDate":showDate,"times":item, "status":timeStatueArr[index]});
      return times.push({
        time: showDate + ' ' + item,
        status: timeStatusArr[index],
      });
      //console.log("items", item);
    });

    setTimeList(times);
  };

  useEffect(() => {
    dateApi();
  }, [nowMonth]);

  const nextNavigation = () => {
    // if(selectTime.length < 5){
    //     ToastMessage(pageText != "" ? pageText[20] : "시간은 5개 이상 선택해주세요");
    //     return false;
    // }

    if (selectTime.length > 1) {
      ToastMessage(
        pageText != '' ? pageText[20] : '예약 시간은 1개까지 선택해주세요.',
      );
      return false;
    }

    //event_reservation02
    Api.send(
      'event_newReservation02',
      {
        idx: params.idx,
        cidx: user_lang != null ? user_lang.cidx : userInfo?.cidx,
        id: userInfo?.id,
        datetime: selectTime.join(','),
        ridx: params?.ridx,
      },
      args => {
        let resultItem = args.resultItem;
        let arrItems = args.arrItems;

        if (resultItem.result === 'Y' && arrItems) {
          console.log('이벤트 예약성공', resultItem);
          ToastMessage(resultItem.message);

          navigation.replace('EventReservationEnd', {
            eventIdx: params.idx,
            hidx: '',
            date: selectTime.join(','),
          });
          // navigation.reset({
          //   routes: [
          //     {
          //       name: 'TabNavi',
          //       screen: 'Event',
          //     },
          //   ],
          // });
        } else {
          console.log('이벤트 예약 실패!', resultItem);
        }
      },
    );
  };

  const {top} = useSafeAreaInsets();

  return (
    <Box flex={1} backgroundColor="#fff" pt={top + 'px'}>
      <Header
        navigation={navigation}
        headerTitle={pageText != '' ? pageText[0] : '예약신청'}
        backButtonStatus={true}
      />
      {loading ? (
        <Loading />
      ) : (
        <ScrollView>
          <Box p="20px">
            {user_lang?.cidx != 0 ? (
              <Box>
                <DefText
                  text={userInfo?.name}
                  style={[fsize.fs16, fweight.m]}
                />
                <DefText
                  text={pageText[1]}
                  style={[fsize.fs14, {lineHeight: 25}]}
                />
                <HStack alignItems={'center'}>
                  <Image
                    source={{uri: BASE_URL + '/images/check_icon_pink.png'}}
                    style={{
                      width: 18,
                      height: 14,
                      resizeMode: 'contain',
                      marginRight: 7,
                    }}
                  />
                  <DefText
                    text={pageText[22]}
                    style={[fsize.fs14, {lineHeight: 22}]}
                  />
                </HStack>
                <DefText
                  text={pageText[23]}
                  style={[fsize.fs14, {lineHeight: 22}]}
                />
              </Box>
            ) : (
              <Box>
                <DefText
                  text={userInfo?.name + '님'}
                  style={[fsize.fs16, fweight.m]}
                />
                <DefText
                  text={pageText[1]}
                  style={[fsize.fs14, {lineHeight: 25}]}
                />
                <HStack alignItems={'center'}>
                  <Image
                    source={{uri: BASE_URL + '/images/check_icon_pink.png'}}
                    style={{
                      width: 18,
                      height: 14,
                      resizeMode: 'contain',
                      marginRight: 7,
                    }}
                  />
                  <DefText
                    text={pageText[22]}
                    style={[fsize.fs14, {lineHeight: 22}]}
                  />
                </HStack>
                <DefText
                  text={pageText[23]}
                  style={[fsize.fs14, {lineHeight: 22}]}
                />
              </Box>
            )}
          </Box>
          <BoxLine />
          <Box px="20px" pb="10px">
            <CalendarComponent
              navigation={navigation}
              onDayPress={day => selectDate(day.dateString)}
              markedDates={{
                ...dateStatus,
                ...selectDates,
              }}
              dateTitle={pageText != '' ? pageText[2] : '날짜선택'}
              user_lang={user_lang?.cidx}
            />
          </Box>
          <BoxLine />

          {showDate != '' && (
            <Box px="20px">
              <TimePickersComponents
                navigation={navigation}
                setSelectTimes={setSelectTime}
                selectTime={selectTime}
                timeLists={timeList}
                selectDate={showDate}
                timeTextTitle={pageText != '' ? pageText[10] : '날짜선택'}
                timeNoText={
                  pageText != '' ? pageText[21] : '상담 가능한 시간이 없습니다.'
                }
              />
            </Box>
          )}
          {(showDate != '' || selectTime != '') && (
            <>
              <BoxLine />
              <Box p="20px">
                <HStack
                  alignItems={'center'}
                  pb="20px"
                  mb="10px"
                  borderBottomWidth={1}
                  borderBottomColor="#757575">
                  <Image
                    source={{uri: BASE_URL + '/images/timeIcons.png'}}
                    style={{
                      width: 20,
                      height: 20,
                      resizeMode: 'stretch',
                      marginRight: 10,
                    }}
                  />
                  <DefText
                    text={pageText != '' ? pageText[12] : '선택 일정'}
                    style={[
                      fweight.bold,
                      {lineHeight: user_lang.cidx == 9 ? 30 : 21},
                    ]}
                  />
                </HStack>
                {showDate != '' && selectTime != '' && (
                  <VStack style={[styles.selectBoxs]}>
                    <Box>
                      <DefText
                        text={
                          pageText != '' ? pageText[13] : '예약 날짜 및 시간'
                        }
                        style={[
                          styles.selectBoxsLeftLabel,
                          user_lang.cidx == 9 && {lineHeight: 30},
                        ]}
                      />
                    </Box>
                    <HStack flexWrap={'wrap'}>
                      {selectTime.map((times, idxs) => {
                        return (
                          <Box
                            key={idxs}
                            borderRadius={5}
                            backgroundColor={colorSelect.pink_de}
                            width={(deviceSize.deviceWidth - 40) * 0.48}
                            height={35}
                            alignItems="center"
                            justifyContent={'center'}
                            mt="15px"
                            mr={
                              (idxs + 1) % 2 != 0
                                ? (deviceSize.deviceWidth - 40) * 0.039
                                : 0
                            }>
                            <DefText
                              text={times}
                              style={[
                                styles.selectBoxsRightText,
                                {color: colorSelect.white},
                              ]}
                            />
                          </Box>
                        );
                      })}
                    </HStack>
                  </VStack>
                )}
              </Box>
            </>
          )}
        </ScrollView>
      )}

      <DefButton
        text={pageText != '' ? pageText[11] : '예약하기'}
        btnStyle={[
          {borderRadius: 0},
          showDate != '' && selectTime != ''
            ? {backgroundColor: colorSelect.pink_de}
            : {backgroundColor: '#F1F1F1'},
        ]}
        txtStyle={[
          showDate != '' && selectTime != ''
            ? {color: colorSelect.white}
            : {color: '#000'},
          user_lang?.cidx == 9 && {lineHeight: 45},
        ]}
        disabled={showDate != '' && selectTime != '' ? false : true}
        onPress={nextNavigation}
      />
    </Box>
  );
};

const styles = StyleSheet.create({
  timeButton: {
    width: (deviceSize.deviceWidth - 40) * 0.32,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#73788B',
    borderRadius: 5,
    marginTop: (deviceSize.deviceWidth - 40) * 0.02,
  },
  timeButtonText: {
    ...fsize.fs15,
    lineHeight: 20,
    color: '#73788B',
  },
  selectBoxs: {
    paddingVertical: 15,
  },
  selectBoxsLeftLabel: {
    ...fweight.bold,
    lineHeight: 20,
  },
  selectBoxsRightText: {
    lineHeight: 20,
  },
});

export default connect(
  ({User}) => ({
    userInfo: User.userInfo, //회원정보
    user_lang: User.user_lang,
  }),
  dispatch => ({
    member_login: user => dispatch(UserAction.member_login(user)), //로그인
    languageSet: user => dispatch(UserAction.languageSet(user)), //선택언어
  }),
)(EventReservation);
