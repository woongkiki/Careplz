import React, {useCallback, useEffect, useState} from 'react';
import {Box, HStack, Modal} from 'native-base';
import {DefText} from '../../../common/BOOTSTRAP';
import Header from '../../../components/Header';
import Loading from '../../../components/Loading';
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {reservationList} from '../../../ArrayData';
import {
  colorSelect,
  deviceSize,
  fsize,
  fweight,
} from '../../../common/StyleCommon';
import ReservationBox from '../../../components/reservation/ReservationBox';
import EmptyPage from '../../../components/EmptyPage';
import {connect} from 'react-redux';
import {actionCreators as UserAction} from '../../../redux/module/action/UserAction';
import ToastMessage from '../../../components/ToastMessage';
import Api from '../../../Api';
import {BASE_URL} from '../../../Utils/APIConstant';
import {useIsFocused} from '@react-navigation/native';
import CalendarComponent from '../../../components/datepicker/CalendarComponent';
import XDate from 'xdate';
import moment from 'moment';
import WebView from 'react-native-webview';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

//예약 내역
const MyReservationList = props => {
  const {navigation, userInfo, user_lang, notichk} = props;

  const isFocused = useIsFocused();

  //앱 페이지 텍스트
  const [pageText, setPageText] = useState([]);

  const pageLanguage = async () => {
    //user_lang != null ? user_lang.cidx : userInfo.cidx
    await Api.send(
      'app_page',
      {
        cidx: user_lang != null ? user_lang?.cidx : userInfo?.cidx,
        code: 'reservationList',
      },
      args => {
        let resultItem = args.resultItem;
        let arrItems = args.arrItems;

        if (resultItem.result === 'Y' && arrItems) {
          console.log('마이페이지 언어 리스트: ', resultItem, arrItems.text);
          setPageText(arrItems.text);
        } else {
          console.log('마이페이지 수정 언어 리스트 실패!', resultItem);
        }
      },
    );
  };

  let cate01 = pageText != '' ? pageText[0] : '예약내역';
  let cate02 = pageText != '' ? pageText[1] : '정기검진 예약';
  let cate03 = pageText != '' ? pageText[2] : '진료완료 예약';

  const reserCate = [
    {
      category: cate01,
      api: 'member_reservation01',
      map: 'reservation01',
    },
    {
      category: cate02,
      api: 'member_reservation02',
      map: 'reservation02',
    },
    {
      category: cate03,
      api: 'member_reservation03',
      map: 'reservation03',
    },
  ];

  const [loading, setLoading] = useState(true);

  const [selectCate, setSelectCate] = useState('1');

  const [visitList, setVisitList] = useState([]);
  const [untactList, setUntactList] = useState([]);
  const [eventList, setEventList] = useState([]);
  const [page, setPage] = useState(1);
  const [apiPage, setApiPage] = useState('member_reservation01');

  const today = new Date();
  const todays = moment(today).format('yy-MM-DD');
  const todayMonth = moment(today).format('yy-MM');

  let oneYearEarly = new Date(today.setFullYear(today.getFullYear() - 1)); // 1년후
  let oneBefore = oneYearEarly.format('yyyy-MM-dd');

  const [calendarModal, setCalendarModal] = useState(false);
  const [selectDates, setSelectDate] = useState([]);
  const [showDate, setShowDate] = useState('');

  const [nowMonth, setNowMonth] = useState(todayMonth);

  const selectDate = date => {
    const dates = {};
    const sDate = new XDate(date);

    dates[sDate.toString('yyyy-MM-dd')] = {
      selected: true,
      selectedColor: colorSelect.pink_de,
    };

    setShowDate(date); //날짜에 표시용
    setNowMonth(date);
    setSelectDate(dates); //달력에 날짜 선택함 표시

    console.log('dates', dates);
  };

  const renderItems = ({item, index}) => {
    return (
      <Box px="20px" mb="20px" mt={index == 0 ? '20px' : 0}>
        <ReservationBox
          navigation={navigation}
          name={userInfo.name}
          hospital={item.hname}
          hospitalSubject={item.category}
          cancleState={item.status}
          cancleReason={item.cmemo}
          requestDate={item.time}
          reservationDate={item.rdate}
          reservationTime={item.rtime}
          wdate={item.wdate}
          reserLang={pageText != '' ? pageText[7] : '예약 요청 중'}
          reserLang2={pageText != '' ? pageText[8] : '예약 확정'}
          reserLang3={pageText != '' ? pageText[9] : '되었습니다.'}
          reserLang4={pageText != '' ? pageText[12] : '예약 완료'}
          reserCancle={pageText != '' ? pageText[10] : '예약 요청 취소'}
          reserCancleTitme={pageText != '' ? pageText[11] : '거절사유'}
          reserIdx={item.idx}
          reserType={selectCate}
        />
      </Box>
    );
  };
  const keyExtractor = useCallback(item => item.idx.toString(), []);

  useEffect(() => {
    setLoading(true);
    setLoading(false);
  }, []);

  useEffect(() => {
    pageLanguage();
  }, []);

  useEffect(() => {
    if (apiPage != '' || isFocused) {
      reservationDetailApi();
    }
  }, [apiPage, isFocused]);

  const [reserTypes, setReserTypes] = useState('reservation01');

  const tabCategoryChange = (cate, api, map) => {
    console.log('map::::', map);

    console.log(cate, api);
    setSelectCate(cate);
    setApiPage(api);
    setPage(1);

    setReserTypes(map);
    setStartDate('');
  };

  const reservationDetailApi = async () => {
    await setPage(1);
    await Api.send(
      apiPage,
      {
        id: userInfo.id,
        page: 1,
        cidx: user_lang != null ? user_lang?.cidx : userInfo?.cidx,
        sdate: startDate,
      },
      args => {
        console.log(apiPage, startDate);

        let resultItem = args.resultItem;
        let arrItems = args.arrItems;

        if (resultItem.result === 'Y' && arrItems) {
          console.log(apiPage + ' 예약 상세 리스트: ', resultItem, arrItems);
          setVisitList(arrItems);
        } else {
          console.log('예약 상세 리스트 실패!', resultItem);
          setVisitList([]);
        }
      },
    );
  };

  const [fetchLoading, setFetchLoading] = useState(false);
  const fetchApi = async () => {
    await setFetchLoading(true);

    await setFetchLoading(false);
    console.log('맨 하단임');
  };

  const pageAdd = async () => {
    await setPage(page + 1);
  };

  const reservationListAdd = () => {
    Api.send(
      apiPage,
      {
        id: userInfo.id,
        page: page,
        cidx: user_lang != null ? user_lang?.cidx : userInfo?.cidx,
        sdate: startDate,
      },
      args => {
        let resultItem = args.resultItem;
        let arrItems = args.arrItems;

        if (resultItem.result === 'Y' && arrItems) {
          console.log(
            apiPage + ' 예약 상세 리스트 추가: ',
            resultItem,
            arrItems,
          );
          setVisitList(arrItems);

          let visitLists = [...visitList];

          arrItems.map((item, index) => {
            return visitLists.push(item);
          });

          setVisitList(visitLists);
        } else {
          console.log('예약 상세 리스트 더 없음!', resultItem);

          if (page > 2) {
            setPage(page);
          }
        }
      },
    );
  };

  useEffect(() => {
    if (fetchLoading) {
      pageAdd();
    }
  }, [fetchLoading]);

  useEffect(() => {
    if (page > 1) {
      console.log(page);
      reservationListAdd();
    }
  }, [page]);

  //알림 체크
  const notiChkHandler = async () => {
    const formData = new FormData();
    formData.append('id', userInfo?.id);
    formData.append('method', 'member_notichk');

    const chat_cnt = await notichk(formData);

    console.log('예약 내역확인 예약 체크::::', chat_cnt);
  };

  useEffect(() => {
    if (isFocused) {
      notiChkHandler();
    }
  }, [isFocused]);

  const [startDate, setStartDate] = useState('');

  const webviewApi = webviews => {
    const jsonData = JSON.parse(webviews.nativeEvent.data);

    setStartDate(jsonData.sdate);
    // setEndDate(jsonData.edate);
    setCalendarModal(false);
    // setCalendarModal(false);
  };

  useEffect(() => {
    setTimeout(() => {
      reservationDetailApi();
    }, 200);
  }, [startDate]);

  const {top} = useSafeAreaInsets();

  return (
    <Box flex={1} backgroundColor="#fff" pt={top + 'px'}>
      <Header
        navigation={navigation}
        backButtonStatus={true}
        headerTitle={pageText != '' ? pageText[0] : '예약내역'}
      />
      {loading ? (
        <Loading />
      ) : (
        <FlatList
          ListHeaderComponent={
            <>
              {user_lang?.cidx != 0 ? (
                reserCate.map((item, index) => {
                  return (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.cateButton,
                        {
                          width: deviceSize.deviceWidth,
                          borderBottomWidth: 1,
                          borderBottomColor: '#dfdfdf',
                        },
                      ]}
                      onPress={() =>
                        tabCategoryChange(index + 1, item.api, item.map)
                      }>
                      <DefText
                        text={item.category}
                        style={[
                          styles.cateButtonText,
                          selectCate == index + 1 && [
                            {color: colorSelect.pink_de},
                            fweight.bold,
                          ],
                        ]}
                        lh={user_lang?.cidx == 9 ? 28 : ''}
                      />
                      {selectCate == index + 1 && (
                        <Box
                          position={'absolute'}
                          bottom={-1}
                          style={{
                            width: '100%',
                            height: 4,
                            backgroundColor: colorSelect.pink_de,
                          }}
                        />
                      )}
                    </TouchableOpacity>
                  );
                })
              ) : (
                <HStack
                  alignItems={'center'}
                  justifyContent="space-between"
                  borderBottomWidth={1}
                  borderBottomColor="#D2DCE8">
                  {reserCate.map((item, index) => {
                    return (
                      <TouchableOpacity
                        key={index}
                        style={[styles.cateButton]}
                        onPress={() =>
                          tabCategoryChange(index + 1, item.api, item.map)
                        }>
                        <DefText
                          text={item.category}
                          style={[
                            styles.cateButtonText,
                            selectCate == index + 1 && [
                              {color: colorSelect.pink_de},
                              fweight.bold,
                            ],
                          ]}
                        />
                        {selectCate == index + 1 && (
                          <Box
                            position={'absolute'}
                            bottom={-1}
                            style={{
                              width: '100%',
                              height: 4,
                              backgroundColor: colorSelect.pink_de,
                            }}
                          />
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </HStack>
              )}
              <HStack pt={'20px'} px="20px" justifyContent={'flex-end'}>
                <TouchableOpacity onPress={() => setCalendarModal(true)}>
                  <Image
                    source={{uri: BASE_URL + '/images/calendarImg.png'}}
                    style={{
                      width: 20,
                      height: 20,
                      resizeMode: 'contain',
                    }}
                  />
                </TouchableOpacity>
              </HStack>
            </>
          }
          data={visitList}
          renderItem={renderItems}
          keyExtractor={keyExtractor}
          ListEmptyComponent={
            <Box py="100px">
              <EmptyPage
                emptyText={
                  selectCate == '1'
                    ? pageText[4]
                    : selectCate == '2'
                    ? pageText[5]
                    : pageText[6]
                }
              />
            </Box>
          }
          onEndReachedThreshold={0.2}
          onEndReached={fetchApi}
          ListFooterComponent={
            fetchLoading && (
              <Box>
                <ActivityIndicator size={'large'} color={'#333'} />
              </Box>
            )
          }
        />
      )}
      <Modal isOpen={calendarModal} onClose={() => setCalendarModal(false)}>
        <Modal.Content
          p="0"
          width={deviceSize.deviceWidth - 40}
          backgroundColor="#fffs">
          <Modal.Body p="20px" backgroundColor={'#fff'}>
            <Box height="452px">
              <WebView
                originWhitelist={['*']}
                onMessage={webviews => webviewApi(webviews)}
                source={{
                  uri:
                    BASE_URL +
                    '/reserveCalendar2.php?id=' +
                    userInfo?.id +
                    '&rtype=' +
                    reserTypes,
                }}
                style={{
                  opacity: 0.99,
                  minHeight: 1,
                }}
              />
            </Box>
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </Box>
  );
};

const styles = StyleSheet.create({
  cateButton: {
    paddingVertical: 16,
    width: deviceSize.deviceWidth / 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cateButtonText: {
    ...fsize.fs15,
    color: '#D2DCE8',
    textAlign: 'center',
  },
});

export default connect(
  ({User}) => ({
    userInfo: User.userInfo, //회원정보
    user_lang: User.user_lang,
  }),
  dispatch => ({
    member_login: user => dispatch(UserAction.member_login(user)), //로그인
    languageSet: user => dispatch(UserAction.languageSet(user)), //언어
    member_logout: user => dispatch(UserAction.member_logout(user)), //로그아웃
    notichk: user => dispatch(UserAction.notichk(user)),
  }),
)(MyReservationList);
