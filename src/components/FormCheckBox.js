import {Box, CheckIcon, HStack} from 'native-base';
import React from 'react';
import {Image, StyleSheet, TouchableOpacity} from 'react-native';
import {DefButton, DefInput, DefText} from '../common/BOOTSTRAP';
import {colorSelect, deviceSize, fsize, fweight} from '../common/StyleCommon';
import {BASE_URL} from '../Utils/APIConstant';
import {connect} from 'react-redux';
import {actionCreators as UserAction} from '../redux/module/action/UserAction';

const FormCheckBox = props => {
  const {
    navigation,
    labelOn,
    labelHorizontal,
    labelIcon,
    labelIconUri,
    labelIconWidth,
    labelIconHeight,
    labelIconResize,
    label,
    label2on,
    label2,
    labelStyle,
    label2Style,
    certiText1,
    certiText2,
    subtext,
    subTextStyle,
    extext,
    required,
    user_lang,
    certiStatus,
    setCertiStatus,
    setCertiEmailModal,
  } = props;

  const certicheckHandler = check => {
    if (certiStatus == check) {
      setCertiStatus('');
    } else {
      setCertiStatus(check);
    }
  };

  const emailCertiModalOpen = () => {
    setCertiEmailModal(true);
  };

  return (
    <Box>
      <Box>
        {labelOn ? (
          labelHorizontal ? (
            <HStack style={[styles.labelTextHorizontalBox]}>
              {labelIcon && (
                <Image
                  source={{uri: labelIconUri}}
                  style={[
                    {
                      width: labelIconWidth,
                      height: labelIconHeight,
                      resizeMode: labelIconResize,
                      marginRight: 10,
                    },
                  ]}
                />
              )}
              <DefText
                text={label}
                style={[styles.labelText, {marginBottom: 0}, labelStyle]}
              />
              {label2on && (
                <DefText
                  text={label2}
                  style={[styles.labelText2, label2Style]}
                />
              )}
            </HStack>
          ) : required ? (
            <HStack>
              <DefText text={label} style={[styles.labelText, labelStyle]} />
              <DefText text="*" style={{color: '#E11B1B', marginLeft: 5}} />
            </HStack>
          ) : (
            <DefText text={label} style={[styles.labelText, labelStyle]} />
          )
        ) : (
          <></>
        )}
      </Box>
    </Box>
  );
};

const styles = StyleSheet.create({
  labelText: {
    ...fweight.bold,
    ...fsize.fs15,
    marginBottom: 10,
    lineHeight: 28,
  },
  labelTextHorizontalBox: {
    alignItems: 'center',
    marginBottom: 10,
  },
  labelText2: {
    ...fsize.fs12,
    color: '#BEBEBE',
  },
  subText: {
    ...fsize.fs14,
    color: '#000000',
    marginBottom: 10,
  },
  exText: {
    ...fsize.fs12,
    color: '#808080',
    marginBottom: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: colorSelect.gray_dfdfdf,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkIcon: {
    width: 12,
    height: 12,
    color: colorSelect.white,
  },
});

export default connect(
  ({User}) => ({
    userInfo: User.userInfo, //회원정보
    user_lang: User.user_lang,
  }),
  dispatch => ({
    member_login: user => dispatch(UserAction.member_login(user)), //로그인
    languageSet: user => dispatch(UserAction.languageSet(user)), //선택언어
  }),
)(FormCheckBox);
