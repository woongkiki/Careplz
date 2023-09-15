import React, {useEffect, useMemo, useState} from 'react';
import {Box, HStack, Select, Modal, CheckIcon} from 'native-base';
import {DefButton, DefInput, DefText} from '../../common/BOOTSTRAP';
import {StyleSheet, TouchableOpacity, Image} from 'react-native';
import Header from '../../components/Header';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {
  colorSelect,
  deviceSize,
  fsize,
  fweight,
} from '../../common/StyleCommon';
import {
  dayArray,
  monthArray,
  phoneFormat,
  yearArray,
} from '../../common/DataFunction';
import Postcode from '@actbase/react-daum-postcode';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import Checkbox from '../../components/Checkbox';
import FormInput from '../../components/FormInput';
import FormSelect from '../../components/FormSelect';
import {nationList} from '../../ArrayData';
import {BASE_URL} from '../../Utils/APIConstant';
import Loading from '../../components/Loading';
import Api from '../../Api';
import ToastMessage from '../../components/ToastMessage';
import RenderHtml from 'react-native-render-html';
import Font from '../../common/Font';
import StyleHtml from '../../common/StyleHtml';
import messaging from '@react-native-firebase/messaging';
import {connect} from 'react-redux';
import {actionCreators as UserAction} from '../../redux/module/action/UserAction';
import UploadLoading from '../../components/UploadLoading';
import FormCheckBox from '../../components/FormCheckBox';

const selectBoxWidth = (deviceSize.deviceWidth - 40) * 0.31;

const systemFonts = [...Font.NotoRegular, 'NotoSansKR-Regular'];

const WebRender = React.memo(function WebRender({html}) {
  return (
    <RenderHtml
      source={{html: html}}
      ignoredStyles={['width', 'height', 'margin', 'padding']}
      ignoredTags={['head', 'script', 'src']}
      imagesMaxWidth={deviceSize.deviceWidth - 40}
      contentWidth={deviceSize.deviceWidth}
      tagsStyles={StyleHtml}
      systemFonts={systemFonts}
      ignoredDomTags={['g-popup', 'g-section-with-header', 'g-review-stars']}
    />
  );
});

