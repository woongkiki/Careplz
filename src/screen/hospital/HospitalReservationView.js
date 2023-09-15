import React, {useEffect, useState} from 'react';
import {Image, ScrollView, StyleSheet, TouchableOpacity} from 'react-native';
import {Box, HStack, Modal} from 'native-base';
import {DefButton, DefText} from '../../common/BOOTSTRAP';
import Header from '../../components/Header';
import {
  colorSelect,
  deviceSize,
  fsize,
  fweight,
} from '../../common/StyleCommon';
import BoxLine from '../../components/BoxLine';
import FormInput from '../../components/FormInput';
import {BASE_URL} from '../../Utils/APIConstant';
import {phoneFormat} from '../../common/DataFunction';
import FormSelect from '../../components/FormSelect';
import ReservationConfirm from '../../components/reservation/ReservationConfirm';
import ReservationRequest from '../../components/reservation/ReservationRequest';
import ReservationCheck from '../../components/reservation/ReservationCheck';
import ReservationCancle from '../../components/reservation/ReservationCancle';
import {connect} from 'react-redux';
import {actionCreators as UserAction} from '../../redux/module/action/UserAction';
import Loading from '../../components/Loading';
import Api from '../../Api';
import ReservationEnd from '../../components/reservation/ReservationEnd';
import ToastMessage from '../../components/ToastMessage';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const HospitalReservationView = props => {
  const {navigation, userInfo, user_lang, route} = props;
  const {params} = route;

  //console.log(params);
  const [loading, setLoading] = useState(true);
  const [reserInfo, setReserInfo] = useState('');
  const [reserDate, setReserDate] = useState([]);
  const [reserTime, setReserTime] = useState([]);
  const [reserTimeArr, setReserTimeArr] = useState([]);
  const [commonText, setCommonText] = useState('');

  const [pageText, setPageText] = useState('');

  const appPageApi = () => {
    //user_lang != null ? user_lang?.cidx : userInfo?.cidx
    Api.send(
      'app_page',
      {
        cidx: user_lang != null ? user_lang?.cidx : userInfo?.cidx,
        code: 'hospitalReserConfirm',
      },
      args => {
        let resultItem = args.resultItem;
        let arrItems = args.arrItems;

        if (resultItem.result === 'Y' && arrItems) {
          //console.log('진료예약 예약상세 언어 리스트: ', resultItem, arrItems);
          setPageText(arrItems.text);
        } else {
          console.log('진료예약 예약상세 언어 리스트 실패!', resultItem);
        }
      },
    );
  };

  useEffect(() => {
    appPageApi();
  }, [user_lang]);

  const hospitalReservationApi = async () => {
    await setLoading(true);
    await Api.send(
      'hospital_reservationDetail',
      {
        idx: params.idx,
        id: userInfo.id,
        cidx: user_lang != null ? user_lang?.cidx : userInfo?.cidx,
      },
      args => {
        let resultItem = args.resultItem;
        let arrItems = args.arrItems;

        if (resultItem.result === 'Y' && arrItems) {
          console.log('병원 예약 상세: ', resultItem, arrItems);
          setReserInfo(arrItems);
          setReserDate(Object.keys(arrItems.time));
          setReserTime(Object.values(arrItems.time));
        } else {
          console.log('병원 예약 상세 실패!', resultItem);
        }
      },
    );
    await setLoading(false);
  };

  useEffect(() => {
    // console.log(reserDate, reserTime);

    let reserTimeArr = [];
    reserDate.map((item, index) => {
      return reserTimeArr.push(item + ' ' + reserTime[index]);
    });

    setReserTimeArr(reserTimeArr);
    //console.log("reserTimeArr", reserTimeArr);
  }, [reserDate, reserTime]);

  const [cancleModal, setCancleModal] = useState(false);
  const reservationCancleModal = () => {
    setCancleModal(true);
  };

  const reservationCancleHandler = () => {
    Api.send(
      'hospital_reservationCancel',
      {idx: params.idx, id: userInfo?.id},
      args => {
        let resultItem = args.resultItem;
        let arrItems = args.arrItems;

        if (resultItem.result === 'Y' && arrItems) {
          console.log('병원 예약 취소 성공: ', resultItem, arrItems);
          ToastMessage(pageText[22]);
          setCancleModal(false);
          hospitalReservationApi();
        } else {
          console.log('병원 예약 취소 실패!', resultItem);
        }
      },
    );
  };

  useEffect(() => {
    hospitalReservationApi();
  }, []);

  const {top} = useSafeAreaInsets();

  return (
    <Box flex={1} backgroundColor="#fff" pt={top + 'px'}>
      <Header
        headerTitle={pageText != '' ? pageText[16] : '병원 예약내역 상세'}
        navigation={navigation}
        backButtonStatus={true}
      />
      {loading ? (
        <Loading />
      ) : (
        <ScrollView>
          <Box px="20px" py="30px">
            {reserInfo.status == 'RA' && (
              <ReservationRequest
                reserTitle={pageText[0]}
                reserText={pageText[1]}
              />
            )}
            {reserInfo.status == 'RB' && (
              <ReservationCheck
                hospital={reserInfo.hname}
                subject={reserInfo.memo}
                rdate={reserInfo.rdate}
                rtime={reserInfo.rtime}
                reserTitle={pageText != '' ? pageText[2] : '예약확정'}
                cfText={pageText != '' ? pageText[3] : '예약이 확정되었습니다.'}
              />
            )}
            {reserInfo.status == 'RC' && (
              <ReservationCancle
                hospital={reserInfo.hname}
                //hename={reserInfo.hename}
                cmemo={reserInfo.cmemo}
                reserTitle={pageText != '' ? pageText[4] : '예약취소'}
                cancleTexts={
                  pageText != ''
                    ? pageText[5]
                    : '요청하신 예약이 취소되었습니다.'
                }
                reasons={pageText != '' ? pageText[6] : '취소 사유'}
              />
            )}
            {reserInfo.status == 'RD' && (
              <ReservationEnd
                hospital={reserInfo.hname}
                subject={reserInfo.memo}
                rdate={reserInfo.rdate}
                rtime={reserInfo.rtime}
                reserTile={pageText != '' ? pageText[17] : '예약 방문 완료'}
                endText={
                  pageText != '' ? pageText[19] : '진료가 완료되었습니다.'
                }
              />
            )}
          </Box>
          <BoxLine />
          <Box px="20px" py="30px">
            <Box>
              <ReservationConfirm
                icon={{uri: BASE_URL + '/images/rnameIcon.png'}}
                iconWidth={15}
                iconHeight={18}
                iconResize="contain"
                label={pageText != '' ? pageText[7] : '진료대상'}
                confirmText={userInfo?.name}
                dates={''}
              />
            </Box>
            <Box mt="30px">
              <ReservationConfirm
                icon={{uri: BASE_URL + '/images/phoneIconCheck.png'}}
                iconWidth={15}
                iconHeight={18}
                iconResize="contain"
                label={pageText != '' ? pageText[8] : '연락처'}
                confirmText={userInfo?.hp}
                dates={''}
              />
            </Box>
            <Box mt="30px">
              <ReservationConfirm
                icon={{uri: BASE_URL + '/images/hopistalTypeIcon.png'}}
                iconWidth={15}
                iconHeight={18}
                iconResize="contain"
                label={pageText != '' ? pageText[9] : '진료항목'}
                confirmText={reserInfo.rtype}
                dates={''}
              />
            </Box>
            {(reserInfo.memo != '' || reserInfo.memo != null) && (
              <Box mt="30px">
                <ReservationConfirm
                  icon={{uri: BASE_URL + '/images/contentIcon.png'}}
                  iconWidth={15}
                  iconHeight={18}
                  iconResize="contain"
                  label={pageText != '' ? pageText[10] : '전달사항'}
                  confirmText={reserInfo.memo}
                  dates={''}
                />
              </Box>
            )}

            <Box mt="30px">
              <ReservationConfirm
                icon={{uri: BASE_URL + '/images/dateIcons.png'}}
                iconWidth={17}
                iconHeight={18}
                iconResize="contain"
                label={pageText != '' ? pageText[11] : '선택일정'}
                confirmText={''}
                dates={reserTimeArr != '' ? reserTimeArr : ''}
              />
            </Box>
            <Box mt="40px">
              {reserInfo.status == 'RC' || reserInfo.status == 'RD' ? (
                <HStack alignItems={'center'} justifyContent="space-between">
                  <TouchableOpacity
                    style={[
                      styles.button,
                      {backgroundColor: colorSelect.pink_de},
                    ]}
                    onPress={() =>
                      navigation.navigate('HospitalInfo', {idx: reserInfo.hidx})
                    }>
                    <DefText
                      text={pageText != '' ? pageText[13] : '병원정보'}
                      style={[styles.buttonText]}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.button,
                      {backgroundColor: colorSelect.gray_dfdfdf},
                    ]}
                    onPress={() =>
                      navigation.navigate('HospitalInfo', {idx: reserInfo.hidx})
                    }>
                    <DefText
                      text={pageText != '' ? pageText[14] : '다시예약'}
                      style={[styles.buttonTex, {color: colorSelect.black}]}
                    />
                  </TouchableOpacity>
                </HStack>
              ) : (
                <HStack alignItems={'center'} justifyContent="space-between">
                  <TouchableOpacity
                    style={[
                      styles.button,
                      reserInfo.cancel
                        ? {backgroundColor: '#7e7e7e'}
                        : {backgroundColor: '#f1f1f1'},
                    ]}
                    disabled={reserInfo.cancel ? false : true}
                    onPress={reservationCancleModal}>
                    <DefText
                      text={pageText != '' ? pageText[12] : '예약취소'}
                      style={[
                        styles.buttonText,
                        reserInfo.cancel
                          ? {color: colorSelect.white}
                          : {color: '#aaa'},
                      ]}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.button,
                      {backgroundColor: colorSelect.pink_de},
                    ]}
                    onPress={() =>
                      navigation.navigate('HospitalInfo', {idx: reserInfo.hidx})
                    }>
                    <DefText
                      text={pageText != '' ? pageText[13] : '병원정보'}
                      style={[styles.buttonText]}
                    />
                  </TouchableOpacity>
                </HStack>
              )}
            </Box>
          </Box>
        </ScrollView>
      )}
      <Modal isOpen={cancleModal} onClose={() => setCancleModal(false)}>
        <Modal.Content width={deviceSize.deviceWidth - 40}>
          <Modal.Body px="20px" pt="30px" pb="20px">
            <Box>
              <DefText
                text={
                  pageText != '' ? pageText[21] : '예약을 취소하시겠습니까?'
                }
                style={{color: '#191919'}}
              />
            </Box>
            <HStack
              mt={'20px'}
              justifyContent={'space-between'}
              alignItems={'center'}>
              <TouchableOpacity
                style={[styles.modalButton, {backgroundColor: '#F1F1F1'}]}
                onPress={() => setCancleModal(false)}>
                <DefText
                  text={pageText != '' ? pageText[20] : '취소'}
                  style={{...fweight.m}}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modalButton,
                  {backgroundColor: colorSelect.navy},
                ]}
                onPress={reservationCancleHandler}>
                <DefText
                  text={pageText != '' ? pageText[15] : '확인'}
                  style={{color: colorSelect.white, ...fweight.m}}
                />
              </TouchableOpacity>
            </HStack>
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </Box>
  );
};

const styles = StyleSheet.create({
  titleBold: {
    ...fweight.bold,
  },
  grayText: {
    ...fsize.fs14,
    color: '#6C6C6C',
    marginTop: 10,
  },
  infoBox: {
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderRadius: 5,
    backgroundColor: '#E9E9E9',
  },
  infoBoxText: {
    ...fsize.fs15,
  },
  button: {
    width: (deviceSize.deviceWidth - 40) * 0.48,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    lineHeight: 52,
  },
  buttonText: {
    color: '#fff',
    ...fweight.m,
  },
  modalButton: {
    width: '48%',
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
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
)(HospitalReservationView);
