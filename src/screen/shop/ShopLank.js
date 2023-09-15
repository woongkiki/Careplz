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
import {BASE_URL} from '../../Utils/APIConstant';
import {
  colorSelect,
  deviceSize,
  fsize,
  fweight,
} from '../../common/StyleCommon';
import {useIsFocused} from '@react-navigation/native';
import {DefText, LabelTitle} from '../../common/BOOTSTRAP';

const ShopLank = props => {
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
              name == 'ShopLank' ? colorSelect.pink_de : colorSelect.white,
            height: top + top / 2,
          }}
        />
      )}

      {isFocused && (
        <StatusBar
          animated={false}
          backgroundColor={
            name == 'ShopLank' ? colorSelect.pink_de : colorSelect.white
          }
        />
      )}
      <ShopHeader navigation={navigation} />
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
        <Box mt="10px">
          <Box p="20px">
            <LabelTitle text={'인기상품'} />
          </Box>
          <Box>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <HStack px="20px">
                {[...Array(10)].map((val, idx) => {
                  return (
                    <TouchableOpacity
                      key={idx}
                      style={[idx != 0 && {marginLeft: 10}]}>
                      <Image
                        source={{uri: `https://picsum.photos/164`}}
                        style={{
                          width: (deviceSize.deviceWidth - 40) * 0.235,
                          height: (deviceSize.deviceWidth - 40) * 0.235,
                          resizeMode: 'stretch',
                          borderRadius: 5,
                        }}
                      />
                      <Box mt="10px">
                        <DefText
                          text={'이로로'}
                          style={[styles.horizontalBannerText1]}
                        />
                        <HStack alignItems={'flex-end'}>
                          <DefText
                            text={'10%'}
                            style={[
                              styles.horizontalBannerPercentText,
                              {marginRight: 5},
                            ]}
                          />
                          <DefText
                            text={'11,000'}
                            style={[styles.horizontalBannerSliceText]}
                          />
                        </HStack>
                        <DefText
                          text={'10,000'}
                          style={[styles.horizontalBannerText2]}
                        />
                      </Box>
                    </TouchableOpacity>
                  );
                })}
              </HStack>
            </ScrollView>
            <Box alignItems={'center'} mt="20px">
              <TouchableOpacity style={[styles.moreBtn]}>
                <HStack alignItems={'center'}>
                  <DefText text={'더보기'} style={[styles.moreBtnText]} />
                  <Image
                    source={{uri: BASE_URL + '/shopImg/pink_bottom_arr.png'}}
                    style={{
                      width: 9,
                      height: 5,
                      resizeMode: 'contain',
                      marginLeft: 5,
                    }}
                  />
                </HStack>
              </TouchableOpacity>
            </Box>
            <Box p="20px">
              <Box width="100%" height={'1px'} backgroundColor={'#EFEFF1'} />
            </Box>
          </Box>
        </Box>
        <Box>
          <Box p="20px" pt="0">
            <LabelTitle text={'피부 타입별 인기 화장품'} />
          </Box>
          <Box>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <HStack px="20px">
                {[...Array(10)].map((val, idx) => {
                  return (
                    <TouchableOpacity
                      key={idx}
                      style={[idx != 0 && {marginLeft: 10}]}>
                      <Image
                        source={{uri: `https://picsum.photos/164`}}
                        style={{
                          width: (deviceSize.deviceWidth - 40) * 0.235,
                          height: (deviceSize.deviceWidth - 40) * 0.235,
                          resizeMode: 'stretch',
                          borderRadius: 5,
                        }}
                      />
                      <Box mt="10px">
                        <DefText
                          text={'이로로'}
                          style={[styles.horizontalBannerText1]}
                        />
                        <HStack alignItems={'flex-end'}>
                          <DefText
                            text={'10%'}
                            style={[
                              styles.horizontalBannerPercentText,
                              {marginRight: 5},
                            ]}
                          />
                          <DefText
                            text={'11,000'}
                            style={[styles.horizontalBannerSliceText]}
                          />
                        </HStack>
                        <DefText
                          text={'10,000'}
                          style={[styles.horizontalBannerText2]}
                        />
                      </Box>
                    </TouchableOpacity>
                  );
                })}
              </HStack>
            </ScrollView>
            <Box alignItems={'center'} mt="20px">
              <TouchableOpacity style={[styles.moreBtn]}>
                <HStack alignItems={'center'}>
                  <DefText text={'더보기'} style={[styles.moreBtnText]} />
                  <Image
                    source={{uri: BASE_URL + '/shopImg/pink_bottom_arr.png'}}
                    style={{
                      width: 9,
                      height: 5,
                      resizeMode: 'contain',
                      marginLeft: 5,
                    }}
                  />
                </HStack>
              </TouchableOpacity>
            </Box>
            <Box p="20px" pb="0">
              <Box width="100%" height={'1px'} backgroundColor={'#EFEFF1'} />
            </Box>
          </Box>
        </Box>
        <Box>
          <Box p="20px">
            <LabelTitle text={'종류별'} />
          </Box>
          <Box>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <HStack px="20px">
                {[...Array(10)].map((val, idx) => {
                  return (
                    <TouchableOpacity
                      key={idx}
                      style={[idx != 0 && {marginLeft: 10}]}>
                      <Image
                        source={{uri: `https://picsum.photos/164`}}
                        style={{
                          width: (deviceSize.deviceWidth - 40) * 0.235,
                          height: (deviceSize.deviceWidth - 40) * 0.235,
                          resizeMode: 'stretch',
                          borderRadius: 5,
                        }}
                      />
                      <Box mt="10px">
                        <DefText
                          text={'이로로'}
                          style={[styles.horizontalBannerText1]}
                        />
                        <HStack alignItems={'flex-end'}>
                          <DefText
                            text={'10%'}
                            style={[
                              styles.horizontalBannerPercentText,
                              {marginRight: 5},
                            ]}
                          />
                          <DefText
                            text={'11,000'}
                            style={[styles.horizontalBannerSliceText]}
                          />
                        </HStack>
                        <DefText
                          text={'10,000'}
                          style={[styles.horizontalBannerText2]}
                        />
                      </Box>
                    </TouchableOpacity>
                  );
                })}
              </HStack>
            </ScrollView>
            <Box alignItems={'center'} mt="20px" pb="70px">
              <TouchableOpacity style={[styles.moreBtn]}>
                <HStack alignItems={'center'}>
                  <DefText text={'더보기'} style={[styles.moreBtnText]} />
                  <Image
                    source={{uri: BASE_URL + '/shopImg/pink_bottom_arr.png'}}
                    style={{
                      width: 9,
                      height: 5,
                      resizeMode: 'contain',
                      marginLeft: 5,
                    }}
                  />
                </HStack>
              </TouchableOpacity>
            </Box>
          </Box>
        </Box>
      </ScrollView>

      {/* 최근본상품 */}
      <Box position={'absolute'} bottom="20px" left="20px">
        <TouchableOpacity
          //style={[styles.fixButton]}
          onPress={() => navigation.navigate('EventRecent')}>
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

export default ShopLank;
