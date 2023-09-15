import {Box, HStack} from 'native-base';
import React, {useState} from 'react';
import {Image, StyleSheet, TouchableOpacity} from 'react-native';
import {DefText} from '../common/BOOTSTRAP';
import {numberFormat} from '../common/DataFunction';
import {deviceSize, fsize, fweight} from '../common/StyleCommon';
import {connect} from 'react-redux';
import {actionCreators as UserAction} from '../redux/module/action/UserAction';
import {BASE_URL} from '../Utils/APIConstant';

const EventBox = props => {
  const {
    navigation,
    mt,
    uri,
    eventName,
    hospital,
    score,
    good,
    percent,
    orPrice,
    price,
    values,
    bookmarkonPress,
    bookmarData,
    eventInfoMove,
    conprice,
    user_lang,
    area,
  } = props;

  return (
    <TouchableOpacity style={{marginTop: mt}} onPress={eventInfoMove}>
      <HStack flexWrap={'wrap'} alignItems={'center'}>
        {/* <Box
                    width={(deviceSize.deviceWidth - 40) * 0.35}
                    height={(deviceSize.deviceWidth - 40) * 0.35}
                    backgroundColor='#dfdfdf'
                    borderRadius={15}
                /> */}
        <Box borderRadius={15}>
          {values != '' && (
            <Box
              position={'absolute'}
              top="0"
              left="0"
              zIndex={'100'}
              marginTop="-11px">
              <Image
                source={{uri: values}}
                style={{
                  width: 41,
                  height: 23,
                  resizeMode: 'contain',
                }}
              />
            </Box>
          )}
          <Image
            source={{uri: uri}}
            style={{
              width: (deviceSize.deviceWidth - 40) * 0.35,
              height: (deviceSize.deviceWidth - 40) * 0.35,
              resizeMode: 'stretch',
              borderRadius: 15,
              overflow: 'hidden',
            }}
          />
        </Box>
        <Box
          width={(deviceSize.deviceWidth - 40) * 0.65}
          justifyContent={'space-between'}
          py="2px"
          pl="20px">
          <Box>
            <DefText
              text={eventName}
              style={[styles.eventName]}
              lh={user_lang?.cidx == 9 ? 30 : ''}
            />
          </Box>
          <Box>
            <DefText
              text={area + ' • ' + hospital}
              style={[styles.hospitalText]}
              lh={user_lang?.cidx == 9 ? 25 : ''}
            />
          </Box>
          <HStack alignItems={'center'}>
            <HStack alignItems={'center'}>
              <Image
                source={require('../images/eventScoreIcon.png')}
                style={{
                  width: 12,
                  height: 12,
                  resizeMode: 'contain',
                }}
              />
              <DefText
                text={score}
                style={[
                  styles.scoreText,
                  {
                    lineHeight: 20,
                  },
                ]}
              />
            </HStack>
            <Box
              width={'1px'}
              height={'8px'}
              backgroundColor="#D5D5D5"
              mx="10px"
            />
            <HStack alignItems={'center'}>
              <Image
                source={require('../images/eventGoodIcon.png')}
                style={{
                  width: 13,
                  height: 12,
                  resizeMode: 'contain',
                }}
              />
              <DefText
                text={good}
                style={[
                  styles.scoreText,
                  {
                    lineHeight: 20,
                  },
                ]}
              />
            </HStack>
          </HStack>
          <HStack my="10px">
            {percent != '0%' && (
              <DefText text={percent} style={[styles.percentText]} />
            )}
            {orPrice != 0 && (
              <Box>
                <DefText
                  text={
                    numberFormat(orPrice) +
                    (user_lang?.cidx != 0 ? 'won' : '원')
                  }
                  style={[styles.orPriceText]}
                />
                <Box
                  width="100%"
                  height="1px"
                  backgroundColor={'#707070'}
                  position="absolute"
                  top="50%"
                  marginTop={'-1px'}
                />
              </Box>
            )}
          </HStack>
          <HStack alignItems={'center'}>
            <DefText
              text={
                conprice != '' ? numberFormat(conprice) : numberFormat(price)
              }
              style={[styles.price]}
            />
            <DefText
              text={user_lang?.cidx != 0 ? 'won' : '원'}
              style={[styles.price]}
            />
          </HStack>
        </Box>
      </HStack>
      <Box
        position={'absolute'}
        bottom="0px"
        right="0"
        height={'100%'}
        //backgroundColor={'#f00'}
        justifyContent={'center'}>
        <TouchableOpacity onPress={bookmarkonPress}>
          <Image
            source={{
              uri:
                bookmarData == 1
                  ? BASE_URL + '/newImg/wishHeartOn.png'
                  : BASE_URL + '/newImg/wishHeartOff.png',
            }}
            style={{
              width: 23,
              height: 21,
              resizeMode: 'contain',
            }}
          />
          {/* <Image
            source={
              bookmarData == 1
                ? require('../images/bookmarkIconPink.png')
                : require('../images/bookmarkIconBlack.png')
            }
            style={{
              width: 18,
              height: 23,
              resizeMode: 'contain',
            }}
          /> */}
        </TouchableOpacity>
      </Box>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  eventName: {
    ...fweight.bold,
    color: '#191919',
  },
  hospitalText: {
    ...fsize.fs13,
    color: '#9B9B9B',
  },
  scoreText: {
    ...fsize.fs14,
    color: '#191919',
    marginLeft: 7,
  },
  percentText: {
    ...fsize.fs15,
    color: '#FF293F',
    marginRight: 7,
  },
  orPriceText: {
    ...fsize.fs15,
    color: '#707070',
  },
  price: {
    ...fsize.fs17,
    color: '#191919',
    ...fweight.bold,
  },
});

export default connect(
  ({User}) => ({
    userInfo: User.userInfo, //회원정보
    user_lang: User.user_lang,
  }),
  dispatch => ({
    member_login: user => dispatch(UserAction.member_login(user)), //로그인
    languageSet: user => dispatch(UserAction.languageSet(user)),
  }),
)(EventBox);
