import {Box} from 'native-base';
import React from 'react';
import {StyleSheet} from 'react-native';
import {DefButton, DefInput} from '../common/BOOTSTRAP';
import {BASE_URL} from '../Utils/APIConstant';

const SearchInput = props => {
  const {
    navigation,
    buttonPositionLeft,
    buttonPositionRight,
    positionMargin,
    btnStyle,
    placeholder,
    placeholderTextColor,
    value,
    onChangeText,
    inputStyle,
    onPress,
    onSubmitEditing,
    iconpink,
    onPressIn,
  } = props;

  return (
    <Box>
      <Box
        position={'absolute'}
        top={'50%'}
        left={buttonPositionLeft}
        right={buttonPositionRight}
        zIndex="99"
        marginTop={positionMargin}>
        <DefButton
          text="검색"
          imageCont={true}
          imageUri={
            iconpink
              ? BASE_URL + '/mngImg/search_icon_navy.png'
              : BASE_URL + '/images/searchButtonIconPink.png'
          }
          imageWidth={14}
          imageHeight={14}
          imageResize={'stretch'}
          btnStyle={[styles.schButton, btnStyle]}
          onPress={onPress}
        />
      </Box>
      <DefInput
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
        value={value}
        onChangeText={onChangeText}
        editable={true}
        inputStyle={inputStyle}
        textAlignVertical="center"
        onSubmitEditing={onSubmitEditing}
        onPressIn={onPressIn}
      />
    </Box>
  );
};

const styles = StyleSheet.create({
  schButton: {
    width: 48,
    height: 48,
    backgroundColor: '#F2F3F5',
  },
});

export default SearchInput;
