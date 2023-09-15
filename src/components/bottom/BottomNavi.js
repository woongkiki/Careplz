import {Box, HStack} from 'native-base';
import React from 'react';
import {Image, TouchableOpacity} from 'react-native';
import {BASE_URL} from '../../Utils/APIConstant';
import {colorSelect, fsize, fweight} from '../../common/StyleCommon';
import {DefText} from '../../common/BOOTSTRAP';

const BottomNavi = props => {
  const {navigation, route, screenName} = props;
  // console.log('bottom navi', screenName);

  const TabNaviMove = screenName => {
    if (screenName == 'HospitalMap') {
      navigation.navigate('HospitalMap', {schText: ''});
    } else {
      navigation.navigate(screenName);
    }
  };

  return (
    <HStack
      backgroundColor={'#fff'}
      shadow={9}
      justifyContent={'space-around'}
      p="20px">
      <TouchableOpacity activeOpacity={1} onPress={() => TabNaviMove('Event')}>
        <HStack
          py="10px"
          px="13px"
          backgroundColor={
            screenName == 'Event' ? colorSelect.pink_de : colorSelect.white
          }
          borderRadius={20}
          alignItems={'center'}
          justifyContent={'center'}>
          <Image
            source={{
              uri:
                screenName == 'Event'
                  ? BASE_URL + '/newImg/tabbar01_on.png'
                  : BASE_URL + '/newImg/tabbar01_off.png',
            }}
            style={{
              width: 23,
              height: 22,
              resizeMode: 'contain',
            }}
          />
          {screenName == 'Event' && (
            <Box ml="10px">
              <DefText
                text={'홈'}
                style={[
                  fsize.fs13,
                  fweight.bold,
                  {color: colorSelect.white, lineHeight: 19},
                ]}
              />
            </Box>
          )}
        </HStack>
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => TabNaviMove('HospitalMap')}>
        <HStack
          py="10px"
          px="13px"
          backgroundColor={
            screenName == 'HospitalMap'
              ? colorSelect.pink_de
              : colorSelect.white
          }
          borderRadius={20}>
          <Image
            source={{
              uri:
                screenName == 'HospitalMap'
                  ? BASE_URL + '/newImg/tabbar02_on.png'
                  : BASE_URL + '/newImg/tabbar02_off.png',
            }}
            style={{
              width: 23,
              height: 22,
              resizeMode: 'contain',
            }}
          />
          {screenName == 'HospitalMap' && (
            <Box ml="10px">
              <DefText
                text={'병원/약국'}
                style={[
                  fsize.fs13,
                  fweight.bold,
                  {color: colorSelect.white, lineHeight: 19},
                ]}
              />
            </Box>
          )}
        </HStack>
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => TabNaviMove('ReservationList')}>
        <HStack
          py="10px"
          px="13px"
          backgroundColor={
            screenName == 'ReservationList'
              ? colorSelect.pink_de
              : colorSelect.white
          }
          borderRadius={20}>
          <Image
            source={{
              uri:
                screenName == 'ReservationList'
                  ? BASE_URL + '/newImg/tabbar03_on.png'
                  : BASE_URL + '/newImg/tabbar03_off.png',
            }}
            style={{
              width: 23,
              height: 22,
              resizeMode: 'contain',
            }}
          />
          {screenName == 'ReservationList' && (
            <Box ml="10px">
              <DefText
                text={'진료내역'}
                style={[
                  fsize.fs13,
                  fweight.bold,
                  {color: colorSelect.white, lineHeight: 19},
                ]}
              />
            </Box>
          )}
        </HStack>
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => TabNaviMove('HealthHandbook')}>
        <HStack
          py="10px"
          px="13px"
          backgroundColor={
            screenName == 'HealthHandbook'
              ? colorSelect.pink_de
              : colorSelect.white
          }
          borderRadius={20}>
          <Image
            source={{
              uri:
                screenName == 'HealthHandbook'
                  ? BASE_URL + '/newImg/tabbar04_on.png'
                  : BASE_URL + '/newImg/tabbar04_off.png',
            }}
            style={{
              width: 23,
              height: 22,
              resizeMode: 'contain',
            }}
          />
          {screenName == 'HealthHandbook' && (
            <Box ml="10px">
              <DefText
                text={'건강수첩'}
                style={[
                  fsize.fs13,
                  fweight.bold,
                  {color: colorSelect.white, lineHeight: 19},
                ]}
              />
            </Box>
          )}
        </HStack>
      </TouchableOpacity>
      <TouchableOpacity activeOpacity={1} onPress={() => TabNaviMove('Mypage')}>
        <HStack
          py="10px"
          px="13px"
          backgroundColor={
            screenName == 'Mypage' ? colorSelect.pink_de : colorSelect.white
          }
          borderRadius={20}>
          <Image
            source={{
              uri:
                screenName == 'Mypage'
                  ? BASE_URL + '/newImg/tabbar05_on.png'
                  : BASE_URL + '/newImg/tabbar05_off.png',
            }}
            style={{
              width: 23,
              height: 22,
              resizeMode: 'contain',
            }}
          />
          {screenName == 'Mypage' && (
            <Box ml="10px">
              <DefText
                text={'내정보'}
                style={[
                  fsize.fs13,
                  fweight.bold,
                  {color: colorSelect.white, lineHeight: 19},
                ]}
              />
            </Box>
          )}
        </HStack>
      </TouchableOpacity>
    </HStack>
  );
};

export default BottomNavi;
