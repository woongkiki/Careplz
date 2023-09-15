import {Box, HStack} from 'native-base';
import React from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {DefText} from '../../../common/BOOTSTRAP';
import Header from '../../../components/Header';
import {Image, ScrollView, StyleSheet, TouchableOpacity} from 'react-native';
import {BASE_URL} from '../../../Utils/APIConstant';
import {colorSelect, fsize, fweight} from '../../../common/StyleCommon';
import EntypoIcon from 'react-native-vector-icons/dist/Entypo';
import BottomNavi from '../../../components/bottom/BottomNavi';

const Manager = props => {
  const {navigation, route} = props;
  const {params, name} = route;
  const {top} = useSafeAreaInsets();

  return (
    <Box flex={1} backgroundColor={'#fff'} pt={top + 'px'}>
      <Header
        navigation={navigation}
        headerTitle={'담당 매니저 프로필'}
        backButtonStatus={true}
      />
      <ScrollView>
        <Box p="20px">
          <HStack alignItems={'center'} justifyContent={'space-between'}>
            <Box>
              <Image
                source={{uri: BASE_URL + '/mngImg/personEx.png'}}
                style={{
                  width: 80,
                  height: 80,
                  resizeMode: 'contain',
                }}
              />
            </Box>
            <HStack>
              <TouchableOpacity
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 40,
                  backgroundColor: colorSelect.navy,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 15,
                }}>
                <EntypoIcon name="chat" size={22} color={'#fff'} />
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 40,
                  backgroundColor: colorSelect.navy,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <EntypoIcon name="phone" size={26} color={'#fff'} />
              </TouchableOpacity>
            </HStack>
          </HStack>
          <HStack alignItems={'center'} my="15px">
            <Image
              source={{uri: BASE_URL + '/newImg/russiaIcon.png'}}
              style={{
                width: 26,
                height: 26,
                resizeMode: 'contain',
                marginRight: 10,
              }}
            />
            <DefText text={'러시아'} style={[styles.defText]} />
            <Box
              width={'1px'}
              height="12px"
              backgroundColor={'#B9B9B9'}
              mx="10px"
            />
            <DefText
              text={'Irina'}
              style={[styles.defText, {marginRight: 10}]}
            />
            <DefText
              text={'여'}
              style={[styles.defText, fweight.m, {color: '#6E6E6E'}]}
            />
          </HStack>
          <Box style={[styles.contBox]}>
            <DefText
              text={'안녕하세요 매니저 홍길동입니다.'}
              style={[styles.contText]}
            />
          </Box>
        </Box>
      </ScrollView>
      <BottomNavi screenName={name} navigation={navigation} />
    </Box>
  );
};

const styles = StyleSheet.create({
  defText: {
    ...fsize.fs16,
    ...fweight.bold,
    lineHeight: 24,
    color: '#191919',
  },
  contBox: {
    padding: 15,
    borderRadius: 8,
    backgroundColor: 'rgba(210,210,223,0.3)',
    minHeight: 106,
  },
  contText: {
    ...fsize.fs14,
    ...fweight.bold,
    lineHeight: 20,
  },
});

export default Manager;
