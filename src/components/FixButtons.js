import {Box, HStack} from 'native-base';
import React from 'react';
import {Image, TouchableOpacity} from 'react-native';
import {colorSelect} from '../common/StyleCommon';
import EntypoIcon from 'react-native-vector-icons/dist/Entypo';
import {BASE_URL} from '../Utils/APIConstant';

const FixButtons = props => {
  const {bottom = '20px', navigation} = props;

  return (
    <Box position={'absolute'} bottom={bottom} right="20px" zIndex={99}>
      <HStack alignItems={'center'}>
        <TouchableOpacity
          onPress={() => navigation.navigate('ChatView')}
          style={{
            width: 50,
            height: 50,
            borderRadius: 50,
            backgroundColor: colorSelect.navy,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 15,
          }}>
          <Image
            source={{uri: BASE_URL + '/images/chat_icons.png'}}
            style={{
              width: 36,
              height: 32,
              resizeMode: 'contain',
            }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            width: 50,
            height: 50,
            borderRadius: 50,
            backgroundColor: colorSelect.navy,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image
            source={{uri: BASE_URL + '/images/call_center_icons.png'}}
            style={{
              width: 45,
              height: 32,
              resizeMode: 'contain',
            }}
          />
        </TouchableOpacity>
      </HStack>
    </Box>
  );
};

export default FixButtons;
