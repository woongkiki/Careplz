import {Box, HStack} from 'native-base';
import React, {useCallback, useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {actionCreators as UserAction} from '../../redux/module/action/UserAction';
import Loading from '../../components/Loading';
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Header from '../../components/Header';
import SearchInput from '../../components/SearchInput';
import {
  colorSelect,
  deviceSize,
  fsize,
  fweight,
} from '../../common/StyleCommon';
import {DefText} from '../../common/BOOTSTRAP';
import {BASE_URL} from '../../Utils/APIConstant';
import BoxLine from '../../components/BoxLine';
import Api from '../../Api';

const HospitalSelect = props => {
  const {navigation, userInfo, user_lang, userPosition, route} = props;
  const {params} = route;
  const {top} = useSafeAreaInsets();

  const [loading, setLoading] = useState(true);
  const [schText, setSchText] = useState('');
  const [hospitalList, setHospitalList] = useState([]);

  const keyExtractor = useCallback(item => item.idx.toString(), []);

  const schChange = text => {
    setSchText(text);
  };

  console.log('params', params);

  const pageApi = async () => {
    await setLoading(true);

    console.log(userPosition?.lat, userPosition?.lng);

    await Api.send(
      'hospital_newReservation03',
      {
        id: userInfo?.id,
        page: 1,
        cidx: user_lang != '' ? user_lang?.cidx : 0,
        lat: userPosition?.lat,
        lng: userPosition?.lng,
        catcode: params?.catcode,
        keyword: '',
        isre: '',
      },
      args => {
        let resultItem = args.resultItem;
        let arrItems = args.arrItems;

        if (resultItem.result === 'Y' && arrItems) {
          console.log('병원  리스트: ', arrItems);
          setHospitalList(arrItems);
        } else {
          console.log('병원 리스트 실패!', resultItem);
          //setHospitalList([]);
        }
      },
    );

    await setLoading(false);
  };

  useEffect(() => {
    pageApi();

    return () => {
      setLoading(true);
    };
  }, []);

  //병원선택
  const hospitalSelected = idx => {
    navigation.navigate('HospitalReservationMessage', {
      hidx: idx,
      selectcategory: params?.catcode,
      selectcategoryName: '',
    });
  };

  return (
    <Box flex={1} backgroundColor={'#fff'} pt={top + 'px'}>
      <Header
        headerTitle="병원선택"
        navigation={navigation}
        backButtonStatus={true}
      />
      {loading ? (
        <Loading />
      ) : (
        <FlatList
          data={hospitalList}
          keyExtractor={keyExtractor}
          renderItem={({item, index}) => {
            return (
              <TouchableOpacity
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor: '#E3E3E3',
                  paddingVertical: 20,
                  paddingHorizontal: 20,
                }}
                onPress={() => hospitalSelected(item.idx)}>
                <HStack
                  alignItems={'center'}
                  justifyContent={'space-between'}
                  flexWrap={'wrap'}>
                  <Box width={(deviceSize.deviceWidth - 40) * 0.22}>
                    <Image
                      source={{uri: item.icon}}
                      style={{
                        width: 60,
                        height: 60,
                        resizeMode: 'stretch',
                        borderRadius: 30,
                      }}
                    />
                  </Box>
                  <Box width={(deviceSize.deviceWidth - 40) * 0.78}>
                    <DefText
                      text={item.name}
                      lh={user_lang?.cidx == 9 ? 31 : ''}
                    />

                    <HStack alignItems={'center'} flexWrap="wrap">
                      <Box mt="10px">
                        <DefText
                          text={item.meter}
                          style={[styles.bottmSheetHospitalText]}
                          lh={user_lang?.cidx == 9 ? 14 : ''}
                        />
                      </Box>
                      <Box>
                        <DefText
                          text={' · '}
                          style={[styles.bottmSheetHospitalText]}
                          lh={user_lang?.cidx == 9 ? 14 : ''}
                        />
                      </Box>
                      <Box>
                        <DefText
                          text={item.address1}
                          style={[styles.bottmSheetHospitalText]}
                          lh={user_lang?.cidx == 9 ? 24 : ''}
                        />
                      </Box>
                      {item.category != '' && (
                        <>
                          <Box
                            style={{
                              width: 1,
                              height: 10,
                              backgroundColor: '#434856',
                              marginHorizontal: 10,
                            }}
                          />
                          <HStack>
                            <DefText
                              text={item.category.join(',')}
                              style={[styles.bottmSheetHospitalText]}
                              lh={user_lang?.cidx == 9 ? 24 : ''}
                            />
                          </HStack>
                        </>
                      )}
                    </HStack>

                    {item.keyword != undefined && (
                      <HStack flexWrap={'wrap'}>
                        {item.keyword.map((k, idxs) => {
                          return (
                            <Box
                              key={idxs}
                              p="5px"
                              borderRadius={5}
                              backgroundColor="#F5F6FA"
                              mr={'10px'}
                              mt="5px">
                              <DefText
                                text={k}
                                style={{
                                  ...fsize.fs12,
                                  ...fweight.m,
                                  color: '#434856',
                                }}
                                lh={user_lang?.cidx == 9 ? 24 : ''}
                              />
                            </Box>
                          );
                        })}
                      </HStack>
                    )}
                  </Box>
                </HStack>
              </TouchableOpacity>
            );
          }}
        />
      )}
    </Box>
  );
};

const styles = StyleSheet.create({
  label: {
    ...fsize.fs14,
    ...fweight.bold,
    color: '#000000',
  },
  recentButton: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: '#E9ECEF',
    marginRight: 10,
    marginTop: 10,
  },
  popularButton: {
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E3E3E3',
  },
  backButton: {
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  bottomSheetButton: {
    height: 30,
    borderRadius: 30,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#B2BBC8',
    justifyContent: 'center',
    marginRight: 10,
  },
  bottomSheetButtonText: {
    color: '#434856',
    ...fsize.fs12,
  },
  bottmSheetHospitalText: {
    ...fsize.fs13,
    color: '#434856',
    lineHeight: 17,
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
    app_positions: user => dispatch(UserAction.app_positions(user)), //현재 좌표
  }),
)(HospitalSelect);
