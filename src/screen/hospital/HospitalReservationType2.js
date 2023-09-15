import {Box, CheckIcon, HStack} from 'native-base';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import Header from '../../components/Header';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ScrollView, StyleSheet} from 'react-native';
import {DefButton, DefText, LabelTitle} from '../../common/BOOTSTRAP';
import Api from '../../Api';
import {connect} from 'react-redux';
import {actionCreators as UserAction} from '../../redux/module/action/UserAction';
import {
  colorSelect,
  deviceSize,
  fsize,
  fweight,
} from '../../common/StyleCommon';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {TouchableOpacity} from 'react-native';
import ToastMessage from '../../components/ToastMessage';
import BottomNavi from '../../components/bottom/BottomNavi';

const HospitalReservationType2 = props => {
  const {navigation, userInfo, user_lang, route} = props;
  const {name, params} = route;
  const {top} = useSafeAreaInsets();

  console.log('params', params);

  const [pageText, setPageText] = useState([]);
  const [reserType, setReserType] = useState('');
  const [clinicSelect, setClinicSelect] = useState('교정');

  const pageApi = async () => {
    await Api.send(
      'app_page',
      {
        cidx: user_lang != null ? user_lang?.cidx : userInfo?.cidx,
        code: 'hospitalReserType',
      },
      args => {
        let resultItem = args.resultItem;
        let arrItems = args.arrItems;

        if (resultItem.result === 'Y' && arrItems) {
          console.log('진료선택 언어 리스트: ', resultItem, arrItems);
          setPageText(arrItems.text);
        } else {
          console.log('진료선택 언어 리스트 실패!', resultItem);
        }
      },
    );
  };

  //예약신청타입 신청
  const reserTypeHandler = type => {
    setReserType(type);
  };

  const nextReservation = () => {
    if (reserType == '') {
      ToastMessage('방문한적이 있는지 선택하세요.');
      return false;
    }

    console.log(reserType);

    Api.send(
      'hospital_newReservation01',
      {
        cidx: user_lang != null ? user_lang?.cidx : userInfo?.cidx,
        id: userInfo?.id,
        idx: params?.hidx,
        visit: reserType,
      },
      args => {
        let resultItem = args.resultItem;
        let arrItems = args.arrItems;

        if (resultItem.result === 'Y' && arrItems) {
          console.log('예약신청 진료여부 체크: ', resultItem, arrItems[0]);

          if (arrItems[0] == 1 || arrItems[0] == 3) {
            navigation.navigate('HospitalReservationCate', {hidx: params.hidx});
          } else {
            navigation.navigate('HospitalReReservation');
          }
        } else {
          console.log('예약신청 진료여부 체크 실패!', resultItem);
        }
      },
    );
  };

  const presendModalClose = () => {
    navigation.navigate('HospitalReservationCate');
    bottomSheetModalRef.current?.close();
  };

  //바텀시트 모달
  const bottomSheetModalRef = useRef(null);

  const snapPoints = useMemo(() => [1, '48%']);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.snapToIndex(1);
  }, []);

  const handleSheetChanges = useCallback(index => {
    console.log('handleSheetChanges', index);
  }, []);

  const renderBackdrop = useCallback(
    props => (
      <BottomSheetBackdrop
        {...props}
        pressBehavior="close"
        appearsOnIndex={0} // 이거 추가
        disappearsOnIndex={-1} // 이거 추가
      />
    ),
    [],
  );

  useEffect(() => {
    pageApi();
  }, []);

  return (
    <GestureHandlerRootView
      style={{flex: 1, backgroundColor: '#fff', paddingTop: top}}>
      <Header
        headerTitle={pageText != '' ? pageText[9] : '일반예약신청'}
        navigation={navigation}
        backButtonStatus={true}
      />
      <ScrollView>
        <Box p="20px">
          <DefButton
            onPress={() => reserTypeHandler('1')}
            text={pageText != '' ? pageText[6] : '첫 방문이에요'}
            btnStyle={[
              styles.defaultButton,
              reserType === '1' && {backgroundColor: colorSelect.navy},
            ]}
            txtStyle={[
              styles.defaultButtonText,
              reserType === '1' && {color: colorSelect.white},
            ]}
          />
          <DefButton
            onPress={() => reserTypeHandler('2')}
            text={pageText != '' ? pageText[7] : '방문한적 있어요'}
            btnStyle={[
              styles.defaultButton,
              {marginTop: 20},
              reserType === '2' && {backgroundColor: colorSelect.navy},
            ]}
            txtStyle={[
              styles.defaultButtonText,
              reserType === '2' && {color: colorSelect.white},
            ]}
          />
          <DefButton
            onPress={() => reserTypeHandler('3')}
            text={pageText != '' ? pageText[8] : '잘 모르겠어요'}
            btnStyle={[
              styles.defaultButton,
              {marginTop: 20},
              reserType === '3' && {backgroundColor: colorSelect.navy},
            ]}
            txtStyle={[
              styles.defaultButtonText,
              reserType === '3' && {color: colorSelect.white},
            ]}
          />
        </Box>
      </ScrollView>
      <DefButton
        disabled={reserType != '' ? false : true}
        onPress={nextReservation}
        text={'다음'}
        btnStyle={{
          borderRadius: 0,
          backgroundColor: reserType != '' ? colorSelect.navy : '#F1F1F1',
        }}
        txtStyle={{
          ...fweight.m,
          color: reserType != '' ? colorSelect.white : '#000',
        }}
      />
      <BottomSheetModalProvider>
        <BottomSheet
          ref={bottomSheetModalRef}
          index={-1}
          snapPoints={snapPoints}
          onChange={handleSheetChanges}
          backdropComponent={renderBackdrop}>
          <BottomSheetScrollView>
            <Box p="20px">
              <Box alignItems={'center'}>
                <LabelTitle text={'증상 또는 진료내용'} />
                <DefText
                  text={'병원을 방문하는 이유를 선택해주세요.'}
                  style={[fsize.fs13, {color: '#7B7B7B', lineHeight: 19}]}
                />
              </Box>
              <Box mt="25px">
                <TouchableOpacity
                  onPress={() => setClinicSelect('교정')}
                  style={[styles.modalListButton]}>
                  <HStack
                    alignItems={'center'}
                    justifyContent={'space-between'}>
                    <CheckIcon color={'#fff'} />
                    <DefText
                      text={'교정'}
                      style={[
                        fsize.fs15,
                        clinicSelect == '교정' && fweight.bold,
                        {
                          color:
                            clinicSelect == '교정'
                              ? colorSelect.navy
                              : '#AEAEAE',
                          lineHeight: 21,
                        },
                      ]}
                    />

                    <CheckIcon
                      size={13}
                      color={
                        clinicSelect == '교정'
                          ? colorSelect.navy
                          : colorSelect.white
                      }
                    />
                  </HStack>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setClinicSelect('일반진료')}
                  style={[styles.modalListButton]}>
                  <HStack
                    alignItems={'center'}
                    justifyContent={'space-between'}>
                    <CheckIcon color={'#fff'} />
                    <DefText
                      text={'일반진료 (레진, 인레이, 크라운, 브릿지)'}
                      style={[
                        fsize.fs15,
                        clinicSelect == '일반진료' && fweight.bold,
                        {
                          color:
                            clinicSelect == '일반진료'
                              ? colorSelect.navy
                              : '#AEAEAE',
                          lineHeight: 21,
                        },
                      ]}
                    />

                    <CheckIcon
                      size={13}
                      color={
                        clinicSelect == '일반진료'
                          ? colorSelect.navy
                          : colorSelect.white
                      }
                    />
                  </HStack>
                </TouchableOpacity>
              </Box>
            </Box>
            <HStack
              px={'20px'}
              pb="20px"
              alignItems={'center'}
              justifyContent={'space-between'}>
              <TouchableOpacity
                style={[styles.modalButton, {backgroundColor: '#BBBBBB'}]}>
                <DefText text={'이전'} style={[styles.modalButtonText]} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={presendModalClose}
                style={[
                  styles.modalButton,
                  {backgroundColor: colorSelect.navy},
                ]}>
                <DefText text={'다음'} style={[styles.modalButtonText]} />
              </TouchableOpacity>
            </HStack>
          </BottomSheetScrollView>
        </BottomSheet>
      </BottomSheetModalProvider>
      <BottomNavi screenName={name} navigation={navigation} />
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  defaultButton: {
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colorSelect.navy,
  },
  defaultButtonText: {
    ...fweight.bold,
    color: colorSelect.navy,
  },
  modalListButton: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EDEDED',
  },
  modalButton: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: (deviceSize.deviceWidth - 40) * 0.48,
    borderRadius: 10,
  },
  modalButtonText: {
    ...fweight.m,
    color: colorSelect.white,
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
)(HospitalReservationType2);
