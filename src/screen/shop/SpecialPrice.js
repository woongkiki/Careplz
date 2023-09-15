import {Box, HStack} from 'native-base';
import React from 'react';
import ShopHeader from '../../components/shop/ShopHeader';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  Image,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  colorSelect,
  deviceSize,
  fsize,
  fweight,
} from '../../common/StyleCommon';
import {useIsFocused} from '@react-navigation/native';
import {BASE_URL} from '../../Utils/APIConstant';
import {DefText, LabelTitle} from '../../common/BOOTSTRAP';

const SpecialPrice = props => {
  const {navigation, route} = props;
  const {name} = route;

  const {top} = useSafeAreaInsets();

  const isFocused = useIsFocused();

  return (
    <Box flex={1} backgroundColor={'#fff'}>
      {Platform.OS === 'ios' && (
        <View
          style={{
            backgroundColor:
              name == 'SpecialPrice' ? colorSelect.pink_de : colorSelect.white,
            height: top + top / 2,
          }}
        />
      )}

      {isFocused && (
        <StatusBar
          animated={false}
          backgroundColor={
            name == 'SpecialPrice' ? colorSelect.pink_de : colorSelect.white
          }
        />
      )}
      <ShopHeader navigation={navigation} rightCont={false} />
      <ScrollView>
        <Box>
          <Image
            source={{uri: BASE_URL + '/shopImg/shop_lank_banner.png'}}
            style={{
              width: deviceSize.deviceWidth,
              height: deviceSize.deviceWidth / 1.25,
              resizeMode: 'stretch',
            }}
          />
        </Box>
        <Box pb="70px">
          <Box p="20px" pb="0">
            <LabelTitle text={'Text 목록만'} />
          </Box>
          <Box px="20px">
            {[...Array(4)].map((val, idx) => {
              return (
                <TouchableOpacity
                  key={idx}
                  style={[
                    {
                      paddingVertical: 20,
                      borderBottomColor: idx + 1 != 4 ? '#EFEFF1' : '#fff',
                      borderBottomWidth: 1,
                    },
                  ]}>
                  <HStack>
                    <Image
                      source={{uri: `https://picsum.photos/164`}}
                      style={{
                        width: (deviceSize.deviceWidth - 40) * 0.32,
                        height: (deviceSize.deviceWidth - 40) * 0.32,
                        resizeMode: 'stretch',
                        borderRadius: 5,
                      }}
                    />
                    <Box
                      width={(deviceSize.deviceWidth - 40) * 0.68}
                      pl="15px"
                      justifyContent={'space-around'}>
                      <Box>
                        <DefText
                          text={'올인원'}
                          style={[styles.horizontalBannerText2, fweight.r]}
                        />
                        <DefText
                          text={'2023.04.04 ~ 2023.06.11'}
                          style={[styles.horizontalBannerText1, ,]}
                        />
                      </Box>
                      <HStack alignItems={'flex-end'} mt="10px">
                        <DefText
                          text={'10%'}
                          style={[
                            styles.horizontalBannerPercentText,
                            {marginRight: 5},
                          ]}
                        />
                        <DefText
                          text={'11,000'}
                          style={[styles.horizontalBannerText2]}
                        />
                      </HStack>
                    </Box>
                  </HStack>
                </TouchableOpacity>
              );
            })}
          </Box>
        </Box>
      </ScrollView>

      {/* 최근본상품 */}
      <Box position={'absolute'} bottom="20px" left="20px">
        <TouchableOpacity
          //style={[styles.fixButton]}
          onPress={() => navigation.navigate('ShopRecent')}>
          <Image
            source={{uri: BASE_URL + '/shopImg/shop_recent_img.png'}}
            style={{
              width: 50,
              height: 50,
              borderRadius: 10,
            }}
          />
        </TouchableOpacity>
      </Box>
    </Box>
  );
};

const styles = StyleSheet.create({
  horizontalBannerText1: {...fsize.fs13, lineHeight: 21},
  horizontalBannerText2: {...fsize.fs15, ...fweight.bold, lineHeight: 21},
  horizontalBannerPercentText: {
    ...fsize.fs15,
    ...fweight.bold,
    color: '#E11B1B',
    lineHeight: 21,
  },
  horizontalBannerSliceText: {
    ...fsize.fs12,
    ...fweight.m,
    lineHeight: 17,
    color: '#A2A2A2',
    textDecorationLine: 'line-through',
  },
  moreBtn: {
    paddingHorizontal: 10,
    borderRadius: 30,
    height: 30,
    borderWidth: 1,
    borderColor: colorSelect.pink_de,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moreBtnText: {
    lineHeight: 28,
    color: colorSelect.pink_de,
    ...fsize.fs12,
  },
});

export default SpecialPrice;
