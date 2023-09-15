import {Box, HStack} from 'native-base';
import React from 'react';
import {StyleSheet, TouchableOpacity, Image} from 'react-native';
import {DefText} from '../common/BOOTSTRAP';
import {colorSelect, fsize, fweight} from '../common/StyleCommon';
import {connect} from 'react-redux';
import {actionCreators as UserAction} from '../redux/module/action/UserAction';
import {BASE_URL} from '../Utils/APIConstant';

const MenuButton = props => {
  const {
    navigation,
    btnText,
    btnStyle,
    txtStyle,
    arrIconNo,
    onPress,
    user_lang,
    notichk,
    icon = '',
    iconWidth,
    iconHeight,
  } = props;

  return (
    <TouchableOpacity
      style={[styles.mypageMenuButton, btnStyle]}
      onPress={onPress}>
      <HStack alignItems={'center'} justifyContent="space-between">
        <HStack alignItems={'center'}>
          {icon != '' && (
            <Box
              mr="10px"
              width="26px"
              height="26px"
              alignItems={'center'}
              justifyContent={'center'}>
              <Image
                source={{uri: icon}}
                style={{
                  width: iconWidth,
                  height: iconHeight,
                  resizeMode: 'contain',
                }}
              />
            </Box>
          )}
          <DefText
            text={btnText}
            style={[styles.mypageMenuButtonText, txtStyle]}
            lh={user_lang?.cidx == 9 ? 28 : 26}
          />
        </HStack>
        <HStack alignItems={'center'}>
          {notichk != '' && (
            <Box style={[styles.countBox]}>
              <DefText text={notichk} style={[styles.count]} />
            </Box>
          )}
          {!arrIconNo && (
            <Image
              source={require('../images/mypageArr.png')}
              style={{
                width: 8,
                height: 12,
                resizeMode: 'contain',
              }}
            />
          )}
        </HStack>
      </HStack>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  mypageMenuButton: {
    paddingVertical: 20,
  },
  mypageMenuButtonText: {
    ...fsize.fs15,
    ...fweight.m,
  },
  countBox: {
    padding: 5,
    borderRadius: 22,
    minWidth: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D12A2A',
    marginRight: 10,
  },
  count: {
    ...fsize.fs14,
    color: colorSelect.white,
    lineHeight: 15,
  },
});

export default connect(
  ({User}) => ({
    userInfo: User.userInfo, //회원정보
    user_lang: User.user_lang,
  }),
  dispatch => ({
    member_login: user => dispatch(UserAction.member_login(user)), //로그인
    languageSet: user => dispatch(UserAction.languageSet(user)),
  }),
)(MenuButton);
