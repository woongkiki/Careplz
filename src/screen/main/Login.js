import React, {useEffect, useState} from 'react';
import {
  TouchableOpacity,
  Platform,
  ScrollView,
  StyleSheet,
  Image,
  PermissionsAndroid,
} from 'react-native';
import {Box, HStack} from 'native-base';
import {DefButton, DefInput, DefText} from '../../common/BOOTSTRAP';
import {
  colorSelect,
  deviceSize,
  fsize,
  fweight,
} from '../../common/StyleCommon';
import ToastMessage from '../../components/ToastMessage';
import GoogleLoginButton from '../../components/GoogleLoginButton';
import KakaoLoginButton from '../../components/KakaoLoginButton';
import NaverLoginButton from '../../components/NaverLoginButton';
import LineLoginButton from '../../components/LineLoginButton';
import FormInput from '../../components/FormInput';
import {BASE_URL} from '../../Utils/APIConstant';
import Loading from '../../components/Loading';
import Api from '../../Api';
import {useIsFocused} from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';
import {connect} from 'react-redux';
import {actionCreators as UserAction} from '../../redux/module/action/UserAction';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import AppleLoginButton from '../../components/AppleLoginButton';
import {
  CALL_PERMISSIONS,
  CALL_PERMISSIONS_NOTI,
  usePermissions,
} from '../../hooks/usePermissions';
import {LoginManager, Profile, Settings} from 'react-native-fbsdk-next';
import FacebookLoginButton from '../../components/FacebookLoginButton';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

