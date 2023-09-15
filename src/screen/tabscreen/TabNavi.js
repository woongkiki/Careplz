import React, {useEffect, useState} from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  View,
  Platform,
  Text,
  LogBox,
} from 'react-native';
import {Box, VStack, HStack} from 'native-base';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import messaging from '@react-native-firebase/messaging';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import {DefText} from '../../common/BOOTSTRAP';
import Toast from 'react-native-toast-message';
import {connect} from 'react-redux';
import {actionCreators as UserAction} from '../../redux/module/action/UserAction';
import {
  colorSelect,
  deviceSize,
  fsize,
  fweight,
} from '../../common/StyleCommon';
import Event from './Event';
import Chat from './Chat';
import HospitalMap from './HospitalMap';
import HospitalMap2 from './HospitalMap2';
import Untact from './Untact';
import Mypage from './Mypage';
import ToastMessage from '../../components/ToastMessage';
import Api from '../../Api';
import {textLengthOverCut} from '../../common/DataFunction';
import {URLSearchParams} from 'react-native-url-polyfill';
import ReservationList from './ReservationList';
import HealthHandbook from './HealthHandbook';
import {BASE_URL} from '../../Utils/APIConstant';
import {getStatusBarHeight} from 'react-native-status-bar-height';

LogBox.ignoreLogs([
  'EventEmitter.removeListener',
  'Possible Unhandled Promise Rejection',
]);

const Tab = createBottomTabNavigator();

const tabBarWidth = deviceSize.deviceWidth / 5;

function CustomTabBar(props) {
  const {state, navigation, user_lang, dynLink, usernoti, userInfo} = props;

  const screenName = state.routes[state.index].name; //tabbar 현재 스크린명

  //console.log('tab navis:::', usernoti);

  //페이지 이동
  //console.log("user_lang",user_lang);

  const TabNaviMove = screenName => {
    if (screenName == 'HospitalMap') {
      navigation.navigate('TabNavi', {
        screen: screenName,
        params: {
          schText: '',
        },
      });
    } else {
      navigation.navigate('TabNavi', {
        screen: screenName,
      });
    }
  };

  const [pageText, setPageText] = useState([]);

  const pageLanguage = () => {
    Api.send('app_page', {cidx: user_lang?.cidx, code: 'FOOTER'}, args => {
      let resultItem = args.resultItem;
      let arrItems = args.arrItems;

      if (resultItem.result === 'Y' && arrItems) {
        //console.log('회원가입 언어 리스트: ', resultItem, arrItems);
        //setPageText(arrItems.text);

        setPageText(arrItems.text);
      } else {
        console.log('회원가입 언어 리스트 실패!', resultItem);
      }
    });
  };

  useEffect(() => {
    pageLanguage();

    return () => {
      console.log('clena up custom tabbar');
    };
  }, [user_lang]);

  return (
    <HStack
      backgroundColor={'#fff'}
      shadow={9}
      p="20px"
      justifyContent={'space-around'}>
      <TouchableOpacity activeOpacity={1} onPress={() => TabNaviMove('Event')}>
        <HStack
          py="10px"
          px="13px"
          backgroundColor={
            screenName == 'Event' ? colorSelect.pink_de : colorSelect.white
          }
          borderRadius={20}
          alignItems={'center'}
          justifyContent={'center'}>
          <Image
            source={{
              uri:
                screenName == 'Event'
                  ? BASE_URL + '/newImg/tabbar01_on.png'
                  : BASE_URL + '/newImg/tabbar01_off.png',
            }}
            style={{
              width: 23,
              height: 22,
              resizeMode: 'contain',
            }}
          />
          {screenName == 'Event' && (
            <Box ml="10px">
              <DefText
                text={'홈'}
                style={[
                  fsize.fs13,
                  fweight.bold,
                  {color: colorSelect.white, lineHeight: 19},
                ]}
              />
            </Box>
          )}
        </HStack>
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => TabNaviMove('HospitalMap')}>
        <HStack
          py="10px"
          px="13px"
          backgroundColor={
            screenName == 'HospitalMap'
              ? colorSelect.pink_de
              : colorSelect.white
          }
          borderRadius={20}>
          <Image
            source={{
              uri:
                screenName == 'HospitalMap'
                  ? BASE_URL + '/newImg/tabbar02_on.png'
                  : BASE_URL + '/newImg/tabbar02_off.png',
            }}
            style={{
              width: 23,
              height: 22,
              resizeMode: 'contain',
            }}
          />
          {screenName == 'HospitalMap' && (
            <Box ml="10px">
              <DefText
                text={'병원/약국'}
                style={[
                  fsize.fs13,
                  fweight.bold,
                  {color: colorSelect.white, lineHeight: 19},
                ]}
              />
            </Box>
          )}
        </HStack>
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => TabNaviMove('ReservationList')}>
        <HStack
          py="10px"
          px="13px"
          backgroundColor={
            screenName == 'ReservationList'
              ? colorSelect.pink_de
              : colorSelect.white
          }
          borderRadius={20}>
          <Image
            source={{
              uri:
                screenName == 'ReservationList'
                  ? BASE_URL + '/newImg/tabbar03_on.png'
                  : BASE_URL + '/newImg/tabbar03_off.png',
            }}
            style={{
              width: 23,
              height: 22,
              resizeMode: 'contain',
            }}
          />
          {screenName == 'ReservationList' && (
            <Box ml="10px">
              <DefText
                text={'진료내역'}
                style={[
                  fsize.fs13,
                  fweight.bold,
                  {color: colorSelect.white, lineHeight: 19},
                ]}
              />
            </Box>
          )}
        </HStack>
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={1}
        onPress={() => TabNaviMove('HealthHandbook')}>
        <HStack
          py="10px"
          px="13px"
          backgroundColor={
            screenName == 'HealthHandbook'
              ? colorSelect.pink_de
              : colorSelect.white
          }
          borderRadius={20}>
          <Image
            source={{
              uri:
                screenName == 'HealthHandbook'
                  ? BASE_URL + '/newImg/tabbar04_on.png'
                  : BASE_URL + '/newImg/tabbar04_off.png',
            }}
            style={{
              width: 23,
              height: 22,
              resizeMode: 'contain',
            }}
          />
          {screenName == 'HealthHandbook' && (
            <Box ml="10px">
              <DefText
                text={'건강수첩'}
                style={[
                  fsize.fs13,
                  fweight.bold,
                  {color: colorSelect.white, lineHeight: 19},
                ]}
              />
            </Box>
          )}
        </HStack>
      </TouchableOpacity>

      <TouchableOpacity activeOpacity={1} onPress={() => TabNaviMove('Mypage')}>
        <HStack
          py="10px"
          px="13px"
          backgroundColor={
            screenName == 'Mypage' ? colorSelect.pink_de : colorSelect.white
          }
          borderRadius={20}>
          <Image
            source={{
              uri:
                screenName == 'Mypage'
                  ? BASE_URL + '/newImg/tabbar05_on.png'
                  : BASE_URL + '/newImg/tabbar05_off.png',
            }}
            style={{
              width: 23,
              height: 22,
              resizeMode: 'contain',
            }}
          />
          {screenName == 'Mypage' && (
            <Box ml="10px">
              <DefText
                text={'내정보'}
                style={[
                  fsize.fs13,
                  fweight.bold,
                  {color: colorSelect.white, lineHeight: 19},
                ]}
              />
            </Box>
          )}
        </HStack>
      </TouchableOpacity>
    </HStack>
  );
}

