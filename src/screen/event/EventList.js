import {useIsFocused} from '@react-navigation/native';
import {Box, CheckIcon, HStack, Modal} from 'native-base';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import Api from '../../Api';
import {eventCateList, popularEvent, subCategory} from '../../ArrayData';
import {DefText} from '../../common/BOOTSTRAP';
import {
  colorSelect,
  deviceSize,
  fsize,
  fweight,
} from '../../common/StyleCommon';
import BoxLine from '../../components/BoxLine';
import EmptyPage from '../../components/EmptyPage';
import EventBox from '../../components/EventBox';
import Header from '../../components/Header';
import Loading from '../../components/Loading';
import {BASE_URL} from '../../Utils/APIConstant';
import {connect} from 'react-redux';
import {actionCreators as UserAction} from '../../redux/module/action/UserAction';
import ToastMessage from '../../components/ToastMessage';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import BottomNavi from '../../components/bottom/BottomNavi';

//순서
const orderlist = ['리뷰순', '최신순', '낮은가격순', '높은가격순'];

const EventList = props => {
  const {navigation, route, userInfo, user_lang} = props;
  const {params, name} = route;

  const [selectCategory, setSelectCategory] = useState(params.item.category);
  const [catcodes, setCatCodes] = useState(params.item.catcode);
  const [catcodes2, setCatCodes2] = useState(params.item.catcode);
  const [eventCategorys, setEventCategorys] = useState([]);
  const [selectSubCategory, setSelectSubCategory] = useState('');
  const [eventSubCategorys, setEventSubCategorys] = useState(subCategory);

  const [contentList, setContentList] = useState(popularEvent);

  const [categoryShow, setCategoryShow] = useState(false);

  const [wishEvent, setWishEvent] = useState([]);

  const [pageText, setPageText] = useState('');

  const [orderDataList, setOrderDataList] = useState([
    pageText != '' ? pageText[1] : '리뷰순',
    pageText != '' ? pageText[2] : '최신순',
    pageText != '' ? pageText[3] : '낮은가격순',
    pageText != '' ? pageText[4] : '높은가격순',
  ]);

  const [commonText, setCommonText] = useState('');

  const pageLangSelects = async () => {
    await Api.send(
      'app_page',
      {
        cidx: user_lang != null ? user_lang.cidx : userInfo.cidx,
        code: 'eventList',
      },
      args => {
        let resultItem = args.resultItem;
        let arrItems = args.arrItems;

        if (resultItem.result === 'Y' && arrItems) {
          //console.log('이벤트 메인 언어 리스트: ', resultItem, arrItems.text);
          setPageText(arrItems.text);
          setOrderText(arrItems.text[1]);
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
          console.log('공통 언어 리스트: ', resultItem, arrItems.text);
          setCommonText(arrItems.text);
        } else {
          console.log('공통 언어 리스트 실패!', resultItem);
        }
      },
    );
  };

  useEffect(() => {
    pageLangSelects();
  }, [user_lang]);

  const wishEventAdd = wish => {
    if (!wishEvent.includes(wish)) {
      setWishEvent([...wishEvent, wish]);
    } else {
      const wishRemove = wishEvent.filter(item => wish !== item);
      setWishEvent(wishRemove);
    }
  };

  const scrollRef = useRef(null);

  const selectCategoryEvent = (category, catcodes) => {
    setCategoryShow(false);
    setSelectCategory(category);
    setCatCodes(catcodes);
    setCatCodes2(catcodes);
    // if(index != 0){
    //     setIndexNumber(index);
    // }
  };

  const [indexNumber, setIndexNumber] = useState(0);
  const [scrollIndex, setScrollIndex] = useState(0);

  const scrollMove = () => {
    scrollRef.current?.scrollToIndex({
      index: scrollIndex,
      animated: true,
    });
  };

  const categoryApi = async () => {
    await Api.send(
      'event_category',
      {cidx: user_lang != null ? user_lang.cidx : userInfo?.cidx},
      args => {
        let resultItem = args.resultItem;
        let arrItems = args.arrItems;

        if (resultItem.result === 'Y' && arrItems) {
          console.log('이벤트 카테고리', resultItem, arrItems);
          setEventCategorys(arrItems);

          if (arrItems != '') {
            setScrollIndex(params.index);
          }
        } else {
          console.log('이벤트 메인 api 실패!', resultItem);

          Alert.alert('이벤트 메인 카테고리 실패!!');
        }
      },
    );
  };

  //지역 목록
  const areaApi = () => {
    Api.send(
      'event_area',
      {cidx: user_lang != null ? user_lang.cidx : userInfo?.cidx},
      args => {
        let resultItem = args.resultItem;
        let arrItems = args.arrItems;

        if (resultItem.result === 'Y' && arrItems) {
          //console.log('지역 목록', arrItems);
          setAreaList(arrItems);
        } else {
          console.log('지역 목록 실패!', resultItem);
        }
      },
    );
  };

  //지역
  //모달
  const [areaModal, setAreaModal] = useState(false);
  const [areaList, setAreaList] = useState([]);
  const [selectArea, setSelectArea] = useState('');

  const selectAreaHandler = item => {
    setSelectArea(item);
    setAreaModal(false);
  };

  //정렬순서
  const [orderVal, setOrderVal] = useState(0);
  const [orderText, setOrderText] = useState(pageText[1]);
  const [orderModal, setOrderModal] = useState(false);

  const orderValHandler = (item, text) => {
    setOrderVal(item);
    setOrderText(text);
    setOrderModal(false);
  };

  useEffect(() => {
    if (params != '') {
      console.log(params);
      categoryApi();
      areaApi();
    }
  }, []);

  useEffect(() => {
    if (eventCategorys != '' && scrollIndex > 0) {
      scrollMove();
    }
  }, [scrollIndex]);

  const [page, setPage] = useState(1);
  const [subCategorys, setSubCategory] = useState([]);
  const [eventList, setEventList] = useState([]);

  const [eventLoading, setEventLoading] = useState(true);

  const subCategoryApi = async () => {
    await setEventLoading(true);
    await Api.send(
      'event_category',
      {
        cidx: user_lang != null ? user_lang.cidx : userInfo?.cidx,
        catcode: catcodes,
      },
      args => {
        let resultItem = args.resultItem;
        let arrItems = args.arrItems;

        if (resultItem.result === 'Y' && arrItems) {
          //console.log("이벤트 서브 카테고리", arrItems);
          setSubCategory(arrItems);
        } else {
          console.log('이벤트 서브 카테고리 실패!', resultItem);
          Alert.alert('이벤트 서브 카테고리 실패!!');
        }
      },
    );

    await Api.send(
      'event_list',
      {
        cidx: user_lang != null ? user_lang.cidx : userInfo?.cidx,
        id: userInfo?.id,
        catcode: catcodes2,
        page: page,
        orderby: orderVal,
        area: selectArea,
      },
      args => {
        let resultItem = args.resultItem;
        let arrItems = args.arrItems;

        if (resultItem.result === 'Y' && arrItems) {
          //console.log('이벤트 목록', arrItems);
          setEventList(arrItems);
        } else {
          console.log('이벤트 목록 실패!', resultItem);
          setEventList([]);
        }
      },
    );
    await setEventLoading(false);
  };

  useEffect(() => {
    if (catcodes != '' || catcodes2 != '') {
      //console.log("catcodes",catcodes)
      subCategoryApi();
    }
  }, [catcodes, catcodes2, selectArea, orderVal]);

  const [refresh, setRefresh] = useState(false);

  const refreshHandler = () => {
    subCategoryApi();
  };

  const keyExtractor = useCallback(item => item.idx.toString(), []);
  const keyExtractorMain = useCallback(item => item.idx.toString(), []);
  const keyExtractor2 = useCallback(item => item.idx.toString(), []);

  //찜 목록 추가
  const wishApiHandler = event => {
    console.log('event', event);

    let eventIdx = eventList.indexOf(event);

    let eventItem = [...eventList];

    let eventidxNum = eventItem[eventIdx].idx;

    //위시체크 변경
    if (eventItem[eventIdx].wishchk == 1) {
      eventItem[eventIdx].wishchk = 0;
      eventItem[eventIdx].wish = parseInt(eventItem[eventIdx].wish) - 1;
    } else {
      eventItem[eventIdx].wishchk = 1;
      eventItem[eventIdx].wish = parseInt(eventItem[eventIdx].wish) + 1;
    }

    setEventList(eventItem);

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

  const {top} = useSafeAreaInsets();

  return (
    <Box flex={1} backgroundColor="#fff" pt={top + 'px'}>
      <Header
        headerTitle={selectCategory != '' && selectCategory}
        backButtonStatus={true}
        navigation={navigation}
        rightButton={
          <HStack>
            <TouchableOpacity
              style={{
                marginRight: 10,
              }}
              onPress={() => navigation.navigate('SearchAll')}>
              <Image
                source={{uri: BASE_URL + '/images/searchIconBlack.png'}}
                style={{
                  width: 15,
                  height: 15,
                  resizeMode: 'contain',
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('WishList')}>
              <Image
                source={{uri: BASE_URL + '/newImg/headHeart.png'}}
                style={{
                  width: 17,
                  height: 15,
                  resizeMode: 'contain',
                }}
              />
            </TouchableOpacity>
          </HStack>
        }
      />
      <Box>
        <BoxLine />
      </Box>
      <Box borderBottomWidth={1} borderBottomColor="#D2DCE8">
        <FlatList
          ref={scrollRef}
          initialScrollIndex={indexNumber}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          data={eventCategorys}
          contentContainerStyle={{paddingRight: 20, paddingRight: 60}}
          renderItem={({item, index}) => {
            return (
              <TouchableOpacity
                style={[
                  styles.categoryButtonTop,
                  {marginLeft: 25, paddingVertical: 10},
                  item.category == selectCategory && {
                    borderBottomWidth: 4,
                    borderBottomColor: colorSelect.pink_de,
                  },
                ]}
                onPress={() =>
                  selectCategoryEvent(item.category, item.catcode)
                }>
                {item.icon != '' && (
                  <Image
                    source={{uri: item.icon}}
                    style={{width: 32, height: 32, resizeMode: 'contain'}}
                  />
                )}
                <Box mt="15px">
                  <DefText
                    text={item.category}
                    style={[
                      {color: '#B2BBC8'},
                      item.category == selectCategory && [
                        {color: colorSelect.pink_de},
                        fweight.bold,
                      ],
                    ]}
                  />
                </Box>
              </TouchableOpacity>
            );
          }}
          keyExtractor={keyExtractor}
          onScrollToIndexFailed={e => {
            console.log('scrollFailed', e);

            scrollRef.current?.scrollToOffset({
              offset: 87 * e.index,
              animated: false,
            });

            setTimeout(() => {
              if (eventCategorys.length !== 0 && scrollRef != null) {
                scrollRef.current?.scrollToIndex({
                  index: scrollIndex,
                  animated: true,
                });
              }
            }, 100);
          }}
        />
        <Box
          position={'absolute'}
          right={'0px'}
          top="0"
          backgroundColor={'#fff'}
          height="100%"
          alignItems={'center'}
          justifyContent="center"
          width="40px">
          <TouchableOpacity onPress={() => setCategoryShow(!categoryShow)}>
            <Image
              source={
                categoryShow
                  ? require('../../images/arrUp.png')
                  : require('../../images/arrDown.png')
              }
              style={{
                width: 14,
                height: 8,
                resizeMode: 'stretch',
              }}
            />
          </TouchableOpacity>
        </Box>
      </Box>
      {eventLoading ? (
        <Loading />
      ) : (
        <FlatList
          refreshControl={
            <RefreshControl refreshing={refresh} onRefresh={refreshHandler} />
          }
          ListHeaderComponent={
            <Box>
              <Box borderBottomWidth={1} borderBottomColor="#D2DCE8">
                <FlatList
                  horizontal={true}
                  data={subCategorys}
                  showsHorizontalScrollIndicator={false}
                  renderItem={({item, index}) => {
                    return (
                      <TouchableOpacity
                        style={[
                          styles.categoryButton,
                          {marginLeft: 25},
                          catcodes2 === item.catcode && {
                            borderBottomWidth: 4,
                            borderBottomColor: colorSelect.pink_de,
                          },
                          index + 1 == subCategorys.length && {marginRight: 25},
                        ]}
                        onPress={() => setCatCodes2(item.catcode)}>
                        <DefText
                          text={item.category}
                          style={[
                            {color: '#B2BBC8', lineHeight: 55},
                            catcodes2 === item.catcode && {
                              color: colorSelect.pink_de,
                              ...fweight.bold,
                            },
                          ]}
                        />
                      </TouchableOpacity>
                    );
                  }}
                  keyExtractor={keyExtractor2}
                />
              </Box>
              <HStack
                py="17px"
                px="20px"
                justifyContent={'space-between'}
                alignItems="center">
                <TouchableOpacity onPress={() => setAreaModal(true)}>
                  <HStack alignItems={'center'}>
                    <DefText
                      text={
                        selectArea != ''
                          ? selectArea
                          : pageText != ''
                          ? pageText[0]
                          : '전체지역'
                      }
                      style={[fsize.fs13, fweight.bold, {marginRight: 5}]}
                    />
                    <Image
                      source={{uri: BASE_URL + '/images/downArrApp.png'}}
                      style={{
                        width: 9,
                        height: 5,
                        resizeMode: 'contain',
                      }}
                    />
                  </HStack>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setOrderModal(true)}>
                  <HStack alignItems={'center'}>
                    <DefText
                      text={orderText}
                      style={[fsize.fs13, fweight.bold, {marginRight: 5}]}
                    />
                    <Image
                      source={{uri: BASE_URL + '/images/downArrApp.png'}}
                      style={{
                        width: 9,
                        height: 5,
                        resizeMode: 'contain',
                      }}
                    />
                  </HStack>
                </TouchableOpacity>
              </HStack>
            </Box>
          }
          data={eventList}
          keyExtractor={keyExtractorMain}
          renderItem={({item, index}) => {
            return (
              <Box px="20px">
                <Box py="20px" borderBottomWidth={1} borderColor="#E3E3E3">
                  <EventBox
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
                        cidx: params.cidx,
                      })
                    }
                    conprice={item.conprice}
                    area={item.area}
                  />
                </Box>
              </Box>
            );
          }}
          ListEmptyComponent={
            <Box style={{flex: 1, height: deviceSize.deviceHeight / 1.45}}>
              <EmptyPage
                emptyText={
                  pageText != '' ? pageText[5] : '이벤트 목록이 없습니다.'
                }
              />
            </Box>
          }
        />
      )}

      <BottomNavi screenName={name} navigation={navigation} />

      {categoryShow && (
        <Box
          position={'absolute'}
          bottom={0}
          left={0}
          backgroundColor="#fff"
          width={deviceSize.deviceWidth}
          height={deviceSize.deviceHeight / 1.37}
          px="20px"
          //p='0'
        >
          <FlatList
            data={eventCategorys}
            showsVerticalScrollIndicator={false}
            keyExtractor={keyExtractor}
            renderItem={({item, index}) => {
              return (
                <TouchableOpacity
                  style={[
                    styles.eventCategoryBox,
                    selectCategory == item.category && {
                      backgroundColor: 'rgba(210,210,223,0.15)',
                      borderColor: colorSelect.navy,
                    },
                    (index + 1) % 3 != 0 && {
                      marginRight: (deviceSize.deviceWidth - 40) * 0.035,
                    },
                  ]}
                  onPress={() =>
                    selectCategoryEvent(item.category, item.catcode)
                  }>
                  {item.icon != '' && (
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
                  )}
                  <DefText
                    text={item.category}
                    style={[styles.eventCategoryBoxText]}
                  />
                </TouchableOpacity>
              );
            }}
            numColumns={3}
          />
        </Box>
      )}

      <Modal isOpen={areaModal} onClose={() => setAreaModal(false)}>
        <Modal.Content
          p="0"
          width={deviceSize.deviceWidth - 40}
          borderRadius={0}>
          <Modal.Body p="0">
            <TouchableOpacity
              style={[styles.selectButtons]}
              onPress={() => selectAreaHandler('')}>
              <HStack alignItems={'center'} justifyContent="space-between">
                <DefText
                  text={pageText != '' ? pageText[0] : '전체'}
                  style={[
                    fsize.fs14,
                    selectArea == '' && {
                      color: colorSelect.pink_de,
                      ...fweight.bold,
                    },
                  ]}
                />
                {selectArea == '' && (
                  <CheckIcon
                    style={{
                      width: 14,
                      height: 14,
                      resizeMode: 'contain',
                      color: colorSelect.pink_de,
                    }}
                  />
                )}
              </HStack>
            </TouchableOpacity>
            {areaList != '' &&
              areaList.map((item, index) => {
                return (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.selectButtons,
                      {borderTopWidth: 1, borderTopColor: '#dfdfdf'},
                    ]}
                    onPress={() => selectAreaHandler(item)}>
                    <HStack
                      alignItems={'center'}
                      justifyContent="space-between">
                      <DefText
                        text={item}
                        style={[
                          fsize.fs14,
                          selectArea == item && {
                            color: colorSelect.pink_de,
                            ...fweight.bold,
                          },
                        ]}
                      />
                      {selectArea == item && (
                        <CheckIcon
                          style={{
                            width: 14,
                            height: 14,
                            resizeMode: 'contain',
                            color: colorSelect.pink_de,
                          }}
                        />
                      )}
                    </HStack>
                  </TouchableOpacity>
                );
              })}
          </Modal.Body>
        </Modal.Content>
      </Modal>
      <Modal isOpen={orderModal} onClose={() => setOrderModal(false)}>
        <Modal.Content
          p="0"
          width={deviceSize.deviceWidth - 40}
          borderRadius={0}>
          <Modal.Body p="0">
            <TouchableOpacity
              style={[
                styles.selectButtons,
                {borderTopWidth: 1, borderTopColor: '#dfdfdf'},
              ]}
              onPress={() => orderValHandler(0, pageText[1])}>
              <HStack alignItems={'center'} justifyContent="space-between">
                <DefText
                  text={pageText[1]}
                  style={[
                    fsize.fs14,
                    orderVal == 0 && {
                      color: colorSelect.pink_de,
                      ...fweight.bold,
                    },
                  ]}
                />
                {orderVal == 0 && (
                  <CheckIcon
                    style={{
                      width: 14,
                      height: 14,
                      resizeMode: 'contain',
                      color: colorSelect.pink_de,
                    }}
                  />
                )}
              </HStack>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.selectButtons,
                {borderTopWidth: 1, borderTopColor: '#dfdfdf'},
              ]}
              onPress={() => orderValHandler(1, pageText[2])}>
              <HStack alignItems={'center'} justifyContent="space-between">
                <DefText
                  text={pageText[2]}
                  style={[
                    fsize.fs14,
                    orderVal == 1 && {
                      color: colorSelect.pink_de,
                      ...fweight.bold,
                    },
                  ]}
                />
                {orderVal == 1 && (
                  <CheckIcon
                    style={{
                      width: 14,
                      height: 14,
                      resizeMode: 'contain',
                      color: colorSelect.pink_de,
                    }}
                  />
                )}
              </HStack>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.selectButtons,
                {borderTopWidth: 1, borderTopColor: '#dfdfdf'},
              ]}
              onPress={() => orderValHandler(2, pageText[3])}>
              <HStack alignItems={'center'} justifyContent="space-between">
                <DefText
                  text={pageText[3]}
                  style={[
                    fsize.fs14,
                    orderVal == 2 && {
                      color: colorSelect.pink_de,
                      ...fweight.bold,
                    },
                  ]}
                />
                {orderVal == 2 && (
                  <CheckIcon
                    style={{
                      width: 14,
                      height: 14,
                      resizeMode: 'contain',
                      color: colorSelect.pink_de,
                    }}
                  />
                )}
              </HStack>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.selectButtons,
                {borderTopWidth: 1, borderTopColor: '#dfdfdf'},
              ]}
              onPress={() => orderValHandler(3, pageText[4])}>
              <HStack alignItems={'center'} justifyContent="space-between">
                <DefText
                  text={pageText[4]}
                  style={[
                    fsize.fs14,
                    orderVal == 3 && {
                      color: colorSelect.pink_de,
                      ...fweight.bold,
                    },
                  ]}
                />
                {orderVal == 3 && (
                  <CheckIcon
                    style={{
                      width: 14,
                      height: 14,
                      resizeMode: 'contain',
                      color: colorSelect.pink_de,
                    }}
                  />
                )}
              </HStack>
            </TouchableOpacity>
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </Box>
  );
};

const styles = StyleSheet.create({
  categoryButtonTop: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryButton: {
    height: 55,
    justifyContent: 'center',
  },
  orderText: {
    ...fsize.fs13,
    ...fweight.bold,
    marginRight: 10,
    lineHeight: 19,
  },
  categoryAllButton: {
    width: (deviceSize.deviceWidth - 40) * 0.32,
    height: (deviceSize.deviceWidth - 40) * 0.32,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#D2DBE6',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: (deviceSize.deviceWidth - 40) * 0.02,
  },
  categoryAllButtonText: {
    ...fsize.fs13,
    ...fweight.m,
    marginTop: 10,
  },
  selectButtons: {
    height: 50,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  eventCategoryBox: {
    width: (deviceSize.deviceWidth - 40) * 0.31,
    height: (deviceSize.deviceWidth - 40) * 0.31,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    borderRadius: 15,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#D2DBE6',
  },
  eventCategoryBoxText: {
    ...fsize.fs14,
    marginTop: 10,
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
)(EventList);
