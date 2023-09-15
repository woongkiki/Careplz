import React, {useEffect, useState, useRef, useMemo, useCallback} from 'react';
import {Box, HStack} from 'native-base';
import {DefButton, DefText, LabelTitle} from '../../common/BOOTSTRAP';
import EventInfoHeader from '../../components/EventInfoHeader';
import {
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Share,
} from 'react-native';
import {BASE_URL} from '../../Utils/APIConstant';
import {
  colorSelect,
  deviceSize,
  fsize,
  fweight,
} from '../../common/StyleCommon';
import {numberFormat, textLengthOverCut} from '../../common/DataFunction';
import BoxLine from '../../components/BoxLine';
import EventReviewBox from '../../components/EventReviewBox';
import {recommendEvent} from '../../ArrayData';
import EventBottomButton from '../../components/EventBottomButton';
import Api from '../../Api';
import Loading from '../../components/Loading';
import {connect} from 'react-redux';
import {actionCreators as UserAction} from '../../redux/module/action/UserAction';
import messaging from '@react-native-firebase/messaging';
import moment from 'moment';
import AutoHeightImage from 'react-native-auto-height-image';
import Checkbox from '../../components/Checkbox';
import {useIsFocused} from '@react-navigation/native';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import SingoLitsComponent from '../../components/SingoLitsComponent';
import ToastMessage from '../../components/ToastMessage';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import FixButtons from '../../components/FixButtons';
import BottomNavi from '../../components/bottom/BottomNavi';
import WebView from 'react-native-webview';

const review = [0, 1, 2, 3];

const singoList = [
  '음란성 게시글',
  '욕설 / 영업방해',
  '개인정보 / 저작권 침해',
  '기타 부적절한 내용',
];

