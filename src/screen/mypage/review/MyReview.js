import React, {useCallback, useEffect, useState} from 'react';
import {Box, HStack, Modal} from 'native-base';
import {connect} from 'react-redux';
import {actionCreators as UserAction} from '../../../redux/module/action/UserAction';
import Header from '../../../components/Header';
import Api from '../../../Api';
import Loading from '../../../components/Loading';
import {FlatList, StyleSheet, TouchableOpacity} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import EventReviewBox from '../../../components/EventReviewBox';
import {
  colorSelect,
  deviceSize,
  fsize,
  fweight,
} from '../../../common/StyleCommon';
import {DefButton, DefText} from '../../../common/BOOTSTRAP';
import ToastMessage from '../../../components/ToastMessage';
import EmptyPage from '../../../components/EmptyPage';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import BottomNavi from '../../../components/bottom/BottomNavi';

const MyReview = props => {
  const {navigation, userInfo, user_lang, route} = props;
  const {name} = route;

  const isFocused = useIsFocused();

  const [loading, setLoading] = useState(true);
  const [pageText, setPageText] = useState('');
  const [page, setPage] = useState(1);
  const [fetchLoading, setFetchLoading] = useState(false);

  const [reviewData, setReviewData] = useState([]); //리뷰데이터
  const [reviewRemoveModal, setReviewRemoveModal] = useState(false); //리뷰삭제 모달
  const [reviewIdx, setReviewIdx] = useState(''); //삭제할 리뷰 인덱스 값

  //리뷰 삭제 모달 띄우기
  const reviewRemoveModalHandler = useCallback(
    idx => {
      setReviewIdx(idx);
      setReviewRemoveModal(true);
    },
    [reviewIdx],
  );

  //리뷰 삭제 핸들러
  const reviewRemoveHandler = () => {
    if (reviewIdx == '') {
      ToastMessage(pageText[7]);
      return false;
    }

    Api.send(
      'member_reviewDelete',
      {id: userInfo?.id, idx: reviewIdx},
      args => {
        let resultItem = args.resultItem;
        let arrItems = args.arrItems;

        if (resultItem.result === 'Y' && arrItems) {
          console.log('나의 리뷰 삭제 성공: ', resultItem, arrItems);

          ToastMessage(pageText[8]);
          reviewRemoveCancle();
          myReviewApiHandler();
        } else {
          console.log('나의 리뷰 삭제 실패!', resultItem);
        }
      },
    );
  };

  //리뷰삭제 모달 닫기
  const reviewRemoveCancle = () => {
    setReviewRemoveModal(false);
    setReviewIdx('');
  };

  //리뷰데이터 렌더링
  const renderItems = ({item, index}) => {
    return (
      <Box
        px="20px"
        borderTopWidth={index != 0 ? 1 : 0}
        borderTopColor={'#E3E3E3'}>
        <TouchableOpacity
          onPress={() => navigation.navigate('HospitalInfo', {idx: item.hidx})}
          style={{paddingVertical: 20}}>
          <DefText
            text={item.hname}
            style={[
              fsize.fs19,
              fweight.bold,
              {lineHeight: 27, marginBottom: 10},
            ]}
          />
          <DefText
            text={'서울 강남구 강남대로 476 (논현동, urbanhive)'}
            style={[fsize.fs15, {color: '#434856', lineHeight: 21}]}
          />
        </TouchableOpacity>
        <EventReviewBox
          navigation={navigation}
          eventWriter={item.name}
          eventTitle={item.type == 'hsp' ? pageText[1] : pageText[2]}
          eventName={item.subject}
          eventDate={item.wdate}
          eventStart={item.star}
          eventContent={item.content}
          reportText={''}
          //eventReviewOnpress={()=>navigation.navigate("Review", {"idx":item.idx, "eventName":eventInfo.name, "eventTitle":pageText[23], "reportText":pageText[22]})}
          photos={item?.photo}
          reviewDel={true}
          reviewRemoveOnpress={() => reviewRemoveModalHandler(item.idx)}
          disabled={true}
          //singoOnprees={()=>reportReview(item.idx)}

          reviewanswer={item.answer}
          reviewAnswerImage={item.hicon}
          hname={item.hname}
          updateStatus={item.editable}
          updateContent={item.type}
          updateText={pageText[10]}
          reviews={item}
        />
      </Box>
    );
  };

  //리뷰 key
  const keyExtractor = useCallback(item => item.idx.toString(), []);

  //페이지 언어 api
  const pageTextApi = () => {
    Api.send(
      'app_page',
      {
        cidx: user_lang != null ? user_lang?.cidx : userInfo?.cidx,
        code: 'myReview',
      },
      args => {
        let resultItem = args.resultItem;
        let arrItems = args.arrItems;

        if (resultItem.result === 'Y' && arrItems) {
          //console.log('나의리뷰 언어 리스트: ', resultItem, arrItems.text);
          setPageText(arrItems.text);
        } else {
          console.log('찜목록 수정 언어 리스트 실패!', resultItem);
        }
      },
    );
  };

  //나의 리뷰 리스트 api
  const myReviewApiHandler = async () => {
    await setLoading(true);
    await Api.send(
      'member_reviewList',
      {
        id: userInfo?.id,
        page: 1,
        cidx: user_lang != null ? user_lang?.cidx : userInfo?.cidx,
      },
      args => {
        let resultItem = args.resultItem;
        let arrItems = args.arrItems;

        if (resultItem.result === 'Y' && arrItems) {
          console.log('나의 리뷰 리스트: ', resultItem, arrItems);
          setReviewData(arrItems);
        } else {
          console.log('나의 리뷰 목록 실패!', resultItem);
        }
      },
    );
    await setLoading(false);
  };

  //api 실행
  useEffect(() => {
    if (isFocused) {
      pageTextApi();
      myReviewApiHandler();
    }
  }, [isFocused]);

  //스크롤이 하단에 가까워졌을 때
  const fetchApi = async () => {
    await setFetchLoading(true);
    await setFetchLoading(false);
  };

  //페이지 추가
  const pageAdd = async () => {
    await setPage(page + 1);
  };

  //fetchLoading 상태가 변경되었을 때
  useEffect(() => {
    if (fetchLoading) {
      pageAdd();
    }
  }, [fetchLoading]);

  //나의 리뷰 목록 추가
  const myReviewApiAdd = () => {
    Api.send(
      'member_reviewList',
      {
        id: userInfo?.id,
        page: page,
        cidx: user_lang != null ? user_lang?.cidx : userInfo?.cidx,
      },
      args => {
        let resultItem = args.resultItem;
        let arrItems = args.arrItems;

        if (resultItem.result === 'Y' && arrItems) {
          console.log('나의 리뷰 리스트 추가: ', resultItem, arrItems);

          let reviewAdd = [...reviewData];

          arrItems.map((item, index) => {
            return reviewAdd.push(item);
          });

          setReviewData(reviewAdd);
        } else {
          console.log('나의 리뷰 목록 추가 없음!', resultItem);
        }
      },
    );
  };

  //페이지 추가되면 리뷰목록 추가
  useEffect(() => {
    if (page > 1) {
      myReviewApiAdd();
    }
  }, [page]);

  const {top} = useSafeAreaInsets();

  return (
    <Box flex={1} backgroundColor={'#fff'} pt={top + 'px'}>
      <Header
        headerTitle={pageText != '' ? pageText[0] : '나의 리뷰'}
        backButtonStatus={true}
        navigation={navigation}
      />
      {loading ? (
        <Loading />
      ) : reviewData != '' ? (
        <FlatList
          data={reviewData}
          keyExtractor={keyExtractor}
          renderItem={renderItems}
          onEndReachedThreshold={0.2}
          onEndReached={fetchApi}
        />
      ) : (
        <Box flex={1}>
          <EmptyPage emptyText={pageText[9]} />
        </Box>
      )}
      <Modal
        isOpen={reviewRemoveModal}
        onClose={() => setReviewRemoveModal(false)}>
        <Modal.Content width={deviceSize.deviceWidth - 40} p={0}>
          <Modal.Body p="20px">
            <Box
              pb="20px"
              borderBottomWidth={1}
              borderBottomColor="#ccc"
              alignItems={'center'}>
              <DefText
                text={pageText != '' ? pageText[3] : '리뷰 삭제'}
                style={[fsize.fs17, fweight.bold]}
                lh={user_lang?.cidx == 9 ? 32 : ''}
              />
            </Box>
            <Box mt="20px">
              <DefText
                text={
                  pageText != ''
                    ? pageText[4]
                    : '작성한 리뷰를 삭제하시겠습니까?\n삭제하면 복구할 수 없습니다.'
                }
                style={[
                  {textAlign: 'center', color: '#191919', lineHeight: 24},
                  fsize.fs14,
                ]}
                lh={user_lang?.cidx == 9 ? 27 : ''}
              />
            </Box>
            <HStack mt="30px" justifyContent={'space-between'}>
              <DefButton
                text={pageText != '' ? pageText[5] : '취소'}
                btnStyle={[
                  styles.modalButton,
                  {width: '48%', backgroundColor: '#F1F1F1'},
                ]}
                onPress={reviewRemoveCancle}
                lh={user_lang?.cidx == 9 ? 40 : ''}
              />
              <DefButton
                text={pageText != '' ? pageText[6] : '확인'}
                btnStyle={[
                  styles.modalButton,
                  {width: '48%', backgroundColor: colorSelect.navy},
                ]}
                txtStyle={[fweight.m, {color: colorSelect.white}]}
                onPress={reviewRemoveHandler}
                lh={user_lang?.cidx == 9 ? 40 : ''}
              />
            </HStack>
          </Modal.Body>
        </Modal.Content>
      </Modal>
      <BottomNavi screenName={name} navigation={navigation} />
    </Box>
  );
};

const styles = StyleSheet.create({
  modalButton: {
    height: 50,
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
)(MyReview);
