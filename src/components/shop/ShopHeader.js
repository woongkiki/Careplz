import {Box, HStack} from 'native-base';
import React, {useEffect, useState} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {colorSelect, deviceSize, fsize} from '../../common/StyleCommon';
import {Image, TouchableOpacity} from 'react-native';
import {BASE_URL} from '../../Utils/APIConstant';
import {DefText} from '../../common/BOOTSTRAP';

const ShopHeader = props => {
  const {navigation, scrollVal, rightCont = true} = props;

  const [scrollVals, setScrollVal] = useState(scrollVal);

  const [schText, setSchText] = useState('');
  const schTextChange = text => {
    setSchText(text);
  };

  useEffect(() => {
    setScrollVal(scrollVal);
  }, [scrollVal]);

  const {top} = useSafeAreaInsets();

  const TabNaviMove = () => {
    navigation.navigate('TabNavi', {
      screen: 'Event',
    });
  };

  return (
    <Box
      backgroundColor={colorSelect.pink_de}
      px="20px"
      py="10px"
      borderBottomLeftRadius={25}
      borderBottomRightRadius={25}
      width={deviceSize.deviceWidth}
      position={'absolute'}
      top={top}
      zIndex={100}>
      <HStack alignItems={'center'} justifyContent="space-between">
        <Image
          source={require('../../images/eventHeaderLogo.png')}
          style={{
            width: deviceSize.deviceWidth / 3.54,
            height: deviceSize.deviceWidth / 3.54 / 3.9,
            resizeMode: 'contain',
          }}
        />
        <HStack alignItems={'center'}>
          <TouchableOpacity onPress={TabNaviMove}>
            <HStack alignItems={'center'}>
              <Image
                source={{uri: BASE_URL + '/shopImg/main_path_logo_icon.png'}}
                style={{
                  width: 22,
                  height: 22,
                  resizeMode: 'contain',
                  marginRight: 10,
                }}
              />
              <DefText
                text={'메인으로'}
                style={[fsize.fs14, {color: colorSelect.white}]}
              />
            </HStack>
          </TouchableOpacity>
          {rightCont && (
            <HStack alignItems={'center'}>
              <TouchableOpacity style={{marginLeft: 14}}>
                <Image
                  source={{uri: BASE_URL + '/shopImg/cart_icon_white.png'}}
                  style={{width: 23, height: 22, resizeMode: 'contain'}}
                />
              </TouchableOpacity>
              <TouchableOpacity style={{marginLeft: 14}}>
                <Image
                  source={{uri: BASE_URL + '/shopImg/heart_icon_white.png'}}
                  style={{width: 22, height: 22, resizeMode: 'contain'}}
                />
              </TouchableOpacity>
            </HStack>
          )}

          {/* <TouchableOpacity onPress={() => navigation.navigate('WishList')}>
            <Image
              source={require('../images/bookmarIconWhite.png')}
              style={{
                width: 17,
                height: 22,
                resizeMode: 'contain',
              }}
            />
          </TouchableOpacity> */}
        </HStack>
      </HStack>
    </Box>
  );
};

export default ShopHeader;
