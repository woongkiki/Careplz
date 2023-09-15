import {Box} from 'native-base';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import Header from '../../components/Header';
import {connect} from 'react-redux';
import {actionCreators as UserAction} from '../../redux/module/action/UserAction';
import Api from '../../Api';
import messaging from '@react-native-firebase/messaging';
import Loading from '../../components/Loading';
import {ScrollView} from 'react-native';
import ReviewComponent from '../../components/hospitalInfo/ReviewComponent';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import {DefButton, LabelTitle} from '../../common/BOOTSTRAP';
import ToastMessage from '../../components/ToastMessage';
import SingoLitsComponent from '../../components/SingoLitsComponent';
import {colorSelect, fweight} from '../../common/StyleCommon';
import {useIsFocused} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const ReviewList = props => {
  const {navigation, route, userInfo, user_lang} = props;
  const {params} = route;

  console.log('params', params);

  const [loading, setLoading] = useState(true);
  const [reviewList, setReivewList] = useState('');
  const [pageText, setPageText] = useState('');
  const [singoList, setSingoList] = useState([]);

  const isFocused = useIsFocused();

  const reviewDetailApi = async () => {
    const token = await messaging().getToken(); // 앱 토큰
    await setLoading(true);
    await setSingoList([]);
    //user_lang != null ? user_lang?.cidx : userInfo?.cidx
    await Api.send(
      'app_page',
      {
        cidx: user_lang != null ? user_lang?.cidx : userInfo?.cidx,
        code: 'reviewDetail',
      },
      args => {
        let resultItem = args.resultItem;
        let arrItems = args.arrItems;

        if (resultItem.result === 'Y' && arrItems) {
          //console.log('병원지도 메인 언어 리스트: ', resultItem, arrItems);
          setPageText(arrItems.text);

          let singos = [...singoList];
          singos[0] = arrItems.text[5];
          singos[1] = arrItems.text[6];
          singos[2] = arrItems.text[7];
          singos[3] = arrItems.text[8];

          setSingoList(singos);
        } else {
          console.log('병원지도 메인 언어 리스트 실패!', resultItem);
        }
      },
    );
    await Api.send(
      'hospital_reviewDetail',
      {
        idx: params.idx,
        cidx: user_lang != null ? user_lang?.cidx : userInfo?.cidx,
        id: userInfo?.id,
        token: token,
      },
      args => {
        let resultItem = args.resultItem;
        let arrItems = args.arrItems;

        if (resultItem.result === 'Y' && arrItems) {
          console.log('리뷰 상세 성공: ', resultItem, arrItems);
          setReivewList(arrItems);
        } else {
          console.log('리뷰 상세 실패!', resultItem);
        }
      },
    );
    await setLoading(false);
  };

  useEffect(() => {
    console.log(singoList);
  }, [singoList]);

  useEffect(() => {
    if (isFocused) {
      reviewDetailApi();
    }
  }, [isFocused]);

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

  console.log(singoList);
  const [reportIdx, setReportIdx] = useState('');
  const reportReview = idx => {
    console.log('idx', idx);
    setReportIdx(idx);
    handlePresentModalPress();
  };

  //신고하기 선택
  const [selectSingo, setSelectSingo] = useState('');

  const singoCloseHandler = () => {
    // if(reportIdx == ""){
    //     ToastMessage(pageText[52]);
    //     return false;
    // }

    // if(selectSingo == ""){
    //     ToastMessage(pageText[53]);
    //     return false;
    // }

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
          //reviewListApi();
        } else {
          console.log('리뷰 신고하기 실패!', resultItem);
          ToastMessage(resultItem.message);
        }
      },
    );
  };

  const reviewGood = idx => {
    Api.send('hospital_reviewRecom', {id: userInfo?.id, idx: idx}, args => {
      let resultItem = args.resultItem;
      let arrItems = args.arrItems;

      if (resultItem.result === 'Y' && arrItems) {
        console.log('리뷰 좋아요 성공: ', resultItem, arrItems);

        //reviewListApi();
        reviewDetailApi();
      } else {
        console.log('리뷰 좋아요 실패!', resultItem);
      }
    });
  };

  const {top} = useSafeAreaInsets();

  return (
    <GestureHandlerRootView
      style={{flex: 1, backgroundColor: '#fff', paddingTop: top}}>
      <Header
        headerTitle={pageText != '' ? pageText[0] : '리뷰'}
        backButtonStatus={true}
        navigation={navigation}
      />
      {loading ? (
        <Loading />
      ) : (
        <Box px={'20px'}>
          {reviewList != '' && (
            <ReviewComponent
              star={reviewList.star}
              reviewContent={reviewList.content}
              reviewDate={reviewList.wdate}
              reviewWriter={reviewList.name}
              recom={reviewList.recom}
              borderT={'transparent'}
              visitCeriText={pageText != '' ? pageText[1] : '방문인증'}
              singoText={pageText != '' ? pageText[2] : '신고'}
              reviewDel={userInfo?.idx === reviewList.idx ? true : false}
              photos={reviewList?.photo}
              singoOnprees={() => reportReview(reviewList.idx)}
              reviewWishOnpress={() => reviewGood(reviewList.idx)}
              reviewanswer={reviewList.answer}
              reviewAnswerImage={reviewList.hicon}
              hname={reviewList.hname}
              navigation={navigation}
              reviews={reviewList}
              updateStatus={reviewList.editable}
              updateText={pageText[11]}
              updateContent={'hsp'}
            />
          )}
        </Box>
      )}

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
                pageText != '' ? pageText[4] : '신고하는 이유를 선택해 주세요.'
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
                text={pageText != '' ? pageText[9] : '신고하기'}
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
)(ReviewList);
