import React, {useEffect, useState} from 'react';
import {Box, HStack, Modal} from 'native-base';
import {DefButton, DefText} from '../../common/BOOTSTRAP';
import DeviceInfo from 'react-native-device-info';
import {useIsFocused} from '@react-navigation/native';
import Loading from '../../components/Loading';
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Linking,
  useWindowDimensions,
  Platform,
} from 'react-native';
import Header from '../../components/Header';
import BoxLine from '../../components/BoxLine';
import {
  colorSelect,
  deviceSize,
  fsize,
  fweight,
} from '../../common/StyleCommon';
import MenuButton from '../../components/MenuButton';
import VersionCheck from 'react-native-version-check';
import {connect} from 'react-redux';
import {actionCreators as UserAction} from '../../redux/module/action/UserAction';
import ToastMessage from '../../components/ToastMessage';
import Api from '../../Api';
import {BASE_URL} from '../../Utils/APIConstant';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import FormInput from '../../components/FormInput';
import KakaoLoginButton from '../../components/KakaoLoginButton';
import LineLoginButton from '../../components/LineLoginButton';
import GoogleLoginButton from '../../components/GoogleLoginButton';
import AppleLoginButton from '../../components/AppleLoginButton';
import BottomNavi from '../../components/bottom/BottomNavi';

let version = VersionCheck.getCurrentVersion(); //앱 버전정보

