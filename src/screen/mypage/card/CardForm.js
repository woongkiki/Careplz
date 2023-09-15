import React, {useEffect, useState} from 'react';
import {Box, HStack} from 'native-base';
import {DefButton, DefText, LabelTitle} from '../../../common/BOOTSTRAP';
import Header from '../../../components/Header';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {StyleSheet} from 'react-native';
import {deviceSize, fsize} from '../../../common/StyleCommon';
import FormInput from '../../../components/FormInput';
import {connect} from 'react-redux';
import {actionCreators as UserAction} from '../../../redux/module/action/UserAction';
import Api from '../../../Api';
import ToastMessage from '../../../components/ToastMessage';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

//카드 등록하기
const CardForm = props => {
  const {navigation, user_lang, userInfo} = props;

  const {top} = useSafeAreaInsets();

  //카드번호
  const [cardNumber1, setCardNumber1] = useState('');
  const [cardNumber2, setCardNumber2] = useState('');
  const [cardNumber3, setCardNumber3] = useState('');
  const [cardNumber4, setCardNumber4] = useState('');

  const cardNumber1Change = cn => {
    setCardNumber1(cn);
  };

  const cardNumber2Change = cn => {
    setCardNumber2(cn);
  };

  const cardNumber3Change = cn => {
    setCardNumber3(cn);
  };

  const cardNumber4Change = cn => {
    setCardNumber4(cn);
  };

  //유효기간
  const [monthYear, setMonthYear] = useState('');
  const monthYearChange = my => {
    setMonthYear(my);
  };

  //cvc
  const [cvcVal, setCvcVal] = useState('');
  const cvcChange = cvc => {
    setCvcVal(cvc);
  };

  //비밀번호 앞 두자리
  const [password, setPassword] = useState('');
  const passwordChange = pwd => {
    setPassword(pwd);
  };

  const [pageText, setPageText] = useState([]);

  const pageLanguage = () => {
    Api.send(
      'app_page',
      {
        cidx: user_lang.cidx != null ? user_lang.cidx : userInfo.cidx,
        code: 'cardRegist',
      },
      args => {
        let resultItem = args.resultItem;
        let arrItems = args.arrItems;

        if (resultItem.result === 'Y' && arrItems) {
          console.log('아이디 찾기 언어 리스트: ', resultItem, arrItems.text);
          setPageText(arrItems.text);
        } else {
          console.log('아이디 찾기 리스트 실패!', resultItem);
        }
      },
    );
  };

  useEffect(() => {
    pageLanguage();
  }, []);

  //카드 등록하기
  const cardRegist = () => {
    if (
      cardNumber1.length != 4 ||
      cardNumber2.length != 4 ||
      cardNumber3.length != 4 ||
      cardNumber4.length != 4
    ) {
      ToastMessage(pageText[10]);
      return false;
    }

    if (monthYear.length != 4) {
      ToastMessage(pageText[11]);
      return false;
    }

    let card_number =
      cardNumber1 + '-' + cardNumber2 + '-' + cardNumber3 + '-' + cardNumber4;
    let month = monthYear.substring(2, 0);
    let year = '20' + monthYear.substring(2, 4);
    let expiry = year + '-' + month;

    let param = {
      id: userInfo.id,
      cidx: user_lang.cidx != null ? user_lang.cidx : userInfo.cidx,
      card_number: card_number,
      expiry: expiry,
      birth: userInfo.birthday,
      pwd_2digit: password,
    };

    console.log('param', param);

    // Api.send('member_cardRegister', {'id':userInfo.id, 'cidx':user_lang.cidx != null ? user_lang.cidx : userInfo.cidx, "card_number":card_number, "expiry":expiry, "birth":userInfo.birthday, "pwd_2digit":password}, (args)=>{

    //     let resultItem = args.resultItem;
    //     let arrItems = args.arrItems;

    //     if(resultItem.result === 'Y' && arrItems) {
    //        console.log('신용카드 등록하기: ', resultItem, arrItems);
    //     //    setPageText(arrItems.text);
    //     }else{
    //        console.log('신용카드 등록하기 실패!', resultItem);

    //     }
    // });
  };

  return (
    <Box flex={1} backgroundColor="#fff" pt={top + 'px'}>
      <Header
        headerTitle={pageText != '' ? pageText[6] : '카드등록'}
        backButtonStatus={true}
        navigation={navigation}
      />
      <KeyboardAwareScrollView>
        <Box p="20px">
          <Box>
            <LabelTitle
              text={pageText != '' ? pageText[0] : '카드정보를 입력해주세요.'}
              lh={user_lang?.cidx == 9 ? 33 : ''}
            />
            <Box mt="5px">
              <DefText
                text={
                  pageText != ''
                    ? pageText[1]
                    : '체크카드, 신용카드 모두 등록 가능합니다.\n진료비 결제의 용도로만 사용됩니다.\n안심하고 등록해 주세요.'
                }
                style={[styles.cardText]}
                lh={user_lang?.cidx == 9 ? 26 : ''}
              />
            </Box>
          </Box>
          <Box style={[styles.marginInput]}>
            <HStack alignItems={'flex-end'} justifyContent="space-between">
              <Box style={[styles.cardInput]}>
                <FormInput
                  labelOn={true}
                  label={pageText != '' ? pageText[2] : '카드번호'}
                  placeholder={'0000'}
                  value={cardNumber1}
                  onChangeText={cardNumber1Change}
                  editable={true}
                  labelHorizontal={false}
                  labelIcon={false}
                  inputStyle={{textAlign: 'center', paddingLeft: 0}}
                  keyboardType="number-pad"
                  maxLength={4}
                />
              </Box>

              <Box style={[styles.cardInput]}>
                <FormInput
                  labelOn={false}
                  label="카드번호"
                  placeholder={'0000'}
                  value={cardNumber2}
                  onChangeText={cardNumber2Change}
                  editable={true}
                  labelHorizontal={false}
                  labelIcon={false}
                  inputStyle={{textAlign: 'center', paddingLeft: 0}}
                  keyboardType="number-pad"
                  maxLength={4}
                />
              </Box>
              <Box style={[styles.cardInput]}>
                <FormInput
                  labelOn={false}
                  label="카드번호"
                  placeholder={'0000'}
                  value={cardNumber3}
                  onChangeText={cardNumber3Change}
                  editable={true}
                  labelHorizontal={false}
                  labelIcon={false}
                  inputStyle={{textAlign: 'center', paddingLeft: 0}}
                  keyboardType="number-pad"
                  maxLength={4}
                />
              </Box>
              <Box style={[styles.cardInput]}>
                <FormInput
                  labelOn={false}
                  label="카드번호"
                  placeholder={'0000'}
                  value={cardNumber4}
                  onChangeText={cardNumber4Change}
                  editable={true}
                  labelHorizontal={false}
                  labelIcon={false}
                  inputStyle={{textAlign: 'center', paddingLeft: 0}}
                  keyboardType="number-pad"
                  maxLength={4}
                />
              </Box>
            </HStack>
          </Box>
          <Box style={[styles.marginInput]}>
            <HStack justifyContent={'space-between'}>
              <Box style={[styles.halfInput]}>
                <FormInput
                  labelOn={true}
                  label={pageText != '' ? pageText[3] : '유효기간'}
                  placeholder={'MM/YY'}
                  value={monthYear}
                  onChangeText={monthYearChange}
                  editable={true}
                  labelHorizontal={false}
                  labelIcon={false}
                  keyboardType="number-pad"
                  maxLength={4}
                />
              </Box>
              <Box style={[styles.halfInput]}>
                <FormInput
                  labelOn={true}
                  label={pageText != '' ? pageText[4] : 'CVC'}
                  placeholder={pageText != '' ? pageText[7] : '3자리 숫자'}
                  value={cvcVal}
                  onChangeText={cvcChange}
                  editable={true}
                  labelHorizontal={false}
                  labelIcon={false}
                  keyboardType="number-pad"
                  maxLength={3}
                />
              </Box>
            </HStack>
          </Box>
          <Box style={[styles.marginInput]}>
            <FormInput
              labelOn={true}
              label={pageText != '' ? pageText[5] : '비밀번호'}
              placeholder={pageText != '' ? pageText[8] : '비밀번호 앞 두자리'}
              value={password}
              onChangeText={passwordChange}
              editable={true}
              labelHorizontal={false}
              labelIcon={false}
              keyboardType="number-pad"
              maxLength={2}
              secureTextEntry={true}
            />
          </Box>
        </Box>
      </KeyboardAwareScrollView>
      <DefButton
        text={pageText != '' ? pageText[9] : '등록하기'}
        btnStyle={{
          backgroundColor: '#f1f1f1',
          borderRadius: 0,
        }}
        onPress={cardRegist}
        lh={user_lang?.cidx == 9 ? 40 : ''}
      />
    </Box>
  );
};

const styles = StyleSheet.create({
  cardText: {
    ...fsize.fs14,
    lineHeight: 22,
    color: '#929292',
  },
  cardInput: {
    width: (deviceSize.deviceWidth - 40) * 0.23,
  },
  halfInput: {
    width: (deviceSize.deviceWidth - 40) * 0.48,
  },
  marginInput: {
    marginTop: 30,
  },
});

export default connect(
  ({User}) => ({
    userInfo: User.userInfo, //회원정보
    user_lang: User.user_lang,
  }),
  dispatch => ({
    member_info: user => dispatch(UserAction.member_info(user)), //회원 정보 조회
    languageSet: user => dispatch(UserAction.languageSet(user)),
  }),
)(CardForm);
