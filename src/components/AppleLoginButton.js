import React from 'react';
import {Image, TouchableOpacity} from 'react-native';
import {BASE_URL} from '../Utils/APIConstant';
import {
  AppleButton,
  appleAuth,
} from '@invertase/react-native-apple-authentication';
import {connect} from 'react-redux';
import {actionCreators as UserAction} from '../redux/module/action/UserAction';

const AppleLoginButton = props => {
  const {navigation, member_login, user_lang} = props;

  //애플로그인
  const onAppleButtonPress = async () => {
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    });

    // Ensure Apple returned a user identityToken
    if (!appleAuthRequestResponse.identityToken) {
      throw 'Apple Sign-In failed - no identify token returned';
    }

    const {identityToken, nonce, user} = appleAuthRequestResponse;

    console.log('appleAuthRequestResponse', appleAuthRequestResponse.user);
    // console.log('identityToken: ', identityToken);
    // console.log('nonce: ', nonce);

    const params = {
      snskey: user,
      //email: userInfo.user.email,
      sns: 'apple',
      token: identityToken,
    };

    appleLoginHandler(params);
  };

  const appleLoginHandler = async profile => {
    const formData = new FormData();
    formData.append('method', 'member_snsLogin');
    formData.append('sns', profile.sns);
    formData.append('snskey', profile.snskey);
    formData.append('token', profile.token);
    formData.append('cidx', user_lang != null ? user_lang.cidx : 0);

    const login = await member_login(formData);

    if (login.result.join) {
      console.log('apple login::', login.result);
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
    <TouchableOpacity onPress={onAppleButtonPress}>
      <Image
        source={{uri: BASE_URL + '/images/appleLoginButton.png'}}
        style={{
          width: 55,
          height: 55,
          resizeMode: 'contain',
        }}
      />
    </TouchableOpacity>
  );
};

export default connect(
  ({User}) => ({
    userInfo: User.userInfo, //회원정보
    user_lang: User.user_lang,
  }),
  dispatch => ({
    member_login: user => dispatch(UserAction.member_login(user)), //로그인
    languageSet: user => dispatch(UserAction.languageSet(user)), //로그인
  }),
)(AppleLoginButton);
