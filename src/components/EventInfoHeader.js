import {Box, HStack} from 'native-base';
import React from 'react';
import {Image, StyleSheet, TouchableOpacity} from 'react-native';
import {BASE_URL} from '../Utils/APIConstant';
import {DefText} from '../common/BOOTSTRAP';
import {textLengthOverCut} from '../common/DataFunction';
import {fsize, fweight} from '../common/StyleCommon';

const headerHeight = 50;

const EventInfoHeader = props => {
  const {navigation, shareOnpress, headerTitle = ''} = props;

  return (
    <Box height={headerHeight + 'px'}>
      <HStack
        alignItems={'center'}
        justifyContent="space-between"
        px="20px"
        height={headerHeight + 'px'}>
        <Box>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image
              source={{uri: BASE_URL + '/images/backButton.png'}}
              style={{
                width: 28,
                height: 16,
                resizeMode: 'contain',
              }}
            />
          </TouchableOpacity>
        </Box>
        {headerTitle != '' && (
          <DefText
            text={textLengthOverCut(headerTitle, 23, '..')}
            style={[fsize.fs18, fweight.m, {lineHeight: 33}]}
          />
        )}
        <Box>
          <TouchableOpacity onPress={shareOnpress}>
            <Image
              source={{uri: BASE_URL + '/images/shareIcon.png'}}
              style={{
                width: 18,
                height: 18,
                resizeMode: 'stretch',
              }}
            />
          </TouchableOpacity>
        </Box>
      </HStack>
    </Box>
  );
};

const styles = StyleSheet.create({
  backButton: {
    width: headerHeight,
    height: headerHeight,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
});

export default EventInfoHeader;
