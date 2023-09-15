import {Box, HStack} from 'native-base';
import React, {useCallback, useMemo, useRef, useState} from 'react';
import {DefText, LabelTitle} from '../../common/BOOTSTRAP';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Header from '../../components/Header';
import {FlatList, Image, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Fontisto';
import EntypoIcon from 'react-native-vector-icons/dist/Entypo';
import {
  colorSelect,
  deviceSize,
  fsize,
  fweight,
} from '../../common/StyleCommon';
import EmptyPage from '../../components/EmptyPage';
import {connect} from 'react-redux';
import {actionCreators as UserAction} from '../../redux/module/action/UserAction';
import FixButtons from '../../components/FixButtons';
import BottomNavi from '../../components/bottom/BottomNavi';
import {BASE_URL} from '../../Utils/APIConstant';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetFlatList,
  BottomSheetHandle,
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';

const HealthHandbook = props => {
  const {navigation, userInfo, user_lang, route} = props;
  const {name} = route;
  const {top} = useSafeAreaInsets();

  const [arrStatus, setArrStatus] = useState(true);
  const [tabSelect, setTabSelect] = useState('1');
  const [healthList, setHealthList] = useState([
    {
      category: '푸드클래스',
      title: '만개의 레시피',
      subTitle: '초보도 따라 할 수 있는 6가지 쿠키 레시피',
      content:
        '잔뜩 구워서 나도 먹고 너도 먹고 함께 먹기 좋은 \n수제 쿠키 어때요?',
      thumb: BASE_URL + '/newImg/healthNewsThum01.png',
      tag: ['홈베이킹', '아이간식'],
    },
    {
      category: '푸드클래스',
      title: '만개의 레시피',
      subTitle: '초보도 따라 할 수 있는 6가지 쿠키 레시피',
      content:
        '잔뜩 구워서 나도 먹고 너도 먹고 함께 먹기 좋은 \n수제 쿠키 어때요?',
      thumb: BASE_URL + '/newImg/healthNewsThum02.png',
      tag: [],
    },
    {
      category: '푸드클래스',
      title: '만개의 레시피',
      subTitle: '초보도 따라 할 수 있는 6가지 쿠키 레시피',
      content:
        '잔뜩 구워서 나도 먹고 너도 먹고 함께 먹기 좋은 \n수제 쿠키 어때요?',
      thumb: BASE_URL + '/newImg/healthNewsThum01.png',
      tag: ['홈베이킹', '아이간식'],
    },
    {
      category: '푸드클래스',
      title: '만개의 레시피',
      subTitle: '초보도 따라 할 수 있는 6가지 쿠키 레시피',
      content:
        '잔뜩 구워서 나도 먹고 너도 먹고 함께 먹기 좋은 \n수제 쿠키 어때요?',
      thumb: BASE_URL + '/newImg/healthNewsThum02.png',
      tag: ['홈베이킹', '아이간식'],
    },
  ]);

  //바텀시트
  const bottomSheetModalHealthNotelRef = useRef(null);

  const snapPointsHealthNote = useMemo(() => [24, '78%']);

  const handleHealthNoteCategoryPress = useCallback(() => {
    //bottomSheetModalRef.current?.close();
    bottomSheetModalHealthNotelRef.current?.snapToIndex(1);
    setArrStatus(false);
  }, []);

  const handleHealthNoteChanges = useCallback(index => {
    console.log('handleSheetChanges', index);

    if (index == 0) {
      setArrStatus(true);
    } else {
      setArrStatus(false);
    }
  });

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

  const HandleComponent = props => (
    <Box
      {...props}
      height="24px"
      backgroundColor={'#B2BBC8'}
      borderTopLeftRadius={10}
      borderTopRadius={10}
      alignItems={'center'}
      justifyContent={'center'}>
      <Image
        source={{
          uri: arrStatus
            ? BASE_URL + '/newImg/bottomSheetTopArr.png'
            : BASE_URL + '/newImg/bottomSheetBotArr.png',
        }}
        style={{
          width: 12,
          height: 20,
          resizeMode: 'contain',
        }}
      />
    </Box>
  );

  const tabChangeHandler = tabNum => {
    setTabSelect(tabNum);
  };

  const _renderItem = ({item, index}) => {
    return (
      <TouchableOpacity>
        <Box px="20px" mt={index != 0 ? '30px' : 0}>
          <Box borderRadius={5} overflow={'hidden'}>
            <Image
              source={{uri: item.thumb}}
              style={{
                width: deviceSize.deviceWidth - 40,
                height: 200,
                resizeMode: 'stretch',
              }}
            />
          </Box>
          <Box>
            <HStack my="10px">
              {item.category != '' && (
                <DefText
                  text={'[' + item.category + '] '}
                  style={[styles.healthNewsTitles]}
                />
              )}
              <DefText text={item.title} style={[styles.healthNewsTitles]} />
            </HStack>
            <Box>
              <DefText
                text={item.subTitle}
                style={[styles.healthNewsSubTitles]}
              />
            </Box>
            <Box mt="5px">
              <DefText
                text={item.content}
                style={[styles.healthNewsContents]}
              />
            </Box>
            {item.tag != '' && (
              <HStack flexWrap={'wrap'} mt="5px">
                {item.tag.map((tags, idx) => {
                  return (
                    <Box key={idx} ml={idx != 0 ? '5px' : 0}>
                      <DefText
                        text={'# ' + tags}
                        style={[styles.healthNewsTags]}
                      />
                    </Box>
                  );
                })}
              </HStack>
            )}
          </Box>
        </Box>
      </TouchableOpacity>
    );
  };

  const keyExtractor = useCallback((item, index) => index.toString(), []);

  return (
    <GestureHandlerRootView
      style={{flex: 1, backgroundColor: '#fff', paddingTop: top}}>
      <Header
        headerTitle="건강수첩"
        rightButton={
          <TouchableOpacity>
            <Icon name={'bell'} size={22} />
          </TouchableOpacity>
        }
      />
      <HStack>
        <TouchableOpacity
          onPress={() => tabChangeHandler(1)}
          style={[styles.tabButton]}>
          <Box
            py="15px"
            width="100%"
            alignItems={'center'}
            borderBottomWidth={4}
            borderBottomColor={tabSelect == 1 ? colorSelect.pink_de : '#fff'}>
            <DefText
              text={'건강소식'}
              style={[
                tabSelect == 1 ? fweight.bold : fweight.r,
                {color: tabSelect == 1 ? colorSelect.pink_de : '#000'},
              ]}
            />
          </Box>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => tabChangeHandler(2)}
          style={[styles.tabButton]}>
          <Box
            py="15px"
            width="100%"
            alignItems={'center'}
            borderBottomWidth={4}
            borderBottomColor={tabSelect == 2 ? colorSelect.pink_de : '#fff'}>
            <DefText
              text={'건강수첩'}
              style={[
                tabSelect == 2 ? fweight.bold : fweight.r,
                {color: tabSelect == 2 ? colorSelect.pink_de : '#000'},
              ]}
            />
          </Box>
        </TouchableOpacity>
      </HStack>
      {tabSelect == 1 && (
        <Box flex={1}>
          {healthList != '' ? (
            <FlatList
              ListHeaderComponent={<Box height="20px" />}
              data={healthList}
              renderItem={_renderItem}
              keyExtractor={keyExtractor}
              ListFooterComponent={<Box height="80px" />}
            />
          ) : (
            <EmptyPage emptyText={'등록된 건강소식이 없습니다.'} />
          )}
        </Box>
      )}

      {tabSelect == 2 && (
        <BottomSheet
          ref={bottomSheetModalHealthNotelRef}
          index={0}
          snapPoints={snapPointsHealthNote}
          onChange={handleHealthNoteChanges}
          handleStyle={{
            backgroundColor: '#B2BBC8',
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
          }}
          handleHeight={24}
          handleIndicatorStyle={{backgroundColor: '#fff'}}
          handleComponent={HandleComponent}
          //backdropComponent={renderBackdrop}
        >
          <Box px="20px">
            <HStack
              flexWrap={'wrap'}
              justifyContent={'space-between'}
              alignItems={'center'}
              py="20px"
              borderBottomWidth={1}
              borderBottomColor={'#E3E3E3'}>
              <LabelTitle
                text={'나의 건강상태'}
                txtStyle={{lineHeight: 26, ...fweight.m}}
              />
              <TouchableOpacity
                style={{
                  height: 25,
                  paddingHorizontal: 10,
                  backgroundColor: colorSelect.pink_de,
                  justifyContent: 'center',
                  borderRadius: 4,
                }}>
                <DefText text={'추가'} style={[fsize.fs13, {color: '#fff'}]} />
              </TouchableOpacity>
            </HStack>
          </Box>
          <BottomSheetScrollView></BottomSheetScrollView>
        </BottomSheet>
      )}
      {userInfo != null && userInfo != undefined && <FixButtons />}
      {/* <BottomNavi navigation={navigation} screenName={name} /> */}
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  tabButton: {
    width: deviceSize.deviceWidth / 2,
    borderBottomWidth: 1,
    borderBottomColor: '#D2DCE8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  healthNewsTitles: {
    ...fsize.fs15,
    ...fweight.bold,
    lineHeight: 21,
    color: '#E4BA5C',
  },
  healthNewsSubTitles: {
    ...fsize.fs15,
    ...fweight.bold,
    lineHeight: 21,
  },
  healthNewsContents: {
    ...fsize.fs15,
    ...fweight.r,
    lineHeight: 21,
  },
  healthNewsTags: {
    ...fsize.fs13,
    ...fweight.r,
    lineHeight: 19,
    color: '#505050',
  },
});

export default connect(
  ({User}) => ({
    userInfo: User.userInfo, //회원정보
    user_lang: User.user_lang,
  }),
  dispatch => ({
    member_login: user => dispatch(UserAction.member_login(user)), //로그인
    languageSet: user => dispatch(UserAction.languageSet(user)), //언어
  }),
)(HealthHandbook);