const Mypage = props => {
  const {navigation, userInfo, user_lang, member_logout, notichk, route} =
    props;
  const {name} = route;

  console.log('route', name);
  //console.log("userInfo Mypage::", userInfo);

  //전화연결
  const callHandler = number => {
    //console.log(number);
    Linking.openURL(`tel:${number}`);
  };

  //앱 페이지 텍스트
  const [pageText, setPageText] = useState([]);
  const [pageText2, setPageText2] = useState([]);

  const pageLanguage = async () => {
    //user_lang != null ? user_lang.cidx : userInfo.cidx
    await Api.send(
      'app_page',
      {
        cidx: user_lang != null ? user_lang.cidx : userInfo.cidx,
        code: 'mypage',
      },
      args => {
        let resultItem = args.resultItem;
        let arrItems = args.arrItems;

        if (resultItem.result === 'Y' && arrItems) {
          //console.log('마이페이지 언어 리스트: ', resultItem, arrItems.text);
          setPageText(arrItems.text);
        } else {
          console.log('마이페이지 수정 언어 리스트 실패!', resultItem);
        }
      },
    );

    await Api.send(
      'app_page',
      {cidx: user_lang != null ? user_lang.cidx : 0, code: 'login'},
      args => {
        let resultItem = args.resultItem;
        let arrItems = args.arrItems;

        if (resultItem.result === 'Y' && arrItems) {
          console.log('회원가입 언어 리스트: ', resultItem, arrItems);
          setPageText2(arrItems.text);
        } else {
          console.log('회원가입 언어 리스트 실패!', resultItem);
        }
      },
    );
  };

  const isFocused = useIsFocused();

  const [loading, setLoading] = useState(true);

  const [mypageInfo, setMypageInfo] = useState('');

  //마이페이지 정보
  const mypageApiHandler = async () => {
    await setLoading(true);
    Api.send('member_mypage', {id: userInfo?.id}, args => {
      let resultItem = args.resultItem;
      let arrItems = args.arrItems;

      if (resultItem.result === 'Y' && arrItems) {
        console.log('마이페이지 정보 가져오기 성공: ', resultItem, arrItems);
        //setPageText(arrItems.text);
        setMypageInfo(arrItems);
      } else {
        console.log('마이페이지 정보 가져오기 실패!', resultItem);
        setMypageInfo('');
      }
    });
    await setLoading(false);
  };

  //알림 체크
  const notiChkHandler = async () => {
    const formData = new FormData();
    formData.append('id', userInfo?.id);
    formData.append('method', 'member_notichk');

    const chat_cnt = await notichk(formData);

    console.log('마이페이지 예약 체크::::', chat_cnt);
  };

  useEffect(() => {
    if (isFocused) {
      mypageApiHandler();
      pageLanguage();
      notiChkHandler();
      //console.log("userInfo", userInfo)
    }
  }, [isFocused]);

  //로그아웃..
  const [logoutModal, setLogoutModal] = useState(false);
  const logOutHandler = async () => {
    const logout = await member_logout(true);

    setLogoutModal(false);

    ToastMessage('로그아웃 합니다.');

    navigation.reset({
      routes: [{name: 'Intro'}],
    });
  };

  const {top, bottom} = useSafeAreaInsets();

  //로그인
  const [idValue, setIdValue] = useState('');
  const idChangeEvent = id => {
    setIdValue(id);
  };

  //비밀번호 입력
  const [passwordValue, setPasswordValue] = useState('');

  const passwordChangeEvent = password => {
    setPasswordValue(password);
  };

  return (
    <Box flex={1} backgroundColor="#fff" pt={top + 'px'}>
      <Header
        navigation={navigation}
        headerTitle={pageText != '' ? pageText[0] : '마이페이지'}
      />
      {loading ? (
        <Loading />
      ) : (
        <ScrollView>
          {mypageInfo != '' ? (
            <Box p={'20px'}>
              <HStack alignItems={'center'} justifyContent="space-between">
                <Box width="70%">
                  <HStack alignItems={'flex-end'} flexWrap="wrap">
                    <Box>
                      <DefText
                        text={mypageInfo != '' && mypageInfo.name}
                        style={[styles.mypageName]}
                      />
                    </Box>
                    <DefText
                      text={mypageInfo != '' && mypageInfo.birthday}
                      style={[styles.mypageYear]}
                    />
                  </HStack>
                  <Box>
                    <DefText
                      text={mypageInfo != '' && mypageInfo.country}
                      style={[styles.mypageNation]}
                    />
                  </Box>
                </Box>
                <TouchableOpacity
                  style={[styles.insertButton]}
                  onPress={() => navigation.navigate('AccountUpdate')}>
                  <DefText
                    text={pageText != '' ? pageText[1] : '수정'}
                    style={[
                      fsize.fs13,
                      {color: colorSelect.white, lineHeight: 33},
                    ]}
                    lh={user_lang?.cidx == 9 ? 30 : ''}
                  />
                </TouchableOpacity>
              </HStack>
            </Box>
          ) : (
            <Box p="20px">
              <Box>
                <FormInput
                  labelOn={true}
                  label={pageText2 != '' ? pageText2[0] : '아이디'}
                  placeholder={
                    pageText2 != '' ? pageText2[1] : '아이디를 입력해 주세요.'
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
                  inputStyle={{lineHeight: idValue.length > 0 ? 20 : 18}}
                />
              </Box>
              <Box mt="15px">
                <FormInput
                  labelOn={true}
                  label={pageText2 != '' ? pageText2[2] : '비밀번호'}
                  placeholder={
                    pageText2 != '' ? pageText2[3] : '비밀번호를 입력해 주세요.'
                  }
                  value={passwordValue}
                  onChangeText={passwordChangeEvent}
                  editable={true}
                  secureTextEntry={true}
                  labelHorizontal={true}
                  labelIcon={true}
                  labelIconUri={BASE_URL + '/images/passwordIcon.png'}
                  labelIconWidth={18}
                  labelIconHeight={18}
                  labelIconResize="contain"
                />
              </Box>
              <Box mt="15px">
                <DefButton
                  text={pageText2 != '' ? pageText2[4] : '로그인'}
                  btnStyle={[
                    {
                      backgroundColor: colorSelect.gray_dfdfdf,
                    },
                  ]}
                  txtStyle={[fweight.bold]}
                  //onPress={loginHandler}
                  lh={user_lang?.cidx == 9 ? 50 : ''}
                />
              </Box>
              <HStack
                justifyContent={'space-around'}
                mt="10px"
                flexWrap={'wrap'}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('Register', '')}
                  style={{marginTop: 10}}>
                  <DefText
                    text={pageText2 != '' ? pageText2[5] : '회원가입'}
                    style={[styles.btnText]}
                    lh={user_lang?.cidx == 9 ? 30 : ''}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => navigation.navigate('IdSearch')}
                  style={{marginTop: 10}}>
                  <DefText
                    text={pageText2 != '' ? pageText2[6] : '아이디 찾기'}
                    style={[styles.btnText]}
                    lh={user_lang?.cidx == 9 ? 30 : ''}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => navigation.navigate('PasswordSearch')}
                  style={{marginTop: 10}}>
                  <DefText
                    text={pageText2 != '' ? pageText2[7] : '비밀번호 찾기'}
                    style={[styles.btnText]}
                    lh={user_lang?.cidx == 9 ? 30 : ''}
                  />
                </TouchableOpacity>
              </HStack>
              <Box mt="20px">
                <DefText
                  text={
                    pageText2 != '' ? pageText2[8] : 'SNS 계정으로 간편 로그인'
                  }
                  style={[styles.snsTitle]}
                  lh={user_lang?.cidx == 9 ? 30 : ''}
                />
              </Box>
              {Platform.OS === 'android' ? (
                <HStack alignItems={'center'} justifyContent="center" mt="20px">
                  <KakaoLoginButton navigation={navigation} />
                  {/* <NaverLoginButton navigation={navigation} /> */}
                  <LineLoginButton navigation={navigation} />
                  <Box ml="15px">
                    <GoogleLoginButton navigation={navigation} />
                  </Box>
                </HStack>
              ) : (
                <Box>
                  <HStack
                    alignItems={'center'}
                    justifyContent="center"
                    mt="20px">
                    <KakaoLoginButton navigation={navigation} />
                    {/* <NaverLoginButton navigation={navigation} /> */}
                    <Box mr="15px">
                      <LineLoginButton navigation={navigation} />
                    </Box>
                    <GoogleLoginButton navigation={navigation} />
                    <AppleLoginButton navigation={navigation} />
                  </HStack>
                </Box>
              )}
            </Box>
          )}

          <BoxLine />
          {mypageInfo != '' && (
            <Box>
              {mypageInfo.mngname != '' && (
                <>
                  <Box p="20px">
                    <DefText
                      text={pageText != '' ? pageText[13] : '담당자'}
                      style={[fsize.fs15, {color: '#858D9B', marginBottom: 10}]}
                      lh={user_lang?.cidx == 9 ? 28 : 23}
                    />
                    <HStack
                      alignItems={'center'}
                      justifyContent="space-between"
                      flexWrap={'wrap'}>
                      <TouchableOpacity
                        onPress={() => navigation.navigate('Manager')}
                        style={{width: '55%'}}>
                        <HStack alignItems={'center'} flexWrap="wrap">
                          <Box width="30%">
                            {mypageInfo.mngimg != '' && (
                              <Image
                                source={{uri: mypageInfo.mngimg}}
                                style={{
                                  width: 48,
                                  height: 48,
                                  resizeMode: 'cover',
                                  borderRadius: 48,
                                }}
                              />
                            )}
                          </Box>
                          <Box width="70%">
                            <DefText
                              text={mypageInfo != '' && mypageInfo.mngname}
                            />
                          </Box>
                        </HStack>
                      </TouchableOpacity>
                      <Box width="45%">
                        <TouchableOpacity
                          style={[styles.callButton]}
                          onPress={() => callHandler(mypageInfo.mnghp)}>
                          <HStack>
                            <Box
                              mr="10px"
                              justifyContent={'center'}
                              alignItems={'center'}>
                              <Image
                                source={require('../../images/phoneIconWhite.png')}
                                style={{
                                  width: 15,
                                  height: 15,
                                  resizeMode: 'contain',
                                }}
                              />
                            </Box>
                            <DefText
                              text={pageText != '' ? pageText[14] : '전화연결'}
                              style={[
                                fsize.fs13,
                                {color: colorSelect.white, lineHeight: 33},
                              ]}
                            />
                          </HStack>
                        </TouchableOpacity>
                      </Box>
                    </HStack>
                  </Box>
                  <BoxLine />
                </>
              )}
            </Box>
          )}

          <Box px="20px">
            {mypageInfo != '' && (
              <>
                <MenuButton
                  btnText={pageText != '' ? pageText[2] : '나의 예약내역'}
                  btnStyle={{
                    borderBottomWidth: 1,
                    borderBottomColor: '#E3E3E3',
                  }}
                  onPress={() => navigation.navigate('MyReservationList')}
                  notichk={mypageInfo != '' ? mypageInfo.todaycnt : ''}
                  icon={BASE_URL + '/newImg/mypageIcon01.png'}
                  iconWidth={21}
                  iconHeight={22}
                />
                {/* <MenuButton
                  btnText={pageText != '' ? pageText[3] : '카드 등록하기'}
                  onPress={() => navigation.navigate('CardForm')}
                  notichk={''}
                /> */}
                <MenuButton
                  btnText={pageText != '' ? pageText[4] : '나의 찜'}
                  onPress={() => navigation.navigate('WishList')}
                  notichk={''}
                  icon={BASE_URL + '/newImg/mypageIcon02.png'}
                  iconWidth={24}
                  iconHeight={22}
                />
                <MenuButton
                  btnText={pageText != '' ? pageText[18] : '나의 리뷰'}
                  onPress={() => navigation.navigate('MyReview')}
                  notichk={''}
                  icon={BASE_URL + '/newImg/mypageIcon03.png'}
                  iconWidth={26}
                  iconHeight={26}
                />
                <MenuButton
                  btnText={pageText != '' ? pageText[5] : '서비스 문의'}
                  onPress={() => navigation.navigate('ServiceQaForm')}
                  notichk={''}
                  icon={BASE_URL + '/newImg/mypageIcon04.png'}
                  iconWidth={22}
                  iconHeight={22}
                />
                <MenuButton
                  btnText={pageText != '' ? pageText[6] : '알림 설정'}
                  onPress={() => navigation.navigate('NotificationSetting')}
                  notichk={''}
                  btnStyle={{
                    borderBottomWidth: 1,
                    borderBottomColor: '#E3E3E3',
                  }}
                  icon={BASE_URL + '/newImg/mypageIcon05.png'}
                  iconWidth={17}
                  iconHeight={20}
                />
              </>
            )}

            <MenuButton
              btnText={pageText != '' ? pageText[7] : '약관 및 정책'}
              onPress={() => navigation.navigate('PolicyList')}
              notichk={''}
            />
            <MenuButton
              btnText={pageText != '' ? pageText[8] : '공지사항'}
              onPress={() => navigation.navigate('NoticeList')}
              notichk={''}
            />
          </Box>
          <Box px="20px">
            {mypageInfo != '' && (
              <HStack
                py="20px"
                justifyContent={'space-between'}
                alignItems="center"
                borderBottomWidth={1}
                borderBottomColor="#e3e3e3">
                <HStack
                  alignItems="center"
                  justifyContent={'space-between'}
                  width="22%">
                  <Box mr="10px">
                    <DefText
                      text={pageText != '' ? pageText[9] + ' ' : '앱 버전 '}
                      style={[fsize.fs15, fweight.m]}
                      lh={user_lang?.cidx == 9 ? 28 : ''}
                    />
                  </Box>
                  <DefText text={mypageInfo.app_ver} style={[fsize.fs15]} />
                </HStack>
                <Box width="70%" alignItems={'flex-end'}>
                  <DefText
                    text={pageText != '' ? pageText[10] : '최신 버전입니다.'}
                    style={[fsize.fs15, {color: '#969696'}]}
                    lh={user_lang?.cidx == 9 ? 28 : ''}
                  />
                </Box>
              </HStack>
            )}

            {mypageInfo != '' && (
              <MenuButton
                btnText={pageText != '' ? pageText[12] : '로그아웃'}
                txtStyle={{color: '#FF5858'}}
                arrIconNo
                onPress={() => setLogoutModal(true)}
                notichk={''}
              />
            )}
          </Box>
        </ScrollView>
      )}
      {/* <BottomNavi screenName={name} navigation={navigation} /> */}
      <Modal isOpen={logoutModal} onClose={() => setLogoutModal(false)}>
        <Modal.Content width={deviceSize.deviceWidth - 40} p="0">
          <Modal.Body p="20px">
            <Box>
              <Box
                pb="20px"
                borderBottomWidth={1}
                borderBottomColor="#ccc"
                alignItems={'center'}>
                <DefText
                  text={pageText != '' ? pageText[12] : '로그아웃'}
                  style={[fsize.fs17, fweight.bold]}
                  lh={user_lang?.cidx == 9 ? 32 : 32}
                />
              </Box>
              <Box mt="20px">
                <DefText
                  text={
                    pageText != ''
                      ? pageText[15]
                      : '정말 로그아웃 하시겠습니까??\n케어해줘? 관련 푸시 알림을 받을 수 없습니다.'
                  }
                  style={[
                    {textAlign: 'center', color: '#191919', lineHeight: 24},
                    fsize.fs14,
                  ]}
                  lh={user_lang?.cidx == 9 ? 27 : 27}
                />
              </Box>
              <HStack mt="30px" justifyContent={'space-between'}>
                <DefButton
                  text={pageText != '' ? pageText[17] : '취소'}
                  btnStyle={[
                    styles.modalButton,
                    {width: '48%', backgroundColor: '#F1F1F1'},
                  ]}
                  onPress={() => setLogoutModal(false)}
                  lh={user_lang?.cidx == 9 ? 40 : 40}
                />
                <DefButton
                  text={pageText != '' ? pageText[16] : '확인'}
                  btnStyle={[
                    styles.modalButton,
                    {width: '48%', backgroundColor: colorSelect.navy},
                  ]}
                  txtStyle={[fweight.m, {color: colorSelect.white}]}
                  onPress={logOutHandler}
                  lh={user_lang?.cidx == 9 ? 40 : 40}
                />
              </HStack>
            </Box>
          </Modal.Body>
        </Modal.Content>
      </Modal>

      {/* {mypageInfo == '' && (
        <Box
          style={{
            width: deviceSize.deviceWidth,
            height: deviceSize.deviceHeight - bottom,
            backgroundColor: 'rgba(255,255,255,0.8)',
            position: 'absolute',
            top: top,
            left: 0,
            padding: 20,
          }}>
          <Box mt="55px" justifyContent={'center'} alignItems="center">
            <Image
              source={{uri: BASE_URL + '/images/mainLogoNavy.png'}}
              style={{
                width: deviceSize.deviceWidth / 1.84,
                height: deviceSize.deviceWidth / 1.84 / 4,
                resizeMode: 'stretch',
              }}
            />
          </Box>
          <Box mt="70px">
            <FormInput
              labelOn={true}
              label={'아이디'}
              placeholder={'아이디를 입력해 주세요.'}
              value={idValue}
              onChangeText={idChangeEvent}
              editable={true}
              labelHorizontal={true}
              labelIcon={true}
              labelIconUri={BASE_URL + '/images/idIcon2.png'}
              labelIconWidth={18}
              labelIconHeight={18}
              labelIconResize="contain"
              inputStyle={{lineHeight: idValue.length > 0 ? 20 : 18}}
            />
          </Box>
        </Box>
      )} */}
    </Box>
  );
};

