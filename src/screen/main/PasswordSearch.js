import React, {useEffect, useState} from 'react';
import {Box, HStack} from 'native-base';
import {DefButton, DefText} from '../../common/BOOTSTRAP';
import Header from '../../components/Header';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import FormInput from '../../components/FormInput';
import {Image, StyleSheet, TouchableOpacity} from 'react-native';
import {BASE_URL} from '../../Utils/APIConstant';
import {colorSelect, fsize, fweight} from '../../common/StyleCommon';
import Api from '../../Api';
import {connect} from 'react-redux';
import {actionCreators as UserAction} from '../../redux/module/action/UserAction';
import ToastMessage from '../../components/ToastMessage';
import messaging from '@react-native-firebase/messaging';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

//비밀번호 찾기
const PasswordSearch = props => {
  const {navigation, user_lang} = props;

  const {top} = useSafeAreaInsets();

  //앱 페이지 텍스트
  const [pageText, setPageText] = useState([]);

  const pageLanguage = async () => {
    await Api.send(
      'app_page',
      {cidx: user_lang.cidx, code: 'findPwd'},
      args => {
        let resultItem = args.resultItem;
        let arrItems = args.arrItems;

        if (resultItem.result === 'Y' && arrItems) {
          console.log('언어 리스트: ', resultItem, arrItems.text);
          setPageText(arrItems.text);
        } else {
          console.log('언어 리스트 실패!', resultItem);
        }
      },
    );
  };

  //아이디
  const [idValue, setIdValue] = useState('');
  const idChangeEvent = id => {
    setIdValue(id);
  };

  //이름
  const [nameValue, setNameValue] = useState('');
  const nameChange = names => {
    setNameValue(names);
  };

  //이메일
  const [emailValue, setEmailValue] = useState('');
  const emailChange = email => {
    setEmailValue(email);
  };

  useEffect(() => {
    pageLanguage();
  }, []);

  const pwdFindHandler = () => {
    if (idValue == '') {
      ToastMessage('아이디를 입력하세요.');
      return false;
    }

    if (nameValue == '') {
      ToastMessage('이름을 입력하세요.');
      return false;
    }

    if (emailValue == '') {
      ToastMessage('이메일을 입력하세요.');
      return false;
    }

    Api.send(
      'member_findPasswd',
      {cidx: user_lang.cidx, id: idValue, name: nameValue, email: emailValue},
      args => {
        let resultItem = args.resultItem;
        let arrItems = args.arrItems;

        if (resultItem.result === 'Y' && arrItems) {
          console.log('비밀번호 찾기 성공: ', resultItem, arrItems);
        } else {
          console.log('비밀번호 찾기 실패!', resultItem);
        }
      },
    );
  };

  return (
    <Box flex={1} backgroundColor="#fff" pt={top + 'px'}>
      <Header
        headerTitle={pageText != '' ? pageText[0] : '비밀번호 찾기'}
        backButtonStatus={true}
        navigation={navigation}
      />
      <KeyboardAwareScrollView>
        <Box p="20px">
          <DefText
            text={
              pageText != ''
                ? pageText[1]
                : '회원가입 시 입력했던 아이디와 이름, 이메일을 입력해 주세요.'
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
              label={pageText != '' ? pageText[2] : '아이디'}
              placeholder={
                pageText != '' ? pageText[3] : '아이디를 입력해 주세요.'
              }
              value={idValue}
              onChangeText={idChangeEvent}
              editable={true}
              labelHorizontal={true}
              labelIcon={true}
              labelIconUri={BASE_URL + '/images/idIcon2.png'}
              labelIconWidth={18}
              labelIconHeight={18}
              labelIconResize="contain"
            />
          </Box>
          <Box style={[styles.inputMargin]}>
            <FormInput
              labelOn={true}
              label={pageText != '' ? pageText[4] : '이름'}
              placeholder={
                pageText != '' ? pageText[5] : '이름을 입력해 주세요.'
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
            />
          </Box>
          <Box style={[styles.inputMargin]}>
            <FormInput
              labelOn={true}
              label={pageText != '' ? pageText[10] : '이메일'}
              placeholder={
                pageText != '' ? pageText[6] : '이메일을 입력해 주세요.'
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
            />
          </Box>
          <Box style={[styles.inputMargin]}>
            <DefButton
              text={pageText != '' ? pageText[7] : '비밀번호 찾기'}
              btnStyle={{backgroundColor: '#dfdfdf'}}
              txtStyle={[fweight.m, {lineHeight: 23}]}
              onPress={pwdFindHandler}
            />
          </Box>
          <Box alignItems={'center'} style={[styles.inputMargin]}>
            <DefText
              text={pageText != '' ? pageText[8] : '문제가 발생하였나요?'}
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
                  text={pageText != '' ? pageText[9] : '고객센터 문의하기'}
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
)(PasswordSearch);
