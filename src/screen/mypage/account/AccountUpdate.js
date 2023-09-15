import React, {useEffect, useState} from 'react';
import {Box, HStack, Modal} from 'native-base';
import {DefButton, DefText} from '../../../common/BOOTSTRAP';
import Header from '../../../components/Header';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import FormInput from '../../../components/FormInput';
import {BASE_URL} from '../../../Utils/APIConstant';
import {phoneFormat} from '../../../common/DataFunction';
import {
  colorSelect,
  deviceSize,
  fsize,
  fweight,
} from '../../../common/StyleCommon';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import FormButton from '../../../components/FormButton';
import moment from 'moment';
import Postcode from '@actbase/react-daum-postcode';
import {SafeAreaView, TouchableOpacity, Image, StyleSheet} from 'react-native';
import BoxLine from '../../../components/BoxLine';
import {connect} from 'react-redux';
import {actionCreators as UserAction} from '../../../redux/module/action/UserAction';
import {StackActions} from '@react-navigation/native';
import Api from '../../../Api';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import BottomNavi from '../../../components/bottom/BottomNavi';

//내정보 수정하기
const AccountUpdate = props => {
  const {navigation, userInfo, user_lang, member_update, member_info, route} =
    props;
  const {name} = route;
  const {top} = useSafeAreaInsets();
  //앱 페이지 텍스트
  const [pageText, setPageText] = useState([]);

  const pageLanguage = async () => {
    //user_lang != null ? user_lang.cidx : userInfo.cidx
    await Api.send(
      'app_page',
      {
        cidx: user_lang != null ? user_lang.cidx : userInfo.cidx,
        code: 'memberUpdate',
      },
      args => {
        let resultItem = args.resultItem;
        let arrItems = args.arrItems;

        if (resultItem.result === 'Y' && arrItems) {
          //console.log('내정보 수정 언어 리스트: ', resultItem, arrItems.text);
          setPageText(arrItems.text);
        } else {
          console.log('내정보 수정 언어 리스트 실패!', resultItem);
        }
      },
    );
  };

  const [nameVal, setNameVal] = useState('');
  const nameChangeEvent = text => {
    setNameVal(text);
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

  const [birthday, setBirthDay] = useState('');
  const [birthdayPickerVisible, setBirthdayPickerVisible] = useState(false);

  const showBirthdayPicker = () => {
    setBirthdayPickerVisible(true);
  };

  const hideBirthdayPicker = () => {
    setBirthdayPickerVisible(false);
  };

  const birthdayPickerSelect = day => {
    let days = moment(day);
    days = days.format('YYYY.MM.DD');
    setBirthDay(days);
    hideBirthdayPicker();
  };

  //이메일 입력
  const [emailValue, setEmailValue] = useState('');
  const emailChange = email => {
    setEmailValue(email);
  };

  //주소
  const [addrZip, setAddrZip] = useState('');
  const [address, setAddress] = useState('');
  const [address2, setAddress2] = useState('');

  const addrHandler = (addzip, address) => {
    setAddrZip(addzip);
    setAddress(address);
  };
  const addressChange = addr => {
    setAddress(addr);
  };
  const addressChange2 = addr => {
    setAddress2(addr);
  };

  //다음주소 검색창 모달
  const [addrModal, setAddrModal] = useState(false);

  //비밀번호 변경
  const [nowPwd, setNowPwd] = useState('');
  const nowPwdChange = pwd => {
    setNowPwd(pwd);
  };

  const [newPwd, setNewPwd] = useState('');
  const newPwdChange = pwd => {
    setNewPwd(pwd);
  };

  const [reNewPwd, setReNewPwd] = useState('');
  const reNewPwdChange = pwd => {
    setReNewPwd(pwd);
  };

  const [sns, setSns] = useState('');

  useEffect(() => {
    pageLanguage();
    if (userInfo) {
      console.log('userInfo', userInfo);
      setNameVal(userInfo?.name);
      setBirthDay(userInfo?.birthday);
      setEmailValue(userInfo?.email);
      setPhoneNumber(userInfo?.hp);

      if (userInfo?.post != '') {
        setAddrZip(userInfo?.post);
      }

      if (userInfo?.address != '') {
        setAddress(userInfo?.address1);
      }

      if (userInfo?.address2 != '') {
        setAddress2(userInfo?.address2);
      }

      setSns(userInfo?.sns);
    }
  }, []);

  const memberUpdateHandler = async () => {
    const formData = new FormData();
    formData.append('method', 'member_update');
    formData.append('id', userInfo.id);
    formData.append('cidx', userInfo.cidx);
    formData.append('email', emailValue);
    formData.append('post', addrZip);
    formData.append('address', address);
    formData.append('address2', address2);

    if (nowPwd != '' && newPwd != '' && reNewPwd != '') {
      formData.append('passwd', nowPwd);
      formData.append('new_passwd1', newPwd);
      formData.append('new_passwd2', reNewPwd);
    }

    const update = await member_update(formData);
    console.log('update', update);

    if (update.result) {
      member_info_handler();
      navigation.dispatch(
        StackActions.replace('TabNavi', {
          screen: 'Mypage',
        }),
      );
    }
  };

  const member_info_handler = async () => {
    const formData = new FormData();
    formData.append('method', 'member_info');
    formData.append('id', userInfo.id);
    formData.append('cidx', userInfo.cidx);

    const member_info_list = await member_info(formData);

    console.log('회원정보  확인:::', member_info_list);
  };

  return (
    <Box flex={1} backgroundColor="#fff" pt={top + 'px'}>
      <Header
        navigation={navigation}
        backButtonStatus={true}
        headerTitle={pageText != '' ? pageText[0] : '내 정보 수정'}
      />
      <KeyboardAwareScrollView>
        <Box p="20px">
          <Box>
            <FormInput
              labelOn={true}
              label={pageText != '' ? pageText[1] : '이름'}
              placeholder={
                pageText != '' ? pageText[2] : '이름을 입력해 주세요.'
              }
              value={nameVal}
              onChangeText={nameChangeEvent}
              inputStyle={[
                {lineHeight: 20, color: '#000'},
                nameVal.length > 0 && {backgroundColor: '#E9E9E9'},
              ]}
              editable={false}
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
              label={pageText != '' ? pageText[3] : '휴대 전화번호'}
              placeholder={
                pageText != '' ? pageText[4] : '휴대 전화번호를 입력해 주세요.'
              }
              value={phoneNumber}
              onChangeText={phoneNumberChange}
              inputStyle={[
                {lineHeight: 20, color: '#000'},
                phoneNumber.length > 0 && {backgroundColor: '#E9E9E9'},
              ]}
              editable={false}
              maxLength={13}
              inputButton={false}
              inputButtonText={pageText != '' ? pageText[5] : '인증받기'}
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
            />
            {/* <Box mt='10px'>
                            <FormInput 
                                labelOn={false}
                                label='인증번호 입력'
                                placeholder={ pageText != "" ? pageText[6] : '인증번호를 입력해 주세요.'}
                                value={certiNumber}
                                onChangeText={certiNumberChange}
                                editable={true}
                                maxLength={6}
                                inputButton={true}
                                inputButtonText={ pageText != "" ? pageText[7] : '확인'}
                                btnDisabled={ certiNumber.length > 0 ? false : true}
                                btnStyle={{backgroundColor: certiNumber.length > 0 ? colorSelect.navy : '#7E7E7E'} }
                            />
                        </Box> */}
          </Box>
          <Box style={[styles.inputMargin]}>
            <FormButton
              labelOn={true}
              label={pageText != '' ? pageText[8] : '생년월일'}
              text={birthday != '' ? birthday : '생년월일을 선택해주세요.'}
              btnStyle={birthday != '' && {backgroundColor: '#E9E9E9'}}
              txtStyle={birthday != '' && {color: '#000', lineHeight: 20}}
              labelHorizontal={true}
              labelIcon={true}
              labelIconUri={BASE_URL + '/images/birthIcon.png'}
              labelIconWidth={18}
              labelIconHeight={18}
              labelIconResize="contain"
              onPress={showBirthdayPicker}
              btndisabled={true}
            />
          </Box>
          <Box style={[styles.inputMargin]}>
            <FormInput
              labelOn={true}
              label={pageText != '' ? pageText[9] : '이메일'}
              placeholder={
                pageText != '' ? pageText[10] : '이메일을 입력해 주세요'
              }
              value={emailValue}
              onChangeText={emailChange}
              editable={sns != '' ? false : true}
              inputButton={sns != '' ? false : true}
              inputButtonText={pageText != '' ? pageText[21] : '중복확인'}
              inputStyle={[
                emailValue.length > 0 && {lineHeight: 20, color: '#000'},
                sns != '' && {backgroundColor: '#E9E9E9'},
              ]}
              btnDisabled={emailValue.length > 0 ? false : true}
              btnStyle={{
                backgroundColor:
                  emailValue.length > 0 ? colorSelect.navy : '#7E7E7E',
              }}
              labelHorizontal={true}
              labelIcon={true}
              labelIconUri={BASE_URL + '/images/emailIcon.png'}
              labelIconWidth={18}
              labelIconHeight={18}
              labelIconResize="contain"
            />
          </Box>
          <Box style={[styles.inputMargin]}>
            <FormInput
              labelOn={true}
              label={pageText != '' ? pageText[11] : '주소'}
              labelHorizontal={true}
              label2={pageText != '' ? ' ' + pageText[12] : ' (선택)'}
              placeholder={
                pageText != '' ? ' ' + pageText[13] : '주소를 입력하세요.'
              }
              value={addrZip}
              //onChangeText={phoneNumberChange}
              editable={false}
              inputStyle={{lineHeight: 20}}
              inputButton={true}
              inputButtonText={
                pageText != '' ? ' ' + pageText[22] : '주소 검색'
              }
              inputButtonPress={() => setAddrModal(true)}
              labelIcon={true}
              labelIconUri={BASE_URL + '/images/addrIcon.png'}
              labelIconWidth={18}
              labelIconHeight={18}
              labelIconResize="contain"
              label2on={true}
            />

            <Box mt="10px">
              <FormInput
                labelOn={false}
                label="상세 주소"
                placeholder={
                  pageText != ''
                    ? ' ' + pageText[14]
                    : '상세 주소를 입력해주세요.'
                }
                value={address}
                onChangeText={addressChange}
                editable={true}
                inputStyle={[address != '' && {lineHeight: 20}]}
              />
            </Box>
            <Box mt="10px">
              <FormInput
                labelOn={false}
                label="상세 주소"
                placeholder={
                  pageText != ''
                    ? ' ' + pageText[14]
                    : '상세 주소를 입력해주세요.'
                }
                value={address2}
                onChangeText={addressChange2}
                editable={true}
                inputStyle={[address2 != '' && {lineHeight: 20}]}
              />
            </Box>
          </Box>
          {userInfo?.sns == '' && (
            <Box style={[styles.inputMargin]}>
              <FormInput
                labelOn={true}
                label={pageText != '' ? ' ' + pageText[15] : '비밀번호 변경'}
                placeholder={
                  pageText != ''
                    ? ' ' + pageText[16]
                    : '현재 비밀번호를 입력해 주세요.'
                }
                value={nowPwd}
                onChangeText={nowPwdChange}
                editable={true}
                inputButton={false}
                secureTextEntry={true}
                labelHorizontal={true}
                labelIcon={true}
                labelIconUri={BASE_URL + '/images/passwordIcon.png'}
                labelIconWidth={18}
                labelIconHeight={18}
                labelIconResize="contain"
              />
              <Box mt="10px">
                <FormInput
                  labelOn={false}
                  //label={ "비밀번호 변경" }
                  placeholder={
                    pageText != ''
                      ? ' ' + pageText[17]
                      : '새 비밀번호를 입력해 주세요.'
                  }
                  value={newPwd}
                  onChangeText={newPwdChange}
                  editable={true}
                  inputButton={false}
                  secureTextEntry={true}
                />
              </Box>
              <Box mt="10px">
                <FormInput
                  labelOn={false}
                  //label={ "비밀번호 변경" }
                  placeholder={
                    pageText != ''
                      ? ' ' + pageText[18]
                      : '새 비밀번호를 다시 입력해 주세요.'
                  }
                  value={reNewPwd}
                  onChangeText={reNewPwdChange}
                  editable={true}
                  inputButton={false}
                  secureTextEntry={true}
                />
              </Box>
            </Box>
          )}
        </Box>
        <BoxLine />
        <Box py="10px">
          <DefButton
            text={pageText != '' ? ' ' + pageText[19] : '회원탈퇴'}
            txtStyle={[fsize.fs15, fweight.m, {color: '#FF5858'}]}
            onPress={() => navigation.navigate('AccountLeave')}
          />
        </Box>
      </KeyboardAwareScrollView>
      <DefButton
        text={pageText != '' ? ' ' + pageText[20] : '수정완료'}
        btnStyle={{backgroundColor: '#F1F1F1', borderRadius: 0}}
        onPress={memberUpdateHandler}
      />
      <DateTimePickerModal
        isVisible={birthdayPickerVisible}
        mode="date"
        onConfirm={birthdayPickerSelect}
        onCancel={hideBirthdayPicker}
        maximumDate={new Date()}
        display={'spinner'}
      />
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
                source={require('../../../images/menuClose.png')}
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
      <BottomNavi screenName={name} navigation={navigation} />
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
    languageSet: user => dispatch(UserAction.languageSet(user)), //언어설정
    member_update: user => dispatch(UserAction.member_update(user)), //회원정보 변경
    member_info: user => dispatch(UserAction.member_info(user)), //회원 정보 조회
  }),
)(AccountUpdate);
