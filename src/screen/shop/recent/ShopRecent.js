import {Box, HStack} from 'native-base';
import React, {useCallback, useEffect, useState} from 'react';
import Header from '../../../components/Header';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Loading from '../../../components/Loading';
import {FlatList, Image, StyleSheet, TouchableOpacity} from 'react-native';
import {deviceSize, fsize, fweight} from '../../../common/StyleCommon';
import {DefText} from '../../../common/BOOTSTRAP';
import {numberFormat} from '../../../common/DataFunction';

const recentData = [
  {
    idx: 1,
    subject: '여드름',
    product: '상품제목',
    percent: 10,
    oprice: 11000,
    price: 10000,
  },
  {
    idx: 2,
    subject: '여드름',
    product: '상품제목',
    percent: 10,
    oprice: 11000,
    price: 10000,
  },
  {
    idx: 3,
    subject: '여드름',
    product: '상품제목',
    percent: 10,
    oprice: 11000,
    price: 10000,
  },
  {
    idx: 4,
    subject: '여드름',
    product: '상품제목',
    percent: 10,
    oprice: 11000,
    price: 10000,
  },
];

const ShopRecent = props => {
  const {navigation} = props;

  const {top} = useSafeAreaInsets();

  const [loading, setLoading] = useState(true);

  const keyExtractor = useCallback(item => item.idx.toString(), []);

  const renderItem = ({item, index}) => {
    return (
      <TouchableOpacity
        style={[
          {width: (deviceSize.deviceWidth - 40) * 0.315, marginTop: 30},
          (index + 1) % 3 == 0
            ? {marginRight: 0}
            : {marginRight: (deviceSize.deviceWidth - 40) * 0.0275},
        ]}>
        <Image
          source={{uri: `https://picsum.photos/164`}}
          style={{
            width: '100%',
            height: (deviceSize.deviceWidth - 40) * 0.315,
            resizeMode: 'stretch',
            borderRadius: 5,
          }}
        />
        <Box mt="10px">
          <DefText text={item.subject} style={[styles.subjectText]} />
          <Box height="3px" />
          <DefText text={item.product} style={[styles.productText]} />
          <Box height="3px" />
          <HStack>
            <DefText text={item.percent + '%'} style={[styles.percentText]} />
            <DefText
              text={numberFormat(item.oprice)}
              style={[styles.orPriceText]}
            />
          </HStack>
          <Box height="3px" />
          <DefText text={numberFormat(item.price)} style={[styles.priceText]} />
        </Box>
      </TouchableOpacity>
    );
  };

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
        navigation={navigation}
        headerTitle={'최근 본 상품'}
        backButtonStatus={true}
      />
      {loading ? (
        <Loading />
      ) : (
        <Box px="20px">
          <FlatList
            data={recentData}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            numColumns={3}
          />
        </Box>
      )}
    </Box>
  );
};

const styles = StyleSheet.create({
  subjectText: {
    ...fsize.fs12,
    lineHeight: 17,
    color: '#868686',
  },
  productText: {
    ...fsize.fs15,
    ...fweight.m,
    lineHeight: 21,
  },
  percentText: {
    ...fsize.fs15,
    ...fweight.bold,
    color: '#E11B1B',
    marginRight: 5,
  },
  orPriceText: {
    ...fsize.fs12,
    ...fweight.m,
    color: '#A2A2A2',
    lineHeight: 17,
    textDecorationLine: 'line-through',
  },
  priceText: {
    ...fsize.fs15,
    ...fweight.bold,
    lineHeight: 21,
  },
});

export default ShopRecent;
