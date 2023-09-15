import React, {useEffect, useState} from 'react';
import {Box} from 'native-base';
import {DefButton, DefText} from '../../common/BOOTSTRAP';
import Header from '../../components/Header';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import FormInput from '../../components/FormInput';
import {phoneFormat} from '../../common/DataFunction';
import {nationList} from '../../ArrayData';
import FormSelect from '../../components/FormSelect';
import {Platform, StyleSheet} from 'react-native';
import {BASE_URL} from '../../Utils/APIConstant';
import Api from '../../Api';
import {connect} from 'react-redux';
import {actionCreators as UserAction} from '../../redux/module/action/UserAction';
import ToastMessage from '../../components/ToastMessage';
import messaging from '@react-native-firebase/messaging';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

//고객센터 문의하기
const CustomerCenterQaForm = props => {
  const {navigation, user_lang} = props;
  const {top} = useSafeAreaInsets();

  //앱 페이지 텍스트
  const [pageText, setPageText] = useState([]);

  const pageLanguage = async () => {
    await Api.send(
      'app_page',
      {cidx: user_lang.cidx, code: 'customerCenterQa'},
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

  //문의제목
  const [qaTitle, setQaTitle] = useState('');
  const qaTitleChange = title => {
    setQaTitle(title);
  };

  //문의 작성자
  const [qaName, setQaName] = useState('');
  const qaNameChange = names => {
    setQaName(names);
  };

  //휴대폰 번호
  const [qaPhoneNumber, setQaPhoneNumber] = useState('');
  const qaPhoneChange = phone => {
    setQaPhoneNumber(phoneFormat(phone));
  };

  //이메일
  const [qaEmail, setQaEmail] = useState('');
  const qaEmailChange = email => {
    setQaEmail(email);
  };

  //국적 선택
  const [nation, setNation] = useState('');
  const [nationLists, setNationLists] = useState([]);

  //나라 목록..
  const nationListApi = async () => {
    const token = await messaging().getToken(); // 앱 토큰

    await Api.send('app_country', {token: token}, args => {
      let resultItem = args.resultItem;
      let arrItems = args.arrItems;

      if (resultItem.result === 'Y' && arrItems) {
        //console.log('나라 리스트: ', resultItem, arrItems);
        setNationLists(arrItems);
      } else {
        console.log('나라 리스트 실패!', resultItem);
      }
    });
  };

  //문의내용
  const [qaContent, setQaContent] = useState('');
  const qaContentChange = content => {
    setQaContent(content);
  };

  useEffect(() => {
    pageLanguage();
    nationListApi();
  }, []);

  const inquiryHandler = () => {
    if (qaTitle == '') {
      ToastMessage('제목을 입력하세요.');
      return false;
    }

    if (qaName == '') {
      ToastMessage('이름을 입력하세요.');
      return false;
    }

    if (qaPhoneNumber == '') {
      ToastMessage('휴대전화번호를 입력하세요.');
      return false;
    }

    if (qaEmail == '') {
      ToastMessage('이메일을 입력하세요.');
      return false;
    }

    if (nation == '') {
      ToastMessage('국적을 선택하세요.');
      return false;
    }

    if (qaContent == '') {
      ToastMessage('내용을 입력하세요.');
      return false;
    }

    Api.send(
      'member_inquiry',
      {
        subject: qaTitle,
        name: qaName,
        hp: qaPhoneNumber,
        email: qaEmail,
        cidx: nation,
        content: qaContent,
      },
      args => {
        let resultItem = args.resultItem;
        let arrItems = args.arrItems;

        if (resultItem.result === 'Y' && arrItems) {
          console.log('문의하기 성공: ', resultItem);
          ToastMessage('고객센터 문의가 완료되었습니다.');
          navigation.goBack();
        } else {
          console.log('문의하기 실패!', resultItem);
          ToastMessage(resultItem.message);
        }
      },
    );
  };

  return (
    <Box flex={1} backgroundColor="#fff" pt={top + 'px'}>
      <Header
        headerTitle={pageText != '' ? pageText[0] : '문의하기'}
        backButtonStatus={true}
        navigation={navigation}
      />
      <KeyboardAwareScrollView>
        <Box p="20px">
          <FormInput
            labelOn={true}
            label={pageText != '' ? pageText[1] : '제목'}
            placeholder={pageText != '' ? pageText[2] : '제목을 입력해 주세요.'}
            value={qaTitle}
            onChangeText={qaTitleChange}
            editable={true}
            labelHorizontal={true}
            labelIcon={true}
            labelIconUri={BASE_URL + '/images/qaSubjectIcon.png'}
            labelIconWidth={18}
            labelIconHeight={18}
            labelIconResize="contain"
          />
          <Box style={[styles.inputMargin]}>
            <FormInput
              labelOn={true}
              label={pageText != '' ? pageText[3] : '이름'}
              placeholder={
                pageText != '' ? pageText[4] : '이름을 입력해 주세요.'
              }
              value={qaName}
              onChangeText={qaNameChange}
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
              label={pageText != '' ? pageText[5] : '휴대폰 번호'}
              placeholder={
                pageText != '' ? pageText[6] : '휴대폰 번호를 입력해 주세요.'
              }
              value={qaPhoneNumber}
              onChangeText={qaPhoneChange}
              editable={true}
              keyboardType="number-pad"
              maxLength={13}
              labelHorizontal={true}
              labelIcon={true}
              labelIconUri={BASE_URL + '/images/phoneIcon.png'}
              labelIconWidth={18}
              labelIconHeight={18}
              labelIconResize="contain"
            />
          </Box>
          <Box style={[styles.inputMargin]}>
            <FormInput
              labelOn={true}
              label={pageText != '' ? pageText[7] : '이메일'}
              placeholder={
                pageText != '' ? pageText[8] : '이메일을 입력해 주세요.'
              }
              value={qaEmail}
              onChangeText={qaEmailChange}
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
            <FormSelect
              labelOn={true}
              label={pageText != '' ? pageText[9] : '국적'}
              placeholder={
                pageText != '' ? pageText[10] : '국적을 선택해 주세요.'
              }
              value={nation}
              onValueChange={val => setNation(val)}
              data={nationLists}
              labelHorizontal={true}
              labelIcon={true}
              labelIconUri={BASE_URL + '/images/nationIcon.png'}
              labelIconWidth={18}
              labelIconHeight={18}
              labelIconResize="contain"
            />
          </Box>
          <Box style={[styles.inputMargin]}>
            <FormInput
              labelOn={true}
              label={pageText != '' ? pageText[11] : '내용'}
              placeholder={
                pageText != '' ? pageText[12] : '내용을 입력해 주세요.'
              }
              value={qaContent}
              onChangeText={qaContentChange}
              editable={true}
              inputStyle={{height: 200, paddingTop: 15}}
              multiline={true}
              textAlignVertical={'top'}
              labelHorizontal={true}
              labelIcon={true}
              labelIconUri={BASE_URL + '/images/messageIcons.png'}
              labelIconWidth={18}
              labelIconHeight={18}
              labelIconResize="contain"
            />
          </Box>
        </Box>
      </KeyboardAwareScrollView>
      <DefButton
        text={pageText != '' ? pageText[13] : '보내기'}
        btnStyle={{backgroundColor: '#dfdfdf'}}
        onPress={inquiryHandler}
      />
    </Box>
  );
};

const styles = StyleSheet.create({
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
)(CustomerCenterQaForm);
