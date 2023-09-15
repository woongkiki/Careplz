import React, {useEffect, useState} from 'react';
import {Box, HStack, Switch} from 'native-base';
import {DefText} from '../../../common/BOOTSTRAP';
import Header from '../../../components/Header';
import {Platform, ScrollView, StyleSheet} from 'react-native';
import {colorSelect, fsize, fweight} from '../../../common/StyleCommon';
import Api from '../../../Api';
import {connect} from 'react-redux';
import {actionCreators as UserAction} from '../../../redux/module/action/UserAction';
import ToastMessage from '../../../components/ToastMessage';
import Loading from '../../../components/Loading';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import BottomNavi from '../../../components/bottom/BottomNavi';

//알림 설정
const NotificationSetting = props => {
  const {navigation, userInfo, user_lang, member_info, route} = props;
  const {name} = route;

  const {top} = useSafeAreaInsets();

  //앱 페이지 텍스트
  const [pageText, setPageText] = useState([]);

  const pageLanguage = async () => {
    //user_lang != null ? user_lang.cidx : userInfo.cidx
    await Api.send(
      'app_page',
      {
        cidx: user_lang != null ? user_lang.cidx : userInfo.cidx,
        code: 'setPush',
      },
      args => {
        let resultItem = args.resultItem;
        let arrItems = args.arrItems;

        if (resultItem.result === 'Y' && arrItems) {
          //console.log('알림설정 언어 리스트: ', resultItem, arrItems.text);
          setPageText(arrItems.text);
        } else {
          console.log('알림설정', resultItem);
        }
      },
    );
  };

  const [notificationStatus, setNotificationStatus] = useState(false);
  const [notifiNumber, setNoitifiNumber] = useState('0');

  useEffect(() => {
    pageLanguage();

    if (userInfo != '') {
      if (userInfo?.resms == 1 || userInfo?.resms) {
        setNotificationStatus(true);
        setNoitifiNumber('1');
      }

      if (userInfo?.resms == 0 || !userInfo?.resms) {
        setNotificationStatus(false);
        setNoitifiNumber('0');
      }
    }
  }, []);

  const [loading, setLoading] = useState(false);
  const [dates, setDates] = useState('');

  const setPushApi = async () => {
    console.log(notifiNumber);
    await setLoading(true);
    await Api.send(
      'member_setPush',
      {
        cidx: user_lang != null ? user_lang.cidx : userInfo.cidx,
        id: userInfo.id,
        resms: notifiNumber,
      },
      args => {
        let resultItem = args.resultItem;
        let arrItems = args.arrItems;

        if (resultItem.result === 'Y' && arrItems) {
          console.log('마케팅 알림 설정 성공: ', resultItem, arrItems);
          setDates(arrItems.redate);
          member_info_handler();
        } else {
          console.log('마케팅 알림 설정 실패', resultItem);
        }
      },
    );
    await setLoading(false);
  };

  const member_info_handler = async () => {
    const formData = new FormData();
    formData.append('method', 'member_info');
    formData.append('id', userInfo.id);
    formData.append('cidx', userInfo.cidx);

    const member_info_list = await member_info(formData);

    console.log('회원정보  확인:::', member_info_list);
  };

  const notiChange = status => {
    console.log(status);

    setNotificationStatus(status);
    if (status) {
      setNoitifiNumber('1');
    } else {
      setNoitifiNumber('0');
    }
  };

  useEffect(() => {
    console.log('notifiNumber', notifiNumber);
    setPushApi();
  }, [notifiNumber]);

  // useEffect(() => {

  //     console.log("notificationStatus::",notificationStatus);
  //     setPushApi();

  // }, [notificationStatus])

  return (
    <Box flex={1} backgroundColor="#fff" pt={top + 'px'}>
      <Header
        navigation={navigation}
        backButtonStatus={true}
        headerTitle={pageText != '' ? pageText[0] : '알림설정'}
      />
      {loading ? (
        <Loading />
      ) : (
        <ScrollView>
          <Box p="20px">
            <Box>
              <DefText
                text={pageText != '' ? pageText[1] : '마케팅 알림'}
                style={[styles.labelTitle]}
                lh={user_lang?.cidx == 9 ? 30 : ''}
              />
              <DefText
                text={
                  pageText != ''
                    ? pageText[2]
                    : '이용자는 마케팅 활용에 대한 동의를 거부할 권리가 있으며, 미동의 시에도 서비스를 이용할 수 있습니다.'
                }
                style={[styles.infoText]}
                lh={user_lang?.cidx == 9 ? 27 : ''}
              />
            </Box>
            <HStack
              mt="30px"
              alignItems={'center'}
              justifyContent="space-between">
              <Box width="75%">
                <DefText
                  text={
                    pageText != '' ? pageText[3] : '마케팅 정보 수신 동의 알림'
                  }
                  style={[styles.marketingTitle]}
                  lh={user_lang?.cidx == 9 ? 27 : ''}
                />
                <DefText
                  text={
                    dates + ' ' + (pageText != '' ? pageText[5] : '업데이트함')
                  }
                  style={[styles.marketingUpdateTime]}
                  lh={user_lang?.cidx == 9 ? 27 : ''}
                />
              </Box>
              <Box width="25%" alignItems="flex-end">
                <Switch
                  isChecked={notificationStatus}
                  size={Platform.OS == 'ios' ? 'md' : 'lg'}
                  onTrackColor={colorSelect.navy}
                  onToggle={() => notiChange(!notificationStatus)}
                />
              </Box>
            </HStack>
          </Box>
        </ScrollView>
      )}
      <BottomNavi screenName={name} navigation={navigation} />
    </Box>
  );
};

const styles = StyleSheet.create({
  labelTitle: {
    ...fweight.m,
    color: '#141414',
  },
  infoText: {
    ...fsize.fs14,
    color: '#878787',
    lineHeight: 26,
    marginTop: 5,
  },
  marketingTitle: {
    ...fsize.fs13,
    ...fweight.bold,
  },
  marketingUpdateTime: {
    ...fsize.fs12,
    color: '#838794',
    marginTop: 5,
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
    member_info: user => dispatch(UserAction.member_info(user)), //회원 정보 조회
  }),
)(NotificationSetting);