//이벤트 상세페이지
const EventInfo = props => {
  const {navigation, route, userInfo, user_lang} = props;
  const {params, name} = route;

  //console.log("params", params);

  const [loading, setLoading] = useState(true);
  const [selectTab, setSelectTab] = useState('1');

  const [otherEvent, setOtherEvent] = useState(recommendEvent);

  const [eventInfo, setEventInfo] = useState('');
  const [eventInfoReview, setEventInfoReview] = useState([]);
  const [eventRelation, setEventRelation] = useState([]);

  const wons = user_lang?.cidx != 0 ? 'won' : '원';

  const [pageText, setPageText] = useState('');

  const [reviewWrite, setReviewWrite] = useState(false);

  const [commonText, setCommonText] = useState('');

  const eventInfoApi = async () => {
    const token = await messaging().getToken(); // 앱 토큰

    await setLoading(true);
    await Api.send(
      'app_page',
      {
        cidx: user_lang != null ? user_lang?.cidx : userInfo?.cidx,
        code: 'eventInfo',
      },
      args => {
        let resultItem = args.resultItem;
        let arrItems = args.arrItems;

        if (resultItem.result === 'Y' && arrItems) {
          //console.log('병원이벤트 상세 언어 리스트: ', resultItem, arrItems);
          setPageText(arrItems.text);

          setDayText(arrItems.text[5] + ' ');
          setHText(arrItems.text[6] + ' ');
          setMText(arrItems.text[7] + ' ');
          setSText(arrItems.text[8] + ' ');

          setSingoDataList([
            arrItems.text[26],
            arrItems.text[27],
            arrItems.text[28],
            arrItems.text[29],
          ]);
        } else {
          console.log('병원이벤트 상세 언어 실패!', resultItem);
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
          //console.log('공통 언어 리스트: ', resultItem, arrItems.text);
          setCommonText(arrItems.text);
        } else {
          console.log('공통 언어 리스트 실패!', resultItem);
        }
      },
    );
    await Api.send(
      'event_detail',
      {
        idx: params.idx,
        cidx: user_lang != null ? user_lang.cidx : userInfo?.cidx,
        id: userInfo?.id,
        token: token,
      },
      args => {
        let resultItem = args.resultItem;
        let arrItems = args.arrItems;

        if (resultItem.result === 'Y' && arrItems) {
          console.log('이벤트 상세', arrItems.event);
          setEventInfo(arrItems.event);
          setEventInfoReview(arrItems.review);
          setEventRelation(arrItems.relation);
          setReviewWrite(arrItems.writeable);

          if (arrItems.event != '') {
            CountDownTimer(moment(arrItems.event.edate).format(''));
          }
        } else {
          console.log('이벤트 상세 실패!', resultItem);
        }
      },
    );
    await setLoading(false);
  };

  const [reviewList, setReviewList] = useState('');

  //리뷰 순서정하기
  const [reviewListOrder, setReviewListOrder] = useState('0');

  //사진리뷰
  const [checkStatus, setCheckStatus] = useState(false);

  const eventReviewApi = () => {
    Api.send(
      'event_reviewList',
      {
        heidx: params.idx,
        cidx: user_lang != null ? user_lang.cidx : userInfo?.cidx,
        id: userInfo?.id,
        orderby: reviewListOrder,
        isphoto: checkStatus ? '1' : '0',
      },
      args => {
        let resultItem = args.resultItem;
        let arrItems = args.arrItems;

        if (resultItem.result === 'Y' && arrItems) {
          console.log('이벤트 리뷰 목록 성공', arrItems);
          setReviewList(arrItems);
        } else {
          console.log('이벤트 리뷰 목록 실패!', resultItem);
          setReviewList('');
        }
      },
    );
  };

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      eventInfoApi();
    }
  }, [isFocused, user_lang]);

  const [timerCont, setTimerCont] = useState('-');
  const [dayText, setDayText] = useState('일 ');
  const [hText, setHText] = useState('시간 ');
  const [mText, setMText] = useState('분 ');
  const [sText, setSText] = useState('초 ');

  let timer;

  //카운트다운
  const CountDownTimer = date => {
    let _vDate = new Date(date);

    let _second = 1000;
    let _minute = _second * 60;
    let _hour = _minute * 60;
    let _day = _hour * 24;

    function showRemaining() {
      let now = new Date();
      let distDt = _vDate - now;

      if (distDt < 0) {
        clearInterval(timer);
        console.log('이벤트 종료!!');
        return;
      }

      let days = Math.floor(distDt / _day);
      let hours = Math.floor((distDt % _day) / _hour);
      let minutes = Math.floor((distDt % _hour) / _minute);
      let seconds = Math.floor((distDt % _minute) / _second);

      Api.send(
        'app_page',
        {
          cidx: user_lang != null ? user_lang?.cidx : userInfo?.cidx,
          code: 'eventInfo',
        },
        args => {
          let resultItem = args.resultItem;
          let arrItems = args.arrItems;

          if (resultItem.result === 'Y' && arrItems) {
            //console.log('병원이벤트 상세 언어 리스트: ', resultItem, arrItems);

            if (user_lang?.cidx == 0) {
              setTimerCont(
                days +
                  arrItems.text[5] +
                  ' ' +
                  hours +
                  arrItems.text[6] +
                  ' ' +
                  minutes +
                  arrItems.text[7] +
                  ' ' +
                  seconds +
                  arrItems.text[8] +
                  ' 남음',
              );
            } else {
              setTimerCont(
                days +
                  arrItems.text[5] +
                  ' ' +
                  hours +
                  arrItems.text[6] +
                  ' ' +
                  minutes +
                  arrItems.text[7] +
                  ' ' +
                  seconds +
                  arrItems.text[8],
              );
            }
          } else {
            console.log('병원이벤트 상세 언어 실패!', resultItem);
          }
        },
      );

      //console.log("타이머::", days + "일 " + hours + "시간 " + minutes + "분 " + seconds + "초");

      //21일 8:42:02 남음
    }

    timer = setInterval(showRemaining, 1000);
  };

  useEffect(() => {
    //CountDownTimer();

    return () => {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    if (isFocused) {
      eventReviewApi();
    }
  }, [isFocused, reviewListOrder, checkStatus, user_lang]);

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

  const [singoDataList, setSingoDataList] = useState([
    pageText[26],
    pageText[27],
    pageText[28],
    pageText[29],
  ]);

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
      ToastMessage('신고하실 리뷰를 선택하세요.');
      return false;
    }

    if (selectSingo == '') {
      ToastMessage('신고 이유를 선택하세요.');
      return false;
    }

    console.log(reportIdx, selectSingo);

    Api.send(
      'event_reviewReport',
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
          eventReviewApi();
        } else {
          console.log('리뷰 신고하기 실패!', resultItem);
          ToastMessage(resultItem.message);
        }
      },
    );
  };

  //위시리스트 추가
  //찜 목록 추가
  const wishApiHandler = eventidx => {
    console.log(eventidx);
    Api.send('event_wish', {id: userInfo?.id, idx: eventidx}, args => {
      let resultItem = args.resultItem;
      let arrItems = args.arrItems;

      if (resultItem.result === 'Y' && arrItems) {
        //console.log('이벤트 찜목록 추가 결과: ', resultItem);

        if (resultItem.message == 'add') {
          ToastMessage(commonText[0]);
          eventInfoApi();
        } else {
          ToastMessage(commonText[1]);
          eventInfoApi();
        }
      } else {
        console.log('이벤트 찜목록 추가 실패!', resultItem);
      }
    });
  };

  const hospitalShare = async () => {
    await Api.send(
      'app_share',
      {
        idx: eventInfo.idx,
        cidx: user_lang != null ? user_lang?.cidx : userInfo?.cidx,
        type: 'evt',
      },
      async args => {
        let arrItems = args.arrItems;
        let resultItem = args.resultItem;

        if (resultItem.result === 'Y' && arrItems) {
          console.log(arrItems);

          let link = arrItems?.link;

          await Share.share({
            title: eventInfo?.name,
            message: link,
          });
        }
      },
    );
  };

  const {top} = useSafeAreaInsets();

  return (
    <GestureHandlerRootView
      style={{flex: 1, backgroundColor: '#fff', paddingTop: top}}>
      <EventInfoHeader
        headerTitle={'이벤트'}
        navigation={navigation}
        shareOnpress={hospitalShare}
      />
      {loading ? (
        <Loading />
      ) : (
        // <ScrollView>
        //   {eventInfo.photo != '' && (
        //     <Box>
        //       <AutoHeightImage
        //         source={{uri: eventInfo.photo[0]}}
        //         width={deviceSize.deviceWidth}
        //       />
        //     </Box>
        //   )}
        //   <Box p="20px">
        //     <LabelTitle
        //       text={eventInfo.name}
        //       lh={user_lang?.cidx == 9 ? 33 : ''}
        //     />
        //     <Box mt="20px" alignItems={'flex-end'}>
        //       <Box mb="10px">
        //         <DefText text={'~ ' + eventInfo.edate} style={[fsize.fs14]} />
        //       </Box>
        //       <HStack alignItems={'center'}>
        //         <Image
        //           source={{uri: BASE_URL + '/images/priceIcon.png'}}
        //           style={{
        //             width: 18,
        //             height: 18,
        //             resizeMode: 'stretch',
        //             marginRight: 5,
        //           }}
        //         />

        //         <LabelTitle
        //           text={
        //             eventInfo.conprice != ''
        //               ? eventInfo.conprice
        //               : numberFormat(eventInfo.price) + wons
        //           }
        //           txtStyle={{lineHeight: 24}}
        //         />
        //       </HStack>
        //     </Box>
        //   </Box>
        //   <Box>
        //     <Box px="20px" pb={eventInfoReview.cnt == '' ? 0 : '20px'}>
        //       <HStack alignItems={'center'} justifyContent="space-between">
        //         <HStack>
        //           <HStack>
        //             <Image
        //               source={require('../../images/eventScoreIcon.png')}
        //               style={{
        //                 width: 14,
        //                 height: 14,
        //                 resizeMode: 'stretch',
        //               }}
        //             />
        //             <DefText
        //               text={eventInfo.star}
        //               style={[styles.scoreGoodText]}
        //             />
        //           </HStack>
        //           <HStack ml="15px">
        //             <Image
        //               source={require('../../images/eventGoodIcon.png')}
        //               style={{
        //                 width: 15,
        //                 height: 14,
        //                 resizeMode: 'stretch',
        //               }}
        //             />
        //             <DefText
        //               text={eventInfo.wish}
        //               style={[styles.scoreGoodText]}
        //             />
        //           </HStack>
        //         </HStack>
        //         {reviewList != '' && (
        //           <TouchableOpacity
        //             onPress={() =>
        //               navigation.navigate('EventReviewList', {
        //                 idx: eventInfo.idx,
        //                 name: eventInfo.name,
        //               })
        //             }>
        //             <HStack alignItems={'center'}>
        //               <DefText
        //                 text={pageText != '' ? pageText[0] : '리뷰 더 보기'}
        //                 style={[styles.reviewText]}
        //               />
        //               <Image
        //                 source={{uri: BASE_URL + '/images/arrRight.png'}}
        //                 style={{
        //                   width: 9,
        //                   height: 10,
        //                   resizeMode: 'contain',
        //                 }}
        //               />
        //             </HStack>
        //           </TouchableOpacity>
        //         )}
        //       </HStack>
        //     </Box>
        //     {reviewList != '' && (
        //       <Box mt="20px" pb="20px">
        //         <ScrollView
        //           horizontal={true}
        //           showsHorizontalScrollIndicator={false}>
        //           <HStack px="20px">
        //             {reviewList.map((item, index) => {
        //               return (
        //                 <TouchableOpacity
        //                   key={index}
        //                   style={[
        //                     styles.reviewButton,
        //                     index != 0 ? {marginLeft: 15} : {marginLeft: 0},
        //                   ]}
        //                   onPress={() =>
        //                     navigation.navigate('Review', {
        //                       idx: item.idx,
        //                       eventName: eventInfo.name,
        //                       eventTitle: pageText[23],
        //                       reportText: pageText[22],
        //                     })
        //                   }>
        //                   <DefText
        //                     text={textLengthOverCut(item.content, 20, '...')}
        //                     style={[styles.reviewButtonText]}
        //                   />
        //                   <HStack alignItems={'center'} mt="10px">
        //                     {item.star == 0 && (
        //                       <Image
        //                         source={{
        //                           uri: BASE_URL + '/images/score0Big.png',
        //                         }}
        //                         style={{
        //                           width: 68,
        //                           height: 12,
        //                           resizeMode: 'contain',
        //                           marginRight: 10,
        //                         }}
        //                       />
        //                     )}
        //                     {item.star == 1 && (
        //                       <Image
        //                         source={{
        //                           uri: BASE_URL + '/images/score1Big.png',
        //                         }}
        //                         style={{
        //                           width: 68,
        //                           height: 12,
        //                           resizeMode: 'contain',
        //                           marginRight: 10,
        //                         }}
        //                       />
        //                     )}
        //                     {item.star == 2 && (
        //                       <Image
        //                         source={{
        //                           uri: BASE_URL + '/images/score2Big.png',
        //                         }}
        //                         style={{
        //                           width: 68,
        //                           height: 12,
        //                           resizeMode: 'contain',
        //                           marginRight: 10,
        //                         }}
        //                       />
        //                     )}
        //                     {item.star == 3 && (
        //                       <Image
        //                         source={{
        //                           uri: BASE_URL + '/images/score3Big.png',
        //                         }}
        //                         style={{
        //                           width: 68,
        //                           height: 12,
        //                           resizeMode: 'contain',
        //                           marginRight: 10,
        //                         }}
        //                       />
        //                     )}
        //                     {item.star == 4 && (
        //                       <Image
        //                         source={{
        //                           uri: BASE_URL + '/images/score4Big.png',
        //                         }}
        //                         style={{
        //                           width: 68,
        //                           height: 12,
        //                           resizeMode: 'contain',
        //                           marginRight: 10,
        //                         }}
        //                       />
        //                     )}
        //                     {item.star == 5 && (
        //                       <Image
        //                         source={{
        //                           uri: BASE_URL + '/images/score5Big.png',
        //                         }}
        //                         style={{
        //                           width: 68,
        //                           height: 12,
        //                           resizeMode: 'contain',
        //                           marginRight: 10,
        //                         }}
        //                       />
        //                     )}
        //                     <DefText
        //                       text={item.star}
        //                       style={[fweight.m, fsize.fs14, {lineHeight: 20}]}
        //                     />
        //                   </HStack>
        //                 </TouchableOpacity>
        //               );
        //             })}
        //           </HStack>
        //         </ScrollView>
        //       </Box>
        //     )}
        //     <BoxLine />
        //     <Box>
        //       <TouchableOpacity
        //         style={{
        //           justifyContent: 'center',
        //           padding: 20,
        //         }}
        //         onPress={() =>
        //           navigation.navigate('HospitalInfo', {idx: eventInfo.hidx})
        //         }>
        //         <HStack
        //           alignItems={'center'}
        //           justifyContent="space-between"
        //           flexWrap={'wrap'}>
        //           <Box width="85%">
        //             <LabelTitle
        //               text={eventInfo.hname}
        //               lh={user_lang?.cidx == 9 ? 33 : ''}
        //             />
        //             <DefText
        //               text={eventInfo.address1 + ' ' + eventInfo.address2}
        //               style={{
        //                 ...fsize.fs15,
        //                 lineHeight: 21,
        //                 ...fweight.m,
        //                 color: '#B2BBC8',
        //                 marginTop: 10,
        //               }}
        //               lh={user_lang?.cidx == 9 ? 25 : ''}
        //             />
        //           </Box>
        //           <Image
        //             source={require('../../images/rightArrBig.png')}
        //             style={{
        //               width: 16,
        //               height: 10,
        //               resizeMode: 'contain',
        //             }}
        //           />
        //         </HStack>
        //       </TouchableOpacity>
        //     </Box>
        //     <BoxLine />
        //     {/* <Box
        //                     borderBottomWidth={1}
        //                     borderBottomColor={'#D2DCE8'}
        //                 >
        //                     <HStack>
        //                         <TouchableOpacity
        //                             style={[styles.itemTabButton]}
        //                             onPress={()=>setSelectTab("1")}
        //                         >
        //                             <HStack
        //                                 height='54px'
        //                                 alignItems={'center'}
        //                                 borderBottomWidth={4}
        //                                 borderBottomColor={ selectTab == 1 ? colorSelect.pink_de : colorSelect.white}
        //                             >
        //                                 <DefText
        //                                     text={ pageText != "" ? pageText[1] : "상세정보"}
        //                                     style={[
        //                                         styles.itemTabButtonText,
        //                                         selectTab == 1 && {...fweight.bold, color:colorSelect.pink_de}
        //                                     ]}
        //                                 />
        //                             </HStack>
        //                         </TouchableOpacity>
        //                         <TouchableOpacity
        //                             style={[styles.itemTabButton]}
        //                             onPress={()=>setSelectTab("2")}
        //                         >
        //                             <HStack
        //                                 height='54px'
        //                                 alignItems={'center'}
        //                                 borderBottomWidth={4}
        //                                 borderBottomColor={selectTab == 2 ? colorSelect.pink_de : colorSelect.white}
        //                             >
        //                                 <DefText
        //                                     text={ pageText != "" ? pageText[2] : "리뷰"}
        //                                     style={[
        //                                         styles.itemTabButtonText,
        //                                         selectTab == 2 && {...fweight.bold, color:colorSelect.pink_de}
        //                                     ]}
        //                                 />
        //                             </HStack>
        //                         </TouchableOpacity>
        //                         <TouchableOpacity
        //                             style={[styles.itemTabButton]}
        //                             onPress={()=>setSelectTab("3")}
        //                         >
        //                             <HStack
        //                                 height='54px'
        //                                 alignItems={'center'}
        //                                 borderBottomWidth={4}
        //                                 borderBottomColor={selectTab == 3 ? colorSelect.pink_de : colorSelect.white}
        //                             >
        //                                 <DefText
        //                                     text={ pageText != "" ? pageText[3] : "추천이벤트"}
        //                                     style={[
        //                                         styles.itemTabButtonText,
        //                                         selectTab == 3 && {...fweight.bold, color:colorSelect.pink_de}
        //                                     ]}
        //                                 />
        //                             </HStack>
        //                         </TouchableOpacity>
        //                     </HStack>
        //                 </Box> */}

        //     <Box>
        //       {eventInfo.photo != '' ? (
        //         eventInfo.photo.map((item, index) => {
        //           return (
        //             <AutoHeightImage
        //               key={index}
        //               source={{uri: item}}
        //               width={deviceSize.deviceWidth}
        //             />
        //           );
        //         })
        //       ) : (
        //         <DefText
        //           text={
        //             pageText != ''
        //               ? pageText[31]
        //               : '입력된 상세정보가 없습니다.'
        //           }
        //         />
        //       )}
        //     </Box>
        //     <BoxLine />
        //     <Box>
        //       {eventInfoReview != '' ? (
        //         <Box>
        //           <Box px="20px">
        //             <Box pt="20px">
        //               <HStack
        //                 alignItems={'center'}
        //                 justifyContent={'space-between'}>
        //                 <LabelTitle
        //                   text={pageText != '' ? pageText[17] : '이벤트 리뷰'}
        //                 />
        //                 {reviewWrite && (
        //                   <TouchableOpacity
        //                     style={[
        //                       styles.titleButton,
        //                       reviewWrite && {
        //                         backgroundColor: colorSelect.pink_de,
        //                       },
        //                     ]}
        //                     onPress={() =>
        //                       navigation.navigate('EventReview', eventInfo)
        //                     }>
        //                     <DefText
        //                       text={pageText != '' ? pageText[24] : '리뷰쓰기'}
        //                       style={[
        //                         styles.titleButtonText,
        //                         reviewWrite && {color: '#fff'},
        //                       ]}
        //                     />
        //                   </TouchableOpacity>
        //                 )}
        //               </HStack>

        //               <HStack
        //                 alignItems={'center'}
        //                 justifyContent="center"
        //                 mt="20px">
        //                 {eventInfo.star == 0 && (
        //                   <Image
        //                     source={{uri: BASE_URL + '/images/score0Big.png'}}
        //                     style={{
        //                       width: 122,
        //                       height: 22,
        //                       resizeMode: 'contain',
        //                       marginRight: 10,
        //                     }}
        //                   />
        //                 )}
        //                 {eventInfo.star == 1 && (
        //                   <Image
        //                     source={{uri: BASE_URL + '/images/score1Big.png'}}
        //                     style={{
        //                       width: 122,
        //                       height: 22,
        //                       resizeMode: 'contain',
        //                       marginRight: 10,
        //                     }}
        //                   />
        //                 )}
        //                 {eventInfo.star == 2 && (
        //                   <Image
        //                     source={{uri: BASE_URL + '/images/score2Big.png'}}
        //                     style={{
        //                       width: 122,
        //                       height: 22,
        //                       resizeMode: 'contain',
        //                       marginRight: 10,
        //                     }}
        //                   />
        //                 )}
        //                 {eventInfo.star == 3 && (
        //                   <Image
        //                     source={{uri: BASE_URL + '/images/score3Big.png'}}
        //                     style={{
        //                       width: 122,
        //                       height: 22,
        //                       resizeMode: 'contain',
        //                       marginRight: 10,
        //                     }}
        //                   />
        //                 )}
        //                 {eventInfo.star == 4 && (
        //                   <Image
        //                     source={{uri: BASE_URL + '/images/score4Big.png'}}
        //                     style={{
        //                       width: 122,
        //                       height: 22,
        //                       resizeMode: 'contain',
        //                       marginRight: 10,
        //                     }}
        //                   />
        //                 )}
        //                 {eventInfo.star == 5 && (
        //                   <Image
        //                     source={{uri: BASE_URL + '/images/score5Big.png'}}
        //                     style={{
        //                       width: 122,
        //                       height: 22,
        //                       resizeMode: 'contain',
        //                       marginRight: 10,
        //                     }}
        //                   />
        //                 )}
        //                 <DefText
        //                   text={eventInfo.star}
        //                   style={[styles.scoreGoodTextBig]}
        //                 />
        //                 <DefText
        //                   text={' (' + eventInfoReview.cnt + ')'}
        //                   style={[
        //                     styles.scoreGoodTextBig,
        //                     fweight.r,
        //                     {color: '#191919'},
        //                   ]}
        //                 />
        //               </HStack>
        //               <Box
        //                 mt="25px"
        //                 style={[styles.reviewButton, {maxWidth: 'auto'}]}>
        //                 <HStack
        //                   alignItems={'center'}
        //                   justifyContent="space-between">
        //                   <Box>
        //                     <DefText
        //                       text={
        //                         pageText != '' ? pageText[11] : '진료/시술/수술'
        //                       }
        //                       style={[styles.reviewCate]}
        //                     />
        //                     <DefText
        //                       text={
        //                         pageText != '' ? pageText[12] : '경과가 좋아요'
        //                       }
        //                       style={[styles.reviewTitle]}
        //                     />
        //                   </Box>
        //                   <DefText
        //                     text={eventInfoReview.result + '%'}
        //                     style={[styles.reviewPercent]}
        //                   />
        //                 </HStack>
        //                 <HStack
        //                   alignItems={'center'}
        //                   justifyContent="space-between"
        //                   mt="20px">
        //                   <Box>
        //                     <DefText
        //                       text={
        //                         pageText != '' ? pageText[13] : '서비스 친절도'
        //                       }
        //                       style={[styles.reviewCate]}
        //                     />
        //                     <DefText
        //                       text={
        //                         pageText != '' ? pageText[14] : '만족스러워요'
        //                       }
        //                       style={[styles.reviewTitle]}
        //                     />
        //                   </Box>
        //                   <DefText
        //                     text={eventInfoReview.service + '%'}
        //                     style={[styles.reviewPercent]}
        //                   />
        //                 </HStack>
        //                 <HStack
        //                   alignItems={'center'}
        //                   justifyContent="space-between"
        //                   mt="20px">
        //                   <Box>
        //                     <DefText
        //                       text={
        //                         pageText != '' ? pageText[15] : '시설 만족도'
        //                       }
        //                       style={[styles.reviewCate]}
        //                     />
        //                     <DefText
        //                       text={
        //                         pageText != '' ? pageText[16] : '매우 청결해요'
        //                       }
        //                       style={[styles.reviewTitle]}
        //                     />
        //                   </Box>
        //                   <DefText
        //                     text={eventInfoReview.clean + '%'}
        //                     style={[styles.reviewPercent]}
        //                   />
        //                 </HStack>
        //               </Box>
        //             </Box>
        //           </Box>
        //           <HStack
        //             alignItems={'center'}
        //             justifyContent="space-between"
        //             flexWrap={'wrap'}
        //             px={'20px'}>
        //             <HStack
        //               flexWrap={'wrap'}
        //               width={(deviceSize.deviceWidth - 40) * 0.6}>
        //               <TouchableOpacity
        //                 style={{marginRight: 14, marginTop: 20}}
        //                 onPress={() => setReviewListOrder('0')}>
        //                 <HStack alignItems={'center'}>
        //                   <Box
        //                     width="16px"
        //                     height="16px"
        //                     borderRadius={'16px'}
        //                     backgroundColor="#D5D5D5"
        //                     alignItems={'center'}
        //                     justifyContent="center"
        //                     mr="5px">
        //                     {reviewListOrder == '0' && (
        //                       <Box
        //                         width="10px"
        //                         height="10px"
        //                         borderRadius="10px"
        //                         backgroundColor={colorSelect.navy}
        //                       />
        //                     )}
        //                   </Box>
        //                   <DefText
        //                     text={pageText != '' ? pageText[18] : '추천순'}
        //                     style={[
        //                       styles.radioButtonText,
        //                       reviewListOrder == '0' && {
        //                         color: colorSelect.navy,
        //                         ...fweight.bold,
        //                       },
        //                     ]}
        //                   />
        //                 </HStack>
        //               </TouchableOpacity>
        //               <TouchableOpacity
        //                 style={{marginTop: 20, marginBottom: 20}}
        //                 onPress={() => setReviewListOrder('1')}>
        //                 <HStack alignItems={'center'}>
        //                   <Box
        //                     width="16px"
        //                     height="16px"
        //                     borderRadius={'16px'}
        //                     backgroundColor="#D5D5D5"
        //                     alignItems={'center'}
        //                     justifyContent="center"
        //                     mr="5px">
        //                     {reviewListOrder == '1' && (
        //                       <Box
        //                         width="10px"
        //                         height="10px"
        //                         borderRadius="10px"
        //                         backgroundColor={colorSelect.navy}
        //                       />
        //                     )}
        //                   </Box>
        //                   <DefText
        //                     text={pageText != '' ? pageText[19] : '최신순'}
        //                     style={[
        //                       styles.radioButtonText,
        //                       reviewListOrder == '1' && {
        //                         color: colorSelect.navy,
        //                         ...fweight.bold,
        //                       },
        //                     ]}
        //                   />
        //                 </HStack>
        //               </TouchableOpacity>
        //             </HStack>

        //             <Checkbox
        //               checkboxText={pageText != '' ? pageText[20] : '사진리뷰'}
        //               onPress={() => setCheckStatus(!checkStatus)}
        //               checkStatus={checkStatus}
        //               txtStyle={{...fsize.fs14}}
        //             />
        //           </HStack>
        //           {reviewList != '' ? (
        //             reviewList.map((item, index) => {
        //               return (
        //                 <Box key={index}>
        //                   <EventReviewBox
        //                     navigation={navigation}
        //                     eventWriter={item.name}
        //                     eventTitle={pageText[23]}
        //                     eventName={eventInfo.name}
        //                     eventDate={item.wdate}
        //                     eventStart={item.star}
        //                     eventContent={item.content}
        //                     reportText={pageText[22]}
        //                     eventReviewOnpress={() =>
        //                       navigation.navigate('Review', {
        //                         idx: item.idx,
        //                         eventName: eventInfo.name,
        //                         eventTitle: pageText[23],
        //                         reportText: pageText[22],
        //                       })
        //                     }
        //                     photos={item?.photo}
        //                     singoOnprees={() => reportReview(item.idx)}
        //                     reviewanswer={item.answer}
        //                     reviewAnswerImage={item.hicon}
        //                     hname={item.hname}
        //                     updateContent={'evt'}
        //                     updateStatus={item.editable}
        //                     updateText={pageText[35]}
        //                     reviews={item}
        //                   />
        //                 </Box>
        //               );
        //             })
        //           ) : (
        //             <Box
        //               py="40px"
        //               alignItems={'center'}
        //               justifyContent={'center'}>
        //               <DefText
        //                 text={
        //                   pageText != '' ? pageText[21] : '리뷰가 없습니다.'
        //                 }
        //                 style={{...fsize.fs14}}
        //               />
        //             </Box>
        //           )}
        //         </Box>
        //       ) : (
        //         <Box py="80px" alignItems="center" justifyContent={'center'}>
        //           <DefText
        //             text={
        //               pageText != '' ? pageText[32] : '등록된 리뷰가 없습니다.'
        //             }
        //             style={{...fsize.fs15}}
        //           />
        //         </Box>
        //       )}
        //     </Box>
        //     <BoxLine />
        //     <Box>
        //       {eventRelation != '' ? (
        //         <Box p="20px" pr="0px">
        //           <LabelTitle
        //             text={pageText != '' ? pageText[33] : '추천 이벤트'}
        //           />
        //           <Box mt="20px">
        //             <ScrollView
        //               horizontal={true}
        //               showsHorizontalScrollIndicator={false}>
        //               <HStack>
        //                 {eventRelation.map((item, index) => {
        //                   return (
        //                     <TouchableOpacity
        //                       key={index}
        //                       style={[
        //                         {
        //                           width: (deviceSize.deviceWidth - 40) * 0.43,
        //                           marginRight: 20,
        //                         },
        //                         //index != 0 && {marginRight:20}
        //                       ]}
        //                       onPress={() =>
        //                         navigation.replace('EventInfo', {
        //                           idx: item.idx,
        //                           cidx: user_lang?.cidx,
        //                         })
        //                       }>
        //                       <Image
        //                         source={{uri: item.thumb}}
        //                         style={{
        //                           width: (deviceSize.deviceWidth - 40) * 0.43,
        //                           height: (deviceSize.deviceWidth - 40) * 0.43,
        //                           resizeMode: 'contain',
        //                           borderRadius: 10,
        //                         }}
        //                       />
        //                       <DefText
        //                         text={item.name}
        //                         style={[
        //                           fsize.fs14,
        //                           {
        //                             lineHeight: 20,
        //                             marginVertical: 10,
        //                             marginTop: 12,
        //                           },
        //                         ]}
        //                       />
        //                       <DefText
        //                         text={numberFormat(item.price) + wons}
        //                         style={[fweight.bold, {lineHeight: 19}]}
        //                       />
        //                     </TouchableOpacity>
        //                   );
        //                 })}
        //               </HStack>
        //             </ScrollView>
        //           </Box>
        //         </Box>
        //       ) : (
        //         <Box py="80px" alignItems="center" justifyContent={'center'}>
        //           <DefText
        //             text={
        //               pageText != '' ? pageText[34] : '추천 이벤트가 없습니다.'
        //             }
        //             style={{...fsize.fs15}}
        //           />
        //         </Box>
        //       )}
        //     </Box>
        //     <Box height="60px" />
        //   </Box>
        // </ScrollView>
        <WebView
          originWhitelist={['*']}
          source={{
            uri: BASE_URL + '/eventInfo.php?date',
          }}
          textZoom={100}
          // startInLoadingState={true}
          // renderLoading={() => {
          //   return <Loading />;
          // }}
          showsVerticalScrollIndicator={false}
          style={{
            opacity: 0.99,
            minHeight: 1,
          }}
        />
      )}

      {userInfo != null && userInfo != undefined && (
        <FixButtons bottom={'150px'} />
      )}
      <EventBottomButton
        navigation={navigation}
        reservationOnpree={() =>
          navigation.navigate('EventReservation', {idx: params.idx, ridx: ''})
        }
        wishChk={eventInfo.wishchk}
        wishButtonOnpress={() => wishApiHandler(eventInfo.idx)}
        hospitalCheck={true}
        cntTime={timerCont}
        eventText1={pageText != '' ? pageText[4] : '이벤트 마감까지 '}
        user_lang={user_lang != null ? user_lang?.cidx : userInfo.cidx}
        rText={pageText != '' ? pageText[10] : '예약하기'}
      />
      <BottomNavi screenName={name} navigation={navigation} />
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
                pageText != '' ? pageText[25] : '신고하는 이유를 선택해 주세요.'
              }
            />
            <Box>
              {singoDataList.map((item, index) => {
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
                text={pageText != '' ? pageText[30] : '신고하기'}
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
  scoreGoodText: {
    ...fsize.fs17,
    ...fweight.bold,
    lineHeight: 19,
    marginLeft: 10,
  },
  scoreGoodTextBig: {
    ...fsize.fs24,
    ...fweight.bold,
    lineHeight: 35,
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
  itemTabButton: {
    width: deviceSize.deviceWidth / 3,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemTabButtonText: {
    ...fsize.fs14,
    lineHeight: 20,
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
  radioButtonText: {
    ...fsize.fs12,
    lineHeight: 16,
    color: '#B2BBC8',
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
)(EventInfo);
