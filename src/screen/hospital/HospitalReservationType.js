import React, {useEffect, useState} from 'react';
import {Box} from 'native-base';
import {DefButton, DefText, LabelTitle} from '../../common/BOOTSTRAP';
import Header from '../../components/Header';
import {ScrollView, StyleSheet, TouchableOpacity} from 'react-native';
import {colorSelect} from '../../common/StyleCommon';
import ToastMessage from '../../components/ToastMessage';
import {connect} from 'react-redux';
import {actionCreators as UserAction} from '../../redux/module/action/UserAction';
import Api from '../../Api';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

//진료 타입 예시
const type = ['일반진료', '예방접종', '건강검진', '기타'];

//병원 예약 진료 타입 선택
const HospitalReservationType = props => {
  const {navigation, route, user_lang, userInfo} = props;
  const {params} = route;
  const {top} = useSafeAreaInsets();

  //console.log(params);

  const [pageText, setPageText] = useState('');

  const [typeStatus, setTypeStatus] = useState('');

  const hospitalTypeStatusApi = async () => {
    //user_lang != null ? user_lang?.cidx : userInfo?.cidx
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
    await Api.send('hospital_reservation02', {hidx: params.hidx}, args => {
      let resultItem = args.resultItem;
      let arrItems = args.arrItems;

      if (resultItem.result === 'Y' && arrItems) {
        console.log('병원 진료카테고리 정보: ', resultItem, arrItems);
        setTypeStatus(arrItems);
      } else {
        console.log('병원 진료카테고리 정보 정보 실패!', resultItem);
      }
    });
  };

  useEffect(() => {
    hospitalTypeStatusApi();
  }, []);

  const [hospitalType, setHospitalType] = useState('');

  const typeSelect = type => {
    setHospitalType(type);

    console.log(type);
    navigation.navigate('HospitalReservationDateTime', {
      hospitalType: type,
      hidx: params.hidx,
      hname: params.hname,
    });
  };

  return (
    <Box flex={1} backgroundColor="#fff" pt={top + 'px'}>
      <Header
        headerTitle={pageText != '' ? pageText[0] : '진료 선택'}
        backButtonStatus={true}
        navigation={navigation}
      />
      <ScrollView>
        <Box p="20px">
          <LabelTitle
            text={pageText != '' ? pageText[1] : '어떤 진료를 원하세요?'}
          />
          <Box mt="30px">
            <DefButton
              text={pageText != '' ? pageText[2] : '일반진료'}
              btnStyle={[
                styles.button,
                hospitalType == '1' && {
                  backgroundColor: colorSelect.pink_de,
                  borderColor: colorSelect.pink_de,
                },
                typeStatus.일반진료 != 1 && {
                  backgroundColor: colorSelect.gray_dfdfdf,
                },
              ]}
              txtStyle={[
                hospitalType == '1' && {color: colorSelect.white},
                typeStatus.일반진료 != 1 && {color: '#999'},
              ]}
              onPress={() => typeSelect('1')}
              disabled={typeStatus.일반진료 == 1 ? false : true}
            />
            <DefButton
              text={pageText != '' ? pageText[3] : '예방접종'}
              btnStyle={[
                styles.button,
                {marginTop: 10},
                hospitalType == '2' && {
                  backgroundColor: colorSelect.pink_de,
                  borderColor: colorSelect.pink_de,
                },
                typeStatus.예방접종 != 1 && {
                  backgroundColor: colorSelect.gray_dfdfdf,
                },
              ]}
              txtStyle={[
                hospitalType == '2' && {color: colorSelect.white},
                typeStatus.예방접종 != 1 && {color: '#999'},
              ]}
              onPress={() => typeSelect('2')}
              disabled={typeStatus.예방접종 == 1 ? false : true}
            />
            <DefButton
              text={pageText != '' ? pageText[4] : '건강검진'}
              btnStyle={[
                styles.button,
                {marginTop: 10},
                hospitalType == '3' && {
                  backgroundColor: colorSelect.pink_de,
                  borderColor: colorSelect.pink_de,
                },
                typeStatus.건강검진 != 1 && {
                  backgroundColor: colorSelect.gray_dfdfdf,
                },
              ]}
              txtStyle={[
                hospitalType == '3' && {color: colorSelect.white},
                typeStatus.건강검진 != 1 && {color: '#999'},
              ]}
              onPress={() => typeSelect('3')}
              disabled={typeStatus.건강검진 == 1 ? false : true}
            />
            <DefButton
              text={pageText != '' ? pageText[5] : '기타'}
              btnStyle={[
                styles.button,
                {marginTop: 10},
                hospitalType == '4' && {
                  backgroundColor: colorSelect.pink_de,
                  borderColor: colorSelect.pink_de,
                },
                typeStatus.기타 != 1 && {
                  backgroundColor: colorSelect.gray_dfdfdf,
                },
              ]}
              txtStyle={[
                hospitalType == '4' && {color: colorSelect.white},
                typeStatus.기타 != 1 && {color: '#999'},
              ]}
              onPress={() => typeSelect('4')}
              disabled={typeStatus.기타 == 1 ? false : true}
            />
            {/* {
                            type.map((item, index) => {
                                return(
                                    <DefButton 
                                        key={index}
                                        text={item}
                                        btnStyle={[
                                            styles.button,
                                            index != 0 && 
                                            {marginTop:10},
                                            hospitalType == item && 
                                            {
                                                backgroundColor:colorSelect.pink_de,
                                                borderColor:colorSelect.pink_de
                                            }
                                        ]}
                                        txtStyle={[
                                            hospitalType == item && 
                                            {color:colorSelect.white}
                                        ]}
                                        onPress={()=>typeSelect(item)}
                                    />
                                )
                            })
                        } */}
          </Box>
        </Box>
      </ScrollView>
    </Box>
  );
};

const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    borderColor: '#E1E1E1',
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
)(HospitalReservationType);
