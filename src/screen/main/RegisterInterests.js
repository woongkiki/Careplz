import {Box, HStack} from 'native-base';
import React, {useEffect, useState} from 'react';
import {DefText} from '../../common/BOOTSTRAP';
import {connect} from 'react-redux';
import {actionCreators as UserAction} from '../../redux/module/action/UserAction';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  colorSelect,
  deviceSize,
  fsize,
  fweight,
} from '../../common/StyleCommon';
import {Image, ScrollView, StyleSheet, TouchableOpacity} from 'react-native';
import Api from '../../Api';
import {useIsFocused} from '@react-navigation/native';
import Loading from '../../components/Loading';
import {BASE_URL} from '../../Utils/APIConstant';
import ToastMessage from '../../components/ToastMessage';

const RegisterInterests = props => {
  const {navigation, user_lang} = props;
  const {top} = useSafeAreaInsets();
  const isFocused = useIsFocused();

  //상태값
  const [loading, setLoading] = useState(true);
  const [categoryList, setCategoryList] = useState([]);
  const [selectCategory, setSelectCategory] = useState([]);

  //카테고리 선택
  const selectCategoryEvent = category => {
    if (!selectCategory.includes(category)) {
      if (selectCategory.length == 3) {
        ToastMessage('관심분야는 3개까지 선택가능합니다.');
        return false;
      }
      setSelectCategory([...selectCategory, category]);
    } else {
      const caregoryRemove = selectCategory.filter(item => category !== item);
      setSelectCategory(caregoryRemove);
    }
  };

  //다음으로 넘어가기
  const nextNavigationHandler = () => {
    if (selectCategory.length == 0) {
      ToastMessage('건너뛰기');
    } else {
      navigation.navigate('RegisterInterests2', {item: selectCategory});
    }
  };

  //카테고리 가져오기
  const categoryApi = async () => {
    //user_lang != null ? user_lang.cidx : 0
    await setLoading(true);
    await Api.send(
      'event_category',
      {cidx: user_lang != null ? user_lang.cidx : 0},
      args => {
        let resultItem = args.resultItem;
        let arrItems = args.arrItems;

        if (resultItem.result === 'Y' && arrItems) {
          //console.log('이벤트 카테고리', resultItem, arrItems);
          setCategoryList(arrItems);
        } else {
          console.log('이벤트 메인 api 실패!', resultItem);
        }
      },
    );
    await setLoading(false);
  };

  //스크린 진입시 실행
  useEffect(() => {
    if (isFocused) {
      categoryApi();
    }

    return () => {
      //초기화
      setCategoryList([]);
      setSelectCategory([]);
    };
  }, [isFocused]);

  return (
    <Box flex={1} backgroundColor={'#fff'} pt={top + 'px'}>
      {loading ? (
        <Loading />
      ) : (
        <ScrollView>
          <Box p="20px" pt="40px">
            <Box>
              <DefText
                text={'관심분야를 선택해 주세요.'}
                style={[styles.titleText]}
              />
              <HStack mt="10px">
                <DefText text={'최대 '} style={[styles.titleText]} />
                <DefText
                  text={'3개이상'}
                  style={[styles.titleText, {color: colorSelect.pink_de}]}
                />
                <DefText text={' 선택'} style={[styles.titleText]} />
              </HStack>
            </Box>
            <Box height="20px" />
            <HStack flexWrap="wrap">
              {categoryList.map((item, index) => {
                return (
                  <Box alignItems={'center'} key={index}>
                    {/* <Box
                      width={(deviceSize.deviceWidth - 40) * 0.22}
                      height={'70%'}
                      borderRadius={40}
                      backgroundColor={
                        selectCategory.includes(item)
                          ? 'rgba(255,127,178,0.6)'
                          : colorSelect.white
                      }
                      position={'absolute'}
                      bottom={'10px'}
                      left="50%"
                      marginLeft={
                        (((deviceSize.deviceWidth - 40) * 0.22) / 2) * -1
                      }
                    /> */}
                    <TouchableOpacity
                      onPress={() => selectCategoryEvent(item)}
                      style={[
                        styles.categoryButton,
                        {
                          marginRight:
                            (index + 1) % 4 != 0
                              ? (deviceSize.deviceWidth - 40) * 0.026
                              : 0,
                        },
                        selectCategory.includes(item) && {
                          borderWidth: 1,
                          borderColor: colorSelect.navy,
                          borderRadius: 10,
                        },
                      ]}>
                      <Box mb="10px">
                        <Image
                          source={{
                            uri:
                              item.icon != ''
                                ? item.icon
                                : BASE_URL + '/images/careplzLogos.png',
                          }}
                          style={{
                            width: 58,
                            height: 50,
                            resizeMode: 'contain',
                          }}
                        />
                      </Box>

                      <Box>
                        <DefText
                          text={item.category}
                          style={[styles.categoryButtonText, {lineHeight: 22}]}
                        />
                      </Box>
                    </TouchableOpacity>
                  </Box>
                );
              })}
            </HStack>
          </Box>
        </ScrollView>
      )}
      <TouchableOpacity
        onPress={nextNavigationHandler}
        style={[
          styles.confirmButton,
          selectCategory.length > 0 && {backgroundColor: colorSelect.pink_de},
        ]}>
        <DefText
          text={selectCategory.length > 0 ? '다음' : '건너뛰기'}
          style={[
            styles.confirmButtonText,
            selectCategory.length > 0 && {color: colorSelect.white},
          ]}
        />
      </TouchableOpacity>
    </Box>
  );
};

const styles = StyleSheet.create({
  titleText: {
    ...fsize.fs18,
    ...fweight.bold,
  },
  categoryButton: {
    width: (deviceSize.deviceWidth - 40) * 0.23,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 5,
    marginVertical: 15,
  },
  categoryButtonText: {
    ...fsize.fs14,
    ...fweight.m,
    color: '#191919',
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
});

export default connect(({User}) => ({
  user_lang: User.user_lang,
}))(RegisterInterests);
