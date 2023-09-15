import React, {useEffect, useState} from 'react';
import {Box, HStack} from 'native-base';
import SearchInput from '../../components/SearchInput';
import {Image, ScrollView, StyleSheet, TouchableOpacity} from 'react-native';
import {DefText} from '../../common/BOOTSTRAP';
import {
  colorSelect,
  deviceSize,
  fsize,
  fweight,
} from '../../common/StyleCommon';
import {rankSch, recentSearchData} from '../../ArrayData';
import BoxLine from '../../components/BoxLine';
import ToastMessage from '../../components/ToastMessage';
import RecentWord from '../../components/RecentWord';
import PopularWord from '../../components/PopularWord';
import Api from '../../Api';
import messaging from '@react-native-firebase/messaging';
import {connect} from 'react-redux';
import {actionCreators as UserAction} from '../../redux/module/action/UserAction';
import {useIsFocused} from '@react-navigation/native';
import {BASE_URL} from '../../Utils/APIConstant';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const SearchAll = props => {
  const {navigation, user_lang, userInfo} = props;

  const isFocused = useIsFocused();

  //검색어
  const [schText, setSchText] = useState('');
  const schChange = text => {
    setSchText(text);
  };

  const schEvent = () => {
    if (schText == '') {
      ToastMessage('검색어를 한글자 이상 입력하세요.');
      return false;
    }

    navigation.navigate('SearchResult', {schText: schText});
  };

  const [recentSchList, setRecentSchList] = useState([]);
  const [popularSchList, setPopularList] = useState([]);

  const [pageText, setPageText] = useState('');

  const eventSearchApi = async () => {
    const token = await messaging().getToken(); // 앱 토큰

    await Api.send(
      'app_page',
      {
        cidx: user_lang != null ? user_lang.cidx : userInfo?.cidx,
        code: 'eventSearch',
      },
      args => {
        let resultItem = args.resultItem;
        let arrItems = args.arrItems;

        if (resultItem.result === 'Y' && arrItems) {
          console.log('이벤트 검색 언어 리스트: ', resultItem, arrItems.text);
          setPageText(arrItems.text);
        } else {
          console.log('이벤트 검색 언어 리스트 실패!', resultItem);
        }
      },
    );

    await Api.send(
      'event_keyword',
      {cidx: user_lang != null ? user_lang.cidx : userInfo?.cidx, token: token},
      args => {
        let resultItem = args.resultItem;
        let arrItems = args.arrItems;

        if (resultItem.result === 'Y' && arrItems) {
          //console.log('이벤트 검색결과 : ', arrItems);
          setRecentSchList(arrItems.member);
          setPopularList(arrItems.hot);
        } else {
          console.log('이벤트 검색결과 실패!', resultItem);
        }
      },
    );
  };

  useEffect(() => {
    if (isFocused) {
      eventSearchApi();
    }
  }, [isFocused]);

  // 최근 검색어 삭제 클릭한 아이템명
  const [delIdx, setDelIdx] = useState('');

  useEffect(() => {
    if (delIdx != '') {
      recentKeywordDel(delIdx);
    }
  }, [delIdx]);

  const recentKeywordDel = async (keyword, status) => {
    if (keyword != '') {
      const token = await messaging().getToken(); // 앱 토큰

      await Api.send(
        'event_keywordDel',
        {all: '', keyword: keyword, token: token},
        args => {
          let resultItem = args.resultItem;
          let arrItems = args.arrItems;

          if (resultItem.result === 'Y' && arrItems) {
            console.log('이벤트 삭제결과 : ', resultItem);
            eventSearchApi();
          } else {
            console.log('이벤트 삭제결과 실패!', resultItem);
          }
        },
      );
    }
  };

  const recentAllKeywordDel = async () => {
    const token = await messaging().getToken(); // 앱 토큰
    await Api.send(
      'event_keywordDel',
      {all: 'true', keyword: '', token: token},
      args => {
        let resultItem = args.resultItem;
        let arrItems = args.arrItems;

        if (resultItem.result === 'Y' && arrItems) {
          console.log('이벤트 삭제결과 : ', resultItem);
          eventSearchApi();
        } else {
          console.log('이벤트 삭제결과 실패!', resultItem);
        }
      },
    );
  };

  const {top} = useSafeAreaInsets();

  return (
    <Box flex={1} backgroundColor="#fff" pt={top + 'px'}>
      <Box p="20px" pb="20px">
        <HStack
          justifyContent={'space-between'}
          width={deviceSize.deviceWidth - 40}
          flexWrap="wrap">
          <Box style={[styles.backButton]}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Image
                source={{uri: BASE_URL + '/images/backButton.png'}}
                style={{
                  width: 28,
                  height: 16,
                  resizeMode: 'contain',
                }}
              />
            </TouchableOpacity>
          </Box>
          <Box width={(deviceSize.deviceWidth - 40) * 0.75}>
            <SearchInput
              placeholder={
                pageText != '' ? pageText[0] : '시술명을 검색하세요.'
              }
              value={schText}
              onChangeText={schChange}
              inputStyle={{
                paddingLeft: 15,
                backgroundColor: '#F2F3F5',
                borderWidth: 0,
                lineHeight: 20,
              }}
              positionMargin={'-24px'}
              buttonPositionRight={0}
              onPress={schEvent}
              onSubmitEditing={schEvent}
            />
          </Box>
          <TouchableOpacity
            style={{
              width: (deviceSize.deviceWidth - 40) * 0.12,
              height: 48,
              justifyContent: 'center',
              alignItems: 'flex-end',
            }}
            onPress={() => navigation.goBack()}>
            <DefText
              text={pageText != '' ? pageText[1] : '취소'}
              style={[fsize.fs14, {color: '#191919'}]}
            />
          </TouchableOpacity>
        </HStack>
      </Box>
      <ScrollView>
        {recentSchList != '' && (
          <>
            <Box pt="0" p="20px">
              <RecentWord
                recentSchData={recentSchList}
                navigation={navigation}
                setDelIdx={setDelIdx}
                allRecentRemove={recentAllKeywordDel}
                titles={pageText != '' ? pageText[2] : '최근 검색어'}
                allDeleteText={pageText != '' ? pageText[3] : '전체 삭제'}
              />
            </Box>
            <BoxLine />
          </>
        )}

        {popularSchList != '' && (
          <>
            <PopularWord
              rankSchData={popularSchList}
              navigation={navigation}
              titles={pageText != '' ? pageText[4] : '인기 검색어'}
            />
          </>
        )}
      </ScrollView>
    </Box>
  );
};

const styles = StyleSheet.create({
  label: {
    ...fsize.fs14,
    ...fweight.bold,
    color: '#000000',
  },
  recentButton: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: '#E9ECEF',
    marginRight: 10,
    marginTop: 10,
  },
  popularButton: {
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E3E3E3',
  },
  backButton: {
    justifyContent: 'center',
    alignItems: 'flex-start',
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
)(SearchAll);
