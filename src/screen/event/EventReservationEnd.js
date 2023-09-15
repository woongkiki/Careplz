import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {actionCreators as UserAction} from '../../redux/module/action/UserAction';
import {Box, HStack, Modal} from 'native-base';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {DefText} from '../../common/BOOTSTRAP';
import Header from '../../components/Header';
import {Image, ScrollView, StyleSheet, TouchableOpacity} from 'react-native';
import {
  colorSelect,
  deviceSize,
  fsize,
  fweight,
} from '../../common/StyleCommon';
import ReservationConfirm from '../../components/reservation/ReservationConfirm';
import {BASE_URL} from '../../Utils/APIConstant';
import Api from '../../Api';

const EventReservationEnd = props => {
  const {navigation, userInfo, user_lang, route} = props;
  const {params} = route;

  const {top} = useSafeAreaInsets();

  const [pageText, setPageText] = useState([]);
  const [eventEnd, setEventEnd] = useState('');
  const [cancleModal, setCancleModal] = useState(false);
  const [editModal, setEditModal] = useState(false);

  const pageTextApi = async () => {
    //user_lang != null ? user_lang.cidx : userInfo.cidx
    await Api.send(
      'app_page',
      {
        cidx: user_lang != null ? user_lang.cidx : userInfo.cidx,
        code: 'eventReserEnd',
      },
      args => {
        let resultItem = args.resultItem;
        let arrItems = args.arrItems;

        if (resultItem.result === 'Y' && arrItems) {
          console.log('이벤트 완료 언어 리스트: ', resultItem, arrItems.text);
          setPageText(arrItems.text);
        } else {
          console.log('이벤트 완료 언어 리스트 실패!', resultItem);
        }
      },
    );

    //이벤트 예약완료
    await Api.send(
      'event_newReservation03',
      {
        cidx: user_lang != null ? user_lang.cidx : userInfo.cidx,
        id: userInfo.id,
      },
      args => {
        let resultItem = args.resultItem;
        let arrItems = args.arrItems;

        if (resultItem.result === 'Y' && arrItems) {
          console.log('이벤트 완료 내역: ', resultItem, arrItems);
          setEventEnd(arrItems);
        } else {
          console.log('이벤트 완료 내역 failed', resultItem);
        }
      },
    );
  };

  //예약 수정
  const reservationModify = () => {
    navigation.navigate('EventReservation', {
      idx: eventEnd.heidx,
      ridx: eventEnd.idx,
    });

    setEditModal(false);
  };

  //예약취소
  const reservationCancleHandler = () => {
    console.log('취소 API!!');
  };

  //메인으로
  const mainMove = () => {
    // navigation.navigate('TabNavi', {
    //   screen: 'Event',
    // });
    navigation.reset({
      routes: [
        {
          name: 'TabNavi',
          screen: 'Event',
        },
      ],
    });
  };

  useEffect(() => {
    pageTextApi();
  }, []);

  return (
    <Box flex={1} backgroundColor={'#fff'} pt={top + 'px'}>
      {/* <Header headerTitle={'이벤트 예약 완료'} /> */}
      <ScrollView>
        <Box p="20px">
          <Box alignItems={'center'} mt="20px">
            <Image
              source={{uri: BASE_URL + '/newImg/calendar_new.png'}}
              style={{
                width: 73,
                height: 83,
                resizeMode: 'contain',
              }}
            />
          </Box>

          <Box alignItems={'center'} my="20px">
            <DefText
              text={'예약신청 완료'}
              style={[fsize.fs19, fweight.bold, {lineHeight: 27}]}
            />
          </Box>

          <DefText
            text={userInfo?.name + ' ' + pageText[0]}
            style={{
              textAlign: 'center',
              lineHeight: user_lang.cidx == 9 ? 30 : 27,
            }}
          />

          <Box mt="30px">
            <ReservationConfirm
              icon={{uri: BASE_URL + '/images/event_name_Icon.png'}}
              iconWidth={22}
              iconHeight={22}
              iconResize="contain"
              label={pageText != '' ? pageText[1] : '이벤트명'}
              confirmText={eventEnd.name}
              dates={''}
              userlang={user_lang.cidx}
            />
          </Box>
          <Box mt="30px">
            <ReservationConfirm
              icon={{uri: BASE_URL + '/images/hospital_icons.png'}}
              iconWidth={22}
              iconHeight={22}
              iconResize="contain"
              label={pageText != '' ? pageText[2] : '병원명'}
              confirmText={eventEnd.hname}
              dates={''}
              userlang={user_lang.cidx}
            />
          </Box>
          <Box mt="30px">
            <ReservationConfirm
              icon={{uri: BASE_URL + '/images/slect_schedule_icons.png'}}
              iconWidth={22}
              iconHeight={22}
              iconResize="contain"
              label={pageText != '' ? pageText[3] : '선택일정'}
              confirmText={eventEnd.datetime}
              dates={''}
              userlang={user_lang.cidx}
            />
          </Box>
          <HStack flexWrap={'wrap'} mt="30px">
            <TouchableOpacity
              disabled={!eventEnd.cancelable}
              style={[
                styles.buttons,
                {
                  backgroundColor: '#BBBBBB',
                  marginRight: (deviceSize.deviceWidth - 40) * 0.02,
                },
              ]}
              onPress={() => setCancleModal(true)}>
              <DefText
                text={pageText != '' ? pageText[4] : '예약취소'}
                style={[styles.buttonText, user_lang == 9 && {lineHeight: 28}]}
              />
            </TouchableOpacity>
            <TouchableOpacity
              disabled={!eventEnd.editable}
              style={[styles.buttons, {backgroundColor: '#BBBBBB'}]}
              onPress={() => setEditModal(true)}>
              <DefText
                text={pageText != '' ? pageText[5] : '예약변경'}
                style={[styles.buttonText, user_lang == 9 && {lineHeight: 28}]}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('HospitalInfo', {idx: eventEnd.hidx})
              }
              style={[
                styles.buttons,
                {
                  backgroundColor: colorSelect.pink_de,
                  marginRight: (deviceSize.deviceWidth - 40) * 0.02,
                },
              ]}>
              <DefText
                text={pageText != '' ? pageText[6] : '병원정보'}
                style={[styles.buttonText, user_lang == 9 && {lineHeight: 28}]}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={mainMove}
              style={[styles.buttons, {backgroundColor: colorSelect.pink_de}]}>
              <DefText
                text={pageText != '' ? pageText[7] : '메인으로'}
                style={[styles.buttonText, user_lang == 9 && {lineHeight: 28}]}
              />
            </TouchableOpacity>
          </HStack>
        </Box>
      </ScrollView>

      {/* 예약취소모달 */}
      <Modal isOpen={cancleModal} onClose={() => setCancleModal(false)}>
        <Modal.Content width={deviceSize.deviceWidth - 40}>
          <Modal.Body px="20px" pt="30px" pb="20px">
            <Box>
              <DefText
                text={'예약을 취소하시겠습니까?'}
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
                <DefText text={'취소'} style={{...fweight.m}} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={reservationCancleHandler}
                style={[
                  styles.modalButton,
                  {backgroundColor: colorSelect.navy},
                ]}>
                <DefText
                  text={'확인'}
                  style={{color: colorSelect.white, ...fweight.m}}
                />
              </TouchableOpacity>
            </HStack>
          </Modal.Body>
        </Modal.Content>
      </Modal>

      {/* 예약변경모달 */}
      <Modal isOpen={editModal} onClose={() => setEditModal(false)}>
        <Modal.Content width={deviceSize.deviceWidth - 40}>
          <Modal.Body px="20px" pt="30px" pb="20px">
            <Box>
              <DefText
                text={'예약을 변경하시겠습니까?'}
                style={{color: '#191919'}}
              />
            </Box>
            <HStack
              mt={'20px'}
              justifyContent={'space-between'}
              alignItems={'center'}>
              <TouchableOpacity
                style={[styles.modalButton, {backgroundColor: '#F1F1F1'}]}
                onPress={() => setEditModal(false)}>
                <DefText text={'취소'} style={{...fweight.m}} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={reservationModify}
                style={[
                  styles.modalButton,
                  {backgroundColor: colorSelect.navy},
                ]}>
                <DefText
                  text={'확인'}
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
  buttons: {
    width: (deviceSize.deviceWidth - 40) * 0.49,
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: (deviceSize.deviceWidth - 40) * 0.02,
  },
  buttonText: {
    ...fsize.fs15,
    ...fweight.m,
    lineHeight: 19,
    color: colorSelect.white,
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
)(EventReservationEnd);
