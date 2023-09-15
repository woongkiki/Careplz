import {Box, CheckIcon, HStack, Modal} from 'native-base';
import React, {useEffect, useState} from 'react';
import {DefText} from '../../common/BOOTSTRAP';
import {connect} from 'react-redux';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ScrollView, StyleSheet, TouchableOpacity} from 'react-native';
import {
  colorSelect,
  deviceSize,
  fsize,
  fweight,
} from '../../common/StyleCommon';
import {useIsFocused} from '@react-navigation/native';
import Loading from '../../components/Loading';
import Header from '../../components/Header';
import BoxLine from '../../components/BoxLine';
import Api from '../../Api';
import ToastMessage from '../../components/ToastMessage';
import Checkbox from '../../components/Checkbox';

const RegisterInterests2 = props => {
  const {navigation, route, user_lang} = props;
  const {params} = route;
  const {top} = useSafeAreaInsets();
  const isFocused = useIsFocused();

  const [loading, setLoading] = useState(true);
  const [checksModal, setChecksModal] = useState(false);
  const [category, setCategory] = useState([]);
  const [selectCategory, setSelectCategory] = useState([]);
  const [diseasePage, setDiseasePage] = useState(1);
  const [diseaseList, setDiseaseList] = useState(['질병1', '질병2', '질병3']);
  const [selectDisease, setSelectDisease] = useState([]);
  const [importantDrug, setImportantDrug] = useState([
    '약물명1',
    '약물명2약물명2약물명2',
    '약물명3',
    '약물명4',
  ]);

  const [importantCheck1, setImportantCheck1] = useState('');
  const [importantCheck2, setImportantCheck2] = useState('');
  const [importantCheck3, setImportantCheck3] = useState([]);
  const [importantCheck4, setImportantCheck4] = useState('');
  const [importantCheck5, setImportantCheck5] = useState('');
  const [importantCheckedStatus, setImportantCheckedStatus] = useState(true);

  const importantCheckHandler = items => {
    if (!importantCheck3.includes(items)) {
      setImportantCheck3([...importantCheck3, items]);
    } else {
      const removeRes = importantCheck3.filter(item => items !== item);
      setImportantCheck3(removeRes);
    }
  };

  //중요사항 체크 했을 때 버튼상태변경
  useEffect(() => {
    if (
      importantCheck1 != '' &&
      importantCheck2 != '' &&
      importantCheck3.length > 0 &&
      importantCheck4 != '' &&
      importantCheck5 != ''
    ) {
      setImportantCheckedStatus(false);
    } else {
      setImportantCheckedStatus(true);
    }
  }, [
    importantCheck1,
    importantCheck2,
    importantCheck3,
    importantCheck4,
    importantCheck5,
  ]);

  //카테고리 선택
  const selectCategoryEvent = category => {
    if (!selectCategory.includes(category)) {
      if (selectCategory.length == 5) {
        ToastMessage('관심분야는 5개까지 선택가능합니다.');
        return false;
      }
      setSelectCategory([...selectCategory, category]);
    } else {
      const caregoryRemove = selectCategory.filter(item => category !== item);
      setSelectCategory(caregoryRemove);
    }
  };

  //건강상태 체크 질병선택하기
  const diseaseSelectHandler = items => {
    if (!selectDisease.includes(items)) {
      setSelectDisease([...selectDisease, items]);
    } else {
      const diseaseListRemove = selectDisease.filter(item => items !== item);
      setSelectDisease(diseaseListRemove);
    }
  };

  const categryListApi = async () => {
    await setLoading(true);

    if (params != '') {
      //user_lang != null ? user_lang.cidx : 0
      await Api.send(
        'event_category',
        {cidx: user_lang != null ? user_lang.cidx : 0, catecode: '100000'},
        args => {
          let resultItem = args.resultItem;
          let arrItems = args.arrItems;

          if (resultItem.result === 'Y' && arrItems) {
            console.log('이벤트 카테고리', resultItem, arrItems);
            setCategory(arrItems);
          } else {
            console.log('이벤트 메인 api 실패!', resultItem);
          }
        },
      );
    }

    await setLoading(false);
  };

  useEffect(() => {
    if (isFocused) {
      categryListApi();
    }

    return () => {
      setCategory([]);
      setSelectCategory([]);
    };
  }, [isFocused]);

  return (
    <Box flex={1} backgroundColor={'#fff'} pt={top + 'px'}>
      <Header
        headerTitle={''}
        backButtonStatus={true}
        navigation={navigation}
      />
      {loading ? (
        <Loading />
      ) : (
        <ScrollView>
          <Box p="20px">
            <Box>
              <DefText
                text={'관심있는 시술을 자세히 알려주세요!'}
                style={[styles.titleText]}
              />
              <HStack mt="10px">
                <DefText text={'최대 '} style={[styles.titleText]} />
                <DefText
                  text={'5개까지'}
                  style={[styles.titleText, {color: colorSelect.pink_de}]}
                />
                <DefText text={' 선택 가능'} style={[styles.titleText]} />
              </HStack>
            </Box>
          </Box>
          <BoxLine />
          <Box p="20px">
            {params?.item.map((item, index) => {
              return (
                <Box key={index} mt={index != 0 ? '30px' : 0}>
                  <DefText
                    text={item.category}
                    style={[styles.categoryTitle]}
                  />
                  <HStack flexWrap={'wrap'}>
                    {category != '' &&
                      category.map((cate, idx) => {
                        return (
                          <TouchableOpacity
                            onPress={() => selectCategoryEvent(cate)}
                            style={[
                              styles.categoryButton,
                              selectCategory.includes(cate) && {
                                backgroundColor: colorSelect.pink_de,
                                borderColor: colorSelect.pink_de,
                              },
                            ]}
                            key={idx}>
                            <DefText
                              text={cate.category}
                              style={[
                                styles.categoryButtonText,
                                selectCategory.includes(cate) && {
                                  color: '#fff',
                                },
                              ]}
                            />
                          </TouchableOpacity>
                        );
                      })}
                  </HStack>
                </Box>
              );
            })}
          </Box>
        </ScrollView>
      )}
      <TouchableOpacity
        //onPress={nextNavigationHandler}
        disabled={selectCategory.length > 0 ? false : true}
        style={[
          styles.confirmButton,
          selectCategory.length > 0 && {backgroundColor: colorSelect.pink_de},
        ]}>
        <DefText
          text={'확인'}
          style={[
            styles.confirmButtonText,
            selectCategory.length > 0 && {color: colorSelect.white},
          ]}
        />
      </TouchableOpacity>
      <Modal isOpen={checksModal} onClose={() => setChecksModal(false)}>
        <Modal.Content
          p="0px"
          width={deviceSize.deviceWidth - 40}
          backgroundColor={'#fff'}>
          <Modal.Body p="0px">
            {diseasePage == 1 && (
              <Box p="20px">
                <Box>
                  <DefText
                    text={'건강상태 체크하기'}
                    style={[fsize.fs17, fweight.bold]}
                  />
                  <Box mt="5px">
                    <DefText
                      text={'나의 건강상태를 체크 해주세요!'}
                      style={[fsize.fs13, {color: '#7B7B7B'}]}
                    />
                  </Box>
                </Box>
                <Box
                  width="100%"
                  height={'1px'}
                  backgroundColor={'#CCCCCC'}
                  my="20px"
                />

                {diseaseList != '' && (
                  <Box>
                    {diseaseList.map((item, index) => {
                      return (
                        <TouchableOpacity
                          onPress={() => diseaseSelectHandler(item)}
                          key={index}
                          style={[
                            index != 0 ? {marginTop: 15} : {marginTop: 0},
                          ]}>
                          <HStack alignItems={'center'}>
                            <Box
                              style={[
                                styles.checkBox,
                                selectDisease.includes(item) && {
                                  borderColor: colorSelect.pink_de,
                                },
                              ]}>
                              {selectDisease.includes(item) && (
                                <CheckIcon
                                  size={'12px'}
                                  color={colorSelect.pink_de}
                                />
                              )}
                            </Box>
                            <Box ml="10px">
                              <DefText text={item} style={[styles.checkText]} />
                            </Box>
                          </HStack>
                        </TouchableOpacity>
                      );
                    })}
                    <TouchableOpacity
                      onPress={() => setDiseasePage(2)}
                      disabled={selectDisease.length > 0 ? false : true}
                      style={[
                        styles.confirmButton,
                        {
                          width: deviceSize.deviceWidth - 80,
                          borderRadius: 10,
                          marginTop: 30,
                        },
                        selectDisease.length > 0 && {
                          backgroundColor: colorSelect.pink_de,
                        },
                      ]}>
                      <DefText
                        text={'다음으로 넘어가기'}
                        style={[
                          styles.confirmButtonText,
                          selectDisease.length > 0 && {
                            color: colorSelect.white,
                          },
                        ]}
                      />
                    </TouchableOpacity>
                  </Box>
                )}
              </Box>
            )}
            {diseasePage == 2 && (
              <Box>
                <Box p="20px">
                  <Box>
                    <DefText
                      text={'중요사항'}
                      style={[fsize.fs17, fweight.bold]}
                    />
                    <Box mt="5px">
                      <DefText
                        text={'중요사항 문항에 체크해주세요!'}
                        style={[fsize.fs13, {color: '#7B7B7B'}]}
                      />
                    </Box>
                  </Box>
                  <Box
                    width="100%"
                    height={'1px'}
                    backgroundColor={'#CCCCCC'}
                    my="20px"
                  />
                  <Box>
                    <DefText text={'임신여부'} style={[styles.labelTitle]} />
                    <HStack mt="10px">
                      <TouchableOpacity
                        onPress={() => setImportantCheck1('임신')}
                        style={[{width: (deviceSize.deviceWidth - 80) * 0.5}]}>
                        <HStack alignItems={'center'}>
                          <Box
                            style={[
                              styles.checkBox,
                              importantCheck1 == '임신' && {
                                borderColor: colorSelect.pink_de,
                              },
                            ]}>
                            {importantCheck1 == '임신' && (
                              <CheckIcon
                                size={'12px'}
                                color={colorSelect.pink_de}
                              />
                            )}
                          </Box>
                          <Box ml="10px">
                            <DefText text={'임신'} style={[styles.checkText]} />
                          </Box>
                        </HStack>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => setImportantCheck1('해당없음')}
                        style={{width: (deviceSize.deviceWidth - 80) * 0.5}}>
                        <HStack alignItems={'center'}>
                          <Box
                            style={[
                              styles.checkBox,
                              importantCheck1 == '해당없음' && {
                                borderColor: colorSelect.pink_de,
                              },
                            ]}>
                            {importantCheck1 == '해당없음' && (
                              <CheckIcon
                                size={'12px'}
                                color={colorSelect.pink_de}
                              />
                            )}
                          </Box>
                          <Box ml="10px">
                            <DefText
                              text={'해당없음'}
                              style={[styles.checkText]}
                            />
                          </Box>
                        </HStack>
                      </TouchableOpacity>
                    </HStack>
                  </Box>
                  <Box mt="20px">
                    <DefText
                      text={
                        '상처의 피가 안 멈추거나 호흡이 어려웠던 적이 있었나요?'
                      }
                      style={[styles.labelTitle]}
                    />
                    <HStack mt="10px">
                      <TouchableOpacity
                        onPress={() => setImportantCheck2('있다')}
                        style={{width: (deviceSize.deviceWidth - 80) * 0.33}}>
                        <HStack alignItems={'center'}>
                          <Box
                            style={[
                              styles.checkBox,
                              importantCheck2 == '있다' && {
                                borderColor: colorSelect.pink_de,
                              },
                            ]}>
                            {importantCheck2 == '있다' && (
                              <CheckIcon
                                size={'12px'}
                                color={colorSelect.pink_de}
                              />
                            )}
                          </Box>
                          <Box ml="10px">
                            <DefText text={'있다'} style={[styles.checkText]} />
                          </Box>
                        </HStack>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => setImportantCheck2('없다')}
                        style={{width: (deviceSize.deviceWidth - 80) * 0.33}}>
                        <HStack alignItems={'center'}>
                          <Box
                            style={[
                              styles.checkBox,
                              importantCheck2 == '없다' && {
                                borderColor: colorSelect.pink_de,
                              },
                            ]}>
                            {importantCheck2 == '없다' && (
                              <CheckIcon
                                size={'12px'}
                                color={colorSelect.pink_de}
                              />
                            )}
                          </Box>
                          <Box ml="10px">
                            <DefText text={'없다'} style={[styles.checkText]} />
                          </Box>
                        </HStack>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => setImportantCheck2('해당없음')}
                        style={{width: (deviceSize.deviceWidth - 80) * 0.33}}>
                        <HStack alignItems={'center'}>
                          <Box
                            style={[
                              styles.checkBox,
                              importantCheck2 == '해당없음' && {
                                borderColor: colorSelect.pink_de,
                              },
                            ]}>
                            {importantCheck2 == '해당없음' && (
                              <CheckIcon
                                size={'12px'}
                                color={colorSelect.pink_de}
                              />
                            )}
                          </Box>
                          <Box ml="10px">
                            <DefText
                              text={'해당없음'}
                              style={[styles.checkText]}
                            />
                          </Box>
                        </HStack>
                      </TouchableOpacity>
                    </HStack>
                  </Box>
                  <Box mt="20px">
                    <DefText
                      text={'약복용, 주사 부작용, 약물명 선택'}
                      style={[styles.labelTitle]}
                    />
                    <HStack flexWrap={'wrap'}>
                      {importantDrug.map((item, index) => {
                        return (
                          <TouchableOpacity
                            onPress={() => importantCheckHandler(item)}
                            key={index}
                            style={{
                              paddingHorizontal: 10,
                              paddingVertical: 5,
                              borderWidth: 1,
                              borderColor: importantCheck3.includes(item)
                                ? colorSelect.pink_de
                                : '#B2BBC8',
                              borderRadius: 5,
                              marginTop: 10,
                              marginRight: 10,
                              backgroundColor: importantCheck3.includes(item)
                                ? colorSelect.pink_de
                                : colorSelect.white,
                            }}>
                            <DefText
                              text={item}
                              style={[
                                fsize.fs15,
                                {
                                  lineHeight: 21,
                                  color: importantCheck3.includes(item)
                                    ? colorSelect.white
                                    : colorSelect.black,
                                },
                              ]}
                            />
                          </TouchableOpacity>
                        );
                      })}
                    </HStack>
                  </Box>
                </Box>
                <BoxLine />
                <Box p="20px">
                  <Box>
                    <DefText text={'생활습관'} style={[styles.labelTitle]} />
                    <HStack flexWrap={'wrap'} mt="10px">
                      <TouchableOpacity
                        onPress={() => setImportantCheck4('흡연')}
                        style={{width: (deviceSize.deviceWidth - 80) * 0.5}}>
                        <HStack alignItems={'center'}>
                          <Box
                            style={[
                              styles.checkBox,
                              importantCheck4 == '흡연' && {
                                borderColor: colorSelect.pink_de,
                              },
                            ]}>
                            {importantCheck4 == '흡연' && (
                              <CheckIcon
                                size={'12px'}
                                color={colorSelect.pink_de}
                              />
                            )}
                          </Box>
                          <Box ml="10px">
                            <DefText text={'흡연'} style={[styles.checkText]} />
                          </Box>
                        </HStack>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => setImportantCheck4('비흡연')}
                        style={{width: (deviceSize.deviceWidth - 80) * 0.5}}>
                        <HStack alignItems={'center'}>
                          <Box
                            style={[
                              styles.checkBox,
                              importantCheck4 == '비흡연' && {
                                borderColor: colorSelect.pink_de,
                              },
                            ]}>
                            {importantCheck4 == '비흡연' && (
                              <CheckIcon
                                size={'12px'}
                                color={colorSelect.pink_de}
                              />
                            )}
                          </Box>
                          <Box ml="10px">
                            <DefText
                              text={'비흡연'}
                              style={[styles.checkText]}
                            />
                          </Box>
                        </HStack>
                      </TouchableOpacity>
                    </HStack>
                    <HStack flexWrap={'wrap'} mt="20px">
                      <TouchableOpacity
                        onPress={() => setImportantCheck5('음주')}
                        style={{width: (deviceSize.deviceWidth - 80) * 0.5}}>
                        <HStack alignItems={'center'}>
                          <Box
                            style={[
                              styles.checkBox,
                              importantCheck5 == '음주' && {
                                borderColor: colorSelect.pink_de,
                              },
                            ]}>
                            {importantCheck5 == '음주' && (
                              <CheckIcon
                                size={'12px'}
                                color={colorSelect.pink_de}
                              />
                            )}
                          </Box>
                          <Box ml="10px">
                            <DefText text={'음주'} style={[styles.checkText]} />
                          </Box>
                        </HStack>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => setImportantCheck5('비음주')}
                        style={{width: (deviceSize.deviceWidth - 80) * 0.5}}>
                        <HStack alignItems={'center'}>
                          <Box
                            style={[
                              styles.checkBox,
                              importantCheck5 == '비음주' && {
                                borderColor: colorSelect.pink_de,
                              },
                            ]}>
                            {importantCheck5 == '비음주' && (
                              <CheckIcon
                                size={'12px'}
                                color={colorSelect.pink_de}
                              />
                            )}
                          </Box>
                          <Box ml="10px">
                            <DefText
                              text={'비음주'}
                              style={[styles.checkText]}
                            />
                          </Box>
                        </HStack>
                      </TouchableOpacity>
                    </HStack>
                  </Box>
                  <HStack justifyContent={'space-between'}>
                    <TouchableOpacity
                      onPress={() => setDiseasePage(1)}
                      disabled={false}
                      style={[
                        styles.confirmButton,
                        {
                          width: (deviceSize.deviceWidth - 80) * 0.48,
                          borderRadius: 10,
                          marginTop: 30,
                        },
                      ]}>
                      <DefText
                        text={'이전'}
                        style={[styles.confirmButtonText]}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      //onPress={() => setDiseasePage(1)}
                      disabled={importantCheckedStatus}
                      style={[
                        styles.confirmButton,
                        {
                          width: (deviceSize.deviceWidth - 80) * 0.48,
                          borderRadius: 10,
                          marginTop: 30,
                        },

                        !importantCheckedStatus && {
                          backgroundColor: colorSelect.pink_de,
                        },
                      ]}>
                      <DefText
                        text={'작성완료'}
                        style={[
                          styles.confirmButtonText,
                          !importantCheckedStatus && {color: colorSelect.white},
                        ]}
                      />
                    </TouchableOpacity>
                  </HStack>
                </Box>
              </Box>
            )}
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </Box>
  );
};

const styles = StyleSheet.create({
  titleText: {
    ...fsize.fs18,
    ...fweight.bold,
  },
  categoryTitle: {
    ...fweight.bold,
    marginBottom: 5,
  },
  categoryButton: {
    paddingHorizontal: 10,
    height: 42,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#B2BBC8',
    borderRadius: 7,
    marginRight: 10,
    marginTop: 10,
  },
  categoryButtonText: {
    ...fsize.fs15,
    ...fweight.r,
    color: '#B2BBC8',
    lineHeight: 40,
  },
  confirmButton: {
    width: deviceSize.deviceWidth,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F1F1F1',
  },
  confirmButtonText: {
    ...fweight.m,
  },
  checkBox: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#707070',
    backgroundColor: '#fff',
    borderRadius: 20,
  },
  checkText: {
    ...fsize.fs15,
    ...fweight.m,
    color: '#191919',
    lineHeight: 20,
  },
  labelTitle: {
    ...fsize.fs16,
    ...fweight.bold,
    color: '#191919',
  },
});

export default connect(({User}) => ({
  user_lang: User.user_lang,
}))(RegisterInterests2);