const styles = StyleSheet.create({
  mypageName: {
    ...fsize.fs24,
    ...fweight.bold,
    lineHeight: 28,
    marginRight: 5,
  },
  mypageYear: {
    color: '#434856',
  },
  mypageNation: {
    ...fweight.m,
    color: '#434856',
    marginTop: 5,
  },
  insertButton: {
    //width:54,
    paddingHorizontal: 10,
    height: 33,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 17,
    backgroundColor: '#B2BBC8',
  },
  callButton: {
    //width:98,
    //paddingHorizontal: 5,
    height: 33,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 17,
    backgroundColor: colorSelect.pink_de,
  },
  modalButton: {
    height: 50,
  },
  btnText: {
    ...fsize.fs15,
    ...fweight.m,
  },
  snsTitle: {
    ...fsize.fs15,
    ...fweight.m,
    color: '#606060',
    textAlign: 'center',
  },
});

export default connect(
  ({User}) => ({
    userInfo: User.userInfo, //회원정보
    user_lang: User.user_lang,
  }),
  dispatch => ({
    member_login: user => dispatch(UserAction.member_login(user)), //로그인
    languageSet: user => dispatch(UserAction.languageSet(user)), //언어
    member_logout: user => dispatch(UserAction.member_logout(user)), //로그아웃
    notichk: user => dispatch(UserAction.notichk(user)),
  }),
)(Mypage);
