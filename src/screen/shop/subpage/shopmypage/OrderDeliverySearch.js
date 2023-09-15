import {Box, HStack} from 'native-base';
import React, {useEffect, useState} from 'react';
import Header from '../../../../components/Header';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Loading from '../../../../components/Loading';
import {Image, ScrollView, StyleSheet, TouchableOpacity} from 'react-native';
import EmptyPage from '../../../../components/EmptyPage';
import {
  colorSelect,
  deviceSize,
  fsize,
  fweight,
} from '../../../../common/StyleCommon';
import {DefText} from '../../../../common/BOOTSTRAP';
import {BASE_URL} from '../../../../Utils/APIConstant';
import {numberFormat} from '../../../../common/DataFunction';

const datas = [
  {
    idx: 1,
    date: '2023.05.05',
    status: '결제완료',
    product: '올인원 로션',
    count: 3,
    price: 20000,
  },
  {
    idx: 2,
    date: '2023.05.05',
    status: '배송준비중',
    product: '올인원 로션',
    count: 3,
    price: 20000,
  },
];

const OrderDeliveryBox = ({date, status, product, count, price, index}) => {
  let statusColor = colorSelect.navy;

  if (status == '배송준비중') {
    statusColor = '#434856';
  } else if (status == '배송완료') {
    statusColor = colorSelect.pink_de;
  }

  return (
    <Box
      py="25px"
      borderTopWidth={1}
      borderTopColor={index != 0 ? '#EFEFF1' : 'transparent'}>
      <HStack
        pb="15px"
        borderBottomWidth={1}
        alignItems={'center'}
        justifyContent={'space-between'}>
        <DefText
          text={date}
          style={[fsize.fs17, fweight.bold, {lineHeight: 25}]}
        />
        <DefText
          text={status}
          style={[
            fsize.fs16,
            fweight.bold,
            {lineHeight: 24, color: statusColor},
          ]}
        />
      </HStack>
      <HStack my="20px">
        <Box style={{width: (deviceSize.deviceWidth - 40) / 4.11}}>
          <Image
            source={{uri: `https://picsum.photos/164`}}
            style={{
              width: deviceSize.deviceWidth / 4.6,
              height: deviceSize.deviceWidth / 4.6,
              resizeMode: 'stretch',
              borderRadius: 5,
            }}
          />
        </Box>
        <Box justifyContent={'space-around'} ml="15px">
          <Box>
            <DefText text={product} style={[fsize.fs15, {lineHeight: 21}]} />
            <DefText
              text={'수량:' + count}
              style={[fsize.fs15, {lineHeight: 21}]}
            />
          </Box>
          <DefText
            text={numberFormat(price) + '원'}
            style={[fweight.bold, {lineHeight: 24}]}
          />
        </Box>
      </HStack>
      {status == '결제완료' ? (
        <HStack alignItems={'center'} justifyContent={'space-between'}>
          <TouchableOpacity
            style={[styles.buttons, {backgroundColor: colorSelect.navy}]}>
            <DefText text={'재구매'} style={[styles.buttonText]} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.buttons, {backgroundColor: '#D2D2DF'}]}>
            <DefText text={'주문취소'} style={[styles.buttonText]} />
          </TouchableOpacity>
        </HStack>
      ) : (
        <Box>
          <TouchableOpacity
            style={[
              styles.buttons,
              {
                backgroundColor: colorSelect.navy,
                width: deviceSize.deviceWidth - 40,
              },
            ]}>
            <DefText text={'재구매'} style={[styles.buttonText]} />
          </TouchableOpacity>
          <HStack alignItems={'center'} mt="10px">
            <Image
              source={{uri: BASE_URL + '/shopImg/pink_alert.png'}}
              style={{
                width: 17,
                height: 17,
                resizeMode: 'contain',
                marginRight: 5,
              }}
            />
            <DefText
              text={'배송준비중 부터는 취소가 불가합니다.'}
              style={[fsize.fs13, {color: '#7B7B7B', lineHeight: 19}]}
            />
          </HStack>
        </Box>
      )}
    </Box>
  );
};

const OrderDeliverySearch = props => {
  const {navigation} = props;
  const {top} = useSafeAreaInsets();

  const [loading, setLoading] = useState(true);

  const apiHandler = async () => {
    await setLoading(true);
    await setLoading(false);
  };

  useEffect(() => {
    apiHandler();
  }, []);

  return (
    <Box flex={1} backgroundColor={'#fff'} pt={top + 'px'}>
      <Header
        headerTitle="주문/배송조회"
        backButtonStatus={true}
        navigation={navigation}
      />
      {loading ? (
        <Loading />
      ) : datas != '' ? (
        <ScrollView>
          <Box p="20px">
            <TouchableOpacity style={[styles.statusButton]}>
              <HStack
                alignItems={'center'}
                justifyContent={'space-between'}
                height="35px"
                px="15px">
                <DefText
                  text={'전체'}
                  style={[fsize.fs13, fweight.m, {lineHeight: 17}]}
                />
                <Image
                  source={{uri: BASE_URL + '/shopImg/cart_arr_icon.png'}}
                  style={{width: 12, height: 7, resizeMode: 'contain'}}
                />
              </HStack>
            </TouchableOpacity>
          </Box>
          <Box
            width={deviceSize.deviceWidth}
            height={'9px'}
            backgroundColor={'#F7F9F9'}
          />
          <Box px="20px">
            {datas.map((item, index) => {
              return (
                <OrderDeliveryBox
                  date={item.date}
                  status={item.status}
                  product={item.product}
                  count={item.count}
                  price={item.price}
                  index={index}
                  key={index}
                />
              );
            })}
          </Box>
        </ScrollView>
      ) : (
        <EmptyPage emptyText={'주문하신 상품이 없습니다.'} />
      )}
    </Box>
  );
};

const styles = StyleSheet.create({
  statusButton: {
    width: deviceSize.deviceWidth - 40,
    height: 35,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colorSelect.black,
  },
  buttons: {
    width: (deviceSize.deviceWidth - 40) * 0.48,
    height: 35,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    ...fsize.fs13,
    lineHeight: 19,
    color: colorSelect.white,
  },
});

export default OrderDeliverySearch;
