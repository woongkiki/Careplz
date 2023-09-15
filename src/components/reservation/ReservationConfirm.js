import {Box, HStack} from 'native-base';
import React from 'react';
import {StyleSheet, Image} from 'react-native';
import {DefText} from '../../common/BOOTSTRAP';
import {colorSelect, fsize, fweight} from '../../common/StyleCommon';

const ReservationConfirm = props => {
  const {
    navigation,
    icon,
    iconWidth,
    iconHeight,
    iconResize,
    iconMr = 10,
    label,
    labelStyle,
    confirmText,
    dates,
    userlang,
  } = props;

  return (
    <Box>
      <HStack alignItems={'center'}>
        <Image
          source={icon}
          style={{
            width: iconWidth,
            height: iconHeight,
            resizeMode: iconResize,
            marginRight: iconMr,
          }}
        />
        <DefText
          text={label}
          style={[
            styles.confirmText,
            labelStyle,
            userlang == 9 ? {lineHeight: 28} : {lineHeight: 21},
          ]}
        />
      </HStack>
      <Box style={[styles.infoBox]}>
        {dates != '' ? (
          <Box>
            {dates != '' ? (
              dates.map((item, index) => {
                return (
                  <DefText
                    text={item}
                    key={index}
                    style={[styles.infoBoxText, index != 0 && {marginTop: 10}]}
                  />
                );
              })
            ) : (
              <DefText text={'Schedule error'} />
            )}
          </Box>
        ) : (
          <DefText text={confirmText} style={[styles.infoBoxText]} />
        )}
      </Box>
    </Box>
  );
};

const styles = StyleSheet.create({
  confirmText: {
    ...fsize.fs15,
    ...fweight.bold,
  },
  infoBox: {
    paddingHorizontal: 15,
    paddingVertical: 13,
    borderRadius: 5,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colorSelect.navy,
    marginTop: 15,
  },
  infoBoxText: {
    ...fsize.fs15,
    lineHeight: 21,
  },
});

export default ReservationConfirm;
