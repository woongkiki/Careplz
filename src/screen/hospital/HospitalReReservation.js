import {Box, HStack} from 'native-base';
import React, {useEffect, useState} from 'react';
import Header from '../../components/Header';
import {connect} from 'react-redux';
import {actionCreators as UserAction} from '../../redux/module/action/UserAction';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Loading from '../../components/Loading';
import {Image, ScrollView, StyleSheet, TouchableOpacity} from 'react-native';
import SearchInput from '../../components/SearchInput';
import {
  colorSelect,
  deviceSize,
  fsize,
  fweight,
} from '../../common/StyleCommon';
import {DefButton, DefText, LabelTitle} from '../../common/BOOTSTRAP';
import {BASE_URL} from '../../Utils/APIConstant';
import Api from '../../Api';
import BottomNavi from '../../components/bottom/BottomNavi';
import {textLengthOverCut} from '../../common/DataFunction';

const HospitalReReservation = props => {
  const {navigation, userInfo, user_lang, route} = props;
  const {name, params} = route;
  const {top} = useSafeAreaInsets();

  const [loading, setLoading] = useState(true);
  const [schText, setSchText] = useState('');
  const [hospitalList, setHospitalList] = useState([
    {
      idx: 1,
      hospital: '변동우 병원',
      area: '경기도 오산',
      thumb: BASE_URL + '/newImg/hospistalThumb.png',
    },
    {
      idx: 2,
      hospital: '변동우 병원',
      area: '경기도 오산',
      thumb: BASE_URL + '/newImg/hospistalThumb.png',
    },
    {
      idx: 3,
      hospital: '변동우 병원',
      area: '경기도 오산',
      thumb: BASE_URL + '/newImg/hospistalThumb.png',
    },
    {
      idx: 4,
      hospital: '변동우 병원',
      area: '경기도 오산',
      thumb: BASE_URL + '/newImg/hospistalThumb.png',
    },
  ]);
  const [categoryList, setCategoryList] = useState([]);
  const [selectCate, setSelectCate] = useState('');
  const [recentHospitalList, setRecentHospitalList] = useState([]); //최근 예약한 병원 목록

  const schTextChange = text => {
    setSchText(text);
  };

  const pageApi = async () => {
    await setLoading(true);
    await Api.send(
      'hospital_newReservation02',
      {
        idx: params?.hidx,
        cidx: user_lang != null ? user_lang?.cidx : userInfo?.cidx,
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
    await Api.send(
      'hospital_newReservation02-2',
      {
        id: userInfo?.id,
        cidx: user_lang != null ? user_lang?.cidx : userInfo?.cidx,
      },
      args => {
        let resultItem = args.resultItem;
        let arrItems = args.arrItems;

        if (resultItem.result === 'Y' && arrItems) {
          console.log('최근 예약 병원 리스트: ', resultItem, arrItems);
          setRecentHospitalList(arrItems);
          //   setSelectCategory(arrItems[0].category);
        } else {
          console.log('최근 예약 병원 리스트 실패!', resultItem);
        }
      },
    );
    await setLoading(false);
  };

  const selectClinic = clinic => {
    setSelectCate(clinic);
  };

  useEffect(() => {
    pageApi();
    return () => {
      setLoading(true);
    };
  }, []);

  return (
    <Box flex={1} backgroundColor={'#fff'} pt={top + 'px'}>
      <Header
        headerTitle={'재진료 예약'}
        navigation={navigation}
        backButtonStatus={true}
      />
      {loading ? (
        <Loading />
      ) : (
        <ScrollView>
          <Box p="20px">
            <SearchInput
              placeholder={'검색어를 입력해주세요.'}
              value={schText}
              onChangeText={schTextChange}
              inputStyle={{
                height: 40,
                paddingLeft: 20,
                backgroundColor: '#fff',
                borderWidth: 0,
                lineHeight: 20,
                borderWidth: 1,
                borderRadius: 20,
              }}
              btnStyle={{
                backgroundColor: colorSelect.white,
                //borderWidth: 1,
                //borderColor: '#E3E3E3',
                height: 38,
                marginRight: 1,
                borderRadius: 20,
              }}
              positionMargin={'-19px'}
              buttonPositionRight={0}
              iconpink={true}
              //onPress={schEvent}
              //onSubmitEditing={schEvent}
            />
            <Box mt="30px">
              <Box mb="10px">
                <LabelTitle text={'최근 예약한 병원 목록'} />
              </Box>
              {recentHospitalList != '' && (
                <HStack flexWrap={'wrap'}>
                  {recentHospitalList.map((item, index) => {
                    return (
                      <TouchableOpacity
                        key={index}
                        style={[
                          {
                            width: (deviceSize.deviceWidth - 40) * 0.23,

                            overflow: 'hidden',
                          },
                          (index + 1) % 4 != 0 && {
                            marginRight: (deviceSize.deviceWidth - 40) * 0.0266,
                          },
                        ]}>
                        <Box>
                          <Box
                            style={{
                              borderRadius: 10,
                              overflow: 'hidden',
                              width: '100%',
                              height: (deviceSize.deviceWidth - 40) * 0.23,
                              borderWidth: 1,
                              borderColor: '#dfdfdf',
                            }}>
                            <Image
                              source={{uri: item.icon}}
                              style={{
                                width: '100%',
                                height: '100%',
                                resizeMode: 'contain',
                              }}
                            />
                            <Box
                              position={'absolute'}
                              top={0}
                              left={0}
                              backgroundColor={'rgba(0,0,0,0.75)'}
                              minWidth={'26px'}
                              minHeight={'26px'}
                              alignItems={'center'}
                              justifyContent={'center'}
                              borderBottomRightRadius={5}>
                              <DefText
                                text={item.no}
                                style={[fsize.fs13, {color: colorSelect.white}]}
                              />
                            </Box>
                          </Box>
                          <Box mt="10px">
                            <DefText
                              text={textLengthOverCut(item.name, 4, '...')}
                              style={[styles.hospitalName]}
                            />
                            <DefText
                              text={item.area1 + ' ' + item.area2}
                              style={[styles.areaName]}
                            />
                          </Box>
                        </Box>
                      </TouchableOpacity>
                    );
                  })}
                </HStack>
              )}
              <Box>
                <TouchableOpacity style={[styles.listButton]}>
                  <HStack alignItems={'center'} justifyContent={'center'}>
                    <DefText
                      text={'목록 더보기'}
                      style={[styles.listButtonText]}
                    />
                    <Image
                      source={{uri: BASE_URL + '/newImg/listArr.png'}}
                      style={{
                        width: 13,
                        height: 7,
                        resizeMode: 'contain',
                      }}
                    />
                  </HStack>
                </TouchableOpacity>
              </Box>
            </Box>
            <Box mt="30px">
              <HStack>
                <LabelTitle
                  text={'진료과목'}
                  txtStyle={{color: colorSelect.pink_de}}
                />
                <LabelTitle text={'으로 찾기'} />
              </HStack>
              {categoryList != '' && (
                <HStack flexWrap={'wrap'}>
                  {categoryList.map((item, index) => {
                    return (
                      <TouchableOpacity
                        key={index}
                        onPress={() => selectClinic(item.catcode)}
                        backgroundColor="#fff"
                        activeOpacity={0.9}
                        style={[
                          (index + 1) % 3 != 0
                            ? {
                                marginRight:
                                  (deviceSize.deviceWidth - 40) * 0.05,
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
                                selectCate == item.catcode
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
                              selectCate == item.catcode && {
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
          </Box>
        </ScrollView>
      )}
      <DefButton
        btnStyle={{
          backgroundColor: selectCate != '' ? colorSelect.navy : '#bbb',
          borderRadius: 0,
        }}
        txtStyle={{color: colorSelect.white, ...fweight.m}}
        disabled={selectCate != '' ? false : true}
        text={'다음'}
      />
      <BottomNavi screenName={name} navigation={navigation} />
    </Box>
  );
};

const styles = StyleSheet.create({
  hospitalName: {
    ...fsize.fs15,
    ...fweight.bold,
    lineHeight: 21,
    color: '#191919',
  },
  areaName: {
    ...fsize.fs13,
    lineHeight: 19,
    color: '#505050',
  },
  listButton: {
    width: deviceSize.deviceWidth - 40,
    height: 39,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F6F8FA',
    borderRadius: 10,
    marginTop: 20,
  },
  listButtonText: {
    ...fsize.fs13,
    ...fweight.m,
    color: '#434856',
    marginRight: 10,
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
)(HospitalReReservation);
