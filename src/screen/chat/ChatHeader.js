import {Box, HStack} from 'native-base';
import React, {useEffect, useState} from 'react';
import {Image, StyleSheet, TouchableOpacity} from 'react-native';
import {BASE_URL} from '../../Utils/APIConstant';
import {DefText} from '../../common/BOOTSTRAP';
import Api from '../../Api';
import {fsize, fweight} from '../../common/StyleCommon';

const headerHeight = 60;

const ChatHeader = props => {
  const {navigation, userInfo, user_lang} = props;

  //console.log(userInfo);
  const [myInfo, setMyInfo] = useState('');

  const mngInfo = () => {
    Api.send('member_mypage', {id: userInfo?.id}, args => {
      let resultItem = args.resultItem;
      let arrItems = args.arrItems;

      if (resultItem.result === 'Y' && arrItems) {
        console.log('마이페이지 정보 가져오기 성공: ', resultItem, arrItems);
        //setPageText(arrItems.text);
        setMyInfo(arrItems);
      } else {
        console.log('마이페이지 정보 가져오기 실패!', resultItem);
        // setMypageInfo('');
      }
    });
  };

  useEffect(() => {
    mngInfo();
    return () => {
      console.log('headers');
    };
  }, []);

  return (
    <HStack height={headerHeight} alignItems={'center'} px="20px">
      <HStack alignItems={'center'}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={{uri: BASE_URL + '/images/backButton.png'}}
            style={{
              width: 16,
              height: 16,
              resizeMode: 'contain',
            }}
          />
        </TouchableOpacity>
        {myInfo != '' && (
          <HStack ml="20px" alignItems={'center'}>
            <Image
              source={{uri: myInfo?.mngimg}}
              style={{
                width: 44,
                height: 44,
                resizeMode: 'contain',
                borderRadius: 22,
              }}
            />
            <Box ml="10px">
              <DefText text={myInfo?.mngname} style={[styles.mngName]} />
              <DefText text={myInfo?.country} style={[styles.mngNation]} />
            </Box>
          </HStack>
        )}
      </HStack>
    </HStack>
  );
};

const styles = StyleSheet.create({
  mngName: {
    ...fweight.bold,
    lineHeight: 24,
  },
  mngNation: {
    ...fsize.fs14,
    ...fweight.m,
    lineHeight: 20,
    color: '#979797',
  },
});

export default ChatHeader;
