import React, {useEffect, useState} from 'react';
import {Box, HStack} from 'native-base';
import {DefButton, DefText} from '../../../common/BOOTSTRAP';
import Header from '../../../components/Header';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {StyleSheet} from 'react-native';
import {fsize, fweight} from '../../../common/StyleCommon';
import BoxLine from '../../../components/BoxLine';
import FormInput from '../../../components/FormInput';
import Checkbox from '../../../components/Checkbox';
import {connect} from 'react-redux';
import {actionCreators as UserAction} from '../../../redux/module/action/UserAction';
import Api from '../../../Api';
import ToastMessage from '../../../components/ToastMessage';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import BottomNavi from '../../../components/bottom/BottomNavi';

//서비스 문의
const ServiceQaForm = props => {
  const {navigation, userInfo, user_lang, route} = props;
  const {name} = route;

  //앱 페이지 텍스트
  const [pageText, setPageText] = useState([]);

  const pageLanguage = async () => {
    //user_lang != null ? user_lang.cidx : userInfo.cidx
    await Api.send(
      'app_page',
      {
        cidx: user_lang != null ? user_lang.cidx : userInfo.cidx,
        code: 'serviceQa',
      },
      args => {
        let resultItem = args.resultItem;
        let arrItems = args.arrItems;

        if (resultItem.result === 'Y' && arrItems) {
          console.log('서비스 문의 언어 리스트: ', resultItem, arrItems.text);
          setPageText(arrItems.text);
        } else {
          console.log('서비스 문의 언어 리스트 실패!', resultItem);
        }
      },
    );
  };

  const [qaTitle, setQaTitle] = useState('');
  const qaTitleChangeEvent = title => {
    setQaTitle(title);
  };

  const [deviceInfo, setDeviceInfo] = useState('');
  const deviceInfoChangeEvent = device => {
    setDeviceInfo(device);
  };

  const [appVersion, setAppVersion] = useState('');
  const appVersionChangeEvent = version => {
    setAppVersion(version);
  };

  const [emailValue, setEmailValue] = useState('');
  const emailChange = email => {
    setEmailValue(email);
  };

  const [agree, setAgree] = useState(false);
  const agreeHandler = () => {
    setAgree(!agree);
  };

  useEffect(() => {
    pageLanguage();
  }, []);

  const serviceInquiryHandler = () => {
    if (qaTitle == '') {
      ToastMessage(pageText[4]);
      return false;
    }

    if (deviceInfo == '') {
      ToastMessage(pageText[6]);
      return false;
    }

    if (appVersion == '') {
      ToastMessage(pageText[10]);
      return false;
    }

    if (emailValue == '') {
      ToastMessage(pageText[12]);
      return false;
    }

    if (!agree) {
      ToastMessage(pageText[23]);
      return false;
    }

    Api.send(
      'member_cs',
      {
        id: userInfo.id,
        content: qaTitle,
        phone: deviceInfo,
        app: appVersion,
        email: emailValue,
        cidx: user_lang != null ? user_lang.cidx : userInfo.cidx,
      },
      args => {
        let resultItem = args.resultItem;
        let arrItems = args.arrItems;

        if (resultItem.result === 'Y' && arrItems) {
          console.log('서비스 문의하기 성공: ', resultItem, arrItems.text);
          //    /setPageText(arrItems.text);
          ToastMessage(pageText[22]);
          navigation.goBack();
        } else {
          console.log('서비스 문의하기 실패!', resultItem);
        }
      },
    );
  };

  const {top} = useSafeAreaInsets();

  return (
    <Box flex={1} backgroundColor="#fff" pt={top + 'px'}>
      <Header
        navigation={navigation}
        backButtonStatus={true}
        headerTitle={pageText != '' ? pageText[0] : '서비스 문의'}
      />
      <KeyboardAwareScrollView>
        <Box p="20px">
          <DefText
            text={
              pageText != ''
                ? pageText[1]
                : '케어해줘?를 사용하시면서 궁금한 점이 있으셨나요?'
            }
            style={[styles.pageTitle]}
            lh={user_lang?.cidx == 9 ? 30 : ''}
          />
          <Box mt="10px">
            <DefText
              text={
                pageText != ''
                  ? pageText[2]
                  : '케어해줘? 서비스 문의 및 개선 사항에 대해\n자유롭게 이야기해 주세요.'
              }
              style={[styles.pageSub]}
              lh={user_lang?.cidx == 9 ? 26 : ''}
            />
            {/* <DefText 
                            text={"전달 주신 소중한 의견 참고하여 서비스 개선에\n반영하도 록 하겠습니다."}
                            style={[styles.pageSub]}
                        /> */}
          </Box>
          <Box mt="10px">
            <DefText
              text={pageText != '' ? '*' + pageText[3] : '*필수항목'}
              style={[styles.pageRequire]}
              lh={user_lang?.cidx == 9 ? 26 : ''}
            />
          </Box>
        </Box>
        <BoxLine />
        <Box p="20px">
          <FormInput
            labelOn={true}
            label={pageText != '' ? pageText[4] : '문의하실 내용은 무엇인가요?'}
            required={true}
            subtext={
              pageText != ''
                ? pageText[5]
                : '문의 내용을 자세하게 남겨주시면 빠른 답변에 도움이 됩니다.'
            }
            placeholder={pageText != '' ? pageText[9] : '내 답변'}
            value={qaTitle}
            onChangeText={qaTitleChangeEvent}
            editable={true}
          />
          <Box style={[styles.inputMargin]}>
            <FormInput
              labelOn={true}
              label={
                pageText != ''
                  ? pageText[6]
                  : '사용중인 핸드폰 기종은 무엇인가요?'
              }
              required={true}
              subtext={
                pageText != ''
                  ? pageText[7]
                  : '버그 문의일 경우 빠른 확인을 위하여 핸드폰 기종을 알려주세요!'
              }
              extext={
                pageText != ''
                  ? pageText[8]
                  : '예시)갤럭시 S10 또는 아이폰 11Pro'
              }
              placeholder={pageText != '' ? pageText[9] : '내 답변'}
              value={deviceInfo}
              onChangeText={deviceInfoChangeEvent}
              editable={true}
            />
          </Box>
          <Box style={[styles.inputMargin]}>
            <FormInput
              labelOn={true}
              label={
                pageText != ''
                  ? pageText[10]
                  : '사용중인 앱 버전은 어떻게 되나요?'
              }
              required={true}
              subtext={
                pageText != ''
                  ? pageText[11]
                  : '(마이페이지 - 버전 정보에서 확인 가능합니다.)'
              }
              placeholder={pageText != '' ? pageText[9] : '내 답변'}
              value={appVersion}
              onChangeText={appVersionChangeEvent}
              editable={true}
            />
          </Box>
          <Box style={[styles.inputMargin]}>
            <FormInput
              labelOn={true}
              label={
                pageText != ''
                  ? pageText[12]
                  : '답변받으실 이메일 주소를 기입해 주세요.'
              }
              required={true}
              placeholder={pageText != '' ? pageText[9] : '내 답변'}
              value={emailValue}
              onChangeText={emailChange}
              editable={true}
            />
          </Box>
          <Box style={[styles.inputMargin]}>
            <HStack>
              <DefText
                text={
                  pageText != '' ? pageText[13] : '개인정보 수집 및 활용 동의'
                }
                style={[styles.labelTitle]}
                lh={user_lang?.cidx == 9 ? 30 : ''}
              />
              <DefText text="*" style={{color: '#E11B1B', marginLeft: 5}} />
            </HStack>
            <Box mt="5px">
              <DefText
                text={
                  pageText != '' ? pageText[14] : '개인정보 수집 항목 : 이메일'
                }
                style={[styles.labelText]}
                lh={user_lang?.cidx == 9 ? 26 : ''}
              />
              <DefText
                text={
                  pageText != ''
                    ? pageText[15]
                    : '수집 목적 : 문의하신 내용에 대한 안내'
                }
                style={[styles.labelText]}
                lh={user_lang?.cidx == 9 ? 26 : ''}
              />
              <HStack alignItems={'flex-start'} flexWrap="wrap">
                <DefText
                  text={pageText != '' ? pageText[16] + ' : ' : '이용기간 : '}
                  style={[styles.labelText]}
                  lh={user_lang?.cidx == 9 ? 26 : ''}
                />
                <Box width={'70%'}>
                  <DefText
                    text={
                      pageText != ''
                        ? pageText[21]
                        : '문의 내용 답변 완료 시 까지'
                    }
                    style={[styles.labelText]}
                    lh={user_lang?.cidx == 9 ? 26 : ''}
                  />
                  <DefText
                    text={
                      pageText != ''
                        ? pageText[17]
                        : '(단, 타법령에 의해 저장할 수 있음)'
                    }
                    style={[styles.labelText, fsize.fs12, {color: '#BEBEBE'}]}
                    lh={user_lang?.cidx == 9 ? 26 : ''}
                  />
                </Box>
              </HStack>
            </Box>
            <Box>
              <DefText
                text={
                  pageText != ''
                    ? pageText[18]
                    : '동의를 거부할 수 있으며, 동의 거부 시 문의에 대한\n답변을 받으실 수 없습니다. (정보 즉시 파기)\n동의 하시겠습니까?'
                }
                style={[styles.labelText, fweight.m, {lineHeight: 22}]}
                lh={user_lang?.cidx == 9 ? 26 : ''}
              />
            </Box>
          </Box>
          <Box mt="20px" pb="20px">
            <Checkbox
              checkboxText={pageText != '' ? pageText[19] : '네 동의 합니다.'}
              checkStatus={agree}
              onPress={agreeHandler}
              txtStyle={[fsize.fs14]}
            />
          </Box>
        </Box>
      </KeyboardAwareScrollView>
      <DefButton
        text={pageText != '' ? pageText[20] : '제출'}
        btnStyle={{backgroundColor: '#f1f1f1', borderRadius: 0}}
        onPress={serviceInquiryHandler}
        lh={user_lang?.cidx == 9 ? 48 : ''}
      />
      <BottomNavi screenName={name} navigation={navigation} />
    </Box>
  );
};

const styles = StyleSheet.create({
  pageTitle: {
    ...fweight.m,
  },
  pageSub: {
    ...fsize.fs14,
    lineHeight: 22,
    color: '#878787',
  },
  pageRequire: {
    ...fsize.fs13,
    lineHeight: 19,
    color: '#E11B1B',
  },
  inputMargin: {
    marginTop: 40,
  },
  labelTitle: {
    ...fweight.bold,
  },
  labelText: {
    ...fsize.fs14,
    marginTop: 5,
  },
});

export default connect(
  ({User}) => ({
    userInfo: User.userInfo, //회원정보
    user_lang: User.user_lang,
  }),
  dispatch => ({
    member_login: user => dispatch(UserAction.member_login(user)), //로그인
    languageSet: user => dispatch(UserAction.languageSet(user)), //선택언어
  }),
)(ServiceQaForm);
