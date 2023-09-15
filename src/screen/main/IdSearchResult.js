import React, {useEffect, useState} from 'react';
import {Box, HStack} from 'native-base';
import {DefButton, DefInput, DefText} from '../../common/BOOTSTRAP';
import Header from '../../components/Header';
import {phoneFormat} from '../../common/DataFunction';
import {
  colorSelect,
  deviceSize,
  fsize,
  fweight,
} from '../../common/StyleCommon';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {BASE_URL} from '../../Utils/APIConstant';
import {Image, StyleSheet} from 'react-native';
import {connect} from 'react-redux';
import {actionCreators as UserAction} from '../../redux/module/action/UserAction';
import Api from '../../Api';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const IdSearchResult = props => {
  const {navigation, route, user_lang} = props;
  const {params} = route;

  const {top} = useSafeAreaInsets();

  //앱 페이지 텍스트
  const [pageText, setPageText] = useState([]);

  const pageLanguage = async () => {
    Api.send('app_page', {cidx: user_lang.cidx, code: 'findIdResult'}, args => {
      let resultItem = args.resultItem;
      let arrItems = args.arrItems;

      if (resultItem.result === 'Y' && arrItems) {
        console.log(
          '아이디 찾기 완료 언어 리스트: ',
          resultItem,
          arrItems.text,
        );
        setPageText(arrItems.text);
      } else {
        console.log('아이디 찾기 완료 언어 리스트 실패!', resultItem);
      }
    });
  };

  useEffect(() => {
    pageLanguage();
  }, []);

  return (
    <Box flex={1} backgroundColor="#fff" pt={top + 'px'}>
      <Header
        headerTitle={pageText != '' ? pageText[0] : '아이디 찾기'}
        navigation={navigation}
        bacbButtonStatus={false}
        headerIcons={true}
        imageUri={BASE_URL + '/images/headerIcon01.png'}
        imageWidth={19}
        imageHeight={19}
        imageResize={'contain'}
      />
      <Box flex={1} alignItems="center" justifyContent={'center'}>
        <Image
          source={require('../../images/idResultIcon.png')}
          style={{
            width: 70,
            height: 70,
            resizeMode: 'stretch',
          }}
        />
        <Box mt="20px">
          <DefText
            text={
              params.name +
              (user_lang.cidx != 0 ? ' ' : '님') +
              (pageText != '' ? pageText[1] : '님의 아이디는')
            }
            style={[styles.appText]}
          />
          <HStack justifyContent={'center'}>
            <DefText
              text={params.data.id}
              style={[
                styles.appText,
                fweight.bold,
                {color: colorSelect.pink_de, textAlign: 'center'},
              ]}
            />
            <DefText
              text={pageText != '' ? ' ' + pageText[2] : ' 입니다.'}
              style={[styles.appText, {textAlign: 'center'}]}
            />
          </HStack>
        </Box>
        <Box
          py="15px"
          backgroundColor={'#F2F2F2'}
          width={deviceSize.deviceWidth - 40}
          alignItems="center"
          borderRadius={5}
          overflow="hidden"
          mt="20px">
          <HStack alignItems={'center'}>
            <Image
              source={require('../../images/joinDateIcon.png')}
              style={{
                width: 12,
                height: 12,
                resizeMode: 'stretch',
                marginRight: 5,
              }}
            />
            <DefText
              text={
                (pageText != '' ? pageText[3] + ' ' : '가입일시 ') +
                params.data.wdate
              }
              style={[styles.joinDate]}
            />
          </HStack>
        </Box>
      </Box>
      <Box>
        <HStack p="20px" justifyContent={'space-between'} alignItems="center">
          <DefButton
            btnStyle={[
              {
                width: (deviceSize.deviceWidth - 40) * 0.48,
                backgroundColor: '#7E7E7E',
              },
            ]}
            text={pageText != '' ? pageText[4] : '비밀번호 찾기'}
            txtStyle={[{color: colorSelect.white, lineHeight: 22}, fweight.m]}
            onPress={() => navigation.navigate('PasswordSearch')}
          />
          <DefButton
            btnStyle={[
              {
                width: (deviceSize.deviceWidth - 40) * 0.48,
                backgroundColor: colorSelect.pink_de,
              },
            ]}
            text={pageText != '' ? pageText[5] : '로그인'}
            txtStyle={[{color: colorSelect.white, lineHeight: 22}, fweight.m]}
            onPress={() => navigation.navigate('Login')}
          />
        </HStack>
      </Box>
    </Box>
  );
};

const styles = StyleSheet.create({
  appText: {
    textAlign: 'center',
    ...fsize.fs21,
    lineHeight: 30,
    color: '#191919',
  },
  joinDate: {
    ...fsize.fs14,
    color: '#6C6C6C',
    lineHeight: 17,
  },
});

export default connect(
  ({User}) => ({
    user_lang: User.user_lang,
  }),
  dispatch => ({
    languageSet: user => dispatch(UserAction.languageSet(user)), //로그인
  }),
)(IdSearchResult);