const styles = StyleSheet.create({
  TabBarMainContainer: {
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 70,
    flexDirection: 'row',
    width: '100%',
    backgroundColor: '#fff',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',

    height: 74,
    justifyContent: 'center',
    backgroundColor: '#fff',
    alignItems: 'center',
    //borderTopWidth:1,
    //borderTopColor:'#e3e3e3'
  },
  tabButtonText: {
    ...fsize.fs13,
    //color: '#707070',
    //marginTop: 10,
    marginLeft: 10,
    textAlign: 'center',
  },
  tabButtonTextOn: {
    color: '#0195FF',
  },
});

const TabNavi = props => {
  const {navigation, user_lang, userInfo, usernoti, notichk, route} = props;
  const {params} = route;

  const notiChkHandler = async () => {
    const formData = new FormData();
    formData.append('id', userInfo?.id);
    formData.append('method', 'member_notichk');

    const chat_cnt = await notichk(formData);

    //console.log('유저 예약 체크::::', chat_cnt);
  };

  useEffect(() => {
    notiChkHandler();
  }, []);

  useEffect(() => {
    //requestUserPermission();

    //푸쉬메시지 앱 실행중에 받을 때
    messaging().onMessage(remoteMessage => {
      if (remoteMessage.data?.message != '') {
        Toast.show({
          type: 'info', //success | error | info
          position: 'top',
          text1: remoteMessage.notification.title,
          text2: remoteMessage.notification.body,
          visibilityTime: 3000,
          // autoHide: remoteMessage.data.intent === 'SellerReg' ? false : true,    // true | false
          topOffset: Platform.OS === 'ios' ? 10 + getStatusBarHeight() : 10,
          style: {backgroundColor: 'red'},
          bottomOffset: 100,
          onShow: () => {},
          onHide: () => {},
          onPress: () => {
            //console.log('12312312313::::', remoteMessage.data)
            if (
              remoteMessage.data?.intent != null &&
              remoteMessage.data?.intent != ''
            ) {
            }
          },
        });
      }

      console.log('실행중 메시지:::', remoteMessage);
    });

    //포그라운드 상태에서 받음
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('onNotificationOpenedApp', remoteMessage);
      if (
        remoteMessage.data?.intent != null &&
        remoteMessage.data?.intent != ''
      ) {
      }
      console.log('포그라운드');
    });

    // 백그라운드
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (
          remoteMessage.data?.intent != null &&
          remoteMessage.data?.intent != ''
        ) {
        }
        console.log('백그라운드');
      });

    // Register background handler
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message handled in the background!', remoteMessage);
    });
  }, []);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
      tabBar={props => (
        <CustomTabBar
          {...props}
          user_lang={user_lang}
          usernoti={usernoti}
          userInfo={userInfo}
        />
      )}
      backBehavior={'history'}>
      <Tab.Screen
        name="Event"
        component={Event}
        initialParams={{dynLink: params?.dynLink}}
      />
      <Tab.Screen name="HospitalMap" component={HospitalMap} />
      <Tab.Screen name="ReservationList" component={ReservationList} />
      <Tab.Screen name="HealthHandbook" component={HealthHandbook} />
      {/* <Tab.Screen name="Chat" component={Chat} /> */}
      <Tab.Screen name="Mypage" component={Mypage} />
    </Tab.Navigator>
  );
};

export default connect(
  ({User}) => ({
    userInfo: User.userInfo, //회원정보
    user_lang: User.user_lang,
    usernoti: User.usernoti,
  }),
  dispatch => ({
    member_login: user => dispatch(UserAction.member_login(user)), //로그인
    languageSet: user => dispatch(UserAction.languageSet(user)), //선택언어
    notichk: user => dispatch(UserAction.notichk(user)),
  }),
)(TabNavi);
