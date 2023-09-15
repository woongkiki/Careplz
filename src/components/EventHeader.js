import React, {useEffect, useState} from 'react';
import {Box, HStack} from 'native-base';
import SearchInput from './SearchInput';
import {Image, TouchableOpacity} from 'react-native';
import {colorSelect, deviceSize, fsize, fweight} from '../common/StyleCommon';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {BASE_URL} from '../Utils/APIConstant';
import {DefText} from '../common/BOOTSTRAP';

const EventHeader = props => {
  const {navigation, scrollVal} = props;

  const [scrollVals, setScrollVal] = useState(scrollVal);

  const [schText, setSchText] = useState('');
  const schTextChange = text => {
    setSchText(text);
  };

  useEffect(() => {
    setScrollVal(scrollVal);
  }, [scrollVal]);

  const {top} = useSafeAreaInsets();

  const ShopMove = () => {
    navigation.navigate('ShopNavi', {
      screen: 'Shop',
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
          source={require('../images/eventHeaderLogo.png')}
          style={{
            width: deviceSize.deviceWidth / 3.54,
            height: deviceSize.deviceWidth / 3.54 / 3.9,
            resizeMode: 'contain',
          }}
        />
        <HStack>
          {/* <TouchableOpacity
            style={{marginRight: 15}}
            onPress={() => navigation.navigate('SearchAll')}>
            <Image
              source={require('../images/searchButtonIconWhite.png')}
              style={{
                width: 22,
                height: 22,
                resizeMode: 'contain',
              }}
            />
          </TouchableOpacity> */}
          <TouchableOpacity
            style={{marginRight: 15}}
            onPress={() => navigation.navigate('LanguageSelect', {back: true})}>
            <Image
              source={{uri: BASE_URL + '/newImg/koreaIcons.png'}}
              style={{
                width: 22,
                height: 22,
                resizeMode: 'stretch',
                borderRadius: 22,
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={ShopMove} style={{marginRight: 15}}>
            <Image
              source={{uri: BASE_URL + '/images/shop_icon.png'}}
              style={{
                width: 22,
                height: 22,
                resizeMode: 'contain',
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('NotificationHistory')}>
            <Image
              source={{uri: BASE_URL + '/images/bell_new_icon.png'}}
              style={{
                width: 21,
                height: 22,
                resizeMode: 'contain',
              }}
            />
            <Box
              backgroundColor={'#E11B1B'}
              position={'absolute'}
              top={-7}
              left={-5}
              minWidth={'19px'}
              minHeight={'19px'}
              justifyContent={'center'}
              alignItems={'center'}
              borderRadius={19}>
              <DefText
                text={'1'}
                style={[fsize.fs12, {color: colorSelect.white, lineHeight: 17}]}
              />
            </Box>
          </TouchableOpacity>
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

export default EventHeader;
