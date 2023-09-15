import React, {useCallback, useEffect, useState} from 'react';
import {Box, HStack} from 'native-base';
import {DefText} from '../../../common/BOOTSTRAP';
import Header from '../../../components/Header';
import {noticeData} from '../../../ArrayData';
import Loading from '../../../components/Loading';
import {ActivityIndicator, FlatList, TouchableOpacity} from 'react-native';
import NoticeBox from '../../../components/notice/NoticeBox';
import {connect} from 'react-redux';
import {actionCreators as UserAction} from '../../../redux/module/action/UserAction';
import Api from '../../../Api';
import {useIsFocused} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import BottomNavi from '../../../components/bottom/BottomNavi';

//알림 설정
const NoticeList = props => {
  const {navigation, userInfo, user_lang, route} = props;
  const {name} = route;

  const isFocused = useIsFocused();

  const [loading, setLoading] = useState(true);
  const [pageText, setPageText] = useState([]);
  const [page, setPage] = useState(1);
  const [noticeList, setNoticeList] = useState(noticeData);
  const [fetchLoading, setFetchLoading] = useState(true);

  const apiHandler = async () => {
    await setLoading(true);
    await Api.send(
      'app_page',
      {
        cidx: user_lang != null ? user_lang.cidx : userInfo.cidx,
        code: 'notice',
      },
      args => {
        let resultItem = args.resultItem;
        let arrItems = args.arrItems;

        if (resultItem.result === 'Y' && arrItems) {
          //console.log('약관 및 정책 언어 리스트: ', resultItem, arrItems.text);
          setPageText(arrItems.text);
        } else {
          console.log('약관 및 정책 언어 리스트 실패!', resultItem);
        }
      },
    );
    await Api.send(
      'member_noticeList',
      {cidx: user_lang != null ? user_lang.cidx : userInfo.cidx, page: page},
      args => {
        let resultItem = args.resultItem;
        let arrItems = args.arrItems;

        if (resultItem.result === 'Y' && arrItems) {
          //console.log('공지사항 불러오기 성공: ', resultItem, arrItems);
          setNoticeList(arrItems);
        } else {
          console.log('공지사항 불러오기 실패!', resultItem);
        }
      },
    );
    await setLoading(false);
  };

  useEffect(() => {
    if (isFocused) {
      apiHandler();
    }
  }, [isFocused]);

  const renderItem = ({item, index}) => {
    return (
      <NoticeBox
        title={item.subject}
        writer={item.name}
        datetime={item.wdate}
        onPress={() => navigation.navigate('NoticeInfo', item)}
      />
    );
  };

  const keyExtractor = useCallback((item, index) => index.toString(), []);

  const pageAdd = async () => {
    await setPage(page + 1);
  };

  //인피니트 스크롤
  const fetchApi = async () => {
    await setFetchLoading(true);
    await pageAdd();
    await setFetchLoading(false);

    console.log('맨 하단임');
  };

  //인피니트 스크롤
  useEffect(() => {
    if (page > 1) {
      Api.send(
        'member_noticeList',
        {cidx: user_lang != null ? user_lang.cidx : userInfo.cidx, page: page},
        args => {
          let resultItem = args.resultItem;
          let arrItems = args.arrItems;

          if (resultItem.result === 'Y' && arrItems) {
            console.log('공지시항 데이터 추가 결과: ', page);

            let noticeData = [...noticeList];

            arrItems.map((item, index) => {
              return noticeData.push(item);
            });

            console.log(noticeData);
            setNoticeList(noticeData);

            // setPopularData(arrItems);
          } else {
            console.log('공지시항 데이터 추가 api 실패!', resultItem);
          }
        },
      );
    }
  }, [page]);

  const {top} = useSafeAreaInsets();

  return (
    <Box flex={1} backgroundColor="#fff" pt={top + 'px'}>
      <Header
        navigation={navigation}
        backButtonStatus={true}
        headerTitle={pageText != '' ? pageText[0] : '공지사항'}
      />
      {loading ? (
        <Loading />
      ) : noticeList != '' ? (
        <FlatList
          data={noticeList}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          onEndReachedThreshold={0.2}
          onEndReached={fetchApi}
          ListFooterComponent={
            <Box>
              {fetchLoading && (
                <Box py="20px" alignItems={'center'} justifyContent="center">
                  <ActivityIndicator size={'large'} color="#333" />
                </Box>
              )}
              <Box pb="80px" />
            </Box>
          }
        />
      ) : (
        <Box flex={1} justifyContent="center" alignItems={'center'}>
          <DefText text="등록된 공지사항이 없습니다." />
        </Box>
      )}
      <BottomNavi screenName={name} navigation={navigation} />
    </Box>
  );
};

export default connect(({User}) => ({
  userInfo: User.userInfo, //회원정보
  user_lang: User.user_lang,
}))(NoticeList);
