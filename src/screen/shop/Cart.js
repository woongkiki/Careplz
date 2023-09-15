import {Box, CheckIcon, HStack} from 'native-base';
import React, {useEffect, useState} from 'react';
import ShopHeader from '../../components/shop/ShopHeader';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Header from '../../components/Header';
import {Image, ScrollView, StyleSheet, TouchableOpacity} from 'react-native';
import {DefText} from '../../common/BOOTSTRAP';
import Loading from '../../components/Loading';
import EmptyPage from '../../components/EmptyPage';
import {
  colorSelect,
  deviceSize,
  fsize,
  fweight,
} from '../../common/StyleCommon';
import {connect} from 'react-redux';
import {actionCreators as UserAction} from '../../redux/module/action/UserAction';
import Api from '../../Api';
import {BASE_URL} from '../../Utils/APIConstant';
import {numberFormat, textLengthOverCut} from '../../common/DataFunction';

const cartList = [
  {
    idx: 1,
    product: '올인원 로션',
    count: 1,
    orPrice: 22000,
    price: 20000,
  },
  {
    idx: 2,
    product: '올인원 로션',
    count: 1,
    orPrice: 22000,
    price: 20000,
  },
];

const Cart = props => {
  const {navigation, userInfo, user_lang} = props;

  const {top} = useSafeAreaInsets();

  const [loading, setLoading] = useState(true);
  const [pageText, setPageText] = useState('');

  //번역
  // const langApi = () => {
  //   //user_lang != null ? user_lang?.cidx : userInfo?.cidx,
  //   Api.send(
  //     'app_page',
  //     {
  //       cidx: 0,
  //       code: 'shopCart',
  //     },
  //     args => {
  //       let resultItem = args.resultItem;
  //       let arrItems = args.arrItems;

  //       if (resultItem.result === 'Y' && arrItems) {
  //         console.log('장바구니 언어 리스트: ', resultItem, arrItems);
  //         setPageText(arrItems.text);
  //         //setSingoDataList([arrItems.text[26], arrItems.text[27], arrItems.text[28], arrItems.text[29]])
  //       } else {
  //         console.log('장바구니 언어 api 실패!', resultItem);
  //       }
  //     },
  //   );
  // };

  const apiHandler = async () => {
    await setLoading(true);
    //await langApi();
    await setLoading(false);
  };

  useEffect(() => {
    apiHandler();
  }, []);

  return (
    <Box flex={1} backgroundColor={'#fff'} pt={top + 'px'}>
      <Header
        navigation={navigation}
        headerTitle={'장바구니'}
        backButtonStatus={false}
      />
      {loading ? (
        <Loading />
      ) : cartList != '' ? (
        <ScrollView>
          <Box
            width={deviceSize.deviceWidth}
            height={'9px'}
            backgroundColor={'#F7F9F9'}
          />
          <HStack
            px="20px"
            py="10px"
            alignItems={'center'}
            justifyContent={'space-between'}>
            <TouchableOpacity>
              <HStack alignItems={'center'}>
                <Box style={[styles.checkBox]}>
                  <CheckIcon size="3" color={'#707070'} />
                </Box>
                <HStack ml="10px">
                  <DefText text={'전체'} style={[styles.checkBoxText]} />
                  <DefText
                    text={'3'}
                    style={[styles.checkBoxText, fweight.bold]}
                  />
                  <DefText text={'개'} style={[styles.checkBoxText]} />
                </HStack>
              </HStack>
            </TouchableOpacity>
            <TouchableOpacity>
              <DefText
                text={'선택 삭제'}
                style={[fsize.fs13, fweight.bold, {lineHeight: 19}]}
              />
            </TouchableOpacity>
          </HStack>
          <Box
            width={deviceSize.deviceWidth}
            height={'9px'}
            backgroundColor={'#F7F9F9'}
          />
          <Box px="20px">
            {cartList.map((item, index) => {
              return (
                <Box pb="20px" key={index}>
                  <TouchableOpacity
                    style={{
                      paddingTop: 20,
                      borderTopWidth: 1,
                      borderTopColor: index != 0 ? '#E8E9EA' : '#fff',
                    }}>
                    <HStack>
                      <HStack
                        alignItems={'center'}
                        width={deviceSize.deviceWidth * 0.35}>
                        <TouchableOpacity style={{marginRight: 10}}>
                          <Box style={[styles.checkBox]}>
                            <CheckIcon size="3" color={'#707070'} />
                          </Box>
                        </TouchableOpacity>
                        <Image
                          source={{uri: `https://picsum.photos/164`}}
                          style={{
                            width: deviceSize.deviceWidth / 4.6,
                            height: deviceSize.deviceWidth / 4.6,
                            resizeMode: 'stretch',
                            borderRadius: 5,
                          }}
                        />
                      </HStack>

                      <Box
                        width={deviceSize.deviceWidth * 0.35}
                        justifyContent={'space-around'}>
                        <DefText
                          text={textLengthOverCut(item.product, 15, '...')}
                          style={[fsize.fs15, {lineHeight: 21}]}
                        />
                        <HStack>
                          <TouchableOpacity
                            style={[
                              styles.cartCountBox,
                              {
                                borderRightWidth: 0,
                                borderTopLeftRadius: 5,
                                borderBottomLeftRadius: 5,
                              },
                            ]}>
                            <Image
                              source={{
                                uri: BASE_URL + '/shopImg/cart_minus_img.png',
                              }}
                              style={{
                                width: 12,
                                height: 1,
                                resizeMode: 'contain',
                              }}
                            />
                          </TouchableOpacity>
                          <Box
                            style={[
                              {
                                borderRightWidth: 0,
                                height: 33,
                                borderWidth: 1,
                                borderColor: '#D0D0D1',
                                borderRightWidth: 0,
                                alignItems: 'center',
                                justifyContent: 'center',
                                paddingHorizontal: 10,
                              },
                            ]}>
                            <DefText
                              text={item.count}
                              style={[
                                fsize.fs15,
                                fweight.bold,
                                {lineHeight: 21},
                              ]}
                            />
                          </Box>
                          <TouchableOpacity
                            style={[
                              styles.cartCountBox,
                              {
                                borderTopRightRadius: 5,
                                borderBottomRightRadius: 5,
                              },
                            ]}>
                            <Image
                              source={{
                                uri: BASE_URL + '/shopImg/cart_plus_img.png',
                              }}
                              style={{
                                width: 12,
                                height: 12,
                                resizeMode: 'contain',
                              }}
                            />
                          </TouchableOpacity>
                        </HStack>
                      </Box>
                      <Box
                        justifyContent={'space-around'}
                        alignItems={'flex-end'}>
                        <TouchableOpacity>
                          <Image
                            source={{
                              uri: BASE_URL + '/shopImg/cart_remove_icon.png',
                            }}
                            style={{
                              width: 16,
                              height: 16,
                              resizeMode: 'contain',
                            }}
                          />
                        </TouchableOpacity>
                        <Box alignItems={'flex-end'}>
                          <DefText
                            text={numberFormat(item.orPrice) + '원'}
                            style={[styles.orPrice]}
                          />
                          <DefText
                            text={numberFormat(item.price) + '원'}
                            style={[styles.price]}
                          />
                        </Box>
                      </Box>
                    </HStack>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.selectButton]}>
                    <HStack
                      alignItems={'center'}
                      height="35px"
                      px="15px"
                      justifyContent={'space-between'}>
                      <DefText
                        text={'상품을 선택해 주세요.'}
                        style={[fsize.fs13, {color: '#BEBEBE'}]}
                      />
                      <Image
                        source={{uri: BASE_URL + '/shopImg/cart_arr_icon.png'}}
                        style={{width: 12, height: 7, resizeMode: 'contain'}}
                      />
                    </HStack>
                  </TouchableOpacity>
                </Box>
              );
            })}
          </Box>
          <Box
            width={deviceSize.deviceWidth}
            height={'9px'}
            backgroundColor={'#F7F9F9'}
          />
          <Box px="20px" py="30px">
            <Box pb="20px" borderBottomWidth={1}>
              <DefText
                text={'결제금액'}
                style={[
                  fsize.fs17,
                  fweight.bold,
                  {color: '#191919', lineHeight: 25},
                ]}
              />
            </Box>
            <Box pb="15px" borderBottomWidth={1} borderBottomColor={'#E8E9EA'}>
              <HStack
                alignItems={'center'}
                justifyContent={'space-between'}
                mt={'15px'}>
                <DefText text={'총 구매 수량'} style={[styles.leftText]} />
                <DefText text={'3개'} style={[styles.rightText]} />
              </HStack>
              <HStack
                alignItems={'center'}
                justifyContent={'space-between'}
                mt={'15px'}>
                <DefText text={'총 상품금액'} style={[styles.leftText]} />
                <DefText
                  text={numberFormat(60000) + '원'}
                  style={[styles.rightText]}
                />
              </HStack>
              <HStack
                alignItems={'center'}
                justifyContent={'space-between'}
                mt={'15px'}>
                <DefText text={'총 배송비'} style={[styles.leftText]} />
                <DefText
                  text={numberFormat(4000) + '원'}
                  style={[styles.rightText]}
                />
              </HStack>
            </Box>
            <HStack
              alignItems={'center'}
              justifyContent={'space-between'}
              mt={'15px'}>
              <DefText text={'총 결제금액'} style={[styles.leftText]} />
              <DefText
                text={numberFormat(64000) + '원'}
                style={[styles.rightText]}
              />
            </HStack>
          </Box>
        </ScrollView>
      ) : (
        <EmptyPage emptyText={'장바구니에 담긴 상품이 없습니다.'} />
      )}
    </Box>
  );
};

