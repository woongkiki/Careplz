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
import {BASE_URL} from '../../Utils/APIConstant';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import Shop from './Shop';
import ShopLank from './ShopLank';
import SpecialPrice from './SpecialPrice';
import Cart from './Cart';
import ShopMypage from './ShopMypage';

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
    navigation.navigate('ShopNavi', {
      screen: screenName,
    });
  };

  useEffect(() => {
    return () => {
      console.log('clena up custom tabbar');
    };
  }, [user_lang]);

  return (
    <HStack backgroundColor={'#fff'} shadow={9} justifyContent={'space-around'}>
      <TouchableOpacity
        activeOpacity={1}
        style={[
          {
            width: tabBarWidth,
            alignItems: 'center',
            justifyContent: 'center',
            height: 70,
          },
        ]}
        onPress={() => TabNaviMove('Shop')}>
        <Image
          source={{
            uri:
              screenName == 'Shop'
                ? BASE_URL + '/shopImg/shop_home_icon_on.png'
                : BASE_URL + '/shopImg/shop_home_icon_off.png',
          }}
          style={{
            width: 22,
            height: 22,
            resizeMode: 'contain',
          }}
        />
        <DefText
          text={'홈'}
          style={[
            fsize.fs12,
            screenName == 'Shop' ? fweight.bold : fweight.r,
            {
              color: screenName == 'Shop' ? colorSelect.pink_de : '#A0A8B1',
              marginTop: 10,
            },
          ]}
        />
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={1}
        style={[
          {
            width: tabBarWidth,
            alignItems: 'center',
            justifyContent: 'center',
            height: 70,
          },
        ]}
        onPress={() => TabNaviMove('ShopLank')}>
        <Image
          source={{
            uri:
              screenName == 'ShopLank'
                ? BASE_URL + '/shopImg/shop_lank_icon_on.png'
                : BASE_URL + '/shopImg/shop_lank_icon_off2.png',
          }}
          style={{
            width: 21,
            height: 22,
            resizeMode: 'contain',
          }}
        />
        <DefText
          text={'랭킹'}
          style={[
            fsize.fs12,
            screenName == 'ShopLank' ? fweight.bold : fweight.r,
            {
              color: screenName == 'ShopLank' ? colorSelect.pink_de : '#A0A8B1',
              marginTop: 10,
            },
          ]}
        />
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={1}
        style={[
          {
            width: tabBarWidth,
            alignItems: 'center',
            justifyContent: 'center',
            height: 70,
          },
        ]}
        onPress={() => TabNaviMove('SpecialPrice')}>
        <Image
          source={{
            uri:
              screenName == 'SpecialPrice'
                ? BASE_URL + '/shopImg/shop_special_icon_on.png'
                : BASE_URL + '/shopImg/shop_special_icon_off.png',
          }}
          style={{
            width: 21,
            height: 22,
            resizeMode: 'contain',
          }}
        />
        <DefText
          text={'특가기획전'}
          style={[
            fsize.fs12,
            screenName == 'SpecialPrice' ? fweight.bold : fweight.r,
            {
              color:
                screenName == 'SpecialPrice' ? colorSelect.pink_de : '#A0A8B1',
              marginTop: 10,
            },
          ]}
        />
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={1}
        style={[
          {
            width: tabBarWidth,
            alignItems: 'center',
            justifyContent: 'center',
            height: 70,
          },
        ]}
        onPress={() => TabNaviMove('Cart')}>
        <Image
          source={{
            uri:
              screenName == 'Cart'
                ? BASE_URL + '/shopImg/shop_cart_icon_on.png'
                : BASE_URL + '/shopImg/shop_cart_icon_off.png',
          }}
          style={{
            width: 21,
            height: 22,
            resizeMode: 'contain',
          }}
        />
        <DefText
          text={'장바구니'}
          style={[
            fsize.fs12,
            screenName == 'Cart' ? fweight.bold : fweight.r,
            {
              color: screenName == 'Cart' ? colorSelect.pink_de : '#A0A8B1',
              marginTop: 10,
            },
          ]}
        />
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={1}
        style={[
          {
            width: tabBarWidth,
            alignItems: 'center',
            justifyContent: 'center',
            height: 70,
          },
        ]}
        onPress={() => TabNaviMove('ShopMypage')}>
        <Image
          source={{
            uri:
              screenName == 'ShopMypage'
                ? BASE_URL + '/shopImg/shop_mypage_icon_on.png'
                : BASE_URL + '/shopImg/shop_mypage_icon_off.png',
          }}
          style={{
            width: 21,
            height: 22,
            resizeMode: 'contain',
          }}
        />
        <DefText
          text={'마이페이지'}
          style={[
            fsize.fs12,
            screenName == 'ShopMypage' ? fweight.bold : fweight.r,
            {
              color:
                screenName == 'ShopMypage' ? colorSelect.pink_de : '#A0A8B1',
              marginTop: 10,
            },
          ]}
        />
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

const ShopNavi = props => {
  const {navigation, user_lang, userInfo, usernoti, notichk, route} = props;
  const {params} = route;

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
      tabBar={props => (
        <CustomTabBar {...props} user_lang={user_lang} userInfo={userInfo} />
      )}
      backBehavior={'history'}>
      <Tab.Screen name="Shop" component={Shop} />
      <Tab.Screen name="ShopLank" component={ShopLank} />
      <Tab.Screen name="SpecialPrice" component={SpecialPrice} />
      <Tab.Screen name="Cart" component={Cart} />
      {/* <Tab.Screen name="Chat" component={Chat} /> */}
      <Tab.Screen name="ShopMypage" component={ShopMypage} />
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
)(ShopNavi);
