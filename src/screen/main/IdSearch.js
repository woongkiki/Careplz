import React, {useEffect, useState} from 'react';
import {Box, HStack} from 'native-base';
import {DefButton, DefInput, DefText} from '../../common/BOOTSTRAP';
import Header from '../../components/Header';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {phoneFormat} from '../../common/DataFunction';
import {
  colorSelect,
  deviceSize,
  fsize,
  fweight,
} from '../../common/StyleCommon';
import {TouchableOpacity} from 'react-native-gesture-handler';
import FormInput from '../../components/FormInput';
import {BASE_URL} from '../../Utils/APIConstant';
import {Image, StyleSheet} from 'react-native';
import Api from '../../Api';
import {connect} from 'react-redux';
import {actionCreators as UserAction} from '../../redux/module/action/UserAction';
import ToastMessage from '../../components/ToastMessage';
import messaging from '@react-native-firebase/messaging';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

//아이디 찾기
const IdSearch = props => {
  const {navigation, user_lang, route} = props;
  const {name} = route;
  const {top} = useSafeAreaInsets();

  //이름
  const [nameValue, setNameValue] = useState('');
  const nameChange = names => {
    setNameValue(names);
  };

  //이메일
  const [emailValue, setEmailValue] = useState('');
  const emailChange = emails => {
    setEmailValue(emails);
  };

  //휴대폰번호
  const [phoneNumber, setPhoneNumber] = useState('');
  const phoneNumberChange = phone => {
    setPhoneNumber(phoneFormat(phone));
  };

  //인증번호
  const [certiNumber, setCertiNumber] = useState('');
  const certiNumberChange = certi => {
    setCertiNumber(certi);
  };

  //앱 페이지 텍스트
  const [pageText, setPageText] = useState([]);

  const pageLanguage = async () => {
    await Api.send('app_page', {cidx: user_lang.cidx, code: 'findId'}, args => {
      let resultItem = args.resultItem;
      let arrItems = args.arrItems;

      if (resultItem.result === 'Y' && arrItems) {
        console.log('아이디 찾기 언어 리스트: ', resultItem, arrItems.text);
        setPageText(arrItems.text);
      } else {
        console.log('아이디 찾기 리스트 실패!', resultItem);
      }
    });
  };

  useEffect(() => {
    pageLanguage();
  }, []);

  const findIdApi = () => {
    Api.send(
      'member_findId',
      {
        name: nameValue,
        hp: phoneNumber,
        email: emailValue,
        cidx: user_lang.cidx,
      },
      args => {
        let resultItem = args.resultItem;
        let arrItems = args.arrItems;

        if (resultItem.result === 'Y' && arrItems) {
          console.log('아이디 찾기: ', resultItem, arrItems);
          //setNationLists(arrItems);
          navigation.navigate('IdSearchResult', {
            data: arrItems,
            name: nameValue,
          });
        } else {
          console.log('아이디 찾기 실패!', resultItem);
          ToastMessage(resultItem.message);
        }
      },
    );
  };

  const [randNumber, setRandNumber] = useState('');
  const [certiCheck, setCertiCheck] = useState(false);

  //sms 인증번호 발송
  const smsSend = async () => {
    const token = await messaging().getToken(); // 앱 토큰

    Api.send(
      'member_sendSms',
      {hp: phoneNumber, token: token, cidx: user_lang.cidx, _type: 'findId'},
      args => {
        let resultItem = args.resultItem;
        let arrItems = args.arrItems;

        if (resultItem.result === 'Y' && arrItems) {
          console.log('인증번호 발송: ', resultItem, arrItems);
          //setNationLists(arrItems);
          ToastMessage(resultItem.message);
          setRandNumber(arrItems[0]);
        } else {
          console.log('인증번호 발송 실패!', resultItem);
          //ToastMessage(resultItem.message);
        }
      },
    );
  };

  const smsCheck = async () => {
    const token = await messaging().getToken(); // 앱 토큰

    Api.send(
      'member_checkSms',
      {
        hp: phoneNumber,
        token: token,
        cidx: user_lang.cidx,
        authnum: certiNumber,
      },
      args => {
        let resultItem = args.resultItem;
        let arrItems = args.arrItems;

        if (resultItem.result === 'Y' && arrItems) {
          console.log('인증번호 확인: ', resultItem, arrItems);
          //setNationLists(arrItems);
          //    ToastMessage(resultItem.message);
          //    setRandNumber(arrItems[0]);
          ToastMessage(resultItem.message);
          setCertiCheck(true);
        } else {
          console.log('인증번호 확인 실패!', resultItem);
          ToastMessage(resultItem.message);
        }
      },
    );
  };

  return (
    <Box flex={1} backgroundColor="#fff" pt={top + 'px'}>
      <Header
        headerTitle={pageText != '' ? pageText[0] : '아이디 찾기'}
        navigation={navigation}
        backButtonStatus={true}
        headerIcons={true}
        imageUri={BASE_URL + '/images/headerIcon01.png'}
        imageWidth={19}
        imageHeight={19}
        imageResize={'contain'}
      />
      <KeyboardAwareScrollView>
        <Box p="20px">
          <DefText
            text={
              pageText != ''
                ? pageText[1]
                : '아이디를 잊어버리셨나요?\n회원가입 시 입력했던 이름과 이메일,\n휴대 전화 번호를 입력해 주세요.'
            }
            style={[
              {
                lineHeight: 27,
              },
              fweight.m,
            ]}
          />
          <Box style={[styles.inputMargin]}>
            <FormInput
              labelOn={true}
              label={pageText != '' ? pageText[2] : '이름'}
              placeholder={
                pageText != '' ? pageText[3] : '이름을 입력해 주세요.'
              }
              value={nameValue}
              onChangeText={nameChange}
              editable={true}
              labelHorizontal={true}
              labelIcon={true}
              labelIconUri={BASE_URL + '/images/nameIcon.png'}
              labelIconWidth={18}
              labelIconHeight={18}
              labelIconResize="contain"
              inputStyle={nameValue.length > 0 && {lineHeight: 20}}
            />
          </Box>
          <Box style={[styles.inputMargin]}>
            <FormInput
              labelOn={true}
              label={pageText != '' ? pageText[4] : '이메일'}
              placeholder={
                pageText != '' ? pageText[5] : '이메일을 입력해 주세요.'
              }
              value={emailValue}
              onChangeText={emailChange}
              editable={true}
              labelHorizontal={true}
              labelIcon={true}
              labelIconUri={BASE_URL + '/images/emailIcon.png'}
              labelIconWidth={18}
              labelIconHeight={18}
              labelIconResize="contain"
              inputStyle={emailValue.length > 0 && {lineHeight: 20}}
            />
          </Box>
          <Box style={[styles.inputMargin]}>
            <FormInput
              labelOn={true}
              label={pageText != '' ? pageText[6] : '휴대폰 번호'}
              placeholder={
                pageText != '' ? pageText[7] : '휴대폰 번호를 입력해 주세요.'
              }
              value={phoneNumber}
              onChangeText={phoneNumberChange}
              editable={true}
              keyboardType="number-pad"
              maxLength={13}
              inputButton={true}
              inputButtonText={pageText != '' ? pageText[8] : '인증 받기'}
              labelHorizontal={true}
              labelIcon={true}
              labelIconUri={BASE_URL + '/images/phoneIcon.png'}
              labelIconWidth={18}
              labelIconHeight={18}
              labelIconResize="contain"
              inputStyle={phoneNumber.length > 0 && {lineHeight: 20}}
              btnStyle={
                phoneNumber.length > 0 && {backgroundColor: colorSelect.navy}
              }
              inputButtonPress={smsSend}
            />
            <Box mt="10px">
              <FormInput
                labelOn={false}
                label="인증 번호"
                placeholder={
                  pageText != '' ? pageText[9] : '인증번호를 입력해 주세요.'
                }
                value={certiNumber}
                onChangeText={certiNumberChange}
                editable={certiCheck ? false : true}
                keyboardType="number-pad"
                maxLength={6}
                inputButton={true}
                inputStyle={[certiNumber.length > 0 && {lineHeight: 20}]}
                inputButtonText={pageText != '' ? pageText[10] : '확인'}
                inputButtonPress={smsCheck}
              />
            </Box>
          </Box>
          <DefButton
            text={pageText != '' ? pageText[11] : '아이디 찾기'}
            btnStyle={[styles.inputMargin, {backgroundColor: '#dfdfdf'}]}
            txtStyle={[fweight.m, {lineHeight: 23}]}
            onPress={findIdApi}
          />
          <Box alignItems={'center'} style={[styles.inputMargin]}>
            <DefText
              text={pageText != '' ? pageText[12] : '문제가 발생하였나요?'}
              style={{color: '#929292'}}
            />
            <TouchableOpacity
              onPress={() => navigation.navigate('CustomerCenterQaForm')}
              style={{marginTop: 10}}>
              <HStack alignItems={'center'}>
                <Image
                  source={require('../../images/customerIcon.png')}
                  style={{
                    width: 18,
                    height: 18,
                    resizeMode: 'stretch',
                    marginRight: 5,
                  }}
                />
                <DefText
                  text={pageText != '' ? pageText[13] : '고객센터 문의하기'}
                  style={[
                    fweight.bold,
                    {color: colorSelect.navy, lineHeight: 22},
                  ]}
                />
              </HStack>
            </TouchableOpacity>
          </Box>
        </Box>
      </KeyboardAwareScrollView>
    </Box>
  );
};

const styles = StyleSheet.create({
  noticeText: {
    ...fsize.fs13,
    color: '#0F8B17',
  },
  inputMargin: {
    marginTop: 40,
  },
});

export default connect(
  ({User}) => ({
    user_lang: User.user_lang,
  }),
  dispatch => ({
    languageSet: user => dispatch(UserAction.languageSet(user)), //로그인
  }),
)(IdSearch);
