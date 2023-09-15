import React, {useEffect, useState} from 'react';
import {Box, HStack} from 'native-base';
import {DefButton, DefText} from '../../../common/BOOTSTRAP';
import Header from '../../../components/Header';
import {Image, ScrollView, StyleSheet, TouchableOpacity} from 'react-native';
import {
  colorSelect,
  deviceSize,
  fsize,
  fweight,
} from '../../../common/StyleCommon';
import {popularEvent, wishHospitalList} from '../../../ArrayData';
import EmptyPage from '../../../components/EmptyPage';
import EventBox from '../../../components/EventBox';
import {connect} from 'react-redux';
import {actionCreators as UserAction} from '../../../redux/module/action/UserAction';
import Loading from '../../../components/Loading';
import Api from '../../../Api';
import {useIsFocused} from '@react-navigation/native';
import ToastMessage from '../../../components/ToastMessage';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import BottomNavi from '../../../components/bottom/BottomNavi';

const wishCategoryList = ['병원', '이벤트'];

//나의 찜
const WishList = props => {
  const {navigation, userInfo, user_lang, route} = props;
  const {name} = route;

  const {top} = useSafeAreaInsets();

  const [loading, setLoading] = useState(true);
  const [wishCategory, setWishCategory] = useState('hsp');

  const [wisthListHospital, setWishListHospital] = useState([]);
  const [wisthListEvent, setWishListEvent] = useState([]);

  const [pageText, setPageText] = useState('');

  //찜
  const [wishEvent, setWishEvent] = useState([0, 1, 2]);

  const isFocused = useIsFocused();

  const wishEventAdd = wish => {
    if (!wishEvent.includes(wish)) {
      setWishEvent([...wishEvent, wish]);
    } else {
      const wishRemove = wishEvent.filter(item => wish !== item);
      setWishEvent(wishRemove);
    }
  };

  const wishItemList = async () => {
    await setLoading(true);
    //user_lang != null ? user_lang?.cidx : userInfo?.cidx
    await Api.send(
      'app_page',
      {
        cidx: user_lang != null ? user_lang?.cidx : userInfo?.cidx,
        code: 'wishList',
      },
      args => {
        let resultItem = args.resultItem;
        let arrItems = args.arrItems;

        if (resultItem.result === 'Y' && arrItems) {
          // console.log('찜목록 언어 리스트: ', resultItem, arrItems.text);
          setPageText(arrItems.text);
        } else {
          console.log('찜목록 수정 언어 리스트 실패!', resultItem);
        }
      },
    );
    await Api.send(
      'member_wish',
      {
        id: userInfo?.id,
        cidx: user_lang != null ? user_lang?.cidx : userInfo?.cidx,
        wtype: wishCategory,
      },
      args => {
        let resultItem = args.resultItem;
        let arrItems = args.arrItems;

        if (resultItem.result === 'Y' && arrItems) {
          console.log('찜목록 정보 가져오기 성공: ', resultItem, arrItems);

          if (wishCategory == 'hsp') {
            setWishListHospital(arrItems);
          } else {
            setWishListEvent(arrItems);
          }
        } else {
          console.log('찜목록 정보 가져오기 실패!', resultItem);

          if (wishCategory == 'hsp') {
            setWishListHospital([]);
          } else {
            setWishListEvent([]);
          }
        }
      },
    );
    await setLoading(false);
  };

  useEffect(() => {
    if (isFocused) {
      wishItemList();
    }
  }, [wishCategory, isFocused]);

  //병원 찾아보기
  const hospitalGo = () => {
    navigation.navigate('TabNavi', {
      screen: 'HospitalMap',
      params: {
        schText: '',
      },
    });
  };

  const EventGo = () => {
    navigation.navigate('TabNavi', {
      screen: 'Event',
    });
  };

  const hospitalWishEvent = idx => {
    Api.send('hospital_wish', {idx: idx, id: userInfo?.id}, args => {
      let resultItem = args.resultItem;
      let arrItems = args.arrItems;

      if (resultItem.result === 'Y' && arrItems) {
        console.log('병원 위시리스트 추가 성공: ', resultItem, arrItems);

        ToastMessage(
          resultItem.message == 'remove' ? pageText[8] : pageText[9],
        );
        wishItemList();
      } else {
        console.log('병원 위시리스트 추가 실패!', resultItem);
      }
    });
  };

  const eventWisthEvent = idx => {
    //console.log("이벤트 인덱스", idx);
    Api.send('event_wish', {id: userInfo?.id, idx: idx}, args => {
      let resultItem = args.resultItem;
      let arrItems = args.arrItems;

      if (resultItem.result === 'Y' && arrItems) {
        //console.log('이벤트 찜목록 추가 결과: ', resultItem);

        if (resultItem.message == 'add') {
          ToastMessage(pageText[9]);
        } else {
          ToastMessage(pageText[8]);
        }

        wishItemList();
      } else {
        console.log('이벤트 찜목록 추가 실패!', resultItem);
      }
    });
  };

  return (
    <Box flex={1} backgroundColor="#fff" pt={top + 'px'}>
      <Header
        headerTitle={pageText != '' ? pageText[0] : '찜목록'}
        backButtonStatus={true}
        navigation={navigation}
      />
      {loading ? (
        <Loading />
      ) : (
        <>
          <HStack
            justifyContent={'space-around'}
            alignItems={'center'}
            borderBottomWidth={1}
            borderBottomColor="#D2DCE8">
            <TouchableOpacity
              style={[styles.cateButton]}
              onPress={() => setWishCategory('hsp')}>
              <HStack justifyContent={'center'} alignItems="center">
                <Box py="16px">
                  <DefText
                    text={pageText != '' ? pageText[1] : '병원'}
                    style={[
                      styles.cateButtonText,
                      wishCategory == 'hsp' && [
                        {color: colorSelect.pink_de},
                        fweight.bold,
                      ],
                    ]}
                  />
                  {wishCategory == 'hsp' && (
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
                </Box>
              </HStack>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.cateButton]}
              onPress={() => setWishCategory('evt')}>
              <HStack justifyContent={'center'} alignItems="center">
                <Box py="16px">
                  <DefText
                    text={pageText != '' ? pageText[2] : '이벤트'}
                    style={[
                      styles.cateButtonText,
                      wishCategory == 'evt' && [
                        {color: colorSelect.pink_de},
                        fweight.bold,
                      ],
                    ]}
                  />
                  {wishCategory == 'evt' && (
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
                </Box>
              </HStack>
            </TouchableOpacity>
          </HStack>
          {wisthListHospital != '' || wisthListEvent != '' ? (
            <>
              {wishCategory == 'hsp' ? (
                wisthListHospital != '' ? (
                  <ScrollView>
                    <Box px="20px">
                      {wisthListHospital.map((item, index) => {
                        return (
                          <Box key={index}>
                            <TouchableOpacity
                              style={[styles.wisthHospitalButton]}
                              onPress={() =>
                                navigation.navigate('HospitalInfo', item)
                              }>
                              <HStack alignItems={'center'}>
                                <Box borderRadius={10}>
                                  <Image
                                    source={{uri: item.icon}}
                                    style={{
                                      width:
                                        (deviceSize.deviceWidth - 40) * 0.228,
                                      height:
                                        (deviceSize.deviceWidth - 40) * 0.228,
                                      resizeMode: 'contain',
                                      borderRadius: 10,
                                    }}
                                  />
                                </Box>
                                <Box
                                  pl="20px"
                                  justifyContent={'center'}
                                  width={(deviceSize.deviceWidth - 40) * 0.7}>
                                  <DefText
                                    text={item.name}
                                    style={[
                                      fweight.bold,
                                      fsize.fs17,
                                      {color: '#191919'},
                                    ]}
                                  />
                                  <DefText
                                    text={
                                      item.consulting
                                        ? pageText[6]
                                        : pageText[7]
                                    }
                                    style={[
                                      fweight.m,
                                      fsize.fs15,
                                      {color: '#B2BBC8', marginTop: 10},
                                    ]}
                                  />
                                </Box>
                              </HStack>
                            </TouchableOpacity>
                            <Box
                              position={'absolute'}
                              top="50%"
                              right="0"
                              marginTop="-11px">
                              <TouchableOpacity
                                onPress={() => hospitalWishEvent(item.idx)}>
                                <Image
                                  source={require('../../../images/bookmarkIconPink.png')}
                                  style={{
                                    width: 18,
                                    height: 23,
                                    resizeMode: 'contain',
                                  }}
                                />
                              </TouchableOpacity>
                            </Box>
                          </Box>
                        );
                      })}
                    </Box>
                  </ScrollView>
                ) : (
                  <Box flex={1}>
                    <EmptyPage
                      emptyText={
                        pageText != '' ? pageText[3] : '찜목록이 비어있습니다.'
                      }
                    />
                    <Box p="20px">
                      <DefButton
                        text={pageText != '' ? pageText[4] : '병원 찾아보기'}
                        btnStyle={{
                          backgroundColor: colorSelect.pink_de,
                        }}
                        txtStyle={[{color: colorSelect.white}, fweight.m]}
                        onPress={hospitalGo}
                      />
                    </Box>
                  </Box>
                )
              ) : wisthListEvent != '' ? (
                <ScrollView>
                  {wisthListEvent.map((item, index) => {
                    return (
                      <Box px="20px" key={index}>
                        <EventBox
                          mt={index != 0 ? 40 : 30}
                          uri={item.thumb}
                          eventName={item.name}
                          hospital={item.hname}
                          score={item.star}
                          good={item.wish}
                          percent={item.per + '%'}
                          orPrice={item.stdprice}
                          price={item.price}
                          values={item.icon}
                          bookmarkonPress={() => eventWisthEvent(item.idx)}
                          bookmarData={item.wishchk}
                          eventInfoMove={() =>
                            navigation.navigate('EventInfo', {
                              idx: item.idx,
                              cidx: user_lang?.cidx,
                            })
                          }
                          conprice={item.conprice}
                          area={item.area}
                        />
                      </Box>
                    );
                  })}
                </ScrollView>
              ) : (
                <Box flex={1}>
                  <EmptyPage
                    emptyText={
                      pageText != '' ? pageText[3] : '찜목록이 비어있습니다.'
                    }
                  />
                  <Box p="20px">
                    <DefButton
                      text={pageText != '' ? pageText[5] : '이벤트 찾아보기'}
                      btnStyle={{
                        backgroundColor: '#F1F1F1',
                        marginTop: 10,
                      }}
                      txtStyle={[fweight.m]}
                      onPress={EventGo}
                    />
                  </Box>
                </Box>
              )}
            </>
          ) : (
            <Box flex={1}>
              <EmptyPage
                emptyText={
                  pageText != '' ? pageText[3] : '찜목록이 비어있습니다.'
                }
              />
              <Box p="20px">
                <DefButton
                  text={pageText != '' ? pageText[4] : '병원 찾아보기'}
                  btnStyle={{
                    backgroundColor: colorSelect.pink_de,
                  }}
                  txtStyle={[{color: colorSelect.white}, fweight.m]}
                  onPress={hospitalGo}
                />
                <DefButton
                  text={pageText != '' ? pageText[5] : '이벤트 찾아보기'}
                  btnStyle={{
                    backgroundColor: '#F1F1F1',
                    marginTop: 10,
                  }}
                  txtStyle={[fweight.m]}
                  onPress={EventGo}
                />
              </Box>
            </Box>
          )}
        </>
      )}
      <BottomNavi screenName={name} navigation={navigation} />
    </Box>
  );
};

const styles = StyleSheet.create({
  cateButton: {
    width: (deviceSize.deviceWidth - 40) * 0.5,
  },
  cateButtonText: {
    ...fsize.fs15,
    color: '#D2DCE8',
  },
  wisthHospitalButton: {
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E3E3E3',
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
  }),
)(WishList);
