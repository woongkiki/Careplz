import {Box, HStack} from 'native-base';
import React from 'react';
import Header from '../../components/Header';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Image, ScrollView, StyleSheet} from 'react-native';
import {BASE_URL} from '../../Utils/APIConstant';
import {
  colorSelect,
  deviceSize,
  fsize,
  fweight,
} from '../../common/StyleCommon';
import {DefText, LabelTitle} from '../../common/BOOTSTRAP';
import BoxLine from '../../components/BoxLine';

const DoctorInfo = props => {
  const {navigation} = props;

  const {top} = useSafeAreaInsets();

  return (
    <Box flex={1} backgroundColor={'#fff'} pt={top + 'px'}>
      <Header
        navigation={navigation}
        headerTitle={'의사프로필'}
        backButtonStatus={true}
      />
      <ScrollView>
        <Image
          source={{uri: BASE_URL + '/images/doctor_info_thumb.png'}}
          style={{
            width: deviceSize.deviceWidth,
            height: deviceSize.deviceWidth / 1.114,
            resizeMode: 'stretch',
          }}
        />
        <Box p="20px">
          <DefText
            text={'변동우병원'}
            style={[
              fsize.fs15,
              fweight.m,
              {color: colorSelect.navy, lineHeight: 21},
            ]}
          />
          <DefText
            text={'김재우 원장'}
            style={[fsize.fs17, fweight.bold, {lineHeight: 26}]}
          />
          <HStack mt="10px">
            <Box style={[styles.subjectBox, {marginRight: 10}]}>
              <DefText text={'안과전문'} style={[styles.subjectBoxText]} />
            </Box>
            <Box style={[styles.subjectBox]}>
              <DefText text={'시력교정시술'} style={[styles.subjectBoxText]} />
            </Box>
          </HStack>
        </Box>
        <BoxLine />
        <Box p="20px">
          <LabelTitle text={'소개'} />
          <Box mt="15px">
            <DefText
              text={
                '안녕하세요  원장 김재우입니다.\n진료항목 : 일반 안과진료, 시력교정술, 백내장, 녹내장'
              }
              style={[styles.infoText]}
            />
          </Box>
          <Box mt="25px">
            <DefText
              text={
                '학력 및 경력\n전영남대학교병원안과임상교수\n전보훈병원 안과 과장'
              }
              style={[styles.infoText]}
            />
          </Box>
        </Box>
      </ScrollView>
    </Box>
  );
};

const styles = StyleSheet.create({
  subjectBox: {
    paddingHorizontal: 13,
    paddingVertical: 7,
    backgroundColor: '#F5F6FA',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subjectBoxText: {
    ...fsize.fs14,
    ...fweight.m,
    color: '#434856',
  },
  infoText: {
    ...fsize.fs15,
    lineHeight: 21,
  },
});

export default DoctorInfo;
