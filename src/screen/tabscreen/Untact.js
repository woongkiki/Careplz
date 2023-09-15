import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Box, HStack} from 'native-base';
import {DefButton, DefText, LabelTitle} from '../../common/BOOTSTRAP';
import Header from '../../components/Header';
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {
  colorSelect,
  deviceSize,
  fsize,
  fweight,
} from '../../common/StyleCommon';
import {hospitalMapCate} from '../../ArrayData';
import BoxLine from '../../components/BoxLine';
import {connect} from 'react-redux';
import {actionCreators as UserAction} from '../../redux/module/action/UserAction';
import Api from '../../Api';
import Loading from '../../components/Loading';
//import { SendbirdCalls } from '@sendbird/calls-react-native';
import {CALL_PERMISSIONS, usePermissions} from '../../hooks/usePermissions';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import ToastMessage from '../../components/ToastMessage';
import {useIsFocused} from '@react-navigation/native';

const Untact = props => {
  const {navigation, userInfo, user_lang} = props;

  console.log('userInfo', userInfo);

  const [appInfos, setAppInfos] = useState('');

  const appInfoHandler = () => {
    Api.send('app_info', {}, args => {
      let resultItem = args.resultItem;
      let arrItems = args.arrItems;

      if (resultItem.result === 'Y' && arrItems) {
        console.log('엡 기본정보: ', resultItem, arrItems);
        setAppInfos(arrItems);
      } else {
        console.log('엡 기본정보 실패!', resultItem);
      }
    });
  };

  useEffect(() => {
    appInfoHandler();
  }, []);

  SendbirdCalls.initialize(
    userInfo != undefined ? userInfo?.sendbird_id : appInfos.sendbird_id,
  );

  //console.log("userInfo", userInfo);

  usePermissions(CALL_PERMISSIONS);

  //console.log("userInfo", userInfo);

  const [hospitalCategoryList, setHospitalCategoryList] = useState([]);
  const [hospitalCategoryHot, setHospitalCategoryHot] = useState([]);
  const [hospitalCategorySub, setHospitalCategorySub] = useState([]);

  const [loading, setLoading] = useState(true);
  const [pageText, setPageText] = useState('');

  const pageLanguage = async () => {
    await setLoading(true);
    await Api.send(
      'app_page',
      {
        cidx: user_lang != null ? user_lang?.cidx : userInfo?.cidx,
        code: 'untactMain',
      },
      args => {
        let resultItem = args.resultItem;
        let arrItems = args.arrItems;

        if (resultItem.result === 'Y' && arrItems) {
          //console.log('비대면 진료 메인 언어 리스트: ', resultItem, arrItems.text);
          setPageText(arrItems.text);
        } else {
          console.log('비대면 진료 메인 언어 리스트 실패!', resultItem);
        }
      },
    );

    //비대면 카테고리
    await Api.send(
      'untact_category',
      {cidx: user_lang != null ? user_lang?.cidx : userInfo?.cidx},
      args => {
        let resultItem = args.resultItem;
        let arrItems = args.arrItems;

        if (resultItem.result === 'Y' && arrItems) {
          //console.log('비대면 카테고리 리스트: ', resultItem, arrItems);
          setHospitalCategoryList(arrItems);
          setHospitalCategoryHot(arrItems.hot);
          setHospitalCategorySub(arrItems.subj);
        } else {
          console.log('비대면 카테고리 리스트 실패!', resultItem);
        }
      },
    );

    await Api.send('untact_call', {id: userInfo?.id}, args => {
      let resultItem = args.resultItem;
      let arrItems = args.arrItems;

      if (resultItem.result === 'Y' && arrItems) {
        console.log('비대면 영상통화 리스트: ', resultItem, arrItems);
        setRommId(arrItems.sendbird_roomid);
      } else {
        console.log('비대면 영상통화 실패!', resultItem);
      }
    });
    await setLoading(false);
  };

  const onSignIn = () => {
    SendbirdCalls.authenticate({
      userId: userInfo?.id,
      accessToken:
        userInfo?.sendbird_token != '' ? userInfo?.sendbird_token : '',
    })
      .then(user => {
        console.log('user', user);
        // The user has been authenticated successfully.
      })
      .catch(error => {
        // Error.
        console.log('user error', error);
      });
  };

  const isFocused = useIsFocused();

  useEffect(() => {
    pageLanguage();
  }, [user_lang, isFocused]);

  useEffect(() => {
    if (isFocused) {
      onSignIn();
    }
  }, [isFocused]);

  const [roomId, setRommId] = useState('');
  //영상통화입장
  const callInApi = () => {
    Api.send(
      'untact_callIn',
      {
        id: userInfo?.id,
        sendbird_roomid: roomId,
        cidx: user_lang != null ? user_lang?.cidx : userInfo?.cidx,
      },
      args => {
        let resultItem = args.resultItem;
        let arrItems = args.arrItems;

        if (resultItem.result === 'Y' && arrItems) {
          console.log('비대면 영상통화 입장 ㄱ: ', resultItem, arrItems);
        } else {
          console.log('비대면 영상통화 입장 실패!', resultItem);
        }
      },
    );
  };

  const [enterParam, setEnterParam] = useState({
    audioEnabled: true,
    videoEnabled: true,
  });

  const enterUntactRoom = async () => {
    //만들어진 룸으로 입장
    const roomIds = roomId;
    const room = await SendbirdCalls.fetchRoomById(roomIds);

    try {
      if (room) {
        await room.enter(enterParam);
        //replace(GroupRoutes.ROOM, { roomId: room.roomId });
        await callInApi();
        navigation.navigate('UntactCall', {
          roomId: room.roomId,
          isCreate: true,
        });
      }
    } catch (e) {
      console.log('[GroupCallEnterRoomScreen::ERROR] enter - ', e);
      //alert({ title: 'Enter a room', message: getErrorMessage(e) });
      ToastMessage('채팅방에 입장할 수 없습니다.');
    }
  };

  //목록보기 모달
  const bottomSheetModalRef = useRef(null);

  const snapPoints = useMemo(() => [1, '65%']);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.snapToIndex(1);
  }, []);

  const handleSheetChanges = useCallback(index => {
    console.log('handleSheetChanges', index);
  }, []);

  const renderBackdrop = useCallback(
    props => (
      <BottomSheetBackdrop
        {...props}
        pressBehavior="close"
        appearsOnIndex={0} // 이거 추가
        disappearsOnIndex={-1} // 이거 추가
      />
    ),
    [],
  );

  useEffect(() => {
    return () => {
      console.log('clean up!!');
    };
  }, []);

  return (
    <GestureHandlerRootView style={{flex: 1, backgroundColor: '#fff'}}>
      <Header
        navigation={navigation}
        backButtonStatus={false}
        headerTitle={pageText != '' ? pageText[0] : '비대면 진료'}
        rightButton={
          <TouchableOpacity
            onPress={() => navigation.navigate('UntactClinicInfo')}>
            <Image
              source={require('../../images/untactMenuIcon.png')}
              style={{
                width: 20,
                height: 18,
                resizeMode: 'stretch',
              }}
            />
          </TouchableOpacity>
        }
      />
      {loading ? (
        <Loading />
      ) : (
        <Box flex={1} justifyContent="space-between">
          <Box>
            <Box px="20px" pt="20px">
              <HStack alignItems={'center'} justifyContent="space-between">
                <Box width="42%">
                  <DefText
                    text={pageText != '' ? pageText[1] : '요즘 많이 받는 진료'}
                    style={[styles.untactLabel]}
                  />
                </Box>
                <TouchableOpacity
                  style={[styles.schButton]}
                  onPress={handlePresentModalPress}>
                  <DefText
                    text={pageText != '' ? pageText[2] : '진료과목찾기'}
                    style={[styles.schButtonText]}
                  />
                </TouchableOpacity>
              </HStack>
            </Box>
            <Box>
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}>
                <HStack py="20px" px="20px">
                  {hospitalCategoryList != '' &&
                    hospitalCategoryList.main.map((item, index) => {
                      return (
                        <Box
                          shadow={4}
                          backgroundColor="#fff"
                          borderRadius={15}
                          key={index}
                          ml={index === 0 ? 0 : '15px'}>
                          <TouchableOpacity
                            style={[styles.hospitalCateButton]}
                            onPress={() =>
                              navigation.navigate('UntactReservation', {
                                hidx: '',
                                hname: '',
                                catcode: item.catcode,
                                selectClinic: item,
                              })
                            }>
                            <Image
                              source={{uri: item.icon}}
                              style={{
                                width: 27,
                                height: 24,
                                resizeMode: 'contain',
                              }}
                            />
                            <DefText
                              text={item.category}
                              style={[
                                fsize.fs12,
                                {color: '#434856', marginTop: 10},
                              ]}
                            />
                          </TouchableOpacity>
                        </Box>
                      );
                    })}
                </HStack>
              </ScrollView>
            </Box>
            <BoxLine />
            <Box p="20px">
              <Box
                justifyContent={'center'}
                alignItems="center"
                py="20px"
                backgroundColor={'#F5F6FA'}
                borderRadius={10}
                px="20px">
                <DefText
                  text={
                    pageText != ''
                      ? pageText[3]
                      : '우리동네 병원에서 비대면 진료 받으세요.'
                  }
                  style={[fweight.m, {color: colorSelect.navy}]}
                />
                <TouchableOpacity
                  style={[styles.mapButton]}
                  onPress={() =>
                    navigation.navigate('UntactMap', {schText: ''})
                  }>
                  <HStack>
                    <Image
                      source={require('../../images/markerIcon.png')}
                      style={{
                        width: 11,
                        height: 14,
                        resizeMode: 'contain',
                        marginRight: 10,
                      }}
                    />
                    <DefText
                      text={pageText != '' ? pageText[4] : '지도에서 병원 찾기'}
                      style={[fsize.fs12, {color: colorSelect.white}]}
                    />
                  </HStack>
                </TouchableOpacity>
              </Box>
            </Box>
          </Box>
          <Box px="20px" pb="30px">
            <DefButton
              text={pageText != '' ? pageText[5] : '영상 통화 시작하기'}
              btnStyle={[
                {
                  backgroundColor: colorSelect.pink_de,
                },
                roomId == '' && {backgroundColor: '#f7f7f7'},
              ]}
              txtStyle={[
                {
                  color: colorSelect.white,
                  ...fweight.m,
                },
                roomId == '' && {color: '#999'},
              ]}
              disabled={roomId != '' ? false : true}
              onPress={enterUntactRoom}
            />
          </Box>
        </Box>
      )}
      <BottomSheetModalProvider>
        <BottomSheet
          ref={bottomSheetModalRef}
          index={-1}
          snapPoints={snapPoints}
          onChange={handleSheetChanges}
          backdropComponent={renderBackdrop}>
          <BottomSheetScrollView
            contentContainerStyle={{backgroundColor: '#fff'}}>
            <Box p="20px">
              {hospitalCategoryHot != '' && (
                <Box>
                  <LabelTitle
                    text={pageText != '' ? pageText[6] : '인기 비대면'}
                  />
                  <HStack flexWrap={'wrap'}>
                    {hospitalCategoryHot.map((item, index) => {
                      return (
                        <TouchableOpacity
                          key={index}
                          style={[styles.modalCategory]}
                          onPress={() =>
                            navigation.navigate('UntactReservation', {
                              hidx: '',
                              hname: '',
                              catcode: item.catcode,
                              selectClinic: item,
                            })
                          }>
                          <HStack alignItems={'center'}>
                            <Box
                              width="30px"
                              height="30px"
                              justifyContent="center"
                              alignItems={'center'}>
                              <Image
                                source={{uri: item.icon}}
                                style={{
                                  width: 30,
                                  height: 30,
                                  resizeMode: 'contain',
                                }}
                              />
                            </Box>
                            <DefText
                              text={item.category}
                              style={[styles.modalCategoryText]}
                            />
                          </HStack>
                        </TouchableOpacity>
                      );
                    })}
                  </HStack>
                </Box>
              )}

              {hospitalCategorySub != '' && (
                <Box mt="40px">
                  <LabelTitle
                    text={pageText != '' ? pageText[7] : '증상별 진료'}
                  />
                  <HStack flexWrap={'wrap'}>
                    {hospitalCategorySub.map((item, index) => {
                      return (
                        <TouchableOpacity
                          key={index}
                          style={[styles.modalCategory]}
                          onPress={() =>
                            navigation.navigate('UntactReservation', {
                              hidx: '',
                              hname: '',
                              catcode: item.catcode,
                              selectClinic: item,
                            })
                          }>
                          <HStack alignItems={'center'}>
                            <Box
                              width="30px"
                              height="30px"
                              justifyContent="center"
                              alignItems={'center'}>
                              <Image
                                source={{uri: item.icon}}
                                style={{
                                  width: 30,
                                  height: 30,
                                  resizeMode: 'contain',
                                }}
                              />
                            </Box>
                            <DefText
                              text={item.category}
                              style={[styles.modalCategoryText]}
                            />
                          </HStack>
                        </TouchableOpacity>
                      );
                    })}
                  </HStack>
                </Box>
              )}
            </Box>

            {/* {
                            hospitalCategoryList.hot != "" &&
                            <Box>
                                <LabelTitle 
                                    text={ pageText != "" ? pageText[6] : "인기 비대면"}
                                />
                                <HStack 
                                    flexWrap={'wrap'}
                                >
                                {
                                    hospitalCategoryList.hot.map((item, index) => {
                                        return(
                                            <TouchableOpacity
                                                key={index}
                                                style={[styles.modalCategory]}
                                                //onPress={()=>selectClinicHandler(item)}
                                            >
                                                <HStack
                                                    alignItems={'center'}
                                                >
                                                    <Box
                                                        width='30px'
                                                        height='30px'
                                                        justifyContent='center'
                                                        alignItems={'center'}
                                                    >
                                                        <Image 
                                                            source={{uri:item.icon}}
                                                            style={{
                                                                width:30,
                                                                height:30,
                                                                resizeMode:'contain'
                                                            }}
                                                        />
                                                    </Box>
                                                    <DefText 
                                                        text={item.category}
                                                        style={[styles.modalCategoryText]}
                                                    />
                                                </HStack>
                                            </TouchableOpacity>
                                        )
                                    })
                                }
                                </HStack>
                            </Box>
                        } */}
          </BottomSheetScrollView>
        </BottomSheet>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  untactLabel: {
    ...fsize.fs18,
    ...fweight.bold,
    lineHeight: 26,
  },
  schButton: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#D2D2DF',
  },
  schButtonText: {
    ...fsize.fs12,
  },
  hospitalCateButton: {
    width: (deviceSize.deviceWidth - 40) * 0.24,
    height: (deviceSize.deviceWidth - 40) * 0.24,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    backgroundColor: '#fff',
  },
  mapButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: 'rgba(67,72,56, 0.5)',
    borderRadius: 10,
    marginTop: 10,
  },
  modalCategory: {
    width: (deviceSize.deviceWidth - 60) * 0.5,
    justifyContent: 'center',
    marginTop: 20,
    paddingHorizontal: 10,
  },
  modalCategoryText: {
    ...fsize.fs13,
    ...fweight.bold,
    marginLeft: 12,
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
)(Untact);