//회원가입
const Register = props => {
  const {navigation, route, user_lang} = props;
  const {params} = route;

  const [loading, setLoading] = useState(true);

  const [pageText, setPageText] = useState([]);

  const [nationLists, setNationLists] = useState([]);

  //나라 목록..
  const nationListApi = async () => {
    const token = await messaging().getToken(); // 앱 토큰

    await Api.send('app_country', {token: token}, args => {
      let resultItem = args.resultItem;
      let arrItems = args.arrItems;

      if (resultItem.result === 'Y' && arrItems) {
        console.log('나라 리스트: ', resultItem, arrItems);
        setNationLists(arrItems);
      } else {
        console.log('나라 리스트 실패!', resultItem);
      }
    });
  };

  const pageLangSelect = async () => {
    await setLoading(true);
    await Api.send(
      'app_page',
      {cidx: user_lang.cidx, code: 'register'},
      args => {
        let resultItem = args.resultItem;
        let arrItems = args.arrItems;

        if (resultItem.result === 'Y' && arrItems) {
          console.log('회원가입 언어 리스트: ', resultItem, arrItems);
          setPageText(arrItems.text);
        } else {
          console.log('회원가입 언어 리스트 실패!', resultItem);
        }
      },
    );
    await nationListApi();
    await setLoading(false);
  };

  useEffect(() => {
    pageLangSelect();
    agreementApi();
  }, []);

  useEffect(() => {
    console.log('nation', nation);
  }, [nation]);

  //국적 선택
  const [nation, setNation] = useState('');

  //언어 선택
  const [language, setLanguage] = useState('');

  //이름 입력
  const [nameValue, setNameValue] = useState('');
  const nameValueChange = nameVal => {
    setNameValue(nameVal);
  };

  const [nicknameValue, setNicknameValue] = useState('');
  const nicknameChange = nickname => {
    setNicknameValue(nickname);
  };

  //성별
  const [genderValue, setGenderValue] = useState('');

  //아이디 입력
  const [idValue, setIdValue] = useState('');
  const idValueChange = idVal => {
    setIdValue(idVal);
    setIdVaildText('');
    setIdVaildStatus(false);
  };

  const [idVaildStatus, setIdVaildStatus] = useState(false);
  const [idVaildText, setIdVaildText] = useState('');

  const idVaildEvent = () => {
    Api.send('member_validId', {cidx: user_lang.cidx, id: idValue}, args => {
      let resultItem = args.resultItem;
      let arrItems = args.arrItems;

      if (resultItem.result === 'Y' && arrItems) {
        //console.log('아이디 중복확인:: ', resultItem);
        setIdVaildText(resultItem.message);
        setIdVaildStatus(true);
        //setPageText(arrItems.text);
      } else {
        console.log('아이디 중복확인 실패!', resultItem);
        setIdVaildText(resultItem.message);
        setIdVaildStatus(false);
      }
    });
  };

  //비밀번호 입력
  const [passwordValue, setPasswordValue] = useState('');
  const PasswordChange = password => {
    setPasswordValue(password);
  };

  //비밀번호 재입력
  const [rePasswordValue, setRePasswordValue] = useState('');
  const rePasswordChange = passowrd => {
    setRePasswordValue(passowrd);
  };

  //비밀번호 유효성 체크
  const [pwdVaildStatus, setPwdVaildStatus] = useState(false);
  const [pwdVaildText, setPwdVaildText] = useState('');

  const pwdVaildEvent = () => {
    Api.send(
      'member_validPw',
      {cidx: user_lang.cidx, passwd: passwordValue, passwd2: rePasswordValue},
      args => {
        let resultItem = args.resultItem;
        let arrItems = args.arrItems;

        if (resultItem.result === 'Y' && arrItems) {
          //console.log('비밀번호 확인:: ', resultItem);
          setPwdVaildStatus(true);
          setPwdVaildText(resultItem.message);
        } else {
          console.log('비밀번호 확인 실패!', resultItem);
          setPwdVaildStatus(false);
          setPwdVaildText(resultItem.message);
        }
      },
    );
  };

  useMemo(() => {
    if (passwordValue != '' && rePasswordValue != '') {
      pwdVaildEvent();
    }

    if (passwordValue == '' && rePasswordValue == '') {
      setPwdVaildText('');
      setPwdVaildStatus(false);
    }
  }, [passwordValue, rePasswordValue]);

  //이메일 입력
  const [emailValue, setEmailValue] = useState('');
  const emailChange = email => {
    setEmailVaildStatus(false);
    setEmailVaildText('');
    setEmailValue(email);
  };

  const [emailVaildStatus, setEmailVaildStatus] = useState(false);
  const [emailVaildText, setEmailVaildText] = useState('');

  //이메일 유효성 검증
  const emailVaildEvent = () => {
    Api.send(
      'member_validEmail',
      {cidx: user_lang.cidx, email: emailValue},
      args => {
        let resultItem = args.resultItem;
        let arrItems = args.arrItems;

        if (resultItem.result === 'Y' && arrItems) {
          //console.log('비밀번호 확인:: ', resultItem);
          setEmailVaildStatus(true);
          setEmailVaildText(resultItem.message);
        } else {
          console.log('비밀번호 확인 실패!', resultItem);
          setEmailVaildStatus(false);
          setEmailVaildText(resultItem.message);
        }
      },
    );
  };

  //생년월일
  const [year, setYear] = useState('');
  const yearChange = y => {
    setYear(y);
  };
  const [yearData, setYearData] = useState(yearArray());
  //let yearInfo = yearArray();

  const [month, setMonth] = useState('');
  const monthChange = m => {
    setMonth(m);
  };
  const [monthData, setMonthData] = useState(monthArray());

  const [day, setDay] = useState('');
  const dayChange = d => {
    setDay(d);
  };
  const [dayData, setDayData] = useState(dayArray());

  //휴대폰번호
  const [phoneNumber, setPhoneNumber] = useState('');
  const phoneNumberChange = phone => {
    setPhoneNumber(phoneFormat(phone));
  };

  const [smsVaildStatus, setSmsVaildStatus] = useState(false);
  const [smsVaildText, setSmsVaildText] = useState('');
  const smsSendHandler = async () => {
    const token = await messaging().getToken(); // 앱 토큰

    await Api.send(
      'member_sendSms',
      {cidx: user_lang.cidx, hp: phoneNumber, token: token},
      args => {
        let resultItem = args.resultItem;
        let arrItems = args.arrItems;

        if (resultItem.result === 'Y' && arrItems) {
          console.log('인증번호 발송 확인:: ', resultItem, arrItems);
          //console.log(arrItems[0])
          if (arrItems != '' || arrItems != undefined) {
            setRandNumber(arrItems[0]);
            ToastMessage(resultItem.message);
          }
        } else {
          console.log('인증번호 발송 확인 실패!', resultItem);
          setRandNumber('');
          ToastMessage(resultItem.message);
        }
      },
    );
  };

  //인증번호
  const [randNumber, setRandNumber] = useState('');
  const [certiNumber, setCertiNumber] = useState('');
  const certiNumberChange = certi => {
    setCertiNumber(certi);
    setSmsVaildText('');
    setSmsVaildStatus(false);
  };

  const checkSmsHandler = async () => {
    const token = await messaging().getToken(); // 앱 토큰
    await Api.send(
      'member_checkSms',
      {
        cidx: user_lang.cidx,
        hp: phoneNumber,
        authnum: certiNumber,
        token: token,
      },
      args => {
        let resultItem = args.resultItem;
        let arrItems = args.arrItems;

        if (resultItem.result === 'Y' && arrItems) {
          //console.log('인증번호 확인:: ', resultItem, arrItems);
          setSmsVaildText(resultItem.message);
          setSmsVaildStatus(true);
        } else {
          console.log('인증번호 확인 실패!', resultItem);
          setSmsVaildText(resultItem.message);
          setSmsVaildStatus(false);
        }
      },
    );
  };

  //주소
  const [addrZip, setAddrZip] = useState('');
  const [address, setAddress] = useState('');
  const [address2, setAddress2] = useState('');

  const addrHandler = (addzip, address) => {
    setAddrZip(addzip);
    setAddress(address);
  };
  const address1Change = addr => {
    setAddress(addr);
  };
  const address2Change = addr => {
    setAddress2(addr);
  };

  //다음주소 검색창 모달
  const [addrModal, setAddrModal] = useState(false);

  //통역사코드
  const [translatorCode, setTranslatorCode] = useState('');
  const translateCodeChange = text => {
    setTranslatorCode(text);
  };

  //인증 수단선택
  const [certiStatus, setCertiStatus] = useState('');

  //약관동의 상태
  const [allAgree, setAllagree] = useState(false); //전체 동의
  const allAgreeHandler = () => {
    setAllagree(!allAgree);

    if (allAgree) {
      setTermuseAgree(false);
      setPrivacyAgree(false);
      setEventAgree(false);
    } else {
      setTermuseAgree(true);
      setPrivacyAgree(true);
      setEventAgree(true);
    }
  };

  const [termuseAgree, setTermuseAgree] = useState(false); // 이용약관 동의
  const termuseAgreeHandler = () => {
    setTermuseAgree(!termuseAgree);
    // if(termuseAgree){
    //     setAllagree(false);
    // }
  };

  const [privacyAgree, setPrivacyAgree] = useState(false); // 개인정보 수집 이용 동의
  const privacyAgreeHandler = () => {
    setPrivacyAgree(!privacyAgree);
    // if(privacyAgree){
    //     setAllagree(false)
    // }
  };

  const [eventAgree, setEventAgree] = useState(false); // 혜택, 이용정보 수신 동의
  const eventAgreeHandler = () => {
    setEventAgree(!eventAgree);
  };

  useEffect(() => {
    if (termuseAgree && privacyAgree && eventAgree) {
      setAllagree(true);
    } else {
      setAllagree(false);
    }
  }, [termuseAgree, privacyAgree, eventAgree]);

  //약관 확인
  const [contentModal, setContentModal] = useState(false);
  const [contentTitle, setContentTitle] = useState('');

  const contentModalShowHandler = (contentTitles, contents, idx) => {
    setContentTitle(contentTitles);
    setContentModal(true);
    setAgreeIndex(idx);
  };

  const [agreeContent, setAgreeContent] = useState([]);
  const [agreeIndex, setAgreeIndex] = useState(0);
  const agreementApi = () => {
    Api.send(
      'app_agreement',
      {cidx: user_lang?.cidx != null ? user_lang?.cidx : 0},
      args => {
        let resultItem = args.resultItem;
        let arrItems = args.arrItems;

        if (resultItem.result === 'Y' && arrItems) {
          //console.log('동의약관 성공: ', resultItem, arrItems);
          setAgreeContent(arrItems);
          //setNationLists(arrItems);
        } else {
          console.log('동의약관 실패!', resultItem);
        }
      },
    );
  };

  const [uploadLoad, setUploadLoad] = useState(false);

  //이메일로 인증
  const [certiEmailModal, setCertiEmailModal] = useState(false);
  const [certiEmail, setCertiEmail] = useState('');
  const [certiEmailNumber, setCertiEmailNumber] = useState('');

  const certiEmailChange = email => {
    setCertiEmail(email);
  };
  const certiEmailNumberChange = num => {
    setCertiEmailNumber(num);
  };

  const [certiHpModal, setCertiHpModal] = useState(false);

  const [certiStatused, setCertiStatused] = useState(''); // 휴대폰이나 이메일 인증완료

  const joinHandler = async () => {
    const token = await messaging().getToken();

    //console.log("token", token);

    if (nation == '') {
      ToastMessage(pageText[2]);
      return false;
    }

    if (nameValue == '') {
      ToastMessage(pageText[4]);
      return false;
    }

    if (params == '') {
      if (idValue == '') {
        ToastMessage(pageText[42]);
        return false;
      }

      if (!idVaildStatus) {
        ToastMessage(pageText[43]);
        return false;
      }

      if (passwordValue == '') {
        ToastMessage(pageText[44]);
        return false;
      }

      if (rePasswordValue == '') {
        ToastMessage(pageText[45]);
        return false;
      }

      if (!pwdVaildStatus) {
        ToastMessage(pwdVaildText);
        return false;
      }
    }

    if (year == '') {
      ToastMessage(pageText[46]);
      return false;
    }

    if (month == '') {
      ToastMessage(pageText[47]);
      return false;
    }

    if (day == '') {
      ToastMessage(pageText[48]);
      return false;
    }

    if (params == '') {
      if (emailValue == '') {
        ToastMessage(pageText[49]);
        return false;
      }

      if (!emailVaildStatus) {
        ToastMessage(emailVaildText);
        return false;
      }
    }

    if (phoneNumber == '') {
      ToastMessage(pageText[50]);
      return false;
    }

    if (!smsVaildStatus) {
      ToastMessage(pageText[51]);
      return false;
    }

    if (!termuseAgree) {
      ToastMessage(pageText[52]);
      return false;
    }

    if (!privacyAgree) {
      ToastMessage(pageText[53]);
      return false;
    }

    let joinParam;
    if (params == '') {
      joinParam = {
        cidx: language, //언어
        cidx2: nation, //국가
        name: nameValue,
        id: idValue,
        passwd: passwordValue,
        nick: nicknameValue,
        birth1: year,
        birth2: month,
        birth3: day,
        email: emailValue,
        hp: phoneNumber,
        post: addrZip,
        address: address,
        address2: address2,
        mcode: translatorCode,
        agree1: termuseAgree,
        agree2: privacyAgree,
        agree3: eventAgree,
        token: token,
      };
    } else {
      joinParam = {
        cidx: language, //언어
        cidx2: nation, //국가
        name: nameValue,
        nick: nicknameValue,
        birth1: year,
        birth2: month,
        birth3: day,
        email: emailValue,
        hp: phoneNumber,
        post: addrZip,
        address: address,
        address2: address2,
        mcode: translatorCode,
        agree1: termuseAgree,
        agree2: privacyAgree,
        agree3: eventAgree,
        token: token,
        sns: params.sns,
        snskey: params.snskey,
      };
    }

    console.log('joinParam:::', joinParam);

    await setUploadLoad(true);

    await Api.send('member_join', joinParam, args => {
      let resultItem = args.resultItem;
      let arrItems = args.arrItems;

      console.log('resultItem', resultItem);

      if (resultItem.result === 'Y' && arrItems) {
        console.log('회원가입 성공: ', resultItem, arrItems);
        ToastMessage(resultItem.message);
        navigation.replace('RegisterEnd', {name: nameValue});
        //setAgreeContent(arrItems);
        //setNationLists(arrItems);
      } else {
        console.log('회원가입 실패!', resultItem);
        ToastMessage(resultItem.message);
      }
    });

    await setUploadLoad(false);
  };

  const {top} = useSafeAreaInsets();

  const RegisterInterestsHandler = () => {
    navigation.navigate('RegisterInterests');
  };

  return (
    <Box flex={1} backgroundColor="#fff" pt={top + 'px'}>
      <Header
        navigation={navigation}
        backButtonStatus={true}
        headerTitle={pageText != '' ? pageText[0] : '회원가입'}
      />
      {loading ? (
        <Loading />
      ) : (
        <KeyboardAwareScrollView>
          <Box p="20px">
            <Box>
              <FormSelect
                labelOn={true}
                label={pageText != '' ? pageText[1] : '국적'}
                placeholder={
                  pageText != '' ? pageText[2] : '국적을 선택해 주세요.'
                }
                value={nation}
                onValueChange={val => setNation(val)}
                data={nationLists}
                labelHorizontal={true}
                labelIcon={true}
                labelIconUri={BASE_URL + '/newImg/nation_icon.png'}
                labelIconWidth={22}
                labelIconHeight={22}
                labelIconResize="contain"
              />
            </Box>
            <Box style={[styles.inputMargin]}>
              <FormSelect
                type={'lang'}
                labelOn={true}
                label={pageText != '' ? pageText[58] : '언어선택'}
                placeholder={
                  pageText != '' ? pageText[60] : '언어를 선택해 주세요.'
                }
                value={nation}
                onValueChange={val => setLanguage(val)}
                data={nationLists}
                labelHorizontal={true}
                labelIcon={true}
                labelIconUri={BASE_URL + '/newImg/lang_icon.png'}
                labelIconWidth={22}
                labelIconHeight={22}
                labelIconResize="contain"
              />
              <HStack flexShrink={1} mt="10px">
                <Box width={(deviceSize.deviceWidth - 40) * 0.07}>
                  <Image
                    source={{uri: BASE_URL + '/newImg/alertIcon.png'}}
                    style={{
                      width: 17,
                      height: 17,
                      resizeMode: 'contain',
                    }}
                  />
                </Box>
                <Box width={(deviceSize.deviceWidth - 40) * 0.93}>
                  <DefText
                    text={
                      '사용하실 언어 선택에 따라 앱서비스 언어와 케어해줄 담당자가 배정 됩니다.'
                    }
                    style={[fsize.fs13, {color: '#7B7B7B'}]}
                  />
                </Box>
              </HStack>
            </Box>
            <Box style={[styles.inputMargin]}>
              <FormInput
                labelOn={true}
                label={pageText != '' ? pageText[3] : '이름'}
                placeholder={
                  pageText != '' ? pageText[4] : '이름을 입력해 주세요.'
                }
                value={nameValue}
                onChangeText={nameValueChange}
                editable={true}
                labelHorizontal={true}
                labelIcon={true}
                labelIconUri={BASE_URL + '/newImg/name_icon.png'}
                labelIconWidth={22}
                labelIconHeight={22}
                labelIconResize="contain"
                inputStyle={[nameValue.length > 0 && {lineHeight: 20}]}
              />
            </Box>
            <Box style={[styles.inputMargin]}>
              <FormInput
                labelOn={true}
                label={pageText != '' ? pageText[59] : '닉네임'}
                placeholder={
                  pageText != '' ? pageText[61] : '닉네임을 입력해 주세요.'
                }
                value={nicknameValue}
                onChangeText={nicknameChange}
                editable={true}
                labelHorizontal={true}
                labelIcon={true}
                labelIconUri={BASE_URL + '/newImg/nick_icon.png'}
                labelIconWidth={22}
                labelIconHeight={22}
                labelIconResize="contain"
                inputStyle={[
                  {paddingRight: 100},
                  nicknameValue.length > 0 && {lineHeight: 20},
                ]}
                inputButton={true}
                btnDisabled={nicknameValue.length > 0 ? false : true}
                btnStyle={
                  nicknameValue.length > 0 && {
                    backgroundColor: colorSelect.navy,
                  }
                }
                inputButtonText={pageText != '' ? pageText[7] : '중복확인'}
              />
            </Box>
            <Box style={[styles.inputMargin]}>
              <HStack alignItems={'center'} mb="10px">
                <Image
                  source={{uri: BASE_URL + '/newImg/gender_icon.png'}}
                  style={{
                    width: 22,
                    height: 16,
                    resizeMode: 'contain',
                    marginRight: 10,
                  }}
                />
                <DefText
                  text={'성별'}
                  style={[fsize.fs15, fweight.bold, {lineHeight: 21}]}
                />
              </HStack>
              <HStack alignItems={'center'} justifyContent={'space-between'}>
                <TouchableOpacity
                  onPress={() => setGenderValue('남자')}
                  style={{
                    width: (deviceSize.deviceWidth - 40) * 0.48,
                    height: 48,
                    borderRadius: 5,
                    borderWidth: 1,
                    borderColor: colorSelect.navy,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor:
                      genderValue == '남자'
                        ? colorSelect.navy
                        : colorSelect.white,
                  }}>
                  <DefText
                    text={'남자'}
                    style={[
                      fsize.fs15,
                      {
                        lineHeight: 21,
                        color:
                          genderValue == '남자' ? colorSelect.white : '#BEBEBE',
                      },
                    ]}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setGenderValue('여자')}
                  style={{
                    width: (deviceSize.deviceWidth - 40) * 0.48,
                    height: 48,
                    borderRadius: 5,
                    borderWidth: 1,
                    borderColor: colorSelect.navy,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor:
                      genderValue == '여자'
                        ? colorSelect.navy
                        : colorSelect.white,
                  }}>
                  <DefText
                    text={'여자'}
                    style={[
                      fsize.fs15,
                      {
                        lineHeight: 21,
                        color:
                          genderValue == '여자' ? colorSelect.white : '#BEBEBE',
                      },
                    ]}
                  />
                </TouchableOpacity>
              </HStack>
            </Box>
            {params == '' && (
              <Box style={[styles.inputMargin]}>
                <FormInput
                  labelOn={true}
                  label={pageText != '' ? pageText[5] : '아이디'}
                  placeholder={
                    pageText != '' ? pageText[6] : '아이디를 입력해 주세요.'
                  }
                  value={idValue}
                  onChangeText={idValueChange}
                  editable={true}
                  inputButton={true}
                  btnDisabled={idValue.length > 0 ? false : true}
                  btnStyle={
                    idValue.length > 0 && {backgroundColor: colorSelect.navy}
                  }
                  inputButtonText={pageText != '' ? pageText[7] : '중복확인'}
                  inputButtonPress={idVaildEvent}
                  inputStyle={{paddingRight: 100, lineHeight: 20}}
                  labelHorizontal={true}
                  labelIcon={true}
                  labelIconUri={BASE_URL + '/newImg/id_icons.png'}
                  labelIconWidth={22}
                  labelIconHeight={22}
                  labelIconResize="contain"
                />
                {idValue.length > 0 && idVaildText != '' && (
                  <HStack mt="10px" alignItems={'center'}>
                    <Image
                      source={{
                        uri: idVaildStatus
                          ? BASE_URL + '/images/alertIcon.png'
                          : BASE_URL + '/images/alertIconRed.png',
                      }}
                      style={{
                        width: 13,
                        height: 13,
                        resizeMode: 'stretch',
                        marginRight: 5,
                      }}
                    />
                    <DefText
                      text={idVaildText}
                      style={[
                        styles.noticeText,
                        !idVaildStatus && {color: '#E11B1B'},
                      ]}
                    />
                  </HStack>
                )}
              </Box>
            )}

            {params == '' && (
              <Box style={[styles.inputMargin]}>
                <FormInput
                  labelOn={true}
                  label={pageText != '' ? pageText[8] : '비밀번호'}
                  placeholder={
                    pageText != ''
                      ? pageText[9]
                      : '영문, 숫자, 특수문자 조합 8자리 이상'
                  }
                  value={passwordValue}
                  onChangeText={PasswordChange}
                  editable={true}
                  inputButton={false}
                  secureTextEntry={true}
                  labelHorizontal={true}
                  labelIcon={true}
                  labelIconUri={BASE_URL + '/newImg/pw_icon.png'}
                  labelIconWidth={20}
                  labelIconHeight={22}
                  labelIconResize="contain"
                />
                <Box mt="10px">
                  <FormInput
                    labelOn={false}
                    label={pageText != '' ? pageText[9] : '비밀번호 확인'}
                    placeholder={
                      pageText != '' ? pageText[10] : '비밀번호 확인'
                    }
                    value={rePasswordValue}
                    onChangeText={rePasswordChange}
                    editable={true}
                    inputButton={false}
                    secureTextEntry={true}
                  />
                </Box>
                {pwdVaildText != '' && (
                  <HStack mt="10px" alignItems={'flex-start'} pr="20px">
                    <Image
                      source={{
                        uri: pwdVaildStatus
                          ? BASE_URL + '/images/alertIcon.png'
                          : BASE_URL + '/images/alertIconRed.png',
                      }}
                      style={{
                        width: 13,
                        height: 13,
                        resizeMode: 'stretch',
                        marginRight: 5,
                      }}
                    />
                    <DefText
                      text={pwdVaildText}
                      style={[
                        styles.noticeText,
                        !pwdVaildStatus && {color: '#E11B1B'},
                      ]}
                    />
                  </HStack>
                )}
              </Box>
            )}

            <Box style={[styles.inputMargin]}>
              <HStack
                flexWrap={'wrap'}
                alignItems={'flex-end'}
                justifyContent="space-between">
                <Box width={selectBoxWidth}>
                  <FormInput
                    labelOn={true}
                    label={pageText != '' ? pageText[11] : '생년월일'}
                    placeholder={pageText != '' ? pageText[12] : '입력'}
                    value={year}
                    onChangeText={yearChange}
                    labelHorizontal={true}
                    labelIcon={true}
                    labelIconUri={BASE_URL + '/newImg/birth_icon.png'}
                    labelIconWidth={22}
                    labelIconHeight={22}
                    labelIconResize="contain"
                    keyboardType={'number-pad'}
                    maxLength={4}
                    inputStyle={[year.length > 0 && {lineHeight: 20}]}
                  />
                </Box>
                <Box width={selectBoxWidth}>
                  <FormInput
                    labelOn={false}
                    //label={ pageText != "" ? pageText[11] : '생년월일'}
                    placeholder={pageText != '' ? pageText[13] : '입력'}
                    value={month}
                    onChangeText={monthChange}
                    labelHorizontal={false}
                    labelIcon={false}
                    //labelIconUri={BASE_URL + "/images/birthIcon.png"}
                    //labelIconWidth={18}
                    //labelIconHeight={18}
                    //labelIconResize='contain'
                    keyboardType={'number-pad'}
                    maxLength={2}
                    inputStyle={[month.length > 0 && {lineHeight: 20}]}
                  />
                </Box>
                <Box width={selectBoxWidth}>
                  <FormInput
                    labelOn={false}
                    //label={ pageText != "" ? pageText[11] : '생년월일'}
                    placeholder={pageText != '' ? pageText[14] : '입력'}
                    value={day}
                    onChangeText={dayChange}
                    labelHorizontal={false}
                    labelIcon={false}
                    //labelIconUri={BASE_URL + "/images/birthIcon.png"}
                    //labelIconWidth={18}
                    //labelIconHeight={18}
                    //labelIconResize='contain'
                    keyboardType={'number-pad'}
                    maxLength={2}
                    inputStyle={[day.length > 0 && {lineHeight: 20}]}
                  />
                </Box>
              </HStack>
            </Box>

            <Box style={[styles.inputMargin]}>
              <FormInput
                labelOn={true}
                label={pageText != '' ? pageText[62] : '프로필 사진'}
                placeholder={
                  pageText != ''
                    ? pageText[63]
                    : '프로필 사진을 업로드 해주세요.'
                }
                value={phoneNumber}
                onChangeText={phoneNumberChange}
                editable={false}
                maxLength={13}
                inputButton={true}
                inputButtonText={pageText != '' ? pageText[64] : '사진선택'}
                inputButtonPress={() => console.log('사진선택')}
                inputStyle={{paddingRight: 100, lineHeight: 20}}
                btnDisabled={false}
                btnStyle={{
                  backgroundColor:
                    phoneNumber.length > 0 ? colorSelect.navy : '#7E7E7E',
                }}
                labelHorizontal={true}
                label2on={true}
                label2={pageText != '' ? ' ' + pageText[24] : ' (선택)'}
                labelIcon={true}
                labelIconUri={BASE_URL + '/newImg/profile_icon.png'}
                labelIconWidth={22}
                labelIconHeight={22}
                labelIconResize="contain"
              />
            </Box>

            <Box style={[styles.inputMargin]}>
              <FormCheckBox
                labelOn={true}
                label={
                  pageText != '' ? pageText[65] : '인증수단을 선택해 주세요.'
                }
                certiText1={pageText != '' ? pageText[66] : '이메일 인증'}
                certiText2={pageText != '' ? pageText[67] : '휴대폰 인증'}
                certiStatus={certiStatus}
                setCertiStatus={setCertiStatus}
                labelHorizontal={true}
                labelIcon={true}
                labelIconUri={BASE_URL + '/newImg/certi_check_icon.png'}
                labelIconWidth={22}
                labelIconHeight={22}
                labelIconResize="contain"
                setCertiEmailModal={setCertiEmailModal}
              />
              <HStack>
                <TouchableOpacity onPress={() => setCertiEmailModal(true)}>
                  <HStack alignItems={'center'}>
                    <Box
                      width="22px"
                      height="22px"
                      borderRadius={'22px'}
                      borderWidth={1}
                      borderColor={'#DFDFE3'}
                      alignItems={'center'}
                      justifyContent={'center'}>
                      <CheckIcon size={'12px'} color={'#DFDFE3'} />
                    </Box>
                    <Box ml="10px">
                      <DefText
                        text={pageText != '' ? pageText[66] : '이메일 인증'}
                        style={[fsize.fs15, {lineHeight: 21, color: '#787878'}]}
                      />
                    </Box>
                  </HStack>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setCertiHpModal(true)}
                  style={{marginLeft: 20}}>
                  <HStack alignItems={'center'}>
                    <Box
                      width="22px"
                      height="22px"
                      borderRadius={'22px'}
                      borderWidth={1}
                      borderColor={'#DFDFE3'}
                      alignItems={'center'}
                      justifyContent={'center'}>
                      <CheckIcon size={'12px'} color={'#DFDFE3'} />
                    </Box>
                    <Box ml="10px">
                      <DefText
                        text={pageText != '' ? pageText[67] : '휴대폰 인증'}
                        style={[fsize.fs15, {lineHeight: 21, color: '#787878'}]}
                      />
                    </Box>
                  </HStack>
                </TouchableOpacity>
              </HStack>
            </Box>

            <Box style={[styles.inputMargin]}>
              <FormInput
                labelOn={true}
                label={pageText != '' ? pageText[23] : '주소'}
                labelHorizontal={true}
                label2={pageText != '' ? ' ' + pageText[24] : ' (선택)'}
                placeholder={
                  pageText != '' ? pageText[25] : '주소를 입력하세요.'
                }
                value={addrZip}
                //onChangeText={phoneNumberChange}
                editable={false}
                inputButton={true}
                inputButtonText={pageText != '' ? pageText[26] : '주소 검색'}
                inputStyle={[
                  {paddingRight: 100},
                  addrZip.length > 0 && {lineHeight: 20},
                ]}
                inputButtonPress={() => setAddrModal(true)}
                labelIcon={true}
                labelIconUri={BASE_URL + '/newImg/addr_icons.png'}
                labelIconWidth={22}
                labelIconHeight={22}
                labelIconResize="contain"
                label2on={true}
              />

              <Box mt="10px">
                <FormInput
                  labelOn={false}
                  label="일반 주소"
                  placeholder={
                    pageText != '' ? pageText[27] : '주소를 입력해주세요.'
                  }
                  value={address}
                  onChangeText={address1Change}
                  editable={true}
                  inputStyle={[address.length > 0 && {lineHeight: 20}]}
                />
              </Box>
              <Box mt="10px">
                <FormInput
                  labelOn={false}
                  label="상세 주소"
                  placeholder={
                    pageText != '' ? pageText[27] : '상세 주소를 입력해주세요.'
                  }
                  value={address2}
                  onChangeText={address2Change}
                  editable={true}
                  inputStyle={[address2.length > 0 && {lineHeight: 20}]}
                />
              </Box>
            </Box>
            <Box style={[styles.inputMargin]}>
              <FormInput
                labelOn={true}
                label={pageText != '' ? pageText[28] : '매니저 코드'}
                labelHorizontal={true}
                label2={pageText != '' ? ' ' + pageText[29] : ' (선택)'}
                placeholder={
                  pageText != '' ? pageText[30] : '매니저 코드를 입력해주세요.'
                }
                value={translatorCode}
                onChangeText={translateCodeChange}
                editable={true}
                labelIcon={true}
                labelIconUri={BASE_URL + '/newImg/mng_code_icon.png'}
                labelIconWidth={22}
                labelIconHeight={22}
                labelIconResize="contain"
                label2on={true}
              />
            </Box>
            <Box style={[styles.inputMargin]}>
              <Box pb="20px" borderBottomWidth={1} borderBottomColor="#dfdfdf">
                <Checkbox
                  checkboxText={
                    pageText != ''
                      ? pageText[31]
                      : '아래 약관에 모두 동의합니다.'
                  }
                  txtStyle={[fweight.bold]}
                  checkStatus={allAgree}
                  onPress={allAgreeHandler}
                />
              </Box>
              <Box mt="20px">
                <HStack alignItems={'center'} justifyContent="space-between">
                  <Box width="70%">
                    <Checkbox
                      checkboxText={
                        pageText != ''
                          ? pageText[32] + ' ' + pageText[36]
                          : '(필수) 이용약관 동의'
                      }
                      checkStatus={termuseAgree}
                      onPress={termuseAgreeHandler}
                      txtStyle={[fsize.fs14]}
                    />
                  </Box>
                  <TouchableOpacity
                    onPress={() => contentModalShowHandler('이용약관', '', 0)}>
                    <DefText
                      text={pageText != '' ? pageText[34] : '보기'}
                      style={[fsize.fs14]}
                    />
                  </TouchableOpacity>
                </HStack>
              </Box>
              <Box mt="20px">
                <HStack alignItems={'center'} justifyContent="space-between">
                  <Box width="70%">
                    <Checkbox
                      checkboxText={
                        pageText != ''
                          ? pageText[32] + ' ' + pageText[37]
                          : '(필수) 개인정보 수집 이용 동의'
                      }
                      checkStatus={privacyAgree}
                      onPress={privacyAgreeHandler}
                      txtStyle={[fsize.fs14]}
                    />
                  </Box>
                  <TouchableOpacity
                    onPress={() =>
                      contentModalShowHandler('개인정보 수집 이용 동의', '', 1)
                    }>
                    <DefText
                      text={pageText != '' ? pageText[34] : '보기'}
                      style={[fsize.fs14]}
                    />
                  </TouchableOpacity>
                </HStack>
              </Box>
              <Box mt="20px">
                <HStack alignItems={'center'} justifyContent="space-between">
                  <Box width="70%">
                    <Checkbox
                      checkboxText={
                        pageText != ''
                          ? pageText[33] + ' ' + pageText[38]
                          : '(선택) 혜택, 이용정보 수신 동의'
                      }
                      checkStatus={eventAgree}
                      onPress={eventAgreeHandler}
                      txtStyle={[fsize.fs14]}
                    />
                  </Box>
                  <TouchableOpacity
                    onPress={() =>
                      contentModalShowHandler('혜택, 이용정보 수신 동의', '', 2)
                    }>
                    <DefText
                      text={pageText != '' ? pageText[34] : '보기'}
                      style={[fsize.fs14]}
                    />
                  </TouchableOpacity>
                </HStack>
              </Box>
            </Box>
          </Box>
        </KeyboardAwareScrollView>
      )}

      <DefButton
        text={pageText != '' ? pageText[35] : '가입하기'}
        btnStyle={{
          backgroundColor: '#F1F1F1',
        }}
        txtStyle={[fweight.m]}
        //onPress={joinHandler}
        onPress={RegisterInterestsHandler}
      />

      <Modal isOpen={certiEmailModal} onClose={() => setCertiEmailModal(false)}>
        <Modal.Content
          p="0"
          width={deviceSize.deviceWidth - 40}
          backgroundColor={'#fff'}>
          <Modal.Body px="20px" pt="30px" pb="20px">
            <Box>
              <DefText
                text={'인증'}
                style={[
                  fsize.fs17,
                  fweight.bold,
                  {color: '#191919', textAlign: 'center'},
                ]}
              />
            </Box>
            <Box
              width={'100%'}
              height={'1px'}
              backgroundColor={'#ccc'}
              mt="15px"
              mb="25px"
            />
            <Box>
              <FormInput
                labelOn={true}
                label={pageText != '' ? pageText[66] : '이메일 인증'}
                placeholder={
                  pageText != '' ? pageText[16] : '이메일을 입력해 주세요'
                }
                value={certiEmail}
                onChangeText={certiEmailChange}
                editable={true}
                inputButton={true}
                inputButtonText={'인증받기'}
                //inputButtonPress={emailVaildEvent}
                inputStyle={{paddingRight: 100, lineHeight: 20}}
                btnDisabled={certiEmail.length > 0 ? false : true}
                btnStyle={{
                  backgroundColor:
                    certiEmail.length > 0 ? colorSelect.navy : '#7E7E7E',
                }}
                labelHorizontal={true}
                labelIcon={true}
                labelIconUri={BASE_URL + '/newImg/email_icons.png'}
                labelIconWidth={22}
                labelIconHeight={22}
                labelIconResize="contain"
              />
              <Box height="10px" />
              <FormInput
                labelOn={false}
                label={pageText != '' ? pageText[66] : '이메일 인증'}
                placeholder={'인증번호를 입력해 주세요.'}
                value={certiEmailNumber}
                onChangeText={certiEmailNumberChange}
                editable={true}
                inputButton={true}
                inputButtonText={'확인'}
                //inputButtonPress={emailVaildEvent}
                inputStyle={{paddingRight: 100, lineHeight: 20}}
                btnDisabled={certiEmailNumber.length > 0 ? false : true}
                btnStyle={{
                  backgroundColor:
                    certiEmailNumber.length > 0 ? colorSelect.navy : '#7E7E7E',
                }}
                labelHorizontal={true}
                labelIcon={true}
                labelIconUri={BASE_URL + '/images/emailIcon.png'}
                labelIconWidth={18}
                labelIconHeight={18}
                labelIconResize="contain"
              />
              <Box height="30px" />
              <TouchableOpacity
                onPress={() => setCertiEmailModal(false)}
                style={[
                  {
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingVertical: 15,
                    width: deviceSize.deviceWidth - 80,
                    backgroundColor: '#F1F1F1',
                    borderRadius: 10,
                  },
                ]}>
                <DefText text={'닫기'} style={[fsize.fs16, fweight.m]} />
              </TouchableOpacity>
            </Box>
          </Modal.Body>
        </Modal.Content>
      </Modal>

      {/* 휴대폰 인증 */}
      <Modal isOpen={certiHpModal} onClose={() => setCertiHpModal(false)}>
        <Modal.Content
          p="0"
          width={deviceSize.deviceWidth - 40}
          backgroundColor={'#fff'}>
          <Modal.Body px="20px" pt="30px" pb="20px">
            <Box>
              <DefText
                text={'인증'}
                style={[
                  fsize.fs17,
                  fweight.bold,
                  {color: '#191919', textAlign: 'center'},
                ]}
              />
            </Box>
            <Box
              width={'100%'}
              height={'1px'}
              backgroundColor={'#ccc'}
              mt="15px"
              mb="25px"
            />
            <Box>
              <FormInput
                labelOn={true}
                label={pageText != '' ? pageText[18] : '휴대 전화번호'}
                placeholder={
                  pageText != ''
                    ? pageText[19]
                    : '휴대 전화번호를 입력해 주세요.'
                }
                value={phoneNumber}
                onChangeText={phoneNumberChange}
                editable={true}
                maxLength={13}
                inputButton={true}
                inputButtonText={pageText != '' ? pageText[20] : '인증받기'}
                inputButtonPress={smsSendHandler}
                inputStyle={{paddingRight: 100, lineHeight: 20}}
                btnDisabled={phoneNumber.length > 0 ? false : true}
                btnStyle={{
                  backgroundColor:
                    phoneNumber.length > 0 ? colorSelect.navy : '#7E7E7E',
                }}
                labelHorizontal={true}
                labelIcon={true}
                labelIconUri={BASE_URL + '/images/phoneIcon.png'}
                labelIconWidth={18}
                labelIconHeight={18}
                labelIconResize="contain"
                keyboardType="number-pad"
              />
              <Box mt="10px">
                <FormInput
                  labelOn={false}
                  label={'인증번호 입력'}
                  placeholder={
                    pageText != '' ? pageText[21] : '인증번호를 입력해 주세요.'
                  }
                  value={certiNumber}
                  onChangeText={certiNumberChange}
                  editable={randNumber != '' ? true : false}
                  maxLength={6}
                  inputButton={true}
                  inputButtonText={pageText != '' ? pageText[22] : '확인'}
                  inputButtonPress={checkSmsHandler}
                  inputStyle={{paddingRight: 100, lineHeight: 20}}
                  btnDisabled={certiNumber.length > 0 ? false : true}
                  btnStyle={{
                    backgroundColor:
                      certiNumber.length > 0 ? colorSelect.navy : '#7E7E7E',
                  }}
                />
              </Box>
              <Box height="30px" />
              <TouchableOpacity
                onPress={() => setCertiHpModal(false)}
                style={[
                  {
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingVertical: 15,
                    width: deviceSize.deviceWidth - 80,
                    backgroundColor: '#F1F1F1',
                    borderRadius: 10,
                  },
                ]}>
                <DefText text={'닫기'} style={[fsize.fs16, fweight.m]} />
              </TouchableOpacity>
            </Box>
          </Modal.Body>
        </Modal.Content>
      </Modal>

      <Modal isOpen={addrModal} onClose={() => setAddrModal(false)}>
        <SafeAreaView style={{flex: 1}}>
          <HStack
            height="45px"
            backgroundColor={'#fff'}
            alignItems="center"
            justifyContent={'space-between'}
            borderBottomWidth={1}
            borderBottomColor={'#dfdfdf'}
            px="20px">
            <DefText
              text="주소를 입력하세요."
              style={[fsize.fs15, fweight.bold]}
            />
            <TouchableOpacity onPress={() => setAddrModal(false)}>
              <Image
                source={require('../../images/menuClose.png')}
                alt="닫기"
                style={{
                  width: deviceSize.deviceWidth / 19.5,
                  height: deviceSize.deviceWidth / 19.5,
                  resizeMode: 'contain',
                }}
              />
            </TouchableOpacity>
          </HStack>
          <Postcode
            style={{
              width: deviceSize.deviceWidth,
              flex: 1,
            }}
            jsOptions={{
              animation: true,
              hideMapBtn: true,
            }}
            onSelected={data => {
              addrHandler(data.zonecode, data.address);
              setAddrModal(false);
            }}
          />
        </SafeAreaView>
      </Modal>

      <Modal isOpen={contentModal} onClose={() => setContentModal(false)}>
        <Modal.Content p="0" width={deviceSize.deviceWidth - 40}>
          <Modal.Body p="0">
            <HStack
              p="20px"
              py="15px"
              borderBottomWidth={1}
              borderBottomColor="#dfdfdf"
              alignItems={'center'}
              justifyContent="space-between">
              <DefText
                text={contentTitle != '' ? contentTitle : ''}
                style={[fweight.bold, fsize.fs16]}
              />
              <TouchableOpacity onPress={() => setContentModal(false)}>
                <Image
                  source={require('../../images/menuClose.png')}
                  style={{
                    width: 16,
                    height: 16,
                    resizeMode: 'contain',
                  }}
                />
              </TouchableOpacity>
            </HStack>
            <Box p="20px">
              {agreeContent != '' && (
                <WebRender html={agreeContent[agreeIndex].content} />
              )}
            </Box>
          </Modal.Body>
        </Modal.Content>
      </Modal>
      {uploadLoad && (
        <UploadLoading
          loadingText={
            pageText != ''
              ? pageText[41]
              : '회원가입 진행 중입니다.\n잠시만 기다려주세요'
          }
        />
      )}
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
    userInfo: User.userInfo, //회원정보
    user_lang: User.user_lang,
  }),
  dispatch => ({
    member_login: user => dispatch(UserAction.member_login(user)), //로그인
    languageSet: user => dispatch(UserAction.languageSet(user)), //로그인
  }),
)(Register);
