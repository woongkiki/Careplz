import React, {useEffect} from 'react';
import {Box, Text} from 'native-base';
import {Image, StatusBar} from 'react-native';
import {DefText} from '../../common/BOOTSTRAP';
import Loading from '../../components/Loading';
import {colorSelect, deviceSize} from '../../common/StyleCommon';
import {BASE_URL} from '../../Utils/APIConstant';
import AsyncStorage from '@react-native-community/async-storage';
import {connect} from 'react-redux';
import {actionCreators as UserAction} from '../../redux/module/action/UserAction';
import ToastMessage from '../../components/ToastMessage';

const Intro = props => {
  const {navigation, member_info, languageSet} = props;

  useEffect(() => {
    AsyncStorage.getItem('language').then(async response => {
      console.log('intro response', response);

      if (response == '') {
        setTimeout(() => {
          //navigation.replace('LanguageSelect');
          navigation.replace('LanguageSelect', {back: true});
        }, 2500);
      } else {
        const langSelects = await languageSet({cidx: response});

        AsyncStorage.getItem('id').then(async rsp => {
          console.log('id', rsp);

          if (rsp == '') {
            setTimeout(() => {
              //navigation.replace('LanguageSelect');
              navigation.replace('Login');
            }, 2500);
          } else {
            // console.log("언어셋 저장 값::", response);
            // console.log('아이디 저장 값::', rsp);

            const formData = new FormData();
            formData.append('method', 'member_info');
            formData.append('id', rsp);
            formData.append('cidx', response);

            const member_info_status = await member_info(formData);

            if (member_info_status.state) {
              console.log('member_info_status', member_info_status);

              ToastMessage(member_info_status.result.name + '님 안녕하세요.');

              setTimeout(() => {
                //navigation.replace('LanguageSelect');
                navigation.reset({
                  routes: [
                    {
                      name: 'TabNavi',
                      screen: 'Event',
                    },
                  ],
                });
              }, 2500);
            } else {
              ToastMessage(
                '로그인 정보가 만료되었습니다.\n다시 로그인 하세요.',
              );

              setTimeout(() => {
                //navigation.replace('LanguageSelect');
                navigation.replace('LanguageSelect', {back: true});
              }, 2500);
            }
          }
        });
      }
    });
  }, []);

  return (
    <Box
      flex={1}
      alignItems="center"
      justifyContent="center"
      backgroundColor={colorSelect.pink_de}>
      <StatusBar
        animated={false}
        backgroundColor={colorSelect.pink_de}
        barStyle={'light-content'}
      />
      <Image
        source={{uri: BASE_URL + '/images/appIntroLogoGif.gif'}}
        style={{
          width: deviceSize.deviceWidth / 1.3,
          height: deviceSize.deviceWidth / 1.3 / 2.69,
          resizeMode: 'stretch',
        }}
      />
    </Box>
  );
};

export default connect(
  ({User}) => ({
    userInfo: User.userInfo, //회원정보
  }),
  dispatch => ({
    member_info: user => dispatch(UserAction.member_info(user)), //회원 정보 조회
    languageSet: user => dispatch(UserAction.languageSet(user)),
  }),
)(Intro);
