import {Box} from 'native-base';
import React from 'react';
import {connect} from 'react-redux';
import {actionCreators as UserAction} from '../../redux/module/action/UserAction';

const ChatList = props => {
  const {navigation} = props;

  return <Box flex={1} backgroundColor={'#fff'}></Box>;
};

export default connect(
  ({User}) => ({
    userInfo: User.userInfo, //회원정보
    user_lang: User.user_lang,
  }),
  dispatch => ({
    member_login: user => dispatch(UserAction.member_login(user)), //로그인
    languageSet: user => dispatch(UserAction.languageSet(user)), //선택언어
  }),
)(ChatList);
