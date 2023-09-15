import React from 'react';
import {
  TouchableOpacity,
  TextInput,
  Platform,
  Dimensions,
  StyleSheet,
  Image,
} from 'react-native';
import {Box, Text, Input, HStack} from 'native-base';
import {colorSelect, deviceSize, fsize, fweight} from './StyleCommon';
import {connect} from 'react-redux';
import {actionCreators as UserAction} from '../redux/module/action/UserAction';

//기본 텍스트 고정
export const DefText = ({text, style, onLayout, lh = ''}) => {
  return (
    <Text
      style={[
        fweight.r,
        fsize.fs16,
        {color: colorSelect.black},
        style,
        lh != '' && {lineHeight: lh},
      ]}
      onLayout={onLayout}>
      {text}
    </Text>
  );
};

export const DefButton = ({
  text,
  btnStyle,
  txtStyle,
  disabled,
  onPress,
  imageCont,
  imageUri,
  imageWidth,
  imageHeight,
  imageResize,
  lh = '',
}) => {
  return (
    <TouchableOpacity
      disabled={disabled ? disabled : false}
      style={[
        {
          width: '100%',
          height: 48,
          borderRadius: 8,
          overflow: 'hidden',
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 10,
        },
        btnStyle,
      ]}
      onPress={onPress}>
      {imageCont ? (
        <Image
          source={{uri: imageUri}}
          style={{
            width: imageWidth,
            height: imageHeight,
            resizeMode: imageResize,
          }}
        />
      ) : (
        <DefText text={text} style={[txtStyle, lh != '' && {lineHeight: lh}]} />
      )}
    </TouchableOpacity>
  );
};

export const DefInput = ({
  value,
  placeholder,
  placeholderTextColor,
  onChangeText,
  onSubmitEditing,
  inputStyle,
  secureTextEntry,
  keyboardType,
  maxLength,
  textAlignVertical,
  multiline,
  editable,
  onPressIn,
}) => {
  return (
    <TextInput
      value={value}
      placeholder={placeholder}
      placeholderTextColor={'#BEBEBE'}
      onChangeText={onChangeText}
      onSubmitEditing={onSubmitEditing}
      secureTextEntry={secureTextEntry ? secureTextEntry : false}
      keyboardType={keyboardType ? keyboardType : 'default'}
      maxLength={maxLength}
      textAlignVertical={textAlignVertical ? textAlignVertical : 'center'}
      multiline={multiline ? multiline : false}
      editable={editable}
      onPressIn={onPressIn}
      style={[
        {
          width: '100%',
          height: 48,
          borderRadius: 5,
          borderWidth: 1,
          borderColor: colorSelect.navy,
          paddingLeft: 15,
          textAlign: 'left',
          backgroundColor: '#fff',
        },
        fsize.fs14,
        fweight.r,
        inputStyle,
      ]}
    />
  );
};

export const LabelTitle = ({text, txtStyle, lh = ''}) => {
  return (
    <DefText
      text={text}
      style={[fweight.bold, fsize.fs18, txtStyle, lh != '' && {lineHeight: lh}]}
    />
  );
};
