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
import messaging from '@react-native-firebase/messaging';
import ToastMessage from '../../components/ToastMessage';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const EventRecent = props => {
  const {navigation, userInfo, user_lang} = props;

  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [recentEvnetList, setRecentEventList] = useState([]);
  const [pageText, setPageText] = useState('');
  const [commonText, setCommonText] = useState('');

  const recentEvent = async () => {
    const token = await messaging().getToken(); // 앱 토큰

    await setLoading(true);
    await Api.send(
      'app_page',
      {
        cidx: user_lang != null ? user_lang.cidx : userInfo.cidx,
        code: 'recentEvent',
      },
      args => {
        let resultItem = args.resultItem;
        let arrItems = args.arrItems;

        if (resultItem.result === 'Y' && arrItems) {
          console.log('이벤트 메인 언어 리스트: ', resultItem, arrItems.text);
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
          console.log('공통 언어 리스트: ', resultItem, arrItems.text);
          setCommonText(arrItems.text);
        } else {
          console.log('공통 언어 리스트 실패!', resultItem);
        }
      },
    );
    await Api.send(
      'event_recent',
      {
        id: userInfo?.id,
        page: page,
        token: token,
        cidx: user_lang != null ? user_lang.cidx : userInfo.cidx,
      },
      args => {
        let resultItem = args.resultItem;
        let arrItems = args.arrItems;

        if (resultItem.result === 'Y' && arrItems) {
          console.log('최근 본 이벤트 리스트: ', resultItem, arrItems);
          setRecentEventList(arrItems);
        } else {
          console.log('최근 본 이벤트 리스트 실패!', resultItem);
          setRecentEventList([]);
        }
      },
    );
    await setLoading(false);
  };

  useEffect(() => {
    recentEvent();
  }, []);

  const keyExtractorMain = useCallback(item => item.idx.toString(), []);

  //찜 목록 추가
  const wishApiHandler = event => {
    console.log('event', event);

    let eventIdx = recentEvnetList.indexOf(event);

    let eventItem = [...recentEvnetList];

    let eventidxNum = eventItem[eventIdx].idx;

    //위시체크 변경
    if (eventItem[eventIdx].wishchk == 1) {
      eventItem[eventIdx].wishchk = 0;
      eventItem[eventIdx].wish = parseInt(eventItem[eventIdx].wish) - 1;
    } else {
      eventItem[eventIdx].wishchk = 1;
      eventItem[eventIdx].wish = parseInt(eventItem[eventIdx].wish) + 1;
    }

    setRecentEventList(eventItem);

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
        headerTitle={pageText != '' ? pageText[0] : '최근 본 이벤트'}
        navigation={navigation}
        backButtonStatus={true}
      />
      {loading ? (
        <Loading />
      ) : recentEvnetList != '' ? (
        <FlatList
          data={recentEvnetList}
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
                        cidx: user_lang.cidx,
                      })
                    }
                    conprice={item.conprice}
                    area={item.area}
                  />
                </Box>
              </Box>
            );
          }}
        />
      ) : (
        <Box flex={1}>
          <EmptyPage
            emptyText={
              pageText != '' ? pageText[1] : '최근 본 이벤트가 없습니다.'
            }
          />
        </Box>
      )}
    </Box>
  );
};

export default connect(({User}) => ({
  userInfo: User.userInfo, //회원정보
  user_lang: User.user_lang,
}))(EventRecent);
