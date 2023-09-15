import React, {useEffect, useState} from 'react';
import {extendTheme, NativeBaseProvider, Box, Text, Image} from 'native-base';
import Theme from '../common/Theme';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import store from '../redux/configureStore';
import {Provider} from 'react-redux';
import {Provider as PaperProvider} from 'react-native-paper';
import {
  View,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Platform,
  LogBox,
} from 'react-native';
import Toast from 'react-native-toast-message';

//스크린
import Intro from './main/Intro';
import Login from './main/Login';
import Register from './main/Register';
import TabNavi from './tabscreen/TabNavi';
import RegisterEnd from './main/RegisterEnd';
import IdSearch from './main/IdSearch';
import IdSearchResult from './main/IdSearchResult';
import CustomerCenterQaForm from './contact/CustomerCenterQaForm';
import PasswordSearch from './main/PasswordSearch';
import PasswordSearchResult from './main/PasswordSearchResult';
import LanguageSelect from './main/LanguageSelect';
import AccountUpdate from './mypage/account/AccountUpdate';
import AccountLeave from './mypage/account/AccountLeave';
import MyReservationList from './mypage/reservation/MyReservationList';
import ServiceQaForm from './mypage/qa/ServiceQaForm';
import NotificationSetting from './mypage/notification/NotificationSetting';
import NoticeList from './mypage/notice/NoticeList';
import NoticeInfo from './mypage/notice/NoticeInfo';
import SearchAll from './event/SearchAll';
import SearchResult from './event/SearchResult';
import WishList from './mypage/wish/WishList';
import UntactClinicInfo from './untact/UntactClinicInfo';
import UntactReservation from './untact/UntactReservation';
//import UntactEnd from './untact/UntactEnd';
import CardForm from './mypage/card/CardForm';
import UntactReservationMyInfo from './untact/UntactReservationMyInfo';
import UntactDoctor from './untact/UntactDoctor';
import UntactClinicEndInfo from './untact/UntactClinicEndInfo';
import UntactTakeMedicine from './untact/UntactTakeMedicine';
import UntactTakeMedicineAddr from './untact/UntactTakeMedicineAddr';
import UntactPharmacy from './untact/UntactPharmacy';
import UntactMap from './untact/UntactMap';
import EventList from './event/EventList';
import EventInfo from './event/EventInfo';
import Review from './event/Review';
import EventReservation from './event/EventReservation';
import HospitalSearch from './hospital/HospitalSearch';
import HospitalInfo from './hospital/HospitalInfo';
import HospitalInfoMap from './hospital/HospitalInfoMap';
import HospitalReview from './hospital/HospitalReview';
import HospitalReservationType from './hospital/HospitalReservationType';
import HospitalReservationMessage from './hospital/HospitalReservationMessage';
import HospitalReservationDateTime from './hospital/HospitalReservationDateTime';
import HospitalReservationRequest from './hospital/HospitalReservationRequest';
import HospitalReservationConfirm from './hospital/HospitalReservationConfirm';
import PrivacyPolicy from './mypage/privacy/PrivacyPolicy';
import PolicyList from './mypage/privacy/PolicyList';
import TermUse from './mypage/privacy/TermUse';
import EventPolicy from './mypage/privacy/EventPolicy';
import PolicyDetail from './mypage/privacy/PolicyDetail';
import EventRecent from './event/EventRecent';
import EventReservationView from './event/EventReservationView';
import HospitalReservationView from './hospital/HospitalReservationView';
import UntactReservationDateTime from './untact/UntactReservationDateTime';
import UntactReservationConfirm from './untact/UntactReservationConfirm';
import UntactReservationView from './untact/UntactReservationView';
//import UntactCall from './untact/UntactCall';
import ReviewList from './hospital/ReviewList';
import EventReview from './event/EventReview';
import UntactEndReview from './untact/UntactEndReview';

import {URLSearchParams} from 'react-native-url-polyfill';
import EventReviewList from './event/EventReviewList';
import UntactMapHeader from './untact/UntactMapHeader';
import MyReview from './mypage/review/MyReview';
import ReviewImageView from './mypage/review/ReviewImageView';
import ReviewUpdate from './mypage/review/ReviewUpdate';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import EventReservationEnd from './event/EventReservationEnd';
import Manager from './mypage/manager/Manager';
import RegisterInterests from './main/RegisterInterests';
import RegisterInterests2 from './main/RegisterInterests2';
import HospitalReservationType2 from './hospital/HospitalReservationType2';
import HospitalReservationCate from './hospital/HospitalReservationCate';
import HospitalReReservation from './hospital/HospitalReReservation';
import HospitalList from './hospital/HospitalList';
import ChatList from './chat/ChatList';
import ChatView from './chat/ChatView';
import NoticeLists from './notice/NoticeLists';
import NotificationHistory from './notice/NotificationHistory';
import DoctorInfo from './hospital/DoctorInfo';
import ShopNavi from './shop/ShopNavi';
import ShopRecent from './shop/recent/ShopRecent';
import OrderDeliverySearch from './shop/subpage/shopmypage/OrderDeliverySearch';
import HospitalSelect from './hospital/HospitalSelect';

