import {Box} from 'native-base';
import React from 'react';
import {Image, StyleSheet, TouchableOpacity} from 'react-native';
import {DefText} from '../common/BOOTSTRAP';
import {
  colorSelect,
  loginButtonStyle,
  loginButtonText,
} from '../common/StyleCommon';
import {LoginManager, Profile, Settings} from 'react-native-fbsdk-next';
import ToastMessage from './ToastMessage';
import messaging from '@react-native-firebase/messaging';
import {connect} from 'react-redux';
import {actionCreators as UserAction} from '../redux/module/action/UserAction';
import {BASE_URL} from '../Utils/APIConstant';

const FacebookLoginButton = props => {
  const {navigation, member_login, user_lang} = props;

  //페이스북 로그인
  const faceBookSignInHandler = async () => {
    const token = await messaging().getToken(); // 앱 토큰

    LoginManager.logInWithPermissions(['public_profile']).then(
      function (result) {
        if (result.isCancelled) {
          //로그인 취소
          console.log('Login cancelled');
          //ToastMessage("로그인을 추")
        } else {
          console.log(
            'Login success with permissions: ' +
              result.grantedPermissions.toString(),
          );

          //로그인 성공시 프로필정보 가져오기
          Profile.getCurrentProfile().then(function (currentProfile) {
            if (currentProfile) {
              //console.log('faebook login sucsess::::', currentProfile);

              const params = {
                snskey: currentProfile.userID,
                email:
                  currentProfile?.email != null ? currentProfile.email : '',
                sns: 'facebook',
                sns_id: 'fb_' + currentProfile.userID,
                token: token,
              };

              faceBookLoginHandler(params);
              //console.log('fb login sucsess', params);
            }
          });
        }
      },
      function (error) {
        //로그인 실패!
        console.log('Login fail with error: ' + error);
      },
    );
  };

  const faceBookLoginHandler = profile => {
    console.log('fb login ::::', profile);
  };

  return (
    <TouchableOpacity
      onPress={faceBookSignInHandler}
      style={[styles.loginButton]}>
      <Image
        source={{uri: BASE_URL + '/newImg/facebookLogo.png'}}
        style={{
          width: 23,
          height: 44,
          resizeMode: 'contain',
        }}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  loginButton: {
    ...loginButtonStyle,
    backgroundColor: '#1977F3',
    justifyContent: 'flex-end',
  },
  loginButtonText: {
    ...loginButtonText,
    color: '#371d1e',
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
  }),
)(FacebookLoginButton);
