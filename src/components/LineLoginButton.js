import React from 'react';
import {
  Alert,
  Image,
  Platform,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Line from '@xmartlabs/react-native-line';
import {DefText} from '../common/BOOTSTRAP';
import {loginButtonStyle, loginButtonText} from '../common/StyleCommon';
import {BASE_URL} from '../Utils/APIConstant';
import {connect} from 'react-redux';
import {actionCreators as UserAction} from '../redux/module/action/UserAction';
import ToastMessage from './ToastMessage';

const LineLoginButton = props => {
  const {navigation, user_lang, member_login} = props;

  const lineLoginHandler = async () => {
    try {
      const userInfo = await Line.login();
      //console.log(userInfo);

      const params = {
        snskey: userInfo.userProfile.userID,
        //email: userInfo.user.email,
        sns: 'line',
        token: userInfo.accessToken.access_token,
      };

      lineLoginAccess(params);
    } catch (error) {
      console.log('라인로그인:::', error);
      ToastMessage('Line login failed');
    }
  };

  const lineLoginAccess = async profile => {
    const formData = new FormData();
    formData.append('method', 'member_snsLogin');
    formData.append('sns', 'line');
    formData.append('snskey', profile.snskey);
    formData.append('token', profile.token);
    formData.append('cidx', user_lang != null ? user_lang.cidx : 0);

    const login = await member_login(formData);

    console.log('line login::', login);
    if (login.result.join) {
      navigation.reset({
        routes: [
          {
            name: 'TabNavi',
            screen: 'Event',
          },
        ],
      });
    } else {
      navigation.navigate('Register', profile);
    }
  };

  return (
    <TouchableOpacity onPress={lineLoginHandler} style={[styles.loginButton]}>
      <Image
        source={{uri: BASE_URL + '/images/lineIcon.png'}}
        style={{
          width: 26,
          height: 26,
          resizeMode: 'stretch',
        }}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  loginButton: {
    ...loginButtonStyle,
    backgroundColor: '#06C755',
  },
  loginButtonText: {
    ...loginButtonText,
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
)(LineLoginButton);
