import {Box, HStack} from 'native-base';
import React from 'react';
import ShopHeader from '../../components/shop/ShopHeader';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Header from '../../components/Header';
import {Image, ScrollView, StyleSheet, TouchableOpacity} from 'react-native';
import {BASE_URL} from '../../Utils/APIConstant';
import {DefText} from '../../common/BOOTSTRAP';
import {deviceSize, fsize, fweight} from '../../common/StyleCommon';

const ShopBox = ({shopCnt, shopStatus}) => {
  return (
    <Box style={[styles.shopBox]}>
      <DefText
        text={shopCnt + '건'}
        style={[styles.shopCount, {color: shopCnt > 0 ? '#000000' : '#DADDE0'}]}
      />
      <DefText
        text={shopStatus}
        style={[
          styles.shopStatus,
          {color: shopCnt > 0 ? '#000000' : '#DADDE0'},
        ]}
      />
    </Box>
  );
};

const MypageMenu = ({
  imgUri,
  menuText,
  iconWidth = 19,
  iconHeight = 14,
  mt = 30,
}) => {
  return (
    <TouchableOpacity style={{marginTop: mt}}>
      <HStack alignItems={'center'}>
        <Box
          width="25px"
          height="25px"
          alignItems={'flex-start'}
          justifyContent={'center'}
          mr="15px">
          <Image
            source={{uri: imgUri}}
            style={[
              {width: iconWidth, height: iconHeight, resizeMode: 'contain'},
            ]}
          />
        </Box>
        <DefText text={menuText} style={[styles.mypageText]} />
      </HStack>
    </TouchableOpacity>
  );
};

const ShopMypage = props => {
  const {navigation} = props;

  const {top} = useSafeAreaInsets();

  return (
    <Box flex={1} backgroundColor={'#fff'} pt={top + 'px'}>
      <Header
        navigation={navigation}
        headerTitle={'마이페이지'}
        backButtonStatus={false}
        rightButton={
          <HStack>
            <TouchableOpacity style={{marginRight: 14}}>
              <Image
                source={{uri: BASE_URL + '/shopImg/cart_icon_black.png'}}
                style={{width: 23, height: 22, resizeMode: 'contain'}}
              />
            </TouchableOpacity>
            <TouchableOpacity>
              <Image
                source={{uri: BASE_URL + '/shopImg/bell_icon_navy.png'}}
                style={{width: 21, height: 22, resizeMode: 'contain'}}
              />
            </TouchableOpacity>
          </HStack>
        }
      />
      <ScrollView>
        <Box p="20px">
          <HStack alignItems={'center'} justifyContent={'space-between'}>
            <DefText
              text={'주문/배송조회'}
              style={[fsize.fs16, fweight.bold, {lineHeight: 24}]}
            />
            <TouchableOpacity
              onPress={() => navigation.navigate('OrderDeliverySearch')}>
              <HStack alignItems={'center'}>
                <DefText
                  text={'더보기'}
                  style={[fsize.fs13, fweight.m, {lineHeight: 19}]}
                />
                <Image
                  source={{uri: BASE_URL + '/shopImg/arr_right_mypage.png'}}
                  style={{
                    width: 10,
                    height: 6,
                    resizeMode: 'contain',
                    marginTop: 1,
                    marginLeft: 3,
                  }}
                />
              </HStack>
            </TouchableOpacity>
          </HStack>
          <HStack
            alignItems={'center'}
            justifyContent={'space-around'}
            mt="20px"
            mx="-5px">
            <ShopBox shopCnt={0} shopStatus={'주문접수'} />
            <Image
              source={{uri: BASE_URL + '/shopImg/right_gray_arr.png'}}
              style={{width: 12, height: 7, resizeMode: 'contain'}}
            />
            <ShopBox shopCnt={0} shopStatus={'결제완료'} />
            <Image
              source={{uri: BASE_URL + '/shopImg/right_gray_arr.png'}}
              style={{width: 12, height: 7, resizeMode: 'contain'}}
            />
            <ShopBox shopCnt={1} shopStatus={'배송준비'} />
            <Image
              source={{uri: BASE_URL + '/shopImg/right_gray_arr.png'}}
              style={{width: 12, height: 7, resizeMode: 'contain'}}
            />
            <ShopBox shopCnt={0} shopStatus={'배송중'} />
            <Image
              source={{uri: BASE_URL + '/shopImg/right_gray_arr.png'}}
              style={{width: 12, height: 7, resizeMode: 'contain'}}
            />
            <ShopBox shopCnt={0} shopStatus={'배송완료'} />
          </HStack>
        </Box>
        <Box
          width={deviceSize.deviceWidth}
          height={'9px'}
          backgroundColor={'#F7F9F9'}
        />
        <Box p="20px">
          <MypageMenu
            imgUri={BASE_URL + '/shopImg/shop_card_icons.png'}
            menuText={'결제 수단 관리'}
            mt={10}
          />
          <MypageMenu
            imgUri={BASE_URL + '/shopImg/shop_bae_icon.png'}
            iconWidth={23}
            iconHeight={15}
            menuText={'배송지 설정/환불계좌 등록'}
          />
          <MypageMenu
            imgUri={BASE_URL + '/shopImg/shop_change_icon.png'}
            iconWidth={25}
            iconHeight={14}
            menuText={'취소/반품/교환내역'}
          />
          <MypageMenu
            imgUri={BASE_URL + '/shopImg/shop_heart_icon.png'}
            iconWidth={19}
            iconHeight={17}
            menuText={'나의 찜 목록'}
          />
          <MypageMenu
            imgUri={BASE_URL + '/shopImg/shop_notice_icon.png'}
            iconWidth={23}
            iconHeight={24}
            menuText={'재입고 알림'}
          />
        </Box>
      </ScrollView>
    </Box>
  );
};

const styles = StyleSheet.create({
  shopBox: {
    alignItems: 'center',
  },
  shopCount: {
    ...fsize.fs18,
    ...fweight.bold,
    lineHeight: 26,
  },
  shopStatus: {
    ...fsize.fs13,
    lineHeight: 19,
  },
  mypageText: {
    ...fsize.fs16,
    ...fweight.m,
    lineHeight: 24,
  },
});

export default ShopMypage;
