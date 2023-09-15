import {Box, CheckIcon, HStack} from 'native-base';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {DefButton, DefText, LabelTitle} from '../../common/BOOTSTRAP';
import {connect} from 'react-redux';
import {actionCreators as UserAction} from '../../redux/module/action/UserAction';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Header from '../../components/Header';
import {Image, ScrollView, StyleSheet, TouchableOpacity} from 'react-native';
import Api from '../../Api';
import Loading from '../../components/Loading';
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

const HospitalReservationCate = props => {
  const {navigation, userInfo, user_lang, route} = props;
  const {params} = route;
  const {top} = useSafeAreaInsets();

  const [loading, setLoading] = useState(true);
  const [categoryList, setCategoryList] = useState([]);
  const [selectCate, setSelectCate] = useState('');
  const [subCategory, setSubCategory] = useState([]);
  const [selectSubCategory, setSelectSubCategory] = useState('');

  const categoryApi = async () => {
    await setLoading(true);
    await Api.send(
      'hospital_newReservation02',
      {
        cidx: user_lang != null ? user_lang?.cidx : userInfo?.cidx,
        catcode: '',
        idx: params.hidx,
      },
      args => {
        let resultItem = args.resultItem;
        let arrItems = args.arrItems;

        if (resultItem.result === 'Y' && arrItems) {
          console.log('병원 진료 과목 리스트: ', resultItem, arrItems);
          setCategoryList(arrItems);

          //   setSelectCategory(arrItems[0].category);
        } else {
          console.log('병원 진료 과목 실패!', resultItem);
        }
      },
    );
    await setLoading(false);
  };

  //진료과목선택
  const selectClinic = clinic => {
    setSelectCate(clinic);
  };

  useEffect(() => {
    categoryApi();
  }, []);

  //bottomsheet
  //바텀시트 모달
  const bottomSheetModalRef = useRef(null);

  const snapPoints = useMemo(() => [1, '70%']);

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

  const presendModalClose = () => {
    navigation.navigate('HospitalReservationMessage', {
      hidx: params.hidx,
      selectcategory: selectSubCategory,
    });
    bottomSheetModalRef.current?.close();
  };

  //다음
  const nextScreen = () => {
    Api.send(
      'hospital_newReservation02',
      {
        cidx: user_lang != null ? user_lang?.cidx : userInfo?.cidx,
        idx: params.hidx,
        catcode: selectCate.catcode,
      },
      args => {
        let resultItem = args.resultItem;
        let arrItems = args.arrItems;

        if (resultItem.result === 'Y' && arrItems) {
          console.log('병원 진료 과목 2차 리스트: ', resultItem, arrItems);

          if (arrItems != '') {
            setSubCategory(arrItems);
            handlePresentModalPress(); //bottom modal open!
          } else {
            if (params.hidx != '') {
              navigation.navigate('HospitalReservationMessage', {
                hidx: params.hidx,
                selectcategory: selectCate.catcode,
                selectcategoryName: selectCate.category,
              });
            } else {
              navigation.navigate('HospitalSelect', {
                catcode: selectSubCategory,
                keyword: '',
                isre: '',
              });
            }
          }
        } else {
          console.log('병원 진료 과목 2차 리스트 실패!', resultItem);
        }
      },
    );

    //navigation.navigate('HospitalList', {selectCate: selectCate});
  };

  const subNextScreen = () => {
    if (params.hidx != '') {
      navigation.navigate('HospitalReservationMessage', {
        hidx: params.hidx,
        selectcategory: selectSubCategory,
        selectcategoryName: '',
      });
    } else {
      console.log('병원 선택 No');
      navigation.navigate('HospitalSelect', {
        catcode: selectSubCategory,
        keyword: '',
        isre: '',
      });
    }

    bottomSheetModalRef.current?.close();
  };

  return (
    <GestureHandlerRootView
      style={{flex: 1, backgroundColor: '#fff', paddingTop: top}}>
      <Header
        headerTitle={'진료과목선택'}
        navigation={navigation}
        backButtonStatus={true}
      />
      {loading ? (
        <Loading />
      ) : (
        <ScrollView>
          <Box p="20px">
            <Box alignItems={'center'} pb="20px">
              <DefText
                text={'홍길동님 안녕하세요.'}
                style={[styles.labelTitle]}
              />
              <HStack>
                <DefText
                  text={'진료과목'}
                  style={[styles.labelTitle, {color: colorSelect.pink_de}]}
                />
                <DefText
                  text={'을 선택해주세요.'}
                  style={[styles.labelTitle]}
                />
              </HStack>
            </Box>
            {categoryList != '' && (
              <HStack flexWrap={'wrap'}>
                {categoryList.map((item, index) => {
                  return (
                    <TouchableOpacity
                      key={index}
                      onPress={() => selectClinic(item)}
                      backgroundColor="#fff"
                      activeOpacity={0.9}
                      style={[
                        (index + 1) % 3 != 0
                          ? {
                              marginRight: (deviceSize.deviceWidth - 40) * 0.05,
                            }
                          : {marginRight: 0},
                      ]}>
                      <Box
                        shadow={9}
                        borderRadius={15}
                        style={[
                          styles.categoryButton,
                          {
                            backgroundColor:
                              selectCate == item
                                ? colorSelect.pink_de
                                : colorSelect.white,
                          },
                        ]}>
                        <Image
                          source={{uri: item.icon}}
                          style={{
                            width: 20,
                            height: 24,
                            resizeMode: 'contain',
                            marginBottom: 10,
                          }}
                        />
                        <DefText
                          text={item.category}
                          style={[
                            styles.categoryButtonText,
                            selectCate == item && {
                              color: colorSelect.white,
                            },
                          ]}
                        />
                      </Box>
                    </TouchableOpacity>
                  );
                })}
              </HStack>
            )}
          </Box>
        </ScrollView>
      )}
      <DefButton
        onPress={nextScreen}
        btnStyle={{
          backgroundColor: selectCate != '' ? colorSelect.navy : '#bbb',
          borderRadius: 0,
        }}
        txtStyle={{color: colorSelect.white, ...fweight.m}}
        disabled={selectCate != '' ? false : true}
        text={'다음'}
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

              {subCategory != '' && (
                <Box>
                  {subCategory.map((item, index) => {
                    return (
                      <TouchableOpacity
                        key={index}
                        style={[styles.modalListButton]}
                        onPress={() => setSelectSubCategory(item.catcode)}>
                        <HStack
                          alignItems={'center'}
                          justifyContent={'space-between'}>
                          <CheckIcon color={'#fff'} />
                          <DefText
                            text={item.category}
                            style={[
                              fsize.fs15,
                              {
                                color:
                                  item.catcode == selectSubCategory
                                    ? colorSelect.navy
                                    : '#AEAEAE',
                                lineHeight: 21,
                              },
                              item.catcode == selectSubCategory && fweight.bold,
                            ]}
                          />
                          {item.catcode == selectSubCategory ? (
                            <CheckIcon size={13} color={colorSelect.navy} />
                          ) : (
                            <CheckIcon size={13} color={colorSelect.white} />
                          )}
                        </HStack>
                      </TouchableOpacity>
                    );
                  })}
                </Box>
              )}

              <TouchableOpacity
                onPress={subNextScreen}
                style={[
                  styles.modalButton,
                  {backgroundColor: colorSelect.navy},
                ]}>
                <DefText text={'다음'} style={[styles.modalButtonText]} />
              </TouchableOpacity>
            </Box>
          </BottomSheetScrollView>
        </BottomSheet>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  labelTitle: {
    ...fsize.fs18,
    ...fweight.bold,
    lineHeight: 26,
  },
  categoryButton: {
    width: (deviceSize.deviceWidth - 40) * 0.3,
    paddingVertical: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },
  categoryButtonText: {
    ...fsize.fs12,
    color: '#434856',
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
    width: deviceSize.deviceWidth - 40,
    borderRadius: 10,
    marginTop: 15,
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
)(HospitalReservationCate);