//로그인
const Login = props => {
  const {navigation, route, member_login, member_info, user_lang} = props;
  const {params} = route;

  if (Platform.OS === 'android') {
    usePermissions(CALL_PERMISSIONS_NOTI);
  }

  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', enabled, authStatus);
    }
  }

  if (Platform.OS === 'ios') {
    PushNotificationIOS.setApplicationIconBadgeNumber(0);
  }

  useEffect(() => {
    //requestPermissionNoti();
    requestUserPermission();
  }, []);
  //console.log("languageSet", user_lang);

  const isFocused = useIsFocused();

  const [loading, setLoading] = useState(true);
  const [pageText, setPageText] = useState('');
  const pageLangSelect = async () => {
    await setLoading(true);
    await Api.send(
      'app_page',
      {cidx: user_lang != null ? user_lang.cidx : 0, code: 'login'},
      args => {
        let resultItem = args.resultItem;
        let arrItems = args.arrItems;

        if (resultItem.result === 'Y' && arrItems) {
          console.log('회원가입 언어 리스트: ', resultItem, arrItems);
          setPageText(arrItems.text);
        } else {
          console.log('회원가입 언어 리스트 실패!', resultItem);
        }
      },
    );
    await setLoading(false);
  };

  useEffect(() => {
    if (isFocused) {
      pageLangSelect();
    }
  }, [isFocused]);

  //아이디 입력
  const [idValue, setIdValue] = useState('');

  const idChangeEvent = id => {
    setIdValue(id);
  };

  //비밀번호 입력
  const [passwordValue, setPasswordValue] = useState('');

  const passwordChangeEvent = password => {
    setPasswordValue(password);
  };

  const loginHandler = async () => {
    const token = await messaging().getToken(); // 앱 토큰

    console.log('token', token);

    const formData = new FormData();
    formData.append('method', 'member_login');
    formData.append('id', idValue);
    formData.append('passwd', passwordValue);
    formData.append('token', token);
    formData.append('cidx', user_lang != null ? user_lang.cidx : 0);

    const login = await member_login(formData);

    if (login.state) {
      //console.log(login.result);
      member_info_handler(login.result.id, login.result.cidx);
      navigation.reset({
        routes: [
          {
            name: 'TabNavi',
            screen: 'Event',
          },
        ],
      });
    } else {
      ToastMessage(login.msg);
      return false;
    }
  };

  const guestLoginHandler = () => {
    ToastMessage('게스트로 로그인합니다.');
    navigation.reset({
      routes: [
        {
          name: 'TabNavi',
          screen: 'Event',
        },
      ],
    });
  };

  const member_info_handler = async (id, cidx) => {
    const token = await messaging().getToken(); // 앱 토큰

    const formData = new FormData();
    formData.append('method', 'member_info');
    formData.append('id', id);
    formData.append('cidx', cidx);
    formData.append('token', token);

    const member_info_list = await member_info(formData);

    console.log('회원정보  확인:::', member_info_list);
  };

  const {top} = useSafeAreaInsets();
  // const appleLoginHandler = (profile) => {
  //     console.log("애플로그인", profile);
  // }

  return (
    <Box flex={1} backgroundColor="#fff" pt={top + 'px'}>
      {loading ? (
        <Loading />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <Box p="20px" pt="0">
            <Box mt="55px" justifyContent={'center'} alignItems="center">
              <Image
                source={{uri: BASE_URL + '/images/mainLogoNavy.png'}}
                style={{
                  width: deviceSize.deviceWidth / 1.84,
                  height: deviceSize.deviceWidth / 1.84 / 4,
                  resizeMode: 'stretch',
                }}
              />
            </Box>
            <Box mt="70px">
              <FormInput
                labelOn={true}
                label={pageText != '' ? pageText[0] : '아이디'}
                placeholder={
                  pageText != '' ? pageText[1] : '아이디를 입력해 주세요.'
                }
                value={idValue}
                onChangeText={idChangeEvent}
                editable={true}
                labelHorizontal={true}
                labelIcon={true}
                labelIconUri={BASE_URL + '/images/idIcon2.png'}
                labelIconWidth={18}
                labelIconHeight={18}
                labelIconResize="contain"
                inputStyle={{lineHeight: idValue.length > 0 ? 20 : 18}}
              />
            </Box>
            <Box mt="40px">
              <FormInput
                labelOn={true}
                label={pageText != '' ? pageText[2] : '비밀번호'}
                placeholder={
                  pageText != '' ? pageText[3] : '비밀번호를 입력해 주세요.'
                }
                value={passwordValue}
                onChangeText={passwordChangeEvent}
                editable={true}
                secureTextEntry={true}
                labelHorizontal={true}
                labelIcon={true}
                labelIconUri={BASE_URL + '/images/passwordIcon.png'}
                labelIconWidth={18}
                labelIconHeight={18}
                labelIconResize="contain"
              />
            </Box>
            <Box mt="50px">
              <DefButton
                text={pageText != '' ? pageText[4] : '로그인'}
                btnStyle={[
                  {
                    backgroundColor: colorSelect.gray_dfdfdf,
                  },
                ]}
                txtStyle={[fweight.bold]}
                onPress={loginHandler}
                lh={user_lang?.cidx == 9 ? 50 : ''}
              />
            </Box>
            <Box mt="10px">
              <DefButton
                btnStyle={[{backgroundColor: colorSelect.navy}]}
                text={pageText != '' ? pageText[15] : '게스트 로그인'}
                txtStyle={[fweight.bold, {color: colorSelect.white}]}
                onPress={guestLoginHandler}
              />
            </Box>
            <HStack justifyContent={'space-around'} mt="10px" flexWrap={'wrap'}>
              <TouchableOpacity
                onPress={() => navigation.navigate('Register', '')}
                style={{marginTop: 10}}>
                <DefText
                  text={pageText != '' ? pageText[5] : '회원가입'}
                  style={[styles.btnText]}
                  lh={user_lang?.cidx == 9 ? 30 : ''}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate('IdSearch')}
                style={{marginTop: 10}}>
                <DefText
                  text={pageText != '' ? pageText[6] : '아이디 찾기'}
                  style={[styles.btnText]}
                  lh={user_lang?.cidx == 9 ? 30 : ''}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate('PasswordSearch')}
                style={{marginTop: 10}}>
                <DefText
                  text={pageText != '' ? pageText[7] : '비밀번호 찾기'}
                  style={[styles.btnText]}
                  lh={user_lang?.cidx == 9 ? 30 : ''}
                />
              </TouchableOpacity>
            </HStack>
            <Box mt="60px">
              <DefText
                text={pageText != '' ? pageText[8] : 'SNS 계정으로 간편 로그인'}
                style={[styles.snsTitle]}
                lh={user_lang?.cidx == 9 ? 30 : ''}
              />
            </Box>

            {Platform.OS === 'android' ? (
              <HStack
                alignItems={'center'}
                justifyContent="space-around"
                mt="20px"
                flexWrap={'wrap'}
                px="20px">
                <KakaoLoginButton navigation={navigation} />
                {/* <NaverLoginButton navigation={navigation} /> */}
                <LineLoginButton navigation={navigation} />

                <GoogleLoginButton navigation={navigation} />

                <FacebookLoginButton navigation={navigation} />
              </HStack>
            ) : (
              <Box>
                <HStack
                  alignItems={'center'}
                  justifyContent="space-around"
                  mt="20px"
                  flexWrap={'wrap'}>
                  <KakaoLoginButton navigation={navigation} />
                  {/* <NaverLoginButton navigation={navigation} /> */}
                  <LineLoginButton navigation={navigation} />
                  <GoogleLoginButton navigation={navigation} />
                  <FacebookLoginButton navigation={navigation} />
                  <AppleLoginButton navigation={navigation} />
                </HStack>
                {/* <HStack
                  alignItems={'center'}
                  justifyContent="center"
                  mt="20px"></HStack> */}
              </Box>
            )}
            <Box mt="60px">
              <DefText
                text={
                  pageText != '' ? pageText[13] : '언어를 잘못 선택하셨나요?'
                }
                style={[styles.languageTitle]}
                lh={user_lang?.cidx == 9 ? 30 : ''}
              />
              <TouchableOpacity
                style={[styles.languageButton]}
                onPress={() =>
                  navigation.navigate('LanguageSelect', {back: true})
                }>
                <DefText
                  text={pageText != '' ? pageText[14] : '언어 재설정'}
                  style={[
                    styles.languageTitle,
                    fweight.bold,
                    fsize.fs18,
                    {color: colorSelect.navy},
                  ]}
                  lh={user_lang?.cidx == 9 ? 34 : ''}
                />
              </TouchableOpacity>
            </Box>
          </Box>
        </ScrollView>
      )}
    </Box>
  );
};

const styles = StyleSheet.create({
  languageTitle: {
    ...fsize.fs16,
    color: '#929292',
    textAlign: 'center',
  },
  languageButton: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  btnText: {
    ...fsize.fs15,
    ...fweight.m,
  },
  snsTitle: {
    ...fsize.fs15,
    ...fweight.m,
    color: '#606060',
    textAlign: 'center',
  },
});

export default connect(
  ({User}) => ({
    userInfo: User.userInfo, //회원정보
    user_lang: User.user_lang,
  }),
  dispatch => ({
    member_login: user => dispatch(UserAction.member_login(user)), //로그인
    languageSet: user => dispatch(UserAction.languageSet(user)), //로그인
    member_info: user => dispatch(UserAction.member_info(user)), //회원 정보 조회
  }),
)(Login);
