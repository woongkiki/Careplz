import React from 'react';
import {Image, StyleSheet, TouchableOpacity} from 'react-native';
import {BASE_URL} from '../../Utils/APIConstant';
import {DefText} from '../../common/BOOTSTRAP';
import {Box} from 'native-base';
import {fsize, fweight} from '../../common/StyleCommon';

const DoctorComponents = props => {
  const {
    navigation,
    doctorName = '김재우 원장',
    subjects = '안과 전문의',
  } = props;

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('DoctorInfo')}
      style={[{justifyContent: 'center', alignItems: 'center'}]}>
      <Image
        source={{uri: BASE_URL + '/newImg/doctorThumbEx.png'}}
        style={{
          width: 72,
          height: 72,
          resizeMode: 'contain',
        }}
      />
      <Box mt="10px">
        <DefText text={doctorName} style={[styles.doctorTitle]} />
      </Box>
      <Box>
        <DefText text={subjects} style={[styles.subjects]} />
      </Box>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  doctorTitle: {
    ...fsize.fs15,
    ...fweight.bold,
    lineHeight: 21,
  },
  subjects: {
    ...fsize.fs13,
    color: '#707070',
    lineHeight: 23,
  },
});

export default DoctorComponents;
