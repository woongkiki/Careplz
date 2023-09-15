import React, {useState, useEffect, useCallback} from 'react';
import {Box, CheckIcon, HStack, Modal} from 'native-base';
import {DefButton, DefText} from '../../common/BOOTSTRAP';
import {
  TouchableOpacity,
  StatusBar,
  ScrollView,
  StyleSheet,
  Image,
  Platform,
  ActivityIndicator,
  View,
  TouchableWithoutFeedback,
} from 'react-native';
import SearchInput from '../../components/SearchInput';
import {
  colorSelect,
  deviceSize,
  fsize,
  fweight,
} from '../../common/StyleCommon';
import EventHeader from '../../components/EventHeader';
import Swiper from 'react-native-swiper';
import {eventCateList, popularEvent} from '../../ArrayData';
import EventBox from '../../components/EventBox';
import BoxLine from '../../components/BoxLine';
import Loading from '../../components/Loading';
import Api from '../../Api';
import {FlatList} from 'react-native-gesture-handler';
import {connect} from 'react-redux';
import {actionCreators as UserAction} from '../../redux/module/action/UserAction';
import ToastMessage from '../../components/ToastMessage';
import {useIsFocused} from '@react-navigation/native';
import {URLSearchParams} from 'react-native-url-polyfill';
import AutoHeightImage from 'react-native-auto-height-image';
import {
  CALL_PERMISSIONS,
  CALL_PERMISSIONS_NOTI,
  usePermissions,
} from '../../hooks/usePermissions';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import BeforeAfterSlider from '../../components/BeforeAfterSlider';
import Icon from 'react-native-vector-icons/Entypo';
import FixButtons from '../../components/FixButtons';
import BottomNavi from '../../components/bottom/BottomNavi';
import {BASE_URL} from '../../Utils/APIConstant';
import {numberFormat, textLengthOverCut} from '../../common/DataFunction';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Carenews from '../../components/Carenews';
import YoutubePlayer from 'react-native-youtube-iframe';
import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment';

const today = new Date();

let todayData = moment(today).format('YYYY-MM-DD');