const styles = StyleSheet.create({
  checkBox: {
    width: 22,
    height: 22,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#707070',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkBoxText: {
    ...fsize.fs15,
    lineHeight: 21,
    color: '#191919',
  },
  cartCountBox: {
    width: 33,
    height: 33,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#D0D0D1',
  },
  orPrice: {
    ...fsize.fs14,
    lineHeight: 20,
    color: '#A8A8A8',
    textDecorationLine: 'line-through',
  },
  price: {
    ...fsize.fs16,
    lineHeight: 24,
    ...fweight.bold,
    color: '#191919',
  },
  selectButton: {
    width: deviceSize.deviceWidth - 40,
    height: 35,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colorSelect.pink_de,
    marginTop: 15,
  },
  leftText: {
    ...fsize.fs15,
    ...fweight.m,
    lineHeight: 21,
  },
  rightText: {
    ...fsize.fs15,
    ...fweight.bold,
    lineHeight: 21,
  },
});

export default connect(
  ({User}) => ({
    userInfo: User.userInfo, //회원정보
    user_lang: User.user_lang,
  }),
  dispatch => ({
    member_login: user => dispatch(UserAction.member_login(user)), //로그인
    languageSet: user => dispatch(UserAction.languageSet(user)), //선택언어
  }),
)(Cart);