LogBox.ignoreLogs(['EventEmitter.removeListener']);

const Stack = createStackNavigator();

const theme = extendTheme({Theme});

const Main = props => {
  const {dynLink} = props;
  console.log('dynLink', dynLink);

  const toastConfig = {
    custom_type: internalState => (
      <View
        style={{
          backgroundColor: '#000000e0',
          borderRadius: 10,
          paddingVertical: 10,
          paddingHorizontal: 20,
          opacity: 0.8,
        }}>
        <Text
          style={{
            textAlign: 'center',
            color: '#FFFFFF',
            fontSize: 15,
            lineHeight: 22,
            letterSpacing: -0.38,
          }}>
          {internalState.text1}
        </Text>
      </View>
    ),
  };

  return (
    <Provider store={store}>
      <PaperProvider>
        <NativeBaseProvider theme={theme}>
          <NavigationContainer>
            <SafeAreaProvider>
              <SafeAreaView edges={['bottom']} style={{flex: 1}}>
                <Stack.Navigator
                  screenOptions={{
                    headerShown: false,
                  }}>
                  <Stack.Screen name="Intro" component={Intro} />
                  <Stack.Screen
                    name="LanguageSelect"
                    component={LanguageSelect}
                  />
                  <Stack.Screen name="Login" component={Login} />
                  <Stack.Screen name="Register" component={Register} />
                  <Stack.Screen
                    name="RegisterInterests"
                    component={RegisterInterests}
                  />
                  <Stack.Screen
                    name="RegisterInterests2"
                    component={RegisterInterests2}
                  />
                  <Stack.Screen name="RegisterEnd" component={RegisterEnd} />
                  <Stack.Screen name="IdSearch" component={IdSearch} />
                  <Stack.Screen
                    name="IdSearchResult"
                    component={IdSearchResult}
                  />
                  <Stack.Screen
                    name="CustomerCenterQaForm"
                    component={CustomerCenterQaForm}
                  />
                  <Stack.Screen
                    name="PasswordSearch"
                    component={PasswordSearch}
                  />
                  <Stack.Screen
                    name="PasswordSearchResult"
                    component={PasswordSearchResult}
                  />
                  <Stack.Screen
                    name="TabNavi"
                    component={TabNavi}
                    initialParams={{dynLink: dynLink}}
                  />
                  <Stack.Screen
                    name="AccountUpdate"
                    component={AccountUpdate}
                  />
                  <Stack.Screen name="AccountLeave" component={AccountLeave} />
                  <Stack.Screen
                    name="MyReservationList"
                    component={MyReservationList}
                  />
                  <Stack.Screen
                    name="ServiceQaForm"
                    component={ServiceQaForm}
                  />
                  <Stack.Screen
                    name="NotificationSetting"
                    component={NotificationSetting}
                  />
                  <Stack.Screen name="NoticeList" component={NoticeList} />
                  <Stack.Screen name="NoticeInfo" component={NoticeInfo} />
                  <Stack.Screen name="SearchAll" component={SearchAll} />
                  <Stack.Screen name="SearchResult" component={SearchResult} />
                  <Stack.Screen name="WishList" component={WishList} />
                  <Stack.Screen
                    name="UntactClinicInfo"
                    component={UntactClinicInfo}
                  />
                  <Stack.Screen
                    name="UntactReservation"
                    component={UntactReservation}
                  />
                  <Stack.Screen name="CardForm" component={CardForm} />
                  <Stack.Screen
                    name="UntactReservationMyInfo"
                    component={UntactReservationMyInfo}
                  />
                  <Stack.Screen name="UntactDoctor" component={UntactDoctor} />
                  <Stack.Screen name="EventList" component={EventList} />
                  <Stack.Screen name="EventInfo" component={EventInfo} />
                  <Stack.Screen name="Review" component={Review} />
                  <Stack.Screen
                    name="EventReservation"
                    component={EventReservation}
                  />
                  <Stack.Screen
                    name="HospitalSearch"
                    component={HospitalSearch}
                  />
                  <Stack.Screen name="HospitalInfo" component={HospitalInfo} />
                  <Stack.Screen
                    name="HospitalInfoMap"
                    component={HospitalInfoMap}
                  />
                  <Stack.Screen
                    name="HospitalReview"
                    component={HospitalReview}
                  />
                  <Stack.Screen
                    name="HospitalReservationType"
                    component={HospitalReservationType}
                  />
                  <Stack.Screen
                    name="HospitalReservationDateTime"
                    component={HospitalReservationDateTime}
                  />
                  <Stack.Screen
                    name="HospitalReservationMessage"
                    component={HospitalReservationMessage}
                  />
                  <Stack.Screen
                    name="HospitalReservationRequest"
                    component={HospitalReservationRequest}
                  />
                  <Stack.Screen
                    name="HospitalReservationConfirm"
                    component={HospitalReservationConfirm}
                  />
                  {/* <Stack.Screen name="UntactEnd" component={UntactEnd} /> */}
                  <Stack.Screen
                    name="UntactClinicEndInfo"
                    component={UntactClinicEndInfo}
                  />
                  <Stack.Screen
                    name="UntactTakeMedicine"
                    component={UntactTakeMedicine}
                  />
                  <Stack.Screen
                    name="UntactTakeMedicineAddr"
                    component={UntactTakeMedicineAddr}
                  />
                  <Stack.Screen
                    name="UntactPharmacy"
                    component={UntactPharmacy}
                  />
                  <Stack.Screen name="PolicyList" component={PolicyList} />
                  <Stack.Screen
                    name="PrivacyPolicy"
                    component={PrivacyPolicy}
                  />
                  <Stack.Screen name="TermUse" component={TermUse} />
                  <Stack.Screen name="EventPolicy" component={EventPolicy} />
                  <Stack.Screen name="PolicyDetail" component={PolicyDetail} />
                  <Stack.Screen name="EventRecent" component={EventRecent} />
                  <Stack.Screen
                    name="EventReservationView"
                    component={EventReservationView}
                  />
                  <Stack.Screen
                    name="EventReviewList"
                    component={EventReviewList}
                  />
                  <Stack.Screen
                    name="HospitalReservationView"
                    component={HospitalReservationView}
                  />
                  <Stack.Screen
                    name="UntactReservationDateTime"
                    component={UntactReservationDateTime}
                  />
                  <Stack.Screen
                    name="UntactReservationConfirm"
                    component={UntactReservationConfirm}
                  />
                  <Stack.Screen
                    name="UntactReservationView"
                    component={UntactReservationView}
                  />
                  {/* <Stack.Screen name="UntactCall" component={UntactCall} /> */}
                  <Stack.Screen name="ReviewList" component={ReviewList} />
                  <Stack.Screen name="EventReview" component={EventReview} />
                  <Stack.Screen
                    name="UntactEndReview"
                    component={UntactEndReview}
                  />
                  <Stack.Screen name="UntactMap" component={UntactMap} />
                  <Stack.Screen
                    name="UntactMapHeader"
                    component={UntactMapHeader}
                  />
                  <Stack.Screen name="MyReview" component={MyReview} />
                  <Stack.Screen
                    name="ReviewImageView"
                    component={ReviewImageView}
                  />
                  <Stack.Screen name="ReviewUpdate" component={ReviewUpdate} />
                  <Stack.Screen
                    name="EventReservationEnd"
                    component={EventReservationEnd}
                  />
                  <Stack.Screen name="Manager" component={Manager} />
                  <Stack.Screen
                    name="HospitalReservationType2"
                    component={HospitalReservationType2}
                  />
                  <Stack.Screen
                    name="HospitalReservationCate"
                    component={HospitalReservationCate}
                  />
                  <Stack.Screen
                    name="HospitalReReservation"
                    component={HospitalReReservation}
                  />
                  <Stack.Screen name="HospitalList" component={HospitalList} />
                  <Stack.Screen name="ChatList" component={ChatList} />
                  <Stack.Screen name="ChatView" component={ChatView} />
                  <Stack.Screen name="NoticeLists" component={NoticeLists} />
                  <Stack.Screen
                    name="NotificationHistory"
                    component={NotificationHistory}
                  />
                  <Stack.Screen name="DoctorInfo" component={DoctorInfo} />
                  <Stack.Screen name="ShopNavi" component={ShopNavi} />
                  <Stack.Screen name="ShopRecent" component={ShopRecent} />
                  <Stack.Screen
                    name="OrderDeliverySearch"
                    component={OrderDeliverySearch}
                  />
                  <Stack.Screen
                    name="HospitalSelect"
                    component={HospitalSelect}
                  />
                </Stack.Navigator>
              </SafeAreaView>
            </SafeAreaProvider>
          </NavigationContainer>
          <Toast config={toastConfig} ref={ref => Toast.setRef(ref)} />
        </NativeBaseProvider>
      </PaperProvider>
    </Provider>
  );
};

export default Main;
