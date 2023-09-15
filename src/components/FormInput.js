import {Box, HStack} from 'native-base';
import React from 'react';
import {Image, StyleSheet} from 'react-native';
import {DefButton, DefInput, DefText} from '../common/BOOTSTRAP';
import {colorSelect, deviceSize, fsize, fweight} from '../common/StyleCommon';
import {BASE_URL} from '../Utils/APIConstant';
import {connect} from 'react-redux';
import {actionCreators as UserAction} from '../redux/module/action/UserAction';

const FormInput = props => {
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
    placeholder,
    value,
    onChangeText,
    onSubmitEditing,
    editable,
    secureTextEntry,
    inputStyle,
    keyboardType,
    multiline,
    textAlignVertical,
    maxLength,
    inputButton,
    inputButtonText,
    btnStyle,
    btnDisabled,
    inputButtonPress,
    subtext,
    subTextStyle,
    extext,
    required,
    txtStyle,
    user_lang,
  } = props;

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
        {subtext && (
          <DefText
            text={subtext}
            style={[styles.subText, subTextStyle]}
            lh={user_lang?.cidx == 9 ? 26 : ''}
          />
        )}
        {extext && (
          <DefText
            text={extext}
            style={[styles.exText]}
            lh={user_lang?.cidx == 9 ? 22 : ''}
          />
        )}
        <Box>
          <DefInput
            placeholder={placeholder}
            value={value}
            onChangeText={onChangeText}
            onSubmitEditing={onSubmitEditing}
            editable={editable}
            secureTextEntry={secureTextEntry}
            maxLength={maxLength}
            inputStyle={[inputStyle]}
            keyboardType={keyboardType}
            multiline={multiline}
            textAlignVertical={textAlignVertical}
          />
          {inputButton && (
            <Box
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                width: (deviceSize.deviceWidth - 40) * 0.25,
                height: '100%',
                backgroundColor: '#7E7E7E',
                borderRadius: 5,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <DefButton
                text={inputButtonText}
                btnStyle={[btnStyle]}
                txtStyle={[
                  {color: colorSelect.white, textAlign: 'center'},
                  fsize.fs14,
                  fweight.m,
                  txtStyle,
                ]}
                disabled={btnDisabled}
                onPress={inputButtonPress}
              />
            </Box>
          )}
        </Box>
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
)(FormInput);
