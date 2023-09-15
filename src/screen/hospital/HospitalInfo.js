import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Box, HStack, Modal} from 'native-base';
import {DefButton, DefText, LabelTitle} from '../../common/BOOTSTRAP';
import EventInfoHeader from '../../components/EventInfoHeader';
import {useIsFocused} from '@react-navigation/native';
import Loading from '../../components/Loading';
import {
  Alert,
  Image,
  Platform,
  ScrollView,
  Share,
  StyleSheet,
  TextInput,
} from 'react-native';
import {
  colorSelect,
  deviceSize,
  fsize,
  fweight,
} from '../../common/StyleCommon';
import BoxLine from '../../components/BoxLine';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {BASE_URL} from '../../Utils/APIConstant';
import ReviewLineCotent from '../../components/ReviewLineCotent';
import HospitalTab from '../../components/hospitalInfo/HospitalTab';
import Checkbox from '../../components/Checkbox';
import {hospistalReview} from '../../ArrayData';
import ReviewComponent from '../../components/hospitalInfo/ReviewComponent';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import ToastMessage from '../../components/ToastMessage';
import {connect} from 'react-redux';
import {actionCreators as UserAction} from '../../redux/module/action/UserAction';
import Api from '../../Api';
import Swiper from 'react-native-swiper';
import {WebView} from 'react-native-webview';
import EventBottomButton from '../../components/EventBottomButton';
import SingoLitsComponent from '../../components/SingoLitsComponent';
import Clipboard from '@react-native-clipboard/clipboard';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import DoctorComponents from '../../components/hospitalInfo/DoctorComponents';
import Icon from 'react-native-vector-icons/MaterialIcons';
import BottomNavi from '../../components/bottom/BottomNavi';

const subject = ['내과', '소아과', '이비인후과'];

//신고하기

