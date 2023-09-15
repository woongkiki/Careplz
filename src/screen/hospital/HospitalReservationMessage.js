import {Box, CheckIcon, HStack, Modal} from 'native-base';
import React, {useRef, useState, useCallback, useMemo, useEffect} from 'react';
import Header from '../../components/Header';
import {ScrollView, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {DefButton, DefInput, DefText, LabelTitle} from '../../common/BOOTSTRAP';
import {
  colorSelect,
  deviceSize,
  fsize,
  fweight,
} from '../../common/StyleCommon';
import {popularUntact, symptomClinic} from '../../ArrayData';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import {BASE_URL} from '../../Utils/APIConstant';
import ImagePicker from 'react-native-image-crop-picker';
import ToastMessage from '../../components/ToastMessage';
import {connect} from 'react-redux';
import {actionCreators as UserAction} from '../../redux/module/action/UserAction';
import Api from '../../Api';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const HospitalReservationMessage = props => {
  const {navigation, route, userInfo, user_lang} = props;
  const {params} = route;

  console.log(params);
  const {top} = useSafeAreaInsets();

  const [pageText, setPageText] = useState('');
  const [subCategoryList, setSubCategoryList] = useState([]);
  const [selectSubCategory, setSelectSubCategory] = useState('');
  const [selectSubCategoryName, setSelectSubCategoryName] = useState('');

  const appPageApi = async () => {
    //user_lang != null ? user_lang?.cidx : userInfo?.cidx
    await Api.send(
      'app_page',
      {
        cidx: user_lang != null ? user_lang?.cidx : userInfo?.cidx,
        code: 'hospitalReserMsg',
      },
      args => {
        let resultItem = args.resultItem;
        let arrItems = args.arrItems;

        if (resultItem.result === 'Y' && arrItems) {
          //console.log('진료예약 전달사항 언어 리스트: ', resultItem, arrItems);
          setPageText(arrItems.text);
        } else {
          console.log('진료예약 전달사항 언어 리스트 실패!', resultItem);
        }
      },
    );

    await Api.send(
      'hospital_newReservation02',
      {
        cidx: user_lang != null ? user_lang?.cidx : userInfo?.cidx,
        idx: params.hidx,
        catcode: params.selectcategory,
      },
      args => {
        let resultItem = args.resultItem;
        let arrItems = args.arrItems;

        if (resultItem.result === 'Y' && arrItems) {
          console.log('병원 진료 과목 3차 리스트: ', resultItem, arrItems);
          setSubCategoryList(arrItems);
        } else {
          console.log('병원 진료 과목 3차 리스트 실패!', resultItem);
        }
      },
    );

    if (params.selectcategoryName != '') {
      setSelectSubCategoryName(params.selectcategoryName);
    }
  };

  useEffect(() => {
    appPageApi();
  }, [user_lang]);

  //선택한 증상 및 진료
  const [selectClinic, setSelectClinic] = useState('');

  //인기 비대면 데이터
  const [popularUntactData, setPopularUntactData] = useState(popularUntact);

  //증상별 진료 데이터
  const [symptomData, setSymptomData] = useState(symptomClinic);

  const selectClinicHandler = item => {
    setSelectClinic(item);
    bottomSheetModalRef.current?.close();
  };

  //bottom Modal
  const bottomSheetModalRef = useRef(null);

  const snapPoints = useMemo(() => [1, '55%', '70%']);

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

  const selectCategoryHandler = cate => {
    setSelectSubCategory(cate.catcode);
    setSelectSubCategoryName(cate.category);
    bottomSheetModalRef.current?.close();
  };

  //카메라
  const [cameraModal, setCameraModal] = useState(false);
  const [imageData, setImageData] = useState([]);
  const [imageIndex, setImageIndex] = useState('');

  const imageSelect = () => {
    setCameraModal(true);
    setImageIndex('');
  };

  const galleryOpen = () => {
    ImagePicker.openPicker({
      width: deviceSize.deviceWidth,
      height: deviceSize.deviceWidth,
      cropping: false,
      multiple: imageIndex != '' ? false : true,
      compressImageMaxWidth: deviceSize.deviceWidth * 1.5,
      compressImageMaxHeight: deviceSize.deviceWidth * 1.5,
      compressImageQuality: 0.7,
    })
      .then(image => {
        const my_photo = {
          uri: image.path,
          type: image.mime,
          data: image.data,
          name: 'profile_img.jpg',
        };

        let imgs = [...imageData];

        if (imageIndex != '') {
          let imageIndexVal = imageIndex - 1;

          imgs[imageIndexVal] = {
            uri: image.path,
            type: image.mime,
            data: image.data,
            name: 'profile' + imageIndexVal + '.jpg',
          };
          setImageData(imgs);
        } else {
          image.map((item, index) => {
            return imgs.push({
              uri: item.path,
              type: item.mime,
              data: item.data,
              name: 'profile' + index + '.jpg',
            });
          });

          setImageData(imgs);
        }

        setCameraModal(false);
      })
      .catch(e => {
        if (e.message == 'Cannot run camera on simulator') {
          ToastMessage('시뮬레이터에서는 카메라를 실행할 수 없습니다.');
        } else {
          ToastMessage('카메라 촬영을 취소하셨습니다.');
        }
      });
  };

  const cameraOpen = () => {
    ImagePicker.openCamera({
      width: deviceSize.deviceWidth,
      height: deviceSize.deviceWidth,
      cropping: false,
      compressImageMaxWidth: deviceSize.deviceWidth * 1.5,
      compressImageMaxHeight: deviceSize.deviceWidth * 1.5,
      compressImageQuality: 0.7,
    })
      .then(image => {
        console.log('camera image', image);

        let imgs = [...imageData];

        let imgadd = {
          uri: image.path,
          type: image.mime,
          data: image.data,
          name: 'msgImg.jpg',
        };
        imgs.push(imgadd);

        setImageData(imgs);
        //console.log("imgs", imgs);
        setCameraModal(false);
      })
      .catch(e => {
        if (e.message == 'Cannot run camera on simulator') {
          ToastMessage('시뮬레이터에서는 카메라를 실행할 수 없습니다.');
        } else {
          ToastMessage('카메라 촬영을 취소하셨습니다.');
        }
      });
  };

  //이미지 삭제
  const reviewImageDel = items => {
    if (!imageData.includes(items)) {
      ToastMessage('삭제할 이미지가 없습니다.');
    } else {
      const imageSelected = imageData.filter(item => items !== item);
      setImageData(imageSelected);
    }
  };

  //이미지 변경
  const imageChange = index => {
    setImageIndex(index);
    setCameraModal(true);
  };

  const [catcodeBack, setCatcodeBack] = useState(false);
  const [backCatcode, setBackCatecode] = useState('');
  const [catCodeValue, setCatcodeValue] = useState('');
  const [cateValue, setCateValue] = useState('');
  const [clinicLists, setClinicLists] = useState([]);

  //증상 가져오기
  const clinicListApi = () => {
    Api.send(
      'hospital_reservation03',
      {
        hidx: params.hidx,
        catcode: catCodeValue,
        cidx: user_lang != null ? user_lang?.cidx : userInfo?.cidx,
      },
      args => {
        let resultItem = args.resultItem;
        let arrItems = args.arrItems;

        if (resultItem.result === 'Y' && arrItems) {
          console.log('병원 진료내용 정보: ', resultItem, arrItems);

          if (arrItems != '') {
            setClinicLists(arrItems);
          } else {
            bottomSheetModalRef.current?.close();
          }
        } else {
          console.log('병원 진료내용 정보 실패!', resultItem);
        }
      },
    );
  };

  const [selectClinicCate, setSelectClinicCate] = useState([]);
  const [clinicNum, setClinicNum] = useState(0);

  const clinicCateChange = (cate, catcode) => {
    //console.log("catcode4:::", catcode.substring(0,4) + "0000");
    console.log('catcode:::', catcode);

    console.log('clinicNum', clinicNum);
    if (clinicNum < 2) {
      setClinicNum(clinicNum + 1);
    }
    setCatcodeValue(catcode);
    setCateValue(cate);

    if (clinicNum == 0) {
      if (!selectClinicCate.includes(catcode)) {
        setSelectClinicCate([...selectClinicCate, catcode]);
      }
    }
  };

  const clinickBefor = clinicNums => {
    console.log('clinicNum::', clinicNums);

    if (clinicNums == 1) {
      setCatcodeValue('');
      setCateValue('');
    } else {
      setCatcodeValue(selectClinicCate[0]);
    }

    setClinicNum(clinicNum - 1);
    setCateValue('');
  };

  useEffect(() => {
    console.log('clinicNum', clinicNum, selectClinicCate);
  }, [clinicNum, selectClinicCate]);

  useEffect(() => {
    clinicListApi();
  }, [catCodeValue]);

  //다음 페이지 이동
  const nextNavigation = async () => {
    const formData = new FormData();
    formData.append('method', 'hospital_reservation04');
    formData.append('id', userInfo.id);
    formData.append('hidx', params.hidx);
    formData.append('cidx', user_lang.cidx);
    formData.append('rtype', params.hospitalType);
    formData.append('catcode', catCodeValue);
    formData.append('datetime', params.selectTime.join(','));

    console.log(imageData);

    if (imageData.length > 0) {
      imageData.map((item, index) => {
        let tmpName = item.uri;
        let fileLength = tmpName.length;
        let fileDot = tmpName.lastIndexOf('.');
        let fileExt = tmpName.substring(fileDot, fileLength).toLowerCase();
        let strtotime = new Date().valueOf();
        let fullName = strtotime + index + fileExt;

        //console.log({'uri' : item.uri, 'name': fullName, 'type': item.type});
        return formData.append('upfile[]', {
          uri: item.uri,
          name: fullName,
          type: item.type,
        });
      });
    }

    const upload = await Api.multipartRequest(formData);

    console.log('upload', upload);
    if (upload.result) {
      navigation.navigate('HospitalReservationRequest', {
        hidx: params.hidx,
        hname: params.hname,
        hospitalType: params.hospitalType,
        selectDates: params.selectDates,
        selectTime: params.selectTime,
        selectClinic: cateValue,
        catcode: catCodeValue,
        reserImage: imageData,
      });
    } else {
      ToastMessage(upload.msg);
      return false;
    }
  };

  return (
    <GestureHandlerRootView
      style={{flex: 1, backgroundColor: '#fff', paddingTop: top}}>
      <Header
        headerTitle={pageText != '' ? pageText[0] : '전달사항'}
        backButtonStatus={true}
        navigation={navigation}
      />
      <ScrollView>
        <Box p="20px">
          <Box mb="25px">
            <HStack alignItems={'flex-end'} flexWrap={'wrap'}>
              <LabelTitle text={'증상 또는 진료내용을 선택하세요.'} />
            </HStack>
            <Box mt="15px">
              <TouchableOpacity
                disabled={params.selectcategoryName != '' ? true : false}
                style={[styles.selectButton]}
                onPress={handlePresentModalPress}>
                <HStack alignItems={'center'} justifyContent="space-between">
                  {selectSubCategoryName != '' ? (
                    <DefText
                      text={selectSubCategoryName}
                      style={[fsize.fs15]}
                    />
                  ) : (
                    <DefText
                      text={
                        pageText != ''
                          ? pageText[5]
                          : '증상 또는 진료내용을 선택해 주세요.'
                      }
                      style={[fsize.fs15, {color: '#BEBEBE'}]}
                    />
                  )}

                  <Image
                    source={require('../../images/downArr.png')}
                    style={{
                      width: 12,
                      height: 7,
                      resizeMode: 'stretch',
                    }}
                  />
                </HStack>
              </TouchableOpacity>
            </Box>
          </Box>
          <Box>
            <Box mb="15px">
              <LabelTitle text={'파일 업로드'} />
            </Box>
            <TouchableOpacity
              style={[styles.cameraSelectButton]}
              onPress={imageSelect}>
              <Image
                source={{uri: BASE_URL + '/images/carmeraIcon.png'}}
                style={{
                  width: 19,
                  height: 16,
                  resizeMode: 'contain',
                }}
              />
              <HStack>
                <DefText
                  text={imageData.length + ' / 6'}
                  style={[fsize.fs15, {color: '#BEBEBE', marginTop: 10}]}
                />
              </HStack>
            </TouchableOpacity>
            <HStack flexWrap={'wrap'}>
              {imageData.map((item, index) => {
                return (
                  <Box
                    key={index}
                    mr={
                      (index + 1) % 3 != 0 &&
                      (deviceSize.deviceWidth - 40) * 0.035
                    }
                    mt="15px">
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.cameraSelectButton,
                        {
                          borderWidth: 0,
                          borderRadius: 5,
                          overflow: 'hidden',
                        },
                      ]}
                      onPress={() => imageChange(index + 1)}
                      disabled={true}>
                      <Image
                        source={{uri: item.uri}}
                        style={{
                          width: '100%',
                          height: '100%',
                          resizeMode: 'stretch',
                        }}
                      />
                    </TouchableOpacity>
                    <Box position={'absolute'} top="10px" right="10px">
                      <TouchableOpacity onPress={() => reviewImageDel(item)}>
                        <Image
                          source={{uri: BASE_URL + '/images/cancel.png'}}
                          style={{
                            width: 20,
                            height: 20,
                            resizeMode: 'contain',
                          }}
                        />
                      </TouchableOpacity>
                    </Box>
                  </Box>
                );
              })}
            </HStack>
          </Box>
        </Box>
      </ScrollView>
      <DefButton
        text={selectSubCategoryName != '' ? pageText[8] : pageText[7]}
        btnStyle={{
          borderRadius: 0,
          backgroundColor:
            selectSubCategoryName != '' ? colorSelect.pink_de : '#F1F1F1',
        }}
        txtStyle={{
          ...fweight.m,
          color:
            selectSubCategoryName != '' ? colorSelect.white : colorSelect.black,
        }}
        onPress={nextNavigation}
      />
      <Modal isOpen={cameraModal} onClose={() => setCameraModal(false)}>
        <Modal.Content width={deviceSize.deviceWidth - 40} p="20px">
          <Modal.Body p="0">
            <HStack alignItems={'center'} justifyContent="space-between">
              <TouchableOpacity
                style={[styles.cameraModalButton]}
                onPress={cameraOpen}>
                <HStack alignItems={'center'}>
                  <Image
                    source={{uri: BASE_URL + '/images/aiCameraIcon.png'}}
                    alt="갤러리"
                    style={{width: 22, height: 19, resizeMode: 'contain'}}
                  />
                  <DefText
                    text="카메라"
                    style={[styles.cameraModalButtonText]}
                  />
                </HStack>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.cameraModalButton]}
                onPress={galleryOpen}>
                <HStack alignItems={'center'}>
                  <Image
                    source={{uri: BASE_URL + '/images/aiGallIcon.png'}}
                    alt="갤러리"
                    style={{width: 22, height: 19, resizeMode: 'contain'}}
                  />
                  <DefText
                    text="갤러리"
                    style={[styles.cameraModalButtonText]}
                  />
                </HStack>
              </TouchableOpacity>
            </HStack>
          </Modal.Body>
        </Modal.Content>
      </Modal>
      <BottomSheetModalProvider>
        <BottomSheet
          ref={bottomSheetModalRef}
          index={-1}
          snapPoints={snapPoints}
          onChange={handleSheetChanges}
          backdropComponent={renderBackdrop}>
          <BottomSheetScrollView
            contentContainerStyle={{backgroundColor: '#fff'}}>
            <Box p="20px">
              <Box alignItems={'center'}>
                <LabelTitle text={'증상'} />
                <DefText
                  text={'병원을 방문하는 이유를 선택해주세요.'}
                  style={[fsize.fs13, {color: '#7B7B7B', lineHeight: 19}]}
                />
              </Box>
              {subCategoryList != '' && (
                <Box>
                  {subCategoryList.map((item, index) => {
                    return (
                      <TouchableOpacity
                        key={index}
                        style={[styles.modalListButton]}
                        onPress={() => selectCategoryHandler(item)}>
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
            </Box>
          </BottomSheetScrollView>
        </BottomSheet>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  texts: {
    ...fsize.fs13,
    lineHeight: 19,
    color: '#434856',
  },
  selectButton: {
    width: '100%',
    height: 48,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#E1E1E1',
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
  modalCategory: {
    width: deviceSize.deviceWidth - 40,
    paddingVertical: 10,
    justifyContent: 'center',
    marginTop: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colorSelect.gray_dfdfdf,
    borderRadius: 10,
    //paddingHorizontal:
  },
  modalCategoryText: {
    ...fsize.fs13,
    ...fweight.bold,
    //marginLeft:12
  },
  cameraSelectButton: {
    width: (deviceSize.deviceWidth - 40) * 0.31,
    height: (deviceSize.deviceWidth - 40) * 0.31,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E1E1E1',
  },
  cameraModalButton: {
    width: '48%',
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colorSelect.navy,
    borderRadius: 10,
  },
  cameraModalButtonText: {
    ...fsize.fs14,
    color: colorSelect.white,
    lineHeight: 19,
    marginLeft: 10,
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
)(HospitalReservationMessage);
