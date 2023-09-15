import React from 'react';
import {TouchableOpacity, Image, StyleSheet} from 'react-native';
import {Box, HStack} from 'native-base';
import {DefText} from '../common/BOOTSTRAP';
import {BASE_URL} from '../Utils/APIConstant';
import {colorSelect, deviceSize, fsize, fweight} from '../common/StyleCommon';

const EventBottomButton = props => {
  const {
    navigation,
    reservationOnpree,
    wishChk,
    hospitalCheck,
    cntTime,
    rText,
    eventText1,
    user_lang,
    wishButtonOnpress,
  } = props;

  return (
    <Box>
      {!hospitalCheck && (
        <Box style={[styles.timeBox]} alignItems={'center'}>
          {user_lang != 0 ? (
            <Box>
              <Box alignItems={'flex-start'}>
                <DefText text={eventText1 + ' '} style={[styles.timeBoxText]} />
              </Box>
              <Box alignItems={'flex-end'}>
                <DefText
                  text={cntTime}
                  style={[styles.timeBoxText, {color: colorSelect.pink_de}]}
                />
              </Box>
            </Box>
          ) : (
            <HStack alignItems={'center'}>
              <DefText text={eventText1 + ' '} style={[styles.timeBoxText]} />
              <DefText
                text={cntTime}
                style={[styles.timeBoxText, {color: colorSelect.pink_de}]}
              />
            </HStack>
          )}
        </Box>
      )}
      <HStack flexWrap={'wrap'}>
        <TouchableOpacity
          style={[styles.eventBookmarkButton]}
          onPress={wishButtonOnpress}>
          <Image
            source={{
              uri:
                wishChk == 1
                  ? BASE_URL + '/images/heart_on_icon.png'
                  : BASE_URL + '/images/heart_off_icon.png',
            }}
            style={{
              width: 18,
              height: 23,
              resizeMode: 'contain',
            }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.eventReservationButton]}
          onPress={reservationOnpree}>
          <DefText
            text={rText != '' ? rText : '예약하기'}
            style={[styles.eventReservationButtonText]}
          />
        </TouchableOpacity>
      </HStack>
    </Box>
  );
};

const styles = StyleSheet.create({
  timeBox: {
    width: deviceSize.deviceWidth,
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  timeBoxText: {
    color: colorSelect.white,
    ...fsize.fs14,
    lineHeight: 20,
  },
  eventBookmarkButton: {
    width: deviceSize.deviceWidth * 0.12,
    height: deviceSize.deviceWidth * 0.12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  eventReservationButton: {
    width: deviceSize.deviceWidth * 0.88,
    height: deviceSize.deviceWidth * 0.12,
    backgroundColor: colorSelect.navy,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventReservationButtonText: {
    ...fweight.m,
    color: colorSelect.white,
    lineHeight: 19,
  },
});

export default EventBottomButton;
