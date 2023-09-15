import React, {useEffect, useState} from 'react';
import {Box, HStack} from 'native-base';
import {DefButton, DefText} from '../../../common/BOOTSTRAP';
import Header from '../../../components/Header';
import {ScrollView, StyleSheet} from 'react-native';
import {fsize, fweight} from '../../../common/StyleCommon';
import {connect} from 'react-redux';
import {actionCreators as UserAction} from '../../../redux/module/action/UserAction';
import Api from '../../../Api';
import Loading from '../../../components/Loading';
import messaging from '@react-native-firebase/messaging';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

//공지사항 상세
const NoticeInfo = props => {
  const {navigation, route, userInfo, user_lang} = props;
  const {params} = route;
  const {top} = useSafeAreaInsets();

  //console.log("params", params);

  const [loading, setLoading] = useState(true);

  const [pageText, setPageText] = useState([]);

  const [noticeDatail, setNoticeDetail] = useState('');

  const noticeDetailAPI = async () => {
    const token = await messaging().getToken(); // 앱 토큰

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
      'member_noticeDetail',
      {
        idx: params.idx,
        cidx: user_lang != null ? user_lang.cidx : userInfo.cidx,
        token: token,
      },
      args => {
        let resultItem = args.resultItem;
        let arrItems = args.arrItems;

        if (resultItem.result === 'Y' && arrItems) {
          console.log('공지사항 상세 불러오기 성공: ', resultItem, arrItems);
          setNoticeDetail(arrItems);
        } else {
          console.log('공지사항 상세 불러오기 실패!', resultItem);
        }
      },
    );
    await setLoading(false);
  };

  useEffect(() => {
    noticeDetailAPI();
  }, []);

  return (
    <Box flex={1} backgroundColor="#fff" pt={top + 'px'}>
      <Header
        navigation={navigation}
        backButtonStatus={true}
        headerTitle={pageText != '' ? pageText[0] : '공지사항'}
      />
      {loading ? (
        <Loading />
      ) : noticeDatail != '' ? (
        <ScrollView showsVerticalScrollIndicator={false}>
          <Box p="20px">
            <DefText
              text={noticeDatail.subject}
              style={[styles.noticeTitle]}
              lh={user_lang?.cidx == 9 ? 33 : ''}
            />
            <HStack
              alignItems={'center'}
              justifyContent="space-between"
              mt="10px">
              <DefText
                text={noticeDatail.name}
                style={[styles.noticeWriter]}
                lh={user_lang?.cidx == 9 ? 28 : ''}
              />
              <DefText
                text={pageText[1] + ' ' + noticeDatail.view}
                style={[styles.noticeWriter, {color: '#000'}]}
                lh={user_lang?.cidx == 9 ? 28 : ''}
              />
            </HStack>
            <Box alignItems={'flex-end'} mt="10px">
              <DefText text={noticeDatail.wdate} style={[styles.noticedate]} />
            </Box>
            <Box
              mt="10px"
              p="20px"
              backgroundColor={'#FAFAFA'}
              borderTopWidth={2}
              borderTopColor="#191919">
              <DefText
                text={noticeDatail.content}
                style={[styles.noticeContent]}
                lh={user_lang?.cidx == 9 ? 28 : ''}
              />
            </Box>
            <DefButton
              text={pageText != '' ? pageText[2] : '목록으로'}
              btnStyle={{
                backgroundColor: '#f1f1f1',
                borderRadius: 10,
                marginTop: 20,
              }}
              txtStyle={[fweight.m]}
              onPress={() => navigation.navigate('NoticeList')}
              lh={user_lang?.cidx == 9 ? 28 : ''}
            />
          </Box>
        </ScrollView>
      ) : (
        <Box>
          <DefText text="" />
        </Box>
      )}
    </Box>
  );
};

const styles = StyleSheet.create({
  noticeTitle: {
    ...fsize.fs18,
    ...fweight.bold,
    color: '#010101',
  },
  noticeWriter: {
    color: '#535353',
    ...fsize.fs15,
  },
  noticedate: {
    ...fsize.fs13,
    color: '#AEAEAE',
  },
  noticeContent: {
    ...fsize.fs14,
    color: '#010101',
  },
});

export default connect(({User}) => ({
  userInfo: User.userInfo, //회원정보
  user_lang: User.user_lang,
}))(NoticeInfo);