const Event = props => {
  const {navigation, route, userInfo, user_lang, notichk} = props;
  const {params, name} = route;

  const [appPopup, setAppPopup] = useState(false);

  if (Platform.OS === 'android') {
    usePermissions(CALL_PERMISSIONS_NOTI);
  }

  //공유하기 이동
  const handleDynamicLink = link => {
    if (link?.url) {
      const str = link?.url.split('?')[1];
      const urlParams = new URLSearchParams(str);

      const screen = urlParams.get('screen');
      const idx = urlParams.get('idx');

      console.log('screen :::', screen);
      console.log('vidx :::', idx);

      if (screen) {
        navigation.navigate(screen, {
          idx: idx,
        });
      }
    } else {
    }
  };

  const dynamiclinkHandler = async () => {
    if (params?.dynLink) {
      console.log('123213', params);
      await handleDynamicLink(params?.dynLink);
      await delete params?.dynLink;
    }
  };

  useEffect(() => {
    dynamiclinkHandler();
  }, []);

  const isFocused = useIsFocused();

  const [loading, setLoading] = useState(true);

  //이벤트 검색
  const [schText, setSchText] = useState('');
  const schTextChange = sch => {
    setSchText(sch);
  };

  const [bannerTop, setBannerTop] = useState([]);
  const [bannerMid, setBannerMid] = useState([]);
  const [eventCategorys, setEventCategorys] = useState([]);
  const [bannerBottom, setBannerBottom] = useState([]);

  //인기시술
  const [popularData, setPopularData] = useState([]);

  //추천이벤트
  const [recomData, setRecomData] = useState([]);

  const [youtubeData, setYoutubeData] = useState(''); //필수영상
  const [playing, setPlaying] = useState('pause');
  const onStateChange = useCallback(state => {
    if (state === 'ended') {
      setPlaying('pause');
      //Alert.alert("video has finished playing!");
    }
  }, []);

  const [careNews, setCareNews] = useState([]); //케어뉴스

  const [beforeAfter, setBeforeAfter] = useState([]); //전후 후기
  const [beforeAfterSelect, setBeforeAfterSelect] = useState('');

  const [healthNews, setHealthNew] = useState([]); //건강소식

  const [appPopupList, setAppPopupList] = useState([]);

  //찜
  const [wishEvent, setWishEvent] = useState([]);

  const [page, setPage] = useState(1);

  const [pageText, setPageText] = useState('');
  const [commonText, setCommonText] = useState('');

  const wishEventAdd = wish => {
    if (!wishEvent.includes(wish)) {
      setWishEvent([...wishEvent, wish]);
    } else {
      const wishRemove = wishEvent.filter(item => wish !== item);
      setWishEvent(wishRemove);
    }
  };

  const loadingEvent = async () => {
    await setLoading(true);
    await setPage(1);
    await Api.send(
      'app_page',
      {
        cidx: user_lang != null ? user_lang.cidx : userInfo.cidx,
        code: 'eventMain',
      },
      args => {
        let resultItem = args.resultItem;
        let arrItems = args.arrItems;

        if (resultItem.result === 'Y' && arrItems) {
          //  console.log('이벤트 메인 언어 리스트: ', resultItem, arrItems.text);
          setPageText(arrItems.text);
        } else {
          console.log('이벤트 메인 언어 리스트 실패!', resultItem);
        }
      },
    );
    await Api.send(
      'app_page',
      {
        cidx: user_lang != null ? user_lang.cidx : userInfo.cidx,
        code: 'commonPage',
      },
      args => {
        let resultItem = args.resultItem;
        let arrItems = args.arrItems;

        if (resultItem.result === 'Y' && arrItems) {
          // console.log('공통 언어 리스트: ', resultItem, arrItems.text);
          setCommonText(arrItems.text);
        } else {
          console.log('공통 언어 리스트 실패!', resultItem);
        }
      },
    );
    await Api.send(
      'app_main',
      {
        id: userInfo?.id,
        cidx: user_lang != null ? user_lang.cidx : userInfo.cidx,
      },
      args => {
        let resultItem = args.resultItem;
        let arrItems = args.arrItems;

        if (resultItem.result === 'Y' && arrItems) {
          //console.log('이벤트 메인 api 성공!', arrItems);
          //console.log(arrItems.banner);
          setBannerTop(arrItems.banner.top);
          setBannerMid(arrItems.banner.middle);
          setEventCategorys(arrItems.category);
          setBannerBottom(arrItems.banner.bottom);
          setPopularData(arrItems.top100);
          setRecomData(arrItems.recom);
          setYoutubeData(arrItems.youtube);
          setCareNews(arrItems.news); //케어뉴스
          setBeforeAfter(arrItems.before_after); //전후 후기
          setBeforeAfterSelect(arrItems.before_after[0]); //전후 후기 사진선택
          setHealthNew(arrItems.health);
        } else {
          console.log('이벤트 메인 api 실패!', resultItem);
        }
      },
    );

    await setLoading(false);
  };

  const popUpHandler = () => {
    Api.send(
      'app_popup',
      {
        cidx: user_lang != null ? user_lang.cidx : userInfo.cidx,
      },
      args => {
        let resultItem = args.resultItem;
        let arrItems = args.arrItems;

        if (resultItem.result === 'Y' && arrItems) {
          console.log('앱 팝업: ', resultItem, arrItems);
          setAppPopupList(arrItems);
        } else {
          console.log('앱 팝업 실패!', resultItem);
        }
      },
    );
  };

  const popApi = () => {
    AsyncStorage.getItem('popdate').then(async response => {
      console.log('response', response);

      await popUpHandler();

      console.log('todayData', todayData);

      if (response == null) {
        await setAppPopup(true);
      } else if (response == todayData) {
        await setAppPopup(false);
      } else {
        await setAppPopup(true);
      }
    });
  };

  const popCloseOne = () => {
    AsyncStorage.setItem('popdate', todayData);
    setAppPopup(false);
  };

  //전후사진 선택
  const baImageSelect = item => {
    setBeforeAfterSelect(item);
  };

  useEffect(() => {
    if (isFocused) {
      if (page == 1) {
        loadingEvent();
      }
    }
  }, [user_lang, isFocused, page]);

  useEffect(() => {
    loadingEvent();
    popApi();
  }, [isFocused]);

  const [fetchLoading, setFetchLoading] = useState(false);

  const pageAdd = async () => {
    await setPage(page + 1);
  };

  //인피니트 스크롤
  const fetchApi = async () => {
    if (popularData.length < 100) {
      await setFetchLoading(true);

      await setFetchLoading(false);
    }
    console.log('맨 하단임');
  };

  const keyExtractor = useCallback((item, index) => index.toString(), []);

  //찜 목록 추가
  const wishApiHandler = event => {
    console.log('event', event);

    let eventIdx = popularData.indexOf(event);

    let eventItem = [...popularData];

    let eventidxNum = eventItem[eventIdx].idx;

    //위시체크 변경
    if (eventItem[eventIdx].wishchk == 1) {
      eventItem[eventIdx].wishchk = 0;
      eventItem[eventIdx].wish = parseInt(eventItem[eventIdx].wish) - 1;
    } else {
      eventItem[eventIdx].wishchk = 1;
      eventItem[eventIdx].wish = parseInt(eventItem[eventIdx].wish) + 1;
    }

    setPopularData(eventItem);

    Api.send('event_wish', {id: userInfo?.id, idx: eventidxNum}, args => {
      let resultItem = args.resultItem;
      let arrItems = args.arrItems;

      if (resultItem.result === 'Y' && arrItems) {
        //console.log('이벤트 찜목록 추가 결과: ', resultItem);

        if (resultItem.message == 'add') {
          ToastMessage(commonText[0]);
        } else {
          ToastMessage(commonText[1]);
        }
      } else {
        console.log('이벤트 찜목록 추가 실패!', resultItem);
      }
    });
  };

  //추천이벤트 찜
  const recomWishApiHandler = event => {
    console.log('event', event);

    let eventIdx = recomData.indexOf(event);

    let eventItem = [...recomData];

    let eventidxNum = eventItem[eventIdx].idx;

    //위시체크 변경
    if (eventItem[eventIdx].wishchk == 1) {
      eventItem[eventIdx].wishchk = 0;
      eventItem[eventIdx].wish = parseInt(eventItem[eventIdx].wish) - 1;
    } else {
      eventItem[eventIdx].wishchk = 1;
      eventItem[eventIdx].wish = parseInt(eventItem[eventIdx].wish) + 1;
    }

    setRecomData(eventItem);

    Api.send('event_wish', {id: userInfo?.id, idx: eventidxNum}, args => {
      let resultItem = args.resultItem;
      let arrItems = args.arrItems;

      if (resultItem.result === 'Y' && arrItems) {
        //console.log('이벤트 찜목록 추가 결과: ', resultItem);

        if (resultItem.message == 'add') {
          ToastMessage(commonText[0]);
        } else {
          ToastMessage(commonText[1]);
        }
      } else {
        console.log('이벤트 찜목록 추가 실패!', resultItem);
      }
    });
  };

  const [sheight1, setSheight1] = useState(296);
  const [sheight2, setSheight2] = useState(240);

  //알림 체크
  const notiChkHandler = async () => {
    const formData = new FormData();
    formData.append('id', userInfo?.id);
    formData.append('method', 'member_notichk');

    const chat_cnt = await notichk(formData);

    //console.log('이벤트 페이지 예약 체크::::', chat_cnt);
  };

  useEffect(() => {
    if (isFocused) {
      notiChkHandler();
    }
  }, [isFocused]);

  const {top} = useSafeAreaInsets();

  const treatmentReservationHandler = type => {
    if (userInfo == '' || userInfo == undefined) {
      ToastMessage(commonText[8]);
      return false;
    }

    if (type == 0) {
      navigation.navigate('HospitalReservationCate', {hidx: ''});
    } else {
      navigation.navigate('HospitalReReservation', {hidx: ''});
    }
  };

  // const setScreenStatusBar = () => {
  //   const {name} = route;

  //   let statusBarColor = '';
  //   let statusBarStyle = '';

  //   if (name === 'Event') {
  //     statusBarColor = colorSelect.pink_de;
  //     statusBarStyle = 'light-content';
  //   } else {
  //     statusBarColor = colorSelect.white;
  //     statusBarStyle = 'default';
  //   }

  //   StatusBar.setBarStyle(statusBarStyle);

  //   if (Platform.OS === 'android') {
  //     StatusBar.setBackgroundColor(statusBarColor);
  //   }

  //   console.log('route::', name);
  // };

  // useEffect(() => {
  //   setScreenStatusBar();
  // }, []);

  useEffect(() => {
    console.log(deviceSize.deviceWidth / 2);
  }, []);

  return (
    <Box flex={1} backgroundColor="#fff">
      {Platform.OS === 'ios' && (
        <View
          style={{
            backgroundColor:
              name == 'Event' ? colorSelect.pink_de : colorSelect.white,
            height: top + top / 2,
          }}
        />
      )}

      {isFocused && (
        <StatusBar
          animated={false}
          backgroundColor={
            name == 'Event' ? colorSelect.pink_de : colorSelect.white
          }
        />
      )}

      <EventHeader navigation={navigation} />
      {loading ? (
        <Loading />
      ) : (
        <FlatList
          ListHeaderComponent={
            <Box>
              {bannerTop != '' && (
                <>
                  <Box>
                    {/* <Image
                      source={{uri: bannerTop[0].upfile}}
                      style={{
                        width: deviceSize.deviceWidth,
                        height: deviceSize.deviceWidth / 1.5,
                        resizeMode: 'stretch',
                      }}
                    /> */}
                    <Swiper
                      loop={true}
                      height={deviceSize.deviceWidth / 1.315}
                      //autoplay={true}
                      //autoplayTimeout={2}
                      dot={
                        <Box
                          style={{
                            backgroundColor: '#BEC0C6',
                            width: 5,
                            height: 5,
                            borderRadius: 5,
                            marginLeft: 7,
                            marginRight: 7,
                          }}
                        />
                      }
                      activeDot={
                        <Box
                          style={{
                            backgroundColor: '#0B0C0E',
                            width: 18,
                            height: 5,
                            borderRadius: 5,
                            marginLeft: 7,
                            marginRight: 7,
                          }}
                        />
                      }
                      paginationStyle={{
                        bottom: 70,
                      }}
                      backgroundColor="transparent">
                      {bannerTop.map((item, index) => {
                        return (
                          <TouchableOpacity
                            key={index}
                            onPress={() =>
                              navigation.navigate('EventInfo', {
                                idx: item.heidx,
                                cidx: userInfo.cidx,
                              })
                            }
                            onLayout={event =>
                              console.log(event.nativeEvent.layout.height)
                            }>
                            <Image
                              source={{uri: item.upfile}}
                              style={{
                                width: deviceSize.deviceWidth,
                                height: deviceSize.deviceWidth / 1.315,
                                resizeMode: 'stretch',
                              }}
                            />
                          </TouchableOpacity>
                        );
                      })}
                    </Swiper>
                    <Box
                      position={'absolute'}
                      bottom="15px"
                      height="40px"
                      zIndex={99}
                      width="100%"
                      alignItems={'center'}>
                      <Box
                        width={deviceSize.deviceWidth - 40}
                        height="40px"
                        backgroundColor={'#fff'}
                        borderRadius={40}
                        overflow={'hidden'}
                        shadow={8}>
                        <SearchInput
                          placeholder={'검색어를 입력해주세요.'}
                          value={schText}
                          onChangeText={schTextChange}
                          inputStyle={{
                            height: 40,
                            paddingLeft: 20,
                            backgroundColor: '#fff',
                            borderWidth: 0,
                            lineHeight: 18,
                            paddingTop: 3,
                          }}
                          btnStyle={{
                            backgroundColor: colorSelect.white,
                          }}
                          positionMargin={'-24px'}
                          buttonPositionRight={0}
                          iconpink={true}
                          //onPress={schEvent}
                          //onSubmitEditing={schEvent}
                        />
                      </Box>
                    </Box>
                  </Box>
                  <BoxLine />
                </>
              )}
              <Box p="20px">
                <DefText
                  text={'일반진료 예약'}
                  style={[styles.labelTitle]}
                  lh={user_lang?.cidx == 9 ? 41 : 0}
                />
                <HStack
                  mt="15px"
                  justifyContent={'space-between'}
                  alignItems={'center'}>
                  <TouchableOpacity
                    onPress={() => treatmentReservationHandler(0)}
                    style={[
                      {
                        width: (deviceSize.deviceWidth - 40) * 0.48,
                        paddingVertical: 6,
                        borderRadius: 20,
                        backgroundColor: colorSelect.pink_de,
                        alignItems: 'center',
                      },
                    ]}>
                    <HStack alignItems={'center'}>
                      <Box mr="10px">
                        <Image
                          source={{uri: BASE_URL + '/images/first_icon.png'}}
                          style={{
                            width: 33,
                            height: 26,
                            resizeMode: 'contain',
                          }}
                        />
                      </Box>
                      <DefText
                        text={pageText != '' ? pageText[7] : '첫 진료에요'}
                        style={[
                          fsize.fs15,
                          fweight.m,
                          {color: colorSelect.white, lineHeight: 20},
                        ]}
                      />
                    </HStack>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => treatmentReservationHandler(1)}
                    style={[
                      {
                        width: (deviceSize.deviceWidth - 40) * 0.48,
                        paddingVertical: 6,
                        borderRadius: 20,
                        backgroundColor: colorSelect.navy,
                        justifyContent: 'center',
                        alignItems: 'center',
                      },
                    ]}>
                    <HStack alignItems={'center'}>
                      <Box mr="10px">
                        <Image
                          source={{uri: BASE_URL + '/images/second_icon.png'}}
                          style={{
                            width: 33,
                            height: 26,
                            resizeMode: 'contain',
                          }}
                        />
                      </Box>
                      <DefText
                        text={pageText != '' ? pageText[8] : '재 진료에요'}
                        style={[
                          fsize.fs15,
                          fweight.m,
                          {color: colorSelect.white, lineHeight: 20},
                        ]}
                      />
                    </HStack>
                  </TouchableOpacity>
                </HStack>
              </Box>
              <BoxLine />
              <Box p="20px">
                <DefText
                  text={pageText != '' ? pageText[1] : '이벤트'}
                  style={[styles.labelTitle]}
                  lh={user_lang?.cidx == 9 ? 41 : 0}
                />
                {eventCategorys != '' && (
                  <HStack flexWrap={'wrap'}>
                    {eventCategorys.map((item, index) => {
                      return (
                        <TouchableOpacity
                          key={index}
                          style={[styles.eventCategoryBox]}
                          onPress={() =>
                            navigation.navigate('EventList', {
                              item: item,
                              index: index,
                              cidx: userInfo.cidx,
                            })
                          }>
                          <Box>
                            <Image
                              source={{uri: item.icon}}
                              style={{
                                width: 42,
                                height: 42,
                                resizeMode: 'contain',
                              }}
                            />
                          </Box>
                          <DefText
                            text={item.category}
                            style={[styles.eventCategoryBoxText]}
                            lh={user_lang?.cidx == 9 ? 27 : ''}
                          />
                        </TouchableOpacity>
                      );
                    })}
                  </HStack>
                )}
              </Box>
              <Box>
                <Swiper
                  loop={true}
                  height={deviceSize.deviceWidth / 2.1}
                  //autoplay={true}
                  //autoplayTimeout={2}
                  dot={
                    <Box
                      style={{
                        backgroundColor: 'transparent',
                        width: 5,
                        height: 5,
                        borderRadius: 5,
                        marginLeft: 7,
                        marginRight: 7,
                      }}
                    />
                  }
                  activeDot={
                    <Box
                      style={{
                        backgroundColor: 'transparent',
                        width: 18,
                        height: 5,
                        borderRadius: 5,
                        marginLeft: 7,
                        marginRight: 7,
                      }}
                    />
                  }
                  paginationStyle={{
                    bottom: 70,
                  }}
                  backgroundColor="transparent">
                  {bannerMid.map((item, index) => {
                    return (
                      <TouchableOpacity
                        key={index}
                        onPress={() =>
                          navigation.navigate('EventInfo', {
                            idx: item.heidx,
                            cidx: userInfo.cidx,
                          })
                        }
                        onLayout={event =>
                          console.log(
                            'mid Banner:::',
                            event.nativeEvent.layout.height,
                          )
                        }>
                        <AutoHeightImage
                          source={{uri: item.upfile}}
                          width={deviceSize.deviceWidth}
                        />
                      </TouchableOpacity>
                    );
                  })}
                </Swiper>
              </Box>
              <Box p="20px">
                <HStack
                  alignItems={'center'}
                  justifyContent={'space-between'}
                  mt="10px">
                  <DefText
                    text={'인기 이벤트 랭킹'}
                    style={[styles.labelTitle]}
                    lh={user_lang?.cidx == 9 ? 41 : 0}
                  />
                  <TouchableOpacity>
                    <HStack alignItems={'center'}>
                      <DefText
                        text={'더보기'}
                        style={[fsize.fs14, {color: '#8F9092', lineHeight: 20}]}
                      />
                      <Box ml="10px">
                        <AntDesign name={'right'} size={10} color={'#8F9092'} />
                      </Box>
                    </HStack>
                  </TouchableOpacity>
                </HStack>
              </Box>
            </Box>
          }
          data={popularData}
          renderItem={({item, index}) => {
            return (
              <Box px="20px">
                <EventBox
                  mt={index != 0 ? 40 : 20}
                  uri={item.thumb}
                  eventName={item.name}
                  hospital={item.hname}
                  score={item.star}
                  good={item.wish}
                  percent={item.per + '%'}
                  orPrice={item.stdprice}
                  price={item.price}
                  values={item.icon}
                  bookmarkonPress={() => wishApiHandler(item)}
                  bookmarData={item.wishchk}
                  eventInfoMove={() =>
                    navigation.navigate('EventInfo', {
                      idx: item.idx,
                      cidx: userInfo.cidx,
                    })
                  }
                  conprice={item.conprice}
                  area={item.area}
                />
              </Box>
            );
          }}
          keyExtractor={keyExtractor}
          //onEndReachedThreshold={0.2}
          //onEndReached={fetchApi}
          ListFooterComponent={
            <Box pt="20px">
              {
                <>
                  {bannerBottom != '' && (
                    <>
                      <BoxLine />
                      <Box p="20px">
                        <Swiper
                          loop={true}
                          height={sheight2}
                          dot={
                            <Box
                              style={{
                                backgroundColor: '#BEC0C6',
                                width: 5,
                                height: 5,
                                borderRadius: 5,
                                marginLeft: 7,
                                marginRight: 7,
                              }}
                            />
                          }
                          activeDot={
                            <Box
                              style={{
                                backgroundColor: '#0B0C0E',
                                width: 18,
                                height: 5,
                                borderRadius: 5,
                                marginLeft: 7,
                                marginRight: 7,
                              }}
                            />
                          }
                          paginationStyle={{
                            bottom: Platform.OS === 'ios' ? 0 : 5,
                          }}
                          backgroundColor="transparent">
                          {bannerBottom.map((item, index) => {
                            return (
                              <TouchableOpacity
                                key={index}
                                onPress={() =>
                                  navigation.navigate('EventInfo', {
                                    idx: item.heidx,
                                    cidx: userInfo?.cidx,
                                  })
                                }
                                onLayout={event =>
                                  setSheight2(
                                    bannerBottom.length > 1
                                      ? event.nativeEvent.layout.height + 20
                                      : event.nativeEvent.layout.height,
                                  )
                                }>
                                <DefText
                                  text={item.title}
                                  style={[
                                    fsize.fs17,
                                    fweight.bold,
                                    {marginBottom: 15},
                                  ]}
                                  lh={user_lang?.cidx == 9 ? 34 : ''}
                                />
                                <Image
                                  source={{uri: item.upfile}}
                                  style={{
                                    width: deviceSize.deviceWidth - 40,
                                    height: (deviceSize.deviceWidth - 40) / 2.7,
                                    resizeMode: 'stretch',
                                  }}
                                />
                                <Box mt="15px">
                                  <DefText
                                    text={item.intro1}
                                    style={[fsize.fs13, {color: '#434856'}]}
                                    lh={user_lang?.cidx == 9 ? 22 : ''}
                                  />
                                  <DefText
                                    text={item.intro2}
                                    style={[
                                      fweight.m,
                                      fsize.fs15,
                                      {marginTop: 5},
                                    ]}
                                    lh={user_lang?.cidx == 9 ? 25 : ''}
                                  />
                                </Box>
                              </TouchableOpacity>
                            );
                          })}
                        </Swiper>
                      </Box>
                    </>
                  )}

                  <BoxLine />

                  <Box p="20px">
                    <DefText
                      text={pageText != '' ? pageText[4] : '추천 이벤트'}
                      style={[styles.labelTitle]}
                      lh={user_lang?.cidx == 9 ? 41 : 0}
                    />
                    {recomData != '' &&
                      recomData.map((item, index) => {
                        return (
                          <Box key={index}>
                            <EventBox
                              mt={30}
                              uri={item.thumb}
                              eventName={item.name}
                              hospital={item.hname}
                              score={item.review}
                              good={item.wish}
                              percent={item.per + '%'}
                              orPrice={item.stdprice}
                              price={item.price}
                              values={item.icon}
                              user_lang={user_lang?.cidx}
                              bookmarkonPress={() => recomWishApiHandler(item)}
                              bookmarData={item.wishchk}
                              eventInfoMove={() =>
                                navigation.navigate('EventInfo', {
                                  idx: item.idx,
                                  cidx: userInfo.cidx,
                                })
                              }
                              conprice={item.conprice}
                              area={item.area}
                            />
                          </Box>
                        );
                      })}
                  </Box>
                  <BoxLine />
                  <Box p="20px">
                    <HStack
                      alignItems={'center'}
                      justifyContent={'space-between'}>
                      <Box width="70%">
                        <DefText
                          text={
                            pageText != ''
                              ? pageText[5]
                              : '발품 전 봐야할 필수영상!'
                          }
                          style={[styles.labelTitle]}
                          lh={user_lang?.cidx == 9 ? 41 : 0}
                        />
                      </Box>
                    </HStack>
                  </Box>
                  <Box>
                    {youtubeData != '' && (
                      <Box>
                        {/* <Image
                          source={{uri: youtubeData.addinfo3}}
                          style={{
                            width: deviceSize.deviceWidth,
                            height: deviceSize.deviceWidth / 2,
                          }}
                        /> */}
                        <YoutubePlayer
                          height={deviceSize.deviceWidth / 1.8}
                          play={playing}
                          videoId={youtubeData.addinfo2}
                          onChangeState={onStateChange}
                        />
                        <Box px="20px" pt="15px" pb="20px">
                          <DefText
                            text={textLengthOverCut(
                              youtubeData.subject,
                              27,
                              '...',
                            )}
                            style={[
                              fsize.fs15,
                              fweight.bold,
                              {lineHeight: 21, color: '#191919'},
                            ]}
                          />
                          <Box mt="5px">
                            <DefText
                              text={
                                '조회수 ' +
                                youtubeData.view +
                                '회 · ' +
                                youtubeData.wdate
                              }
                              style={[
                                fsize.fs13,
                                {color: '#909090', lineHeight: 19},
                              ]}
                            />
                          </Box>
                        </Box>
                      </Box>
                    )}
                  </Box>
                  <BoxLine />
                  <Box p="20px">
                    <HStack
                      alignItems={'center'}
                      justifyContent={'space-between'}>
                      <Box width="70%">
                        <DefText
                          text={pageText != '' ? pageText[9] : '케어뉴스'}
                          style={[styles.labelTitle]}
                          lh={user_lang?.cidx == 9 ? 41 : 0}
                        />
                      </Box>
                      <TouchableOpacity>
                        <HStack alignItems={'center'}>
                          <DefText
                            text={'전체보기'}
                            style={[
                              fsize.fs14,
                              {color: '#8F9092', lineHeight: 20},
                            ]}
                          />

                          <Box ml="10px">
                            <AntDesign
                              name={'right'}
                              size={10}
                              color={'#8F9092'}
                            />
                          </Box>
                        </HStack>
                      </TouchableOpacity>
                    </HStack>
                    {careNews != '' && (
                      <Box>
                        {careNews.map((item, index) => {
                          return (
                            <Carenews
                              key={index}
                              thumb={item.thumb}
                              title={item.subject}
                              date={item.wdate}
                            />
                          );
                        })}
                      </Box>
                    )}
                  </Box>
                  <BoxLine />
                  <Box py="20px">
                    <Box px="20px">
                      <DefText
                        text={pageText != '' ? pageText[10] : '전후 후기'}
                        style={[styles.labelTitle]}
                        lh={user_lang?.cidx == 9 ? 41 : 0}
                      />
                    </Box>
                    {beforeAfterSelect != '' && (
                      <>
                        <Box
                          mt="10px"
                          borderRadius={10}
                          overflow={'hidden'}
                          px="20px">
                          <BeforeAfterSlider
                            afterImage={beforeAfterSelect.photo[1]}
                            beforeImage={beforeAfterSelect.photo[0]}
                            navigation={navigation}
                          />
                        </Box>
                        <HStack
                          mt="10px"
                          justifyContent={'space-between'}
                          alignItems={'center'}
                          px="20px">
                          <DefText
                            text={'AFTER'}
                            style={[
                              fsize.fs15,
                              fweight.bold,
                              {color: '#8B8D8D'},
                            ]}
                          />
                          <DefText
                            text={'BEFORE'}
                            style={[
                              fsize.fs15,
                              fweight.bold,
                              {color: '#C16045'},
                            ]}
                          />
                        </HStack>
                      </>
                    )}

                    {beforeAfter != '' && (
                      <Box mt="10px">
                        <ScrollView
                          horizontal
                          showsHorizontalScrollIndicator={false}
                          contentContainerStyle={{
                            paddingLeft: 20,
                            paddingRight: 20,
                          }}>
                          {beforeAfter.map((item, index) => {
                            return (
                              <TouchableOpacity
                                style={[{marginLeft: index != 0 ? 10 : 0}]}
                                key={index}
                                onPress={() => baImageSelect(item)}>
                                <Image
                                  source={{
                                    uri: item.photo[1],
                                  }}
                                  style={{
                                    width: 70,
                                    height: 70,
                                    resizeMode: 'stretch',
                                    borderRadius: 8,
                                  }}
                                />
                                {item == beforeAfterSelect && (
                                  <Box
                                    width="100%"
                                    height="100%"
                                    position={'absolute'}
                                    top={0}
                                    left={0}
                                    backgroundColor={'rgba(0,0,0,0.5)'}
                                    borderRadius={'8px'}
                                    alignItems={'center'}
                                    justifyContent={'center'}>
                                    <CheckIcon
                                      size={'18px'}
                                      color={colorSelect.white}
                                    />
                                  </Box>
                                )}
                              </TouchableOpacity>
                            );
                          })}
                        </ScrollView>
                      </Box>
                    )}
                  </Box>
                  <BoxLine />
                  <Box p="20px">
                    <HStack
                      alignItems={'center'}
                      justifyContent={'space-between'}>
                      <Box width="70%">
                        <DefText
                          text={pageText != '' ? pageText[11] : '건강소식'}
                          style={[styles.labelTitle]}
                          lh={user_lang?.cidx == 9 ? 41 : 0}
                        />
                      </Box>
                      <TouchableOpacity>
                        <HStack alignItems={'center'}>
                          <DefText
                            text={'전체보기'}
                            style={[
                              fsize.fs14,
                              {color: '#8F9092', lineHeight: 20},
                            ]}
                          />

                          <Box ml="10px">
                            <AntDesign
                              name={'right'}
                              size={10}
                              color={'#8F9092'}
                            />
                          </Box>
                        </HStack>
                      </TouchableOpacity>
                    </HStack>
                    {healthNews != '' && (
                      <Box>
                        {healthNews.map((item, index) => {
                          return (
                            <Carenews
                              key={index}
                              thumb={item.thumb}
                              title={item.subject}
                              date={item.wdate}
                            />
                          );
                        })}
                      </Box>
                    )}
                  </Box>
                </>
              }
              {/* {fetchLoading && (
                <Box py="20px" alignItems={'center'} justifyContent="center">
                  <ActivityIndicator size={'large'} color="#333" />
                </Box>
              )} */}
              <Box pb="80px" />
            </Box>
          }
        />
      )}

      <Box position={'absolute'} bottom="20px" left="20px">
        <TouchableOpacity
          //style={[styles.fixButton]}
          onPress={() => navigation.navigate('EventRecent')}>
          <Image
            source={{uri: BASE_URL + '/newImg/recentExThumb.png'}}
            style={{
              width: 50,
              height: 50,
              borderRadius: 10,
            }}
          />
        </TouchableOpacity>
      </Box>
      {/* <BottomNavi screenName={name} navigation={navigation} /> */}
      {userInfo != null && userInfo != undefined && (
        <FixButtons navigation={navigation} />
      )}

      <Modal isOpen={appPopup} onClose={() => setAppPopup(false)}>
        <Modal.Content
          p="0"
          backgroundColor={'transparent'}
          width={deviceSize.deviceWidth - 40}>
          <Modal.Body p="0px">
            <Swiper
              loop={true}
              height={deviceSize.deviceWidth - 40}
              //autoplay={true}
              //autoplayTimeout={2}
              dot={
                <Box
                  style={{
                    backgroundColor: '#BEC0C6',
                    width: 5,
                    height: 5,
                    borderRadius: 5,
                    marginLeft: 7,
                    marginRight: 7,
                  }}
                />
              }
              activeDot={
                <Box
                  style={{
                    backgroundColor: '#0B0C0E',
                    width: 18,
                    height: 5,
                    borderRadius: 5,
                    marginLeft: 7,
                    marginRight: 7,
                  }}
                />
              }
              paginationStyle={{
                bottom: 20,
              }}>
              {appPopupList.map((item, index) => {
                return (
                  <Box key={index}>
                    <Image
                      source={{uri: item.upfile}}
                      style={{
                        width: '100%',
                        height: deviceSize.deviceWidth - 40,
                        resizeMode: 'stretch',
                      }}
                    />
                  </Box>
                );
              })}
            </Swiper>

            <HStack
              backgroundColor={'rgba(67,72,86,0.8)'}
              alignItems={'center'}>
              <TouchableOpacity
                style={{
                  width: '49%',
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingVertical: 15,
                }}
                onPress={popCloseOne}>
                <DefText
                  text={'하루동안 보지않기'}
                  style={[
                    fsize.fs14,
                    {color: colorSelect.white, lineHeight: 20},
                  ]}
                />
              </TouchableOpacity>
              <Box width="1px" height="16px" backgroundColor={'#fff'} />
              <TouchableOpacity
                onPress={() => setAppPopup(false)}
                style={{
                  width: '49%',
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingVertical: 15,
                }}>
                <DefText
                  text={'닫기'}
                  style={[
                    fsize.fs14,
                    {color: colorSelect.white, lineHeight: 20},
                  ]}
                />
              </TouchableOpacity>
            </HStack>
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </Box>
  );
};

const styles = StyleSheet.create({
  labelTitle: {
    ...fsize.fs20,
    ...fweight.bold,
  },
  eventCategoryBox: {
    width: (deviceSize.deviceWidth - 40) * 0.25,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  eventCategoryBoxText: {
    ...fsize.fs14,
    marginTop: 10,
  },

  // fixButton: {
  //   //width:116,
  //   paddingHorizontal: 10,
  //   height: 40,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   borderRadius: 27,
  //   backgroundColor: colorSelect.pink_de,
  // },
  fixButtonText: {
    ...fsize.fs14,
    ...fweight.m,
    lineHeight: 16,
    color: colorSelect.white,
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
    notichk: user => dispatch(UserAction.notichk(user)),
  }),
)(Event);
