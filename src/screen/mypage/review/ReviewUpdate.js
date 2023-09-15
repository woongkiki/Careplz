import React, {useEffect, useState} from 'react';
import {Box, HStack, Modal} from 'native-base';
import {DefButton, DefInput, DefText} from '../../../common/BOOTSTRAP';
import Header from '../../../components/Header';
import {ScrollView, Image, TouchableOpacity, StyleSheet} from 'react-native';
import {BASE_URL} from '../../../Utils/APIConstant';
import {
  colorSelect,
  deviceSize,
  fsize,
  fweight,
} from '../../../common/StyleCommon';
import BoxLine from '../../../components/BoxLine';
import ImagePicker from 'react-native-image-crop-picker';
import ToastMessage from '../../../components/ToastMessage';
import {connect} from 'react-redux';
import {actionCreators as UserAction} from '../../../redux/module/action/UserAction';
import Api from '../../../Api';
import ReviewQaBox from '../../../components/review/ReviewQaBox';
import StartIcons from '../../../components/review/StartIcons';
import UploadLoading from '../../../components/UploadLoading';
import messaging from '@react-native-firebase/messaging';
import {numberFormat} from '../../../common/DataFunction';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const score = [1, 2, 3, 4, 5];

//병원 리뷰작성하기
const ReviewUpdate = props => {
  const {navigation, userInfo, user_lang, route} = props;
  const {params} = route;
  const {reviewInfo, type} = params;

  console.log('type', type);

  const [pageText, setPageText] = useState('');
  const [pageText2, setPageText2] = useState('');

  const pageTextApi = () => {
    Api.send(
      'app_page',
      {
        cidx: user_lang != null ? user_lang?.cidx : userInfo?.cidx,
        code: 'hospitalReview1',
      },
      args => {
        let resultItem = args.resultItem;
        let arrItems = args.arrItems;

        if (resultItem.result === 'Y' && arrItems) {
          //console.log('병원 리뷰작성 언어 리스트: ', resultItem, arrItems);
          setPageText(arrItems.text);
        } else {
          console.log('병원 리뷰작성 리스트 실패!', resultItem);
        }
      },
    );

    Api.send(
      'app_page',
      {
        cidx: user_lang != null ? user_lang?.cidx : userInfo?.cidx,
        code: 'hospitalReview2',
      },
      args => {
        let resultItem = args.resultItem;
        let arrItems = args.arrItems;

        if (resultItem.result === 'Y' && arrItems) {
          console.log('병원 리뷰작성 언어 리스트: ', resultItem, arrItems);
          setPageText2(arrItems.text);
        } else {
          console.log('병원 리뷰작성 리스트 실패!', resultItem);
        }
      },
    );
  };

  useEffect(() => {
    pageTextApi();
  }, []);

  const [starIdx, setStarIdx] = useState('');
  const [start1, setStar1] = useState(false);
  const [start2, setStar2] = useState(false);
  const [start3, setStar3] = useState(false);
  const [start4, setStar4] = useState(false);
  const [start5, setStar5] = useState(false);

  const startSelectEvent = idx => {
    setStarIdx(idx);
    if (idx == 5) {
      setStar5(true);
      setStar4(true);
      setStar3(true);
      setStar2(true);
      setStar1(true);
    } else if (idx == 4) {
      setStar5(false);
      setStar4(true);
      setStar3(true);
      setStar2(true);
      setStar1(true);
    } else if (idx == 3) {
      setStar5(false);
      setStar4(false);
      setStar3(true);
      setStar2(true);
      setStar1(true);
    } else if (idx == 2) {
      setStar5(false);
      setStar4(false);
      setStar3(false);
      setStar2(true);
      setStar1(true);
    } else if (idx == 1) {
      setStar5(false);
      setStar4(false);
      setStar3(false);
      setStar2(false);
      setStar1(true);
    }
  };

  const [page, setPage] = useState(2);

  //첫번째 선택 답변
  const [qaAnswer, setQaAnswer] = useState('');

  //첫번째 질문지 답변 선택
  const reviewQaSelect = select => {
    setQaAnswer(select);
  };

  //두번째 선택 답변
  const [qaAnswer2, setQaAnswer2] = useState('');

  //두번째 질문지 답변 선택
  const reviewQaSelect2 = select => {
    setQaAnswer2(select);
  };

  //세번째 선택 답변
  const [qaAnswer3, setQaAnswer3] = useState('');

  //세번째 질문지 답변 선택
  const reviewQaSelect3 = select => {
    setQaAnswer3(select);
  };

  //상세한 리뷰작성
  const [reviewContent, setReviewContent] = useState('');
  const reviewContentChange = text => {
    setReviewContent(text);
  };

  //갤러리, 카메라 선택 모달
  const [cameraModal, setCameraModal] = useState(false);

  const [reviewImage, setReviewImage] = useState([]);

  //갤러리 열기
  const galleryOpen = () => {
    console.log(imageIndex);

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
          //data: image.data,
          name: 'profile_img.jpg',
        };

        let imgs = [...reviewImage];

        if (imageIndex != '') {
          let imageIndexVal = imageIndex - 1;

          imgs[imageIndexVal] = {
            uri: image.path,
            type: image.mime,
            data: image.data,
            name: 'profile' + imageIndexVal + '.jpg',
          };
          setReviewImage(imgs);
        } else {
          image.map((item, index) => {
            return imgs.push({
              uri: item.path,
              type: item.mime,
              data: item.data,
              name: 'profile' + index + '.jpg',
            });
          });

          setReviewImage(imgs);
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

        let imgs = [...reviewImage];

        if (imageIndex != '') {
          let imageIndexVal = imageIndex - 1;

          imgs[imageIndexVal] = {
            uri: image.path,
            type: image.mime,
            data: image.data,
            name: 'profile' + imageIndexVal + '.jpg',
          };
          setReviewImage(imgs);
        } else {
          let imgLength = imgs.length + 1;

          imgs.push({
            uri: image.path,
            type: image.mime,
            data: image.data,
            name: 'profile' + imgLength + '.jpg',
          });
          setReviewImage(imgs);
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

  const reviewImageDel = items => {
    if (!reviewImage.includes(items)) {
      ToastMessage('삭제할 이미지가 없습니다.');
    } else {
      const imageSelected = reviewImage.filter(item => items !== item);
      setReviewImage(imageSelected);
    }
  };

  const [imageIndex, setImageIndex] = useState('');

  const imageAdd = () => {
    setImageIndex('');
    setCameraModal(true);
  };

  const imageChange = index => {
    setImageIndex(index);
    setCameraModal(true);
  };

  //재방문여부
  const [reVisit, setReVisit] = useState('');

  //진료 비용
  const [hospitalPrice, setHospitalPrice] = useState('');

  const [priceFormat, setPriceFormat] = useState('');
  const hospitalPriceChange = price => {
    console.log(numberFormat(price));
    setHospitalPrice(numberFormat(price));
  };

  const [uploadLoad, setUploadLoad] = useState(false);

  //작성완료
  const reviewWriteEvent = async () => {
    if (qaAnswer == '') {
      ToastMessage('진료 결과를 선택해주세요.');
      return false;
    }
    if (qaAnswer2 == '') {
      ToastMessage('선생님이 친절하셨는지 선택해주세요.');
      return false;
    }
    if (qaAnswer3 == '') {
      ToastMessage('시설과 장비가 어땠는지 선택해주세요.');
      return false;
    }
    if (reviewContent.length < 10) {
      ToastMessage('상세한 리뷰 내용을 10자 이상 입력해주세요.');
      return false;
    }
    if (reVisit == '') {
      ToastMessage('재방문 여부를 선택해주세요.');
      return false;
    }

    //console.log(reviewImage)

    await setUploadLoad(true);

    if (type == 'evt') {
      apis = 'event_reviewUpdate';
    } else {
      apis = 'hospital_reviewUpdate';
    }

    const formData = new FormData();
    formData.append('method', apis);
    formData.append('id', userInfo?.id);
    formData.append(
      'cidx',
      user_lang != null ? user_lang?.cidx : userInfo?.cidx,
    );
    formData.append('idx', reviewInfo.idx);
    formData.append('star', starIdx);
    formData.append('content', reviewContent);
    formData.append('addinfo1', qaAnswer);
    formData.append('addinfo2', qaAnswer2);
    formData.append('addinfo3', qaAnswer3);
    formData.append('addinfo4', reVisit);
    formData.append('addinfo5', hospitalPrice);

    if (reviewImage != '') {
      reviewImage.map((item, index) => {
        let tmpName = item.uri;
        let fileLength = tmpName.length;
        let fileDot = tmpName.lastIndexOf('.');
        let fileExt = tmpName.substring(fileDot, fileLength).toLowerCase();
        let strtotime = new Date().valueOf();
        let fullName = strtotime + index + fileExt;

        //console.log({'uri' : item.uri, 'name': fullName, 'type': item.type})
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
      await setUploadLoad(false);
      ToastMessage(upload.msg);
      navigation.goBack();
    } else {
      await setUploadLoad(false);
      ToastMessage(upload.msg);
      return false;
    }
    //const upload = await Api.multipartRequest(formData);

    // Api.send('event_reviewWrite', {'id':userInfo?.id, 'cidx':user_lang != null ? user_lang?.cidx : userInfo?.cidx, 'hidx':params.idx, 'star':starIdx, 'content':reviewContent, 'addinfo1':qaAnswer, 'addinfo2':qaAnswer2, 'addinfo3':qaAnswer3, 'addinfo4':reVisit, 'addinfo5':hospitalPrice}, (args)=>{

    //     let resultItem = args.resultItem;
    //     let arrItems = args.arrItems;

    //     if(resultItem.result === 'Y' && arrItems) {
    //        console.log('병원 리뷰 작성하기: ', resultItem, arrItems);
    //     //    setPageText(arrItems.text);
    //         navigation.goBack();
    //     }else{
    //        console.log('병원 리뷰 작성 실패!', resultItem);

    //     }
    // });
  };

  //작성한 리뷰 불러오기
  const reviewApiRec = async () => {
    const token = await messaging().getToken(); // 앱 토큰

    let apis;

    if (type == 'evt') {
      apis = 'event_reviewDetail';
    } else {
      apis = 'hospital_reviewDetail';
    }

    Api.send(
      apis,
      {
        idx: reviewInfo.idx,
        cidx: user_lang != null ? user_lang?.cidx : userInfo?.cidx,
        id: userInfo?.id,
        token: token,
      },
      args => {
        let resultItem = args.resultItem;
        let arrItems = args.arrItems;

        if (resultItem.result === 'Y' && arrItems) {
          console.log('병원이벤트 리뷰 정보: ', resultItem, arrItems);

          startSelectEvent(arrItems.star);
          setQaAnswer(arrItems.addinfo1);
          setQaAnswer2(arrItems.addinfo2);
          setQaAnswer3(arrItems.addinfo3);
          setReviewContent(arrItems.content);
          setReVisit(arrItems.addinfo4);
          setHospitalPrice(numberFormat(arrItems.addinfo5));

          let photos = [];

          arrItems?.photo.map((item, index) => {
            return photos.push({
              uri: item,
              type: 'image/jpeg',
              name: 'profile' + index + '.jpg',
            });
          });

          console.log(photos);

          setReviewImage(photos);
        } else {
          console.log('병원이벤트 리뷰 정보 실패!', resultItem);
        }
      },
    );
  };

  useEffect(() => {
    reviewApiRec();
  }, []);

  const {top} = useSafeAreaInsets();

  return (
    <Box flex={1} backgroundColor="#fff" pt={top + 'px'}>
      <Header
        headerTitle={pageText != '' ? pageText[0] : '리뷰'}
        backButtonStatus={true}
        navigation={navigation}
      />
      {page == 1 && (
        <>
          <Box flex={1} alignItems="center" justifyContent={'center'}>
            <Image
              source={{uri: BASE_URL + '/images/hospitalIcons.png'}}
              style={{
                width: 63,
                height: 60,
                resizeMode: 'contain',
              }}
            />
            <HStack mt="25px">
              <StartIcons
                onPress={() => startSelectEvent(1)}
                btnStatus={start1}
              />
              <StartIcons
                btnstyle={[{marginLeft: 13}]}
                onPress={() => startSelectEvent(2)}
                btnStatus={start2}
              />
              <StartIcons
                btnstyle={[{marginLeft: 13}]}
                onPress={() => startSelectEvent(3)}
                btnStatus={start3}
              />
              <StartIcons
                btnstyle={[{marginLeft: 13}]}
                onPress={() => startSelectEvent(4)}
                btnStatus={start4}
              />
              <StartIcons
                btnstyle={[{marginLeft: 13}]}
                onPress={() => startSelectEvent(5)}
                btnStatus={start5}
              />
            </HStack>
            <Box mt="30px">
              {pageText != '' && (
                <DefText
                  text={pageText[1] + '\n' + pageText[2]}
                  style={[
                    {
                      textAlign: 'center',
                      ...fsize.fs19,
                      lineHeight: 27,
                    },
                  ]}
                />
              )}
              <DefText
                text={reviewInfo.hname}
                style={{...fweight.bold, textAlign: 'center', marginTop: 20}}
              />
            </Box>
          </Box>
          <DefButton
            text={pageText != '' ? pageText[3] : '다음'}
            txtStyle={{
              color: starIdx != '' ? colorSelect.white : colorSelect.black,
            }}
            btnStyle={{
              borderRadius: 0,
              backgroundColor: starIdx != '' ? colorSelect.pink_de : '#F1F1F1',
            }}
            disabled={starIdx != '' ? false : true}
            onPress={() => setPage(2)}
          />
        </>
      )}
      {page == 2 && (
        <ScrollView>
          <Box p="20px">
            <HStack alignItems={'center'}>
              <Image
                source={{uri: BASE_URL + '/images/hospitalIcons.png'}}
                style={{
                  width: 46,
                  height: 46,
                  resizeMode: 'contain',
                  marginRight: 20,
                }}
              />
              <Box>
                <DefText
                  text={userInfo?.name}
                  style={[
                    fsize.fs15,
                    fweight.bold,
                    {color: '#191919', marginBottom: 5},
                  ]}
                />
                <HStack>
                  <StartIcons
                    onPress={() => startSelectEvent(1)}
                    btnStatus={start1}
                    imgStyle={{width: 19, height: 19}}
                  />
                  <StartIcons
                    btnstyle={[{marginLeft: 7}]}
                    onPress={() => startSelectEvent(2)}
                    btnStatus={start2}
                    imgStyle={{width: 19, height: 19}}
                  />
                  <StartIcons
                    btnstyle={[{marginLeft: 7}]}
                    onPress={() => startSelectEvent(3)}
                    btnStatus={start3}
                    imgStyle={{width: 19, height: 19}}
                  />
                  <StartIcons
                    btnstyle={[{marginLeft: 7}]}
                    onPress={() => startSelectEvent(4)}
                    btnStatus={start4}
                    imgStyle={{width: 19, height: 19}}
                  />
                  <StartIcons
                    btnstyle={[{marginLeft: 7}]}
                    onPress={() => startSelectEvent(5)}
                    btnStatus={start5}
                    imgStyle={{width: 19, height: 19}}
                  />
                </HStack>
              </Box>
            </HStack>
          </Box>
          <BoxLine />
          <Box px="20px">
            <ReviewQaBox
              qaTitle={pageText2 != '' ? pageText2[0] : '진료 결과는 어때요?'}
              onPress={() => reviewQaSelect('0')}
              onPress2={() => reviewQaSelect('1')}
              onPress3={() => reviewQaSelect('2')}
              selectA={qaAnswer}
              btnText1={pageText2 != '' ? pageText2[5] : '별로에요'}
              btnText2={pageText2 != '' ? pageText2[6] : '보통이에요'}
              btnText3={pageText2 != '' ? pageText2[7] : '좋아요'}
            />
            <ReviewQaBox
              qaTitle={
                pageText2 != '' ? pageText2[1] : '선생님은 친절하셨나요?'
              }
              onPress={() => reviewQaSelect2('0')}
              onPress2={() => reviewQaSelect2('1')}
              onPress3={() => reviewQaSelect2('2')}
              selectA={qaAnswer2}
              btnText1={pageText2 != '' ? pageText2[5] : '별로에요'}
              btnText2={pageText2 != '' ? pageText2[6] : '보통이에요'}
              btnText3={pageText2 != '' ? pageText2[7] : '좋아요'}
            />
            <ReviewQaBox
              qaTitle={pageText2 != '' ? pageText2[2] : '시설, 장비는 어때요?'}
              onPress={() => reviewQaSelect3('0')}
              onPress2={() => reviewQaSelect3('1')}
              onPress3={() => reviewQaSelect3('2')}
              selectA={qaAnswer3}
              btnText1={pageText2 != '' ? pageText2[5] : '별로에요'}
              btnText2={pageText2 != '' ? pageText2[6] : '보통이에요'}
              btnText3={pageText2 != '' ? pageText2[7] : '좋아요'}
              borderStatus
            />
          </Box>
          <BoxLine />
          <Box px="20px" py="30px">
            <DefText
              text={pageText2 != '' ? pageText2[3] : '상세한 리뷰를 써주세요.'}
              style={[styles.reviewTitle]}
            />
            <Box mt="15px">
              <DefInput
                placeholder={
                  pageText2 != ''
                    ? pageText2[4]
                    : '최소 10자 이상 입력해 주세요.'
                }
                value={reviewContent}
                onChangeText={reviewContentChange}
                inputStyle={{height: 190, padding: 15, paddingTop: 15}}
                textAlignVertical="top"
                multiline={true}
              />
            </Box>
          </Box>
          <BoxLine />
          <Box py="30px">
            <HStack alignItems={'flex-end'} px="20px">
              <DefText
                text={
                  pageText2 != '' ? pageText2[8] : '리뷰 사진을 올려주세요.'
                }
                style={[styles.reviewTitle]}
              />
              <DefText
                text={pageText2 != '' ? ' (' + pageText2[9] + ')' : ' (선택)'}
                style={[styles.selectText]}
              />
            </HStack>
            <Box>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <HStack px="20px" pt="15px">
                  <TouchableOpacity
                    style={[styles.cameraSelectButton]}
                    onPress={imageAdd}>
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
                        text={reviewImage.length + ' / 6'}
                        style={[fsize.fs15, {color: '#BEBEBE', marginTop: 10}]}
                      />
                    </HStack>
                  </TouchableOpacity>
                  {reviewImage.map((item, index) => {
                    return (
                      <Box key={index}>
                        <Box borderRadius={5} overflow="hidden" ml="15px">
                          <TouchableOpacity
                            style={[
                              styles.cameraSelectButton,
                              {borderWidth: 0},
                            ]}
                            onPress={() => imageChange(index + 1)}>
                            <Image
                              source={{uri: item.uri}}
                              style={{
                                width: '100%',
                                height: '100%',
                                resizeMode: 'stretch',
                              }}
                            />
                          </TouchableOpacity>
                        </Box>
                        <Box position={'absolute'} top="10px" right="10px">
                          <TouchableOpacity
                            onPress={() => reviewImageDel(item)}>
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
              </ScrollView>
            </Box>
          </Box>
          <BoxLine />
          <Box px="20px">
            <ReviewQaBox
              qaTitle={pageText2 != '' ? pageText2[10] : '재방문 하시겠어요?'}
              btnText1={pageText2 != '' ? pageText2[11] : '네'}
              btnText2={pageText2 != '' ? pageText2[12] : '아니요'}
              btnText3={pageText2 != '' ? pageText2[13] : '모르겠어요'}
              onPress={() => setReVisit('0')}
              onPress2={() => setReVisit('1')}
              onPress3={() => setReVisit('2')}
              selectA={reVisit}
              borderStatus
            />
          </Box>
          <BoxLine />
          <Box px="20px" py="30px">
            <HStack alignItems={'flex-end'} width={'90%'}>
              <DefText
                text={
                  pageText2 != '' ? pageText2[14] : '알려주시면 큰 도움이 돼요.'
                }
                style={[styles.reviewTitle]}
              />
              <DefText
                text={pageText2 != '' ? ' (' + pageText2[9] + ')' : ' (선택)'}
                style={[styles.selectText]}
              />
            </HStack>
            <Box mt="15px">
              <DefInput
                placeholder={
                  pageText2 != '' ? pageText2[15] : '진료 비용을 입력해주세요.'
                }
                value={hospitalPrice}
                onChangeText={hospitalPriceChange}
                keyboardType="number-pad"
                inputStyle={{lineHeight: 19}}
              />
            </Box>
          </Box>
        </ScrollView>
      )}
      {page == 2 && (
        <DefButton
          text={pageText2 != '' ? pageText2[20] : '수정완료'}
          btnStyle={{borderRadius: 0, backgroundColor: colorSelect.pink_de}}
          txtStyle={{color: colorSelect.white, ...fweight.m}}
          onPress={reviewWriteEvent}
        />
      )}

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
                    text={pageText2 != '' ? pageText2[18] : '카메라'}
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
                    text={pageText2 != '' ? pageText2[19] : '갤러리'}
                    style={[styles.cameraModalButtonText]}
                  />
                </HStack>
              </TouchableOpacity>
            </HStack>
          </Modal.Body>
        </Modal.Content>
      </Modal>
      {uploadLoad && (
        <UploadLoading
          loadingText={
            pageText2 != ''
              ? pageText2[21]
              : '리뷰 수정 중 입니다\n잠시만 기다려주세요'
          }
        />
      )}
    </Box>
  );
};

const styles = StyleSheet.create({
  reviewTitle: {
    ...fsize.fs15,
    ...fweight.bold,
    color: '#191919',
  },
  reviewButton: {
    width: (deviceSize.deviceWidth - 40) * 0.31,
    height: 48,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E1E1E1',
  },
  reviewButtonText: {
    ...fsize.fs14,
    color: '#191919',
  },
  selectText: {
    ...fsize.fs13,
    ...fweight.bold,
    color: '#BEBEBE',
  },
  cameraSelectButton: {
    width: (deviceSize.deviceWidth - 40) * 0.26,
    height: (deviceSize.deviceWidth - 40) * 0.26,
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
});

export default connect(
  ({User}) => ({
    userInfo: User.userInfo, //회원정보
    user_lang: User.user_lang,
    userPosition: User.userPosition,
  }),
  dispatch => ({
    member_login: user => dispatch(UserAction.member_login(user)), //로그인
    languageSet: user => dispatch(UserAction.languageSet(user)), //선택언어
  }),
)(ReviewUpdate);