//병원 상세보기
const HospitalInfo = props => {
  const {navigation, route, user_lang, userInfo, userPosition} = props;
  const {params, name} = route;

  const isFocused = useIsFocused();

  const [loading, setLoading] = useState(true);
  const [hopistalInfo, setHospitalInfo] = useState('');

  const [pageText, setPageText] = useState([]);
  const [commonText, setCommonText] = useState([]);
  const [hospitalReviewList, setHospitalReview] = useState('');

  const [reviewWrite, setReviewWrite] = useState(false);

  const [singoList, setSingoList] = useState([]);

  const appLoading = async () => {
    //user_lang != null ? user_lang?.cidx : userInfo?.cidx
    await setLoading(true);
    await setSingoList([]);
    await Api.send(
      'app_page',
      {
        cidx: user_lang != null ? user_lang?.cidx : userInfo?.cidx,
        code: 'hospitalInfo',
      },
      args => {
        let resultItem = args.resultItem;
        let arrItems = args.arrItems;

        if (resultItem.result === 'Y' && arrItems) {
          //console.log('병원지도 메인 언어 리스트: ', resultItem, arrItems);
          setPageText(arrItems.text);

          setReviewListText(arrItems.text[36]);

          let singos = [...singoList];
          singos[0] = arrItems.text[55];
          singos[1] = arrItems.text[56];
          singos[2] = arrItems.text[57];
          singos[3] = arrItems.text[58];

          setSingoList(singos);
        } else {
          console.log('병원지도 메인 언어 리스트 실패!', resultItem);
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
      'hospital_detail',
      {
        idx: params.idx,
        cidx: user_lang != null ? user_lang?.cidx : userInfo?.cidx,
        id: userInfo?.id,
        lat: userPosition?.lat,
        lng: userPosition?.lng,
      },
      args => {
        let resultItem = args.resultItem;
        let arrItems = args.arrItems;

        if (resultItem.result === 'Y' && arrItems) {
          console.log('병원 상세 정보: ', resultItem, arrItems.hospital);
          setHospitalInfo(arrItems.hospital);
          setReviewWrite(arrItems.hospital.writeable);
        } else {
          console.log('병원 상세 정보 실패!', resultItem);
        }
      },
    );

    await setLoading(false);
  };

  const reviewListApi = () => {
    Api.send(
      'hospital_reviewList',
      {
        hidx: params.idx,
        id: userInfo?.id,
        cidx: user_lang != null ? user_lang?.cidx : userInfo?.cidx,
        orderby: reviewListOrder,
        isphoto: checkStatus ? '1' : '0',
      },
      args => {
        let resultItem = args.resultItem;
        let arrItems = args.arrItems;

        if (resultItem.result === 'Y' && arrItems) {
          console.log('병원 리뷰 리스트: ', resultItem, arrItems);
          setHospitalReview(arrItems);
        } else {
          console.log('병원 리뷰 리스트 실패!', resultItem);
          setHospitalReview('');
        }
      },
    );
  };

  useEffect(() => {
    if (isFocused) {
      appLoading();
    }
  }, [isFocused]);

  const reviewGoodHandler = item => {
    //console.log("review items", item);
    let hrIndx = hospitalReviewList.indexOf(item); //리뷰 인덱스 가져오기

    let hpReviews = [...hospitalReviewList]; // 리뷰 복사

    let hrReviewIdx = hpReviews[hrIndx].idx; //리뷰 인덱스

    if (hpReviews[hrIndx].recomchk == 1) {
      hpReviews[hrIndx].recomchk = 0;
      hpReviews[hrIndx].recom = parseInt(hpReviews[hrIndx].recom) - 1;
    } else {
      hpReviews[hrIndx].recomchk = 1;
      hpReviews[hrIndx].recom = parseInt(hpReviews[hrIndx].recom) + 1;
    }

    console.log(hpReviews[hrIndx]);

    setHospitalReview(hpReviews);

    Api.send(
      'hospital_reviewRecom',
      {id: userInfo?.id, idx: hrReviewIdx},
      args => {
        let resultItem = args.resultItem;
        let arrItems = args.arrItems;

        if (resultItem.result === 'Y' && arrItems) {
          console.log('리뷰 좋아요 성공: ', resultItem, arrItems);

          //reviewListApi();
          //reviewDetailApi();
        } else {
          console.log('리뷰 좋아요 실패!', resultItem);
        }
      },
    );
  };

  //탭 카테고리 선택
  const [tabCategory, setTabCategory] = useState('병원정보');

  const [timeShow, setTimeShow] = useState(false);

  const scrollRef = useRef(null);

  //맨위 병원 컴포넌츠
  const [box0, setBox0] = useState('');
  const box0Offset = y => {
    setBox0(y);
  };

  //병원정보 layOut
  const [box1, setBox1] = useState('');
  const box1Offset = y => {
    setBox1(y);
  };

  //진료정보 layOut
  const [box2, setBox2] = useState('');
  const box2Offset = y => {
    setBox2(y);
  };

  //리뷰 layOut
  const [box3, setBox3] = useState('');
  const box3Offset = y => {
    setBox3(y);
  };

  //탭 누르면 스크롤 이동
  const scrollAnimate = (yScroll, category) => {
    // console.log("yScroll", yScroll);

    // let box0Val = box0 + 5;

    // console.log(box0);

    // scrollRef.current?.scrollTo({
    //     y:yScroll + box0Val,
    //     animate:true
    // })

    setTabCategory(category);
  };

  //현재 스크롤 오프셋값 가져오기
  const [scrollOffset, setScrollOffset] = useState(0);
  const scrollOffesetHandler = y => {
    //console.log("box2",y, box0, box1, box2, box3);

    // if(y > (box3 + 200)){
    //     setTabCategory("리뷰");
    // }else if(y > (box2 + 200)){
    //     setTabCategory("진료정보");
    // }else{
    //     setTabCategory("병원정보");
    // }

    setScrollOffset(y);
  };

  //리뷰 순서정하기
  const [reviewOrderModal, setReviewOrderModal] = useState(false);
  const [reviewListOrder, setReviewListOrder] = useState('0');
  const [reviewListText, setReviewListText] = useState(pageText[36]);

  const reviewOrderHandler = order => {
    setReviewListOrder(order);
    if (order == '0') {
      setReviewListText(pageText[36]);
    } else if (order == '1') {
      setReviewListText(pageText[64]);
    } else if (order == '2') {
      setReviewListText(pageText[65]);
    }
    setReviewOrderModal(false);
  };

  //사진리뷰
  const [checkStatus, setCheckStatus] = useState(false);

  useEffect(() => {
    console.log('reviewListOrder', reviewListOrder);
    reviewListApi();
  }, [isFocused, reviewListOrder, checkStatus]);

  //리뷰 좋아요..
  const [reviewGood, setReviewGood] = useState([]);

  // const reviewGoodHandler = (idx) => {

  //     if(!reviewGood.includes(idx)){
  //         setReviewGood([...reviewGood, idx]);
  //     }else{
  //         const reviewWishRemove = reviewGood.filter(item => idx !== item);
  //         setReviewGood(reviewWishRemove);
  //     }
  // }

  //신고하기 모달
  const bottomSheetModalRef = useRef(null);

  const snapPoints = useMemo(() => [1, '48%']);

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

  const [reportIdx, setReportIdx] = useState('');
  const reportReview = idx => {
    console.log('idx', idx);
    setReportIdx(idx);
    handlePresentModalPress();
  };

  //신고하기 선택
  const [selectSingo, setSelectSingo] = useState('');

  const singoCloseHandler = () => {
    if (reportIdx == '') {
      ToastMessage(pageText[52]);
      return false;
    }

    if (selectSingo == '') {
      ToastMessage(pageText[53]);
      return false;
    }

    console.log(reportIdx, selectSingo);

    Api.send(
      'hospital_reviewReport',
      {
        idx: reportIdx,
        cidx: user_lang != null ? user_lang?.cidx : userInfo?.cidx,
        id: userInfo?.id,
        reason: selectSingo,
      },
      args => {
        let resultItem = args.resultItem;
        let arrItems = args.arrItems;

        if (resultItem.result === 'Y' && arrItems) {
          console.log('리뷰 신고하기 성공: ', resultItem, arrItems);

          ToastMessage(resultItem.message);
          bottomSheetModalRef.current?.close();
          reviewListApi();
        } else {
          console.log('리뷰 신고하기 실패!', resultItem);
          ToastMessage(resultItem.message);
        }
      },
    );
  };

  const hospitalWishAddApi = idx => {
    console.log('hospital idx', idx);

    if (userInfo == null || userInfo == undefined) {
      ToastMessage(commonText[8]);
      return false;
    }

    Api.send('hospital_wish', {idx: idx, id: userInfo?.id}, args => {
      let resultItem = args.resultItem;
      let arrItems = args.arrItems;

      if (resultItem.result === 'Y' && arrItems) {
        console.log('병원 위시리스트 추가 성공: ', resultItem, arrItems);

        appLoading();
        ToastMessage(
          resultItem.message == 'remove'
            ? '찜 목록에서 제거했습니다.'
            : '찜 목록에 추가했습니다.',
        );
      } else {
        console.log('병원 위시리스트 추가 실패!', resultItem);
        ToastMessage('찜 목록 저장에 실패하였습니다.');
      }
    });
  };

  const hospitalShare = async () => {
    await Api.send(
      'app_share',
      {
        idx: hopistalInfo.idx,
        cidx: user_lang != null ? user_lang?.cidx : userInfo?.cidx,
        type: 'hsp',
      },
      async args => {
        let arrItems = args.arrItems;
        let resultItem = args.resultItem;

        if (resultItem.result === 'Y' && arrItems) {
          console.log(arrItems);

          let link = arrItems?.link;
          let body = `케어해줘?\n\n`;
          body += `${hopistalInfo?.name}\n`;
          body += `${hopistalInfo?.address1}\n\n`;
          body += `${link}`;

          await Share.share({
            title: hopistalInfo?.name,
            message: body,
          });
        }
      },
    );
  };

  const addressCopyText = addr => {
    //ToastMessage(pageText[51]);
    Clipboard.setString(addr);
  };

  // const [test, setTest] = useState("");
  // const testChange = (text) => {
  //     setTest(text);
  // }

  const {top} = useSafeAreaInsets();

  const hospitalReservationHandler = () => {
    if (userInfo == null || userInfo == undefined) {
      ToastMessage(commonText[8]);
      return false;
    } else {
      navigation.navigate('HospitalReservationType2', {
        hidx: hopistalInfo.idx,
        hname: hopistalInfo.name,
      });
    }
  };

  return (
    <GestureHandlerRootView
      style={{flex: 1, backgroundColor: '#fff', paddingTop: top}}>
      <EventInfoHeader navigation={navigation} shareOnpress={hospitalShare} />
      {/* <TextInput 
                value={test}
                onChangeText={testChange}
            /> */}

      {/* {
                scrollOffset > 320 &&
                <HospitalTab
                    tabCategory={tabCategory}
                    onPress1={()=>scrollAnimate(box1, "병원정보")}
                    onPress2={()=>scrollAnimate(box2, "진료정보")}
                    onPress3={()=>scrollAnimate(box3, "리뷰")}
                    tabName1={ pageText != "" ? pageText[4] : "병원정보" }
                    tabName2={ pageText != "" ? pageText[5] : "진료정보" }
                    tabName3={ pageText != "" ? pageText[6] : "리뷰" }
                />
            } */}

      {loading ? (
        <Loading />
      ) : (
        <ScrollView ref={scrollRef}>
          <Box p="20px" onLayout={e => box0Offset(e.nativeEvent.layout.height)}>
            <DefText
              text={hopistalInfo.name}
              style={[styles.hospitalName]}
              lh={user_lang?.cidx == 9 ? 32 : ''}
            />

            <HStack alignItems={'center'} flexWrap={'wrap'} mt="10px">
              <HStack mt="10px" flexWrap={'wrap'}>
                <Box>
                  <DefText
                    text={hopistalInfo.meter}
                    style={[styles.hospitalInfoText]}
                  />
                </Box>
                <Box>
                  <DefText text={' · '} style={[styles.hospitalInfoText]} />
                </Box>
                <Box>
                  <DefText
                    text={
                      hopistalInfo?.address1 +
                      ' ' +
                      hopistalInfo?.address2 +
                      ' | '
                      //hopistalInfo?.category.join(',')
                    }
                    style={[styles.hospitalInfoText]}
                    lh={user_lang?.cidx == 9 ? 28 : ''}
                  />
                </Box>
              </HStack>
              {/* {
                                hopistalInfo.category != undefined &&
                                <Box mt='0px'>
                                    <DefText 
                                        text={ hopistalInfo.category.join(",")} 
                                        style={[styles.hospitalInfoText]}
                                        lh={ user_lang?.cidx == 9 ? 28 : ''}
                                    />
                                </Box>
                            } */}
            </HStack>
            <HStack alignItems={'center'}>
              <HStack alignItems={'center'} mr="10px">
                <Box
                  style={{
                    width: 9,
                    height: 9,
                    borderRadius: 9,
                    backgroundColor: colorSelect.navy,
                    marginRight: 5,
                  }}
                />
                <DefText
                  text={hopistalInfo.consulting ? pageText[3] : pageText[42]}
                  style={[styles.hospitalInfoText]}
                />
              </HStack>
              {hopistalInfo.consulting && (
                <Box>
                  <DefText
                    text={
                      hopistalInfo.today_stime.substring(0, 5) +
                      ' ~ ' +
                      hopistalInfo.today_etime.substring(0, 5)
                    }
                    style={[styles.hospitalInfoText]}
                  />
                </Box>
              )}
            </HStack>
            {hopistalInfo != '' && (
              <Swiper
                loop={true}
                height={210}
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
                  bottom: Platform.OS === 'ios' ? 10 : 10,
                }}
                backgroundColor="transparent">
                {hopistalInfo?.photo.map((item, idx) => {
                  return (
                    <Box
                      borderRadius={15}
                      overflow="hidden"
                      key={idx}
                      mt="10px">
                      <Image
                        source={{uri: item}}
                        style={{
                          width: deviceSize.deviceWidth - 40,
                          height: 200,
                          resizeMode: 'cover',
                        }}
                      />
                    </Box>
                  );
                })}
              </Swiper>
            )}
          </Box>
          <BoxLine />
          <Box>
            {/* <HospitalTab
                            tabCategory={tabCategory}
                            onPress1={()=>scrollAnimate(box1 - 50, "병원정보")}
                            onPress2={()=>scrollAnimate(box2, "진료정보")}
                            onPress3={()=>scrollAnimate(box3, "리뷰")}
                            tabName1={ pageText != "" ? pageText[4] : "병원정보" }
                            tabName2={ pageText != "" ? pageText[5] : "진료정보" }
                            tabName3={ pageText != "" ? pageText[6] : "리뷰" }
                        /> */}
            <Box>
              <Box p="20px">
                <DefText
                  text={pageText != '' ? pageText[24] : '병원소개'}
                  style={[styles.hospitalInfoTitle]}
                  lh={user_lang?.cidx == 9 ? 28 : ''}
                />
                <Box mt="15px">
                  <DefText
                    text={hopistalInfo.intro}
                    style={{
                      ...fsize.fs15,
                      color: '#707070',
                    }}
                    lh={user_lang?.cidx == 9 ? 28 : ''}
                  />
                </Box>
              </Box>
              <BoxLine />
              <Box>
                <Box p="20px">
                  <DefText
                    text={pageText != '' ? pageText[62] : '의사선생님'}
                    style={[styles.hospitalInfoTitle]}
                    lh={user_lang?.cidx == 9 ? 28 : ''}
                  />
                  <Box mt="10px">
                    <Box>
                      <DefText
                        text={
                          pageText[67] +
                          ' 6명 ·' +
                          pageText[68] +
                          ' 6명 ·' +
                          pageText[69] +
                          ' 1명'
                        }
                        style={[fsize.fs14, {color: '#707070', lineHeight: 23}]}
                      />
                    </Box>
                    {/* <HStack mt="10px">
                      <TouchableOpacity
                        style={[
                          {
                            paddingHorizontal: 10,
                            paddingVertical: 7,
                            borderRadius: 5,
                            backgroundColor: '#B2BBC8',
                          },
                        ]}>
                        <DefText
                          text={pageText[70]}
                          style={[fsize.fs13, {color: colorSelect.white}]}
                        />
                      </TouchableOpacity>
                    </HStack> */}
                  </Box>
                </Box>
                <Box pb="20px">
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{paddingHorizontal: 20}}>
                    {[...Array(8)].map((item, index) => {
                      return (
                        <Box key={index} ml={index != 0 ? '30px' : '0'}>
                          <DoctorComponents navigation={navigation} />
                        </Box>
                      );
                    })}
                  </ScrollView>
                </Box>
              </Box>
              <BoxLine />
              <Box p="20px">
                <HStack alignItems={'center'} justifyContent="space-between">
                  <DefText
                    text={pageText != '' ? pageText[25] : '위치'}
                    style={[styles.hospitalInfoTitle]}
                  />
                  <TouchableOpacity
                    style={[styles.titleButton]}
                    onPress={() =>
                      addressCopyText(
                        hopistalInfo.address1 + ' ' + hopistalInfo.address2,
                      )
                    }>
                    <DefText
                      text={pageText != '' ? pageText[26] : '주소복사'}
                      style={[styles.titleButtonText]}
                    />
                  </TouchableOpacity>
                </HStack>
                <Box mt="15px" mb="15px">
                  <DefText
                    text={hopistalInfo.address1 + ' ' + hopistalInfo.address2}
                    style={[styles.addressText]}
                    lh={user_lang?.cidx == 9 ? 26 : ''}
                  />
                  <DefText
                    text={hopistalInfo.address3}
                    style={[styles.addressText, {marginTop: 5}]}
                    lh={user_lang?.cidx == 9 ? 26 : ''}
                  />
                </Box>
                {/* <Box
                                    height='200px'
                                    borderRadius={10}
                                    backgroundColor='#f1f1f1'
                                    mt='20px'
                                >

                                </Box> */}

                <Box height="200px" borderRadius={5} overflow="hidden">
                  <WebView
                    originWhitelist={['*']}
                    source={{
                      uri:
                        BASE_URL +
                        '/hospitalInfoMap.php?idx=' +
                        hopistalInfo.idx,
                    }}
                    // startInLoadingState={true}
                    // renderLoading={()=>{
                    //     return(
                    //         <Loading />
                    //     )
                    // }}
                    style={{
                      opacity: 0.99,
                      minHeight: 1,
                    }}
                  />

                  <Box
                    position={'absolute'}
                    width={deviceSize.deviceWidth - 40}
                    height={'200px'}
                    backgroundColor="transparent">
                    <TouchableOpacity
                      style={{
                        height: 200,
                      }}
                      onPress={() =>
                        navigation.navigate('HospitalInfoMap', {
                          idx: hopistalInfo.idx,
                          name: hopistalInfo.name,
                        })
                      }></TouchableOpacity>
                  </Box>
                </Box>
              </Box>

              {hopistalInfo.tel != null && (
                <>
                  <BoxLine />
                  <Box p="20px">
                    <DefText
                      text="전화번호"
                      style={[styles.hospitalInfoTitle]}
                    />
                    <HStack
                      justifyContent={'space-between'}
                      alignItems="center"
                      mt="15px">
                      <DefText
                        text={hopistalInfo.tel}
                        style={[styles.addressText]}
                      />
                      <TouchableOpacity style={[styles.titleButton]}>
                        <DefText
                          text={pageText != '' ? pageText[63] : '전화하기'}
                          style={[styles.titleButtonText]}
                        />
                      </TouchableOpacity>
                    </HStack>
                  </Box>
                </>
              )}
            </Box>
            <BoxLine />
            <Box>
              <Box p="20px">
                <DefText
                  text={pageText != '' ? pageText[7] : '진료시간'}
                  style={[styles.hospitalInfoTitle]}
                />
                <HStack alignItems={'center'} mt="10px">
                  <Box
                    style={{
                      width: 9,
                      height: 9,
                      borderRadius: 9,
                      backgroundColor: colorSelect.navy,
                      marginRight: 5,
                    }}
                  />
                  {hopistalInfo.consulting ? (
                    <DefText
                      text={pageText != '' ? pageText[8] : '진료 중입니다.'}
                      style={{
                        ...fsize.fs13,
                        lineHeight: 17,
                        color: '#434856',
                      }}
                    />
                  ) : (
                    <DefText
                      text={pageText != '' ? pageText[42] : '휴진'}
                      style={{
                        ...fsize.fs13,
                        lineHeight: 17,
                        color: '#434856',
                      }}
                    />
                  )}
                </HStack>
                <Box
                  mt="20px"
                  p="20px"
                  backgroundColor="rgba(166,185,207,0.3)"
                  borderRadius={15}>
                  <HStack>
                    <Box style={[styles.timeBox]}>
                      <DefText
                        text={pageText != '' ? pageText[9] : '오늘'}
                        style={[styles.timeBoxLabel]}
                      />
                      <DefText
                        text={
                          hopistalInfo.today_stime.substring(0, 5) +
                          ' ~ ' +
                          hopistalInfo.today_etime.substring(0, 5)
                        }
                        style={[styles.timeBoxText]}
                      />
                    </Box>
                    <Box style={[styles.timeBox]}>
                      <DefText
                        text={pageText != '' ? pageText[10] : '점심시간'}
                        style={[styles.timeBoxLabel]}
                      />
                      <DefText
                        text={
                          hopistalInfo.rest_stime.substring(0, 5) +
                          ' ~ ' +
                          hopistalInfo.rest_etime.substring(0, 5)
                        }
                        style={[styles.timeBoxText]}
                      />
                    </Box>
                  </HStack>
                </Box>
                <Box
                  mt="20px"
                  p="20px"
                  pb="15px"
                  backgroundColor="rgba(166,185,207,0.1)"
                  borderRadius={15}>
                  <HStack flexWrap="wrap">
                    <Box style={[styles.timeBox]}>
                      <DefText
                        text={pageText != '' ? pageText[11] : '월요일'}
                        style={[styles.timeBoxLabel]}
                      />
                      {hopistalInfo.mon_able == 1 ? (
                        <DefText
                          text={
                            hopistalInfo.mon_stime.substring(0, 5) +
                            ' ~ ' +
                            hopistalInfo.mon_etime.substring(0, 5)
                          }
                          style={[styles.timeBoxText]}
                        />
                      ) : (
                        <DefText
                          text={pageText != '' ? pageText[42] : '휴진'}
                          style={[styles.timeBoxText, {color: '#FC4C4E'}]}
                        />
                      )}
                    </Box>
                    <Box style={[styles.timeBox]}>
                      <DefText
                        text={pageText != '' ? pageText[12] : '화요일'}
                        style={[styles.timeBoxLabel]}
                      />
                      {hopistalInfo.tue_able == 1 ? (
                        <DefText
                          text={
                            hopistalInfo.tue_stime.substring(0, 5) +
                            ' ~ ' +
                            hopistalInfo.tue_etime.substring(0, 5)
                          }
                          style={[styles.timeBoxText]}
                        />
                      ) : (
                        <DefText
                          text={pageText != '' ? pageText[42] : '휴진'}
                          style={[styles.timeBoxText, {color: '#FC4C4E'}]}
                        />
                      )}
                    </Box>
                  </HStack>
                  {timeShow && (
                    <Box>
                      <HStack flexWrap="wrap" mt="30px">
                        <Box style={[styles.timeBox]}>
                          <DefText
                            text={pageText != '' ? pageText[13] : '수요일'}
                            style={[styles.timeBoxLabel]}
                          />
                          {hopistalInfo.wed_able == 1 ? (
                            <DefText
                              text={
                                hopistalInfo.wed_stime.substring(0, 5) +
                                ' ~ ' +
                                hopistalInfo.wed_etime.substring(0, 5)
                              }
                              style={[styles.timeBoxText]}
                            />
                          ) : (
                            <DefText
                              text={pageText != '' ? pageText[42] : '휴진'}
                              style={[styles.timeBoxText, {color: '#FC4C4E'}]}
                            />
                          )}
                        </Box>
                        <Box style={[styles.timeBox]}>
                          <DefText
                            text={pageText != '' ? pageText[14] : '목요일'}
                            style={[styles.timeBoxLabel]}
                          />
                          {hopistalInfo.thu_able == 1 ? (
                            <DefText
                              text={
                                hopistalInfo.tue_stime.substring(0, 5) +
                                ' ~ ' +
                                hopistalInfo.tue_etime.substring(0, 5)
                              }
                              style={[styles.timeBoxText]}
                            />
                          ) : (
                            <DefText
                              text={pageText != '' ? pageText[42] : '휴진'}
                              style={[styles.timeBoxText, {color: '#FC4C4E'}]}
                            />
                          )}
                        </Box>
                      </HStack>
                      <HStack flexWrap="wrap" mt="30px">
                        <Box style={[styles.timeBox]}>
                          <DefText
                            text={pageText != '' ? pageText[15] : '금요일'}
                            style={[styles.timeBoxLabel]}
                          />
                          {hopistalInfo.fri_able == 1 ? (
                            <DefText
                              text={
                                hopistalInfo.fri_stime.substring(0, 5) +
                                ' ~ ' +
                                hopistalInfo.fri_etime.substring(0, 5)
                              }
                              style={[styles.timeBoxText]}
                            />
                          ) : (
                            <DefText
                              text={pageText != '' ? pageText[42] : '휴진'}
                              style={[styles.timeBoxText, {color: '#FC4C4E'}]}
                            />
                          )}
                        </Box>
                        <Box style={[styles.timeBox]}>
                          <DefText
                            text={pageText != '' ? pageText[16] : '토요일'}
                            style={[styles.timeBoxLabel, {color: '#0C43B7'}]}
                          />
                          {hopistalInfo.sat_able == 1 ? (
                            <DefText
                              text={
                                hopistalInfo.sat_stime.substring(0, 5) +
                                ' ~ ' +
                                hopistalInfo.sat_etime.substring(0, 5)
                              }
                              style={[styles.timeBoxText, {color: '#0C43B7'}]}
                            />
                          ) : (
                            <DefText
                              text={pageText != '' ? pageText[42] : '휴진'}
                              style={[styles.timeBoxText, {color: '#FC4C4E'}]}
                            />
                          )}
                        </Box>
                      </HStack>
                      <HStack flexWrap="wrap" mt="30px">
                        <Box style={[styles.timeBox]}>
                          <DefText
                            text={pageText != '' ? pageText[17] : '일요일'}
                            style={[styles.timeBoxLabel, {color: '#FC4C4E'}]}
                          />
                          {hopistalInfo.sun_able == 1 ? (
                            <DefText
                              text={
                                hopistalInfo.sun_stime.substring(0, 5) +
                                ' ~ ' +
                                hopistalInfo.sun_etime.substring(0, 5)
                              }
                              style={[styles.timeBoxText, {color: '#0C43B7'}]}
                            />
                          ) : (
                            <DefText
                              text={pageText != '' ? pageText[42] : '휴진'}
                              style={[styles.timeBoxText, {color: '#FC4C4E'}]}
                            />
                          )}
                        </Box>
                        <Box style={[styles.timeBox]}>
                          <DefText
                            text={pageText != '' ? pageText[18] : '공휴일'}
                            style={[styles.timeBoxLabel, {color: '#FC4C4E'}]}
                          />
                          {hopistalInfo.hol_able == 1 ? (
                            <DefText
                              text={
                                hopistalInfo.hol_stime.substring(0, 5) +
                                ' ~ ' +
                                hopistalInfo.hol_etime.substring(0, 5)
                              }
                              style={[styles.timeBoxText, {color: '#0C43B7'}]}
                            />
                          ) : (
                            <DefText
                              text={pageText != '' ? pageText[42] : '휴진'}
                              style={[styles.timeBoxText, {color: '#FC4C4E'}]}
                            />
                          )}
                        </Box>
                      </HStack>
                      {(hopistalInfo.rest_able == 1 ||
                        hopistalInfo.rest_able2 == 1) && (
                        <HStack flexWrap="wrap" mt="30px">
                          {hopistalInfo.rest_able == 1 && (
                            <Box style={[styles.timeBox]}>
                              <DefText
                                text={
                                  pageText != ''
                                    ? pageText[19]
                                    : '평일 점심시간'
                                }
                                style={[styles.timeBoxLabel]}
                              />
                              <DefText
                                text={
                                  hopistalInfo.rest_stime.substring(0, 5) +
                                  ' ~ ' +
                                  hopistalInfo.rest_etime.substring(0, 5)
                                }
                                style={[styles.timeBoxText]}
                              />
                            </Box>
                          )}
                          {hopistalInfo.rest_able2 == 1 && (
                            <Box style={[styles.timeBox]}>
                              <DefText
                                text={
                                  pageText != ''
                                    ? pageText[20]
                                    : '주말 점심시간'
                                }
                                style={[styles.timeBoxLabel]}
                              />
                              <DefText
                                text={
                                  hopistalInfo.rest_stime2.substring(0, 5) +
                                  ' ~ ' +
                                  hopistalInfo.rest_etime2.substring(0, 5)
                                }
                                style={[styles.timeBoxText]}
                              />
                            </Box>
                          )}
                        </HStack>
                      )}
                    </Box>
                  )}

                  <TouchableOpacity
                    style={{
                      width: '100%',
                      paddingTop: 15,
                      alignItems: 'center',
                      borderTopWidth: 1,
                      borderTopColor: '#E3E3E3',
                      marginTop: 20,
                    }}
                    onPress={() => setTimeShow(!timeShow)}>
                    <HStack alignItems={'center'}>
                      <Image
                        source={
                          !timeShow
                            ? require('../../images/downArrHopistal.png')
                            : require('../../images/upArrHopistal.png')
                        }
                        style={{
                          width: 13,
                          height: 7,
                          resizeMode: 'contain',
                          marginRight: 10,
                        }}
                      />
                      <DefText
                        text={timeShow ? pageText[23] : pageText[22]}
                        style={{
                          ...fsize.fs13,
                          color: '#434856',
                        }}
                      />
                    </HStack>
                  </TouchableOpacity>
                </Box>
              </Box>
              <BoxLine />
              <Box p="20px">
                <DefText
                  text={pageText != '' ? pageText[27] : '진료과목'}
                  style={[styles.hospitalInfoTitle]}
                />
                {hopistalInfo.category != '' && (
                  <HStack mt="5px" flexWrap={'wrap'}>
                    {hopistalInfo.category.map((item, index) => {
                      return (
                        <Box
                          key={index}
                          style={[styles.subjectBox]}
                          mr="10px"
                          mt="10px">
                          <DefText
                            text={item}
                            style={[styles.subjectBoxText]}
                            lh={user_lang?.cidx == 9 ? 26 : ''}
                          />
                        </Box>
                      );
                    })}
                  </HStack>
                )}
              </Box>
            </Box>
            <BoxLine />
            <Box px="20px">
              <Box pt="20px">
                <HStack alignItems={'center'} justifyContent={'space-between'}>
                  <LabelTitle
                    text={pageText[6]}
                    txtStyle={[styles.hospitalInfoTitle]}
                  />
                  {reviewWrite && (
                    <TouchableOpacity
                      style={[
                        styles.titleButton,
                        reviewWrite && {backgroundColor: colorSelect.pink_de},
                      ]}
                      disabled={reviewWrite ? false : true}
                      onPress={() =>
                        navigation.navigate('HospitalReview', hopistalInfo)
                      }>
                      <DefText
                        text={pageText != '' ? pageText[29] : '리뷰쓰기'}
                        style={[
                          styles.titleButtonText,
                          reviewWrite && {color: '#fff'},
                        ]}
                      />
                    </TouchableOpacity>
                  )}
                </HStack>
                <Box alignItems={'center'}>
                  <DefText
                    text={'별점 ' + hopistalInfo.star}
                    style={[styles.scoreGoodTextBig]}
                  />
                </Box>
                <HStack alignItems={'center'} justifyContent="center" mb="10px">
                  {hopistalInfo.star == 0 && (
                    <Image
                      source={{uri: BASE_URL + '/images/score0Big.png'}}
                      style={{
                        width: 191,
                        height: 32,
                        resizeMode: 'contain',
                        marginRight: 10,
                      }}
                    />
                  )}
                  {hopistalInfo.star == 1 && (
                    <Image
                      source={{uri: BASE_URL + '/images/score1Big.png'}}
                      style={{
                        width: 191,
                        height: 32,
                        resizeMode: 'contain',
                        marginRight: 10,
                      }}
                    />
                  )}
                  {hopistalInfo.star == 2 && (
                    <Image
                      source={{uri: BASE_URL + '/images/score2Big.png'}}
                      style={{
                        width: 191,
                        height: 32,
                        resizeMode: 'contain',
                        marginRight: 10,
                      }}
                    />
                  )}
                  {hopistalInfo.star == 3 && (
                    <Image
                      source={{uri: BASE_URL + '/images/score3Big.png'}}
                      style={{
                        width: 191,
                        height: 32,
                        resizeMode: 'contain',
                        marginRight: 10,
                      }}
                    />
                  )}
                  {hopistalInfo.star == 4 && (
                    <Image
                      source={{uri: BASE_URL + '/images/score4Big.png'}}
                      style={{
                        width: 191,
                        height: 32,
                        resizeMode: 'contain',
                        marginRight: 10,
                      }}
                    />
                  )}
                  {hopistalInfo.star == 5 && (
                    <Image
                      source={{uri: BASE_URL + '/images/score5Big.png'}}
                      style={{
                        width: 191,
                        height: 32,
                        resizeMode: 'contain',
                        marginRight: 10,
                      }}
                    />
                  )}

                  {/* <DefText
                    text={' (' + hopistalInfo.review.cnt + ')'}
                    style={[
                      styles.scoreGoodTextBig,
                      fweight.r,
                      {color: '#191919'},
                    ]}
                  /> */}
                </HStack>
                {/* <Box
                  mt="25px"
                  style={[styles.reviewButton, {maxWidth: 'auto'}]}>
                  <HStack alignItems={'center'} justifyContent="space-between">
                    <Box>
                      <DefText
                        text={pageText != '' ? pageText[43] : '진료/시술/수술'}
                        style={[styles.reviewCate]}
                      />
                      <DefText
                        text={pageText != '' ? pageText[44] : '경과가 좋아요'}
                        style={[styles.reviewTitle]}
                      />
                    </Box>
                    <DefText
                      text={hopistalInfo.review.result + '%'}
                      style={[styles.reviewPercent]}
                    />
                  </HStack>
                  <HStack
                    alignItems={'center'}
                    justifyContent="space-between"
                    mt="20px">
                    <Box>
                      <DefText
                        text={pageText != '' ? pageText[45] : '서비스 친절도'}
                        style={[styles.reviewCate]}
                      />
                      <DefText
                        text={pageText != '' ? pageText[46] : '만족스러워요'}
                        style={[styles.reviewTitle]}
                      />
                    </Box>
                    <DefText
                      text={hopistalInfo.review.service + '%'}
                      style={[styles.reviewPercent]}
                    />
                  </HStack>
                  <HStack
                    alignItems={'center'}
                    justifyContent="space-between"
                    mt="20px">
                    <Box>
                      <DefText
                        text={pageText != '' ? pageText[47] : '시설 만족도'}
                        style={[styles.reviewCate]}
                      />
                      <DefText
                        text={pageText != '' ? pageText[48] : '매우 청결해요'}
                        style={[styles.reviewTitle]}
                      />
                    </Box>
                    <DefText
                      text={hopistalInfo.review.clean + '%'}
                      style={[styles.reviewPercent]}
                    />
                  </HStack>
                </Box> */}
              </Box>
              <HStack
                alignItems={'center'}
                justifyContent="space-between"
                flexWrap={'wrap'}
                mt="20px"
                pb="10px">
                <HStack width={(deviceSize.deviceWidth - 40) * 0.6}>
                  <TouchableOpacity onPress={() => setReviewOrderModal(true)}>
                    <HStack alignItems={'center'}>
                      <DefText
                        text={reviewListText}
                        style={[fsize.fs14, fweight.bold]}
                      />
                      <Icon name={'keyboard-arrow-down'} size={18} />
                    </HStack>
                  </TouchableOpacity>
                  {/* <TouchableOpacity
                    style={{marginRight: 14, marginTop: 20}}
                    onPress={() => setReviewListOrder('0')}>
                    <HStack alignItems={'center'}>
                      <Box
                        width="16px"
                        height="16px"
                        borderRadius={'16px'}
                        backgroundColor="#D5D5D5"
                        alignItems={'center'}
                        justifyContent="center"
                        mr="5px">
                        {reviewListOrder == '0' && (
                          <Box
                            width="10px"
                            height="10px"
                            borderRadius="10px"
                            backgroundColor={colorSelect.navy}
                          />
                        )}
                      </Box>
                      <DefText
                        text={pageText != '' ? pageText[35] : '추천순'}
                        style={[
                          styles.radioButtonText,
                          reviewListOrder == '0' && {
                            color: colorSelect.navy,
                            ...fweight.bold,
                          },
                        ]}
                      />
                    </HStack>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{marginTop: 20, marginBottom: 20}}
                    onPress={() => setReviewListOrder('1')}>
                    <HStack alignItems={'center'}>
                      <Box
                        width="16px"
                        height="16px"
                        borderRadius={'16px'}
                        backgroundColor="#D5D5D5"
                        alignItems={'center'}
                        justifyContent="center"
                        mr="5px">
                        {reviewListOrder == '1' && (
                          <Box
                            width="10px"
                            height="10px"
                            borderRadius="10px"
                            backgroundColor={colorSelect.navy}
                          />
                        )}
                      </Box>
                      <DefText
                        text={pageText != '' ? pageText[36] : '최신순'}
                        style={[
                          styles.radioButtonText,
                          reviewListOrder == '1' && {
                            color: colorSelect.navy,
                            ...fweight.bold,
                          },
                        ]}
                      />
                    </HStack>
                  </TouchableOpacity> */}
                </HStack>

                <Checkbox
                  checkboxText={pageText != '' ? pageText[37] : '사진리뷰'}
                  onPress={() => setCheckStatus(!checkStatus)}
                  checkStatus={checkStatus}
                  txtStyle={{...fsize.fs14}}
                />
              </HStack>
              {hospitalReviewList != '' ? (
                <Box>
                  {hospitalReviewList.map((item, index) => {
                    return (
                      <ReviewComponent
                        key={index}
                        star={item.star}
                        reviewContent={item.content}
                        reviewDate={item.wdate}
                        reviewWriter={item.name}
                        recom={item.recom}
                        reviewOnpress={() =>
                          navigation.navigate('ReviewList', {idx: item.idx})
                        }
                        singoOnprees={() => reportReview(item.idx)}
                        singoText={pageText != '' ? pageText[40] : '신고'}
                        reviewDel={userInfo?.idx === item.idx ? true : false}
                        photos={item?.photo}
                        visitCeriText={
                          pageText != '' ? pageText[54] : '방문인증'
                        }
                        reviewWishOnpress={() => reviewGoodHandler(item)}
                        reviewanswer={item.answer}
                        reviewAnswerImage={item.hicon}
                        hname={item.hname}
                        navigation={navigation}
                        reviews={item}
                        updateStatus={item.editable}
                        updateText={pageText[61]}
                        updateContent={'hsp'}
                      />
                    );
                  })}
                </Box>
              ) : (
                <Box py="40px" alignItems={'center'} justifyContent={'center'}>
                  <DefText
                    text={pageText != '' ? pageText[50] : '리뷰가 없습니다.'}
                    style={{...fsize.fs14}}
                  />
                </Box>
              )}
            </Box>
          </Box>
        </ScrollView>
      )}

      <Box shadow={9} backgroundColor="#fff">
        <EventBottomButton
          navigation={navigation}
          reservationOnpree={hospitalReservationHandler}
          hospitalCheck={true}
          wishChk={hopistalInfo.wishchk}
          rText={pageText != '' ? pageText[49] : '예약하기'}
          wishButtonOnpress={() => hospitalWishAddApi(hopistalInfo.idx)}
        />
        <BottomNavi screenName={name} navigation={navigation} />
        {/* {
                    ( hopistalInfo.consulting && hopistalInfo.isrsv == 1 )&&
                    <EventBottomButton
                        navigation={navigation}
                        reservationOnpree={() => navigation.navigate("HospitalReservationType", {"hidx":hopistalInfo.idx, 'hname':hopistalInfo.name})}
                        hospitalCheck={true}
                        wishChk={hopistalInfo.wishchk}
                        rText={ pageText != "" ? pageText[49] : "예약하기"}
                    />
                } */}
      </Box>

      <Modal
        isOpen={reviewOrderModal}
        onClose={() => setReviewOrderModal(false)}>
        <Modal.Content
          p="0"
          backgroundColor={'#fff'}
          width={deviceSize.deviceWidth - 40}>
          <Modal.Body p="0">
            <TouchableOpacity
              onPress={() => reviewOrderHandler('0')}
              style={{
                paddingVertical: 15,
                paddingHorizontal: 20,
                borderBottomWidth: 1,
                borderBottomColor: colorSelect.gray_dfdfdf,
              }}>
              <DefText
                text={pageText[36]}
                style={[
                  fsize.fs14,
                  reviewListOrder == '0' && fweight.bold,
                  {
                    lineHeight: 17,
                    color:
                      reviewListOrder == '0' ? colorSelect.pink_de : '#000',
                  },
                ]}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => reviewOrderHandler('1')}
              style={{
                paddingVertical: 15,
                paddingHorizontal: 20,
                borderBottomWidth: 1,
                borderBottomColor: colorSelect.gray_dfdfdf,
              }}>
              <DefText
                text={pageText[64]}
                style={[
                  fsize.fs14,
                  reviewListOrder == '1' && fweight.bold,
                  {
                    lineHeight: 17,
                    color:
                      reviewListOrder == '1' ? colorSelect.pink_de : '#000',
                  },
                ]}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => reviewOrderHandler('2')}
              style={{paddingVertical: 15, paddingHorizontal: 20}}>
              <DefText
                text={pageText[65]}
                style={[
                  fsize.fs14,
                  reviewListOrder == '2' && fweight.bold,
                  {
                    lineHeight: 17,
                    color:
                      reviewListOrder == '2' ? colorSelect.pink_de : '#000',
                  },
                ]}
              />
            </TouchableOpacity>
          </Modal.Body>
        </Modal.Content>
      </Modal>

      <BottomSheetModalProvider>
        <BottomSheet
          ref={bottomSheetModalRef}
          index={-1}
          snapPoints={snapPoints}
          onChange={handleSheetChanges}
          backdropComponent={renderBackdrop}>
          <Box p="20px">
            <LabelTitle
              text={
                pageText != '' ? pageText[59] : '신고하는 이유를 선택해 주세요.'
              }
            />
            <Box>
              {singoList.map((item, index) => {
                return (
                  <SingoLitsComponent
                    key={index}
                    reason={item}
                    onPress={() => setSelectSingo(index)}
                    idx={index}
                    selectReason={selectSingo}
                  />
                );
              })}
            </Box>
            <Box mt="30px">
              <DefButton
                btnStyle={{backgroundColor: colorSelect.pink_de}}
                text={pageText != '' ? pageText[60] : '신고하기'}
                txtStyle={{color: '#fff', ...fweight.m}}
                onPress={singoCloseHandler}
                disabled={false}
              />
            </Box>
          </Box>
        </BottomSheet>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  hospitalName: {
    ...fsize.fs23,
    ...fweight.bold,
    lineHeight: 28,
  },
  hospitalInfoText: {
    ...fsize.fs15,
    lineHeight: 20,
    color: '#434856',
  },
  tabButton: {
    width: deviceSize.deviceWidth / 3,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabButtonText: {
    ...fsize.fs14,
    color: '#191919',
    lineHeight: 50,
  },
  timeBox: {
    width: (deviceSize.deviceWidth - 80) * 0.5,
  },
  timeBoxLabel: {
    ...fsize.fs13,
    ...fweight.bold,
    color: '#191919',
  },
  timeBoxText: {
    ...fsize.fs15,
    color: '#191919',
    marginTop: 10,
  },
  hospitalInfoTitle: {
    ...fsize.fs20,
    ...fweight.bold,
    lineHeight: 23,
  },
  titleButton: {
    paddingHorizontal: 10,
    height: 28,
    borderRadius: 10,
    backgroundColor: 'rgba(210, 210, 223, 0.5)',
    justifyContent: 'center',
  },
  titleButtonText: {
    ...fsize.fs12,
    lineHeight: 28,
  },
  addressText: {
    ...fsize.fs14,
    color: '#434856',
  },
  subjectBox: {
    height: 40,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: '#D2D2DF',
    justifyContent: 'center',
  },
  subjectBoxText: {
    ...fsize.fs14,
    lineHeight: 40,
  },
  radioButtonText: {
    ...fsize.fs12,
    lineHeight: 16,
    color: '#B2BBC8',
  },
  scoreGoodText: {
    ...fsize.fs17,
    ...fweight.bold,
    lineHeight: 19,
    marginLeft: 10,
  },
  scoreGoodTextBig: {
    ...fsize.fs18,
    ...fweight.bold,
    color: '#B2BBC8',
    lineHeight: 26,
    marginBottom: 10,
  },
  reviewText: {
    ...fsize.fs13,
    ...fweight.m,
    lineHeight: 19,
    color: '#8C9095',
    marginRight: 5,
  },
  reviewButton: {
    backgroundColor: 'rgba(255,127,178, 0.1)',
    borderRadius: 10,
    overflow: 'hidden',
    padding: 20,
    maxWidth: 260,
  },
  reviewButtonText: {
    ...fsize.fs13,
    ...fweight.m,
  },
  reviewCate: {
    ...fsize.fs12,
    ...fweight.bold,
    lineHeight: 17,
    color: '#B2BBC8',
  },
  reviewTitle: {
    lineHeight: 21,
    marginTop: 5,
  },
  reviewPercent: {
    ...fsize.fs24,
    ...fweight.bold,
    lineHeight: 29,
  },
});

export default connect(
  ({User}) => ({
    userInfo: User.userInfo, //회원정보
    user_lang: User.user_lang,
    userPosition: User.userPosition,
  }),
  dispatch => ({
    member_login: user => dispatch(UserAction.member_login(user)), //로그인
    languageSet: user => dispatch(UserAction.languageSet(user)), //선택언어
  }),
)(HospitalInfo);
