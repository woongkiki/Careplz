import {Box, HStack} from 'native-base';
import React, {useState} from 'react';
import {DefText, LabelTitle} from '../../common/BOOTSTRAP';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import ShopHeader from '../../components/shop/ShopHeader';
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
import SearchInput from '../../components/SearchInput';

const Shop = props => {
  const {navigation, route} = props;
  const {name} = route;

  const {top} = useSafeAreaInsets();

  const isFocused = useIsFocused();

  const [schText, setSchtText] = useState('');

  //
  const schTextChange = text => {
    setSchtText(text);
  };

  return (
    <Box flex={1} backgroundColor={'#fff'}>
      {Platform.OS === 'ios' && (
        <View
          style={{
            backgroundColor:
              name == 'Shop' ? colorSelect.pink_de : colorSelect.white,
            height: top + top / 2,
          }}
        />
      )}

      {isFocused && (
        <StatusBar
          animated={false}
          backgroundColor={
            name == 'Shop' ? colorSelect.pink_de : colorSelect.white
          }
        />
      )}
      <ShopHeader navigation={navigation} />
      <ScrollView>
        <Box>
          <Box>
            <Image
              source={{uri: BASE_URL + '/shopImg/shopBanner.png'}}
              style={{
                width: deviceSize.deviceWidth,
                height: deviceSize.deviceWidth / 1.25,
                resizeMode: 'stretch',
              }}
            />
            <Box px="20px" position={'absolute'} bottom="15px" width={'100%'}>
              <SearchInput
                placeholder="상품명 또는 해시태그, 브랜드 검색"
                value={schText}
                buttonPositionRight={0}
                positionMargin={'-21px'}
                inputStyle={{
                  height: 45,
                  borderRadius: 45,
                  borderWidth: 1,
                  borderColor: colorSelect.pink_de,
                }}
                btnStyle={{
                  height: 42,
                  borderRadius: 43,
                  marginRight: 1,
                  backgroundColor: colorSelect.white,
                }}
                onChangeText={schTextChange}
              />
            </Box>
          </Box>
          <Box mt="10px">
            <Box p="20px">
              <LabelTitle text={'피부 타입별'} />
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
                            resizeMode: 'contain',
                            borderRadius: 5,
                          }}
                        />
                        <Box mt="10px">
                          <DefText
                            text={'여드름'}
                            style={[styles.horizontalBannerText1]}
                          />
                          <DefText
                            text={'(TEXT등록)'}
                            style={[styles.horizontalBannerText2]}
                          />
                        </Box>
                      </TouchableOpacity>
                    );
                  })}
                </HStack>
              </ScrollView>
              <Box p="20px">
                <Box width="100%" height={'1px'} backgroundColor={'#EFEFF1'} />
              </Box>
            </Box>
          </Box>
          <Box>
            <Box p="20px" pt="5px">
              <LabelTitle text={'화장품 종류별'} />
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
                            resizeMode: 'contain',
                            borderRadius: 5,
                          }}
                        />
                        <Box mt="10px">
                          <DefText
                            text={'스킨케어'}
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
              <Box p="20px">
                <Box width="100%" height={'1px'} backgroundColor={'#EFEFF1'} />
              </Box>
            </Box>
          </Box>
          <Box>
            <Box p="20px" pt="5px">
              <LabelTitle text={'브랜드별'} />
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
                            resizeMode: 'contain',
                            borderRadius: 5,
                          }}
                        />
                        <Box mt="10px">
                          <DefText
                            text={'스킨케어'}
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
              <Box p="20px">
                <Box width="100%" height={'1px'} backgroundColor={'#EFEFF1'} />
              </Box>
            </Box>
          </Box>
          <Box>
            <Box p="20px" pt="5px">
              <LabelTitle text={'브랜드별'} />
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
                            resizeMode: 'contain',
                            borderRadius: 5,
                          }}
                        />
                        <Box mt="10px">
                          <DefText
                            text={'스킨케어'}
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
              <Box p="20px">
                <Box width="100%" height={'1px'} backgroundColor={'#EFEFF1'} />
              </Box>
            </Box>
          </Box>
          <Box>
            <Box p="20px" pt="5px">
              <LabelTitle text={'베스트 상품'} />
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
                            width: (deviceSize.deviceWidth - 40) * 0.32,
                            height: (deviceSize.deviceWidth - 40) * 0.32 * 1.21,
                            resizeMode: 'stretch',
                            borderRadius: 5,
                          }}
                        />
                        <Box mt="10px">
                          <DefText
                            text={'상품명'}
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
                              style={[styles.horizontalBannerText2]}
                            />
                          </HStack>
                        </Box>
                      </TouchableOpacity>
                    );
                  })}
                </HStack>
              </ScrollView>
              <Box p="20px">
                <Box width="100%" height={'1px'} backgroundColor={'#EFEFF1'} />
              </Box>
            </Box>
          </Box>
          <Box>
            <Box p="20px" pt="5px">
              <LabelTitle text={'Text 목록만'} />
            </Box>
            <Box px="20px">
              {[...Array(3)].map((val, idx) => {
                return (
                  <TouchableOpacity
                    key={idx}
                    style={[idx != 0 && {marginTop: 20}]}>
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
                            text={'한줄소개'}
                            style={[
                              styles.horizontalBannerText1,
                              {color: '#898E96'},
                            ]}
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
                        <Box alignItems={'flex-end'} mt="15px">
                          <Image
                            source={{
                              uri: BASE_URL + '/images/heart_off_icon.png',
                            }}
                            style={{
                              width: 19,
                              height: 17,
                              resizeMode: 'contain',
                            }}
                          />
                        </Box>
                      </Box>
                    </HStack>
                  </TouchableOpacity>
                );
              })}
            </Box>
            <Box p="20px">
              <Box width="100%" height={'1px'} backgroundColor={'#EFEFF1'} />
            </Box>
          </Box>
          <Box>
            <Box p="20px" pt="5px">
              <LabelTitle text={'특가 이벤트'} />
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
                            width: (deviceSize.deviceWidth - 40) * 0.32,
                            height: (deviceSize.deviceWidth - 40) * 0.32 * 1.21,
                            resizeMode: 'stretch',
                            borderRadius: 5,
                          }}
                        />
                        <Box mt="10px">
                          <DefText
                            text={'상품명'}
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
                              style={[styles.horizontalBannerText2]}
                            />
                          </HStack>
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
            <Box p="20px" pt="5px">
              <LabelTitle text={'최근 본 상품'} />
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
                            width: (deviceSize.deviceWidth - 40) * 0.32,
                            height: (deviceSize.deviceWidth - 40) * 0.32 * 1.21,
                            resizeMode: 'stretch',
                            borderRadius: 5,
                          }}
                        />
                        <Box mt="10px">
                          <DefText
                            text={'상품명'}
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
                              style={[styles.horizontalBannerText2]}
                            />
                          </HStack>
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
            <Box p="20px" pt="5px">
              <LabelTitle text={'추천 상품'} />
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
                            width: (deviceSize.deviceWidth - 40) * 0.32,
                            height: (deviceSize.deviceWidth - 40) * 0.32 * 1.21,
                            resizeMode: 'stretch',
                            borderRadius: 5,
                          }}
                        />
                        <Box mt="10px">
                          <DefText
                            text={'상품명'}
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
                              style={[styles.horizontalBannerText2]}
                            />
                          </HStack>
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
            </Box>
          </Box>
        </Box>
      </ScrollView>
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

export default Shop;
