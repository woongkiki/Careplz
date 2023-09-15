import {Box, HStack} from 'native-base';
import React from 'react';
import {Image, StyleSheet, TouchableOpacity} from 'react-native';
import {DefText} from '../common/BOOTSTRAP';
import {BASE_URL} from '../Utils/APIConstant';
import {deviceSize, fsize, fweight} from '../common/StyleCommon';

const careNewsData = [
  {
    idx: 1,
    thumb: BASE_URL + '/newImg/careNewsThum01.png',
  },
];

const Carenews = props => {
  const {navigation, thumb, title, date} = props;

  return (
    <TouchableOpacity style={{marginTop: 20}}>
      <HStack flexWrap={'wrap'} alignItems={'center'}>
        <Box width={(deviceSize.deviceWidth - 40) * 0.2 + 'px'}>
          <Image
            source={{uri: thumb}}
            style={{
              width: (deviceSize.deviceWidth - 40) * 0.17,
              height: (deviceSize.deviceWidth - 40) * 0.17,
              borderRadius: ((deviceSize.deviceWidth - 40) * 0.17) / 2,
            }}
          />
        </Box>
        <Box
          width={(deviceSize.deviceWidth - 40) * 0.8 + 'px'}
          justifyContent={'space-between'}>
          <DefText text={title} style={[styles.label]} />
          <Box mt="5px">
            <DefText text={date} style={[styles.date]} />
          </Box>
        </Box>
      </HStack>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  label: {
    ...fsize.fs15,
    ...fweight.bold,
    lineHeight: 21,
    color: '#191919',
  },
  date: {
    ...fsize.fs13,
    lineHeight: 19,
    color: '#909090',
  },
});

export default Carenews;
