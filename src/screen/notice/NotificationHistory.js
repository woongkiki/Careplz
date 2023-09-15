import React, {useCallback, useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {actionCreators as UserAction} from '../../redux/module/action/UserAction';
import {Box, HStack} from 'native-base';
import Header from '../../components/Header';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Loading from '../../components/Loading';
import {
  Alert,
  Animated,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {BASE_URL} from '../../Utils/APIConstant';
import {DefText} from '../../common/BOOTSTRAP';
import {
  colorSelect,
  deviceSize,
  fsize,
  fweight,
} from '../../common/StyleCommon';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import {RectButton} from 'react-native-gesture-handler';

const data = [
  {
    idx: 1,
    type: 2,
    hospital: '굿플랜치과',
    subject: '치과',
    content: '03.29(일) 11:00 재예약 되었습니다.',
    thumb: BASE_URL + '/images/careplzeAppIcons.png',
  },
  {
    idx: 2,
    type: 2,
    hospital: '굿플랜치과',
    subject: '치과',
    content: '03.29(일) 진료 1시간 전입니다.',
    thumb: BASE_URL + '/images/careplzeAppIcons.png',
  },
  {
    idx: 3,
    type: 1,
    hospital: '굿플랜치과',
    subject: '치과',
    content: '03.29(일) 11:00 예약확정 되었습니다.',
    thumb: BASE_URL + '/images/careplzeAppIcons.png',
  },
];

const widths = deviceSize.deviceWidth;

const RenderRight = (progress, dragX) => {
  //   console.log('dragX', dragX);

  //   const opacity = dragX.interpolate({
  //     inputRange: [0, 20],
  //     outputRange: [1, 0.5],
  //   });
  //   const AnimatedButton = Animated.createAnimatedComponent(TouchableOpacity);

  return (
    <TouchableOpacity
      style={{
        width: 60,
        backgroundColor: '#B2BBC8',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <DefText text={'삭제'} />
    </TouchableOpacity>
  );
};

const NotificationHistory = props => {
  const {navigation, route} = props;
  const {name} = route;
  const {top} = useSafeAreaInsets();

  const [loading, setLoading] = useState(true);

  const keyExtractor = useCallback(item => item.idx.toString(), []);

  const pageApi = async () => {
    await setLoading(true);
    await setLoading(false);
  };

  useEffect(() => {
    pageApi();
  }, []);

  return (
    <Box flex={1} backgroundColor={'#fff'} pt={top + 'px'}>
      <Header
        headerTitle={'알림내역'}
        navigation={navigation}
        backButtonStatus={true}
      />
      {loading ? (
        <Loading />
      ) : (
        <FlatList
          data={data}
          keyExtractor={keyExtractor}
          renderItem={({item, index}) => {
            return (
              <Box pr="20px">
                <Swipeable
                  useNativeAnimations
                  overshootRight={false}
                  //onSwipeableRightOpen={() => deleteItem(item.id)}
                  renderRightActions={RenderRight}>
                  <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => Alert.alert('screen move!!')}
                    style={{
                      backgroundColor: '#fff',
                      paddingLeft: 20,
                    }}>
                    <HStack flexWrap={'wrap'} borderBottomWidth={1} py="20px">
                      <Image
                        source={{uri: item.thumb}}
                        style={{
                          width: 50,
                          height: 50,
                          resizeMode: 'stretch',
                          borderRadius: 50,
                        }}
                      />
                      <Box width={widths - 90} pl="15px">
                        <HStack>
                          <Box
                            px="10px"
                            py="5px"
                            backgroundColor={colorSelect.pink_de}
                            borderRadius={5}>
                            <DefText
                              text={'이벤트 예약 알림'}
                              style={[fsize.fs13, {color: colorSelect.white}]}
                            />
                          </Box>
                        </HStack>
                        <HStack alignItems={'center'} mt="10px">
                          <DefText
                            text={item.hospital}
                            style={[fsize.fs15, {color: '#7C7C7C'}]}
                          />
                          <Box
                            width={'1px'}
                            height={'10px'}
                            backgroundColor={'#7C7C7C'}
                            mx="10px"
                          />
                          <DefText
                            text={item.subject}
                            style={[fsize.fs15, {color: '#7C7C7C'}]}
                          />
                        </HStack>
                        <Box mt="10px">
                          <DefText
                            text={'03.29 (일) 11:00 재예약 되었습니다.'}
                            style={[
                              fsize.fs15,
                              fweight.bold,
                              {color: colorSelect.navy},
                            ]}
                          />
                        </Box>
                      </Box>
                    </HStack>
                  </TouchableOpacity>
                </Swipeable>
              </Box>
            );
          }}
        />
      )}
    </Box>
  );
};

export default connect(({User}) => ({
  userInfo: User.userInfo, //회원정보
  user_lang: User.user_lang,
}))(NotificationHistory);
