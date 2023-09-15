import React, {useEffect, useState} from 'react';
import {Box, Modal} from 'native-base';
import {DefText} from '../../common/BOOTSTRAP';
//import { GroupCallVideoView, SendbirdCalls, Room } from '@sendbird/calls-react-native';
import {connect} from 'react-redux';
import {actionCreators as UserAction} from '../../redux/module/action/UserAction';
import Api from '../../Api';
import {
  Alert,
  Image,
  Platform,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import useGroupCallRoom from '../../components/untact/useGroupCallRoom';
import {deviceSize} from '../../common/StyleCommon';
import {useKeepAwake} from '@sayem314/react-native-keep-awake';
import GroupCallVideoStreamView from '../../components/untact/GroupCallVideoStreamView';
import Header from '../../components/Header';
import RoomFooter from '../../components/untact/RoomFooter';
import {BASE_URL} from '../../Utils/APIConstant';
import AudioDeviceSelectModal from '../../components/AudioDeviceSelectModal';

const MARGIN_SIZE = 2;

//비대면 진료 3자 통화
const UntactCall = props => {
  const {navigation, userInfo, user_lang, route} = props;
  const {params} = route;
  const {roomId, isCreated} = params;

  const [visible, setVisible] = useState(false);
  const [layoutSize, setLayoutSize] = useState({width: 0, height: 0});

  // const rooms = async () => {
  //     const roomStatus = await Room();

  //     console.log("roomStatus", roomStatus);
  // }

  const {room, isFetched} = useGroupCallRoom(roomId);

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', () => {
      console.log(
        `[GroupCallRoomScreen::ERROR] beforeRemove - the room(${roomId}) is not found`,
      );
      if (room) {
        room.exit();
      }
    });

    return () => unsubscribe();
  }, [room]);

  useEffect(() => {
    if (isFetched && !room) {
      console.log(
        `[GroupCallRoomScreen::ERROR] goBack() - the room(${roomId}) is not found`,
      );
      navigation.goBack();
    }
  }, [isFetched]);

  //영상통화종료
  const callOutApi = () => {
    console.log('callOut');

    Api.send(
      'untact_callOut',
      {
        id: userInfo?.id,
        sendbird_roomid: roomId,
        cidx: user_lang != null ? user_lang?.cidx : userInfo?.cidx,
      },
      args => {
        let resultItem = args.resultItem;
        let arrItems = args.arrItems;

        if (resultItem.result === 'Y' && arrItems) {
          console.log('비대면 영상통화 종료 ㄱ: ', resultItem, arrItems);
        } else {
          console.log('비대면 영상통화 종료 실패!', resultItem);
        }
      },
    );
  };

  return (
    <Box flex={1} backgroundColor="#fff">
      <Header
        navigation={navigation}
        backButtonStatus={false}
        headerTitle={'화상채팅'}
        rightButton={
          <TouchableOpacity
            onPress={() => {
              if (Platform.OS === 'android') {
                setVisible(true);
              }
              if (Platform.OS === 'ios') {
                SendbirdCalls.ios_routePickerView();
              }
            }}>
            <Image
              source={{uri: BASE_URL + '/images/audioIconOn.png'}}
              alt="음향"
              style={{
                width: 40,
                height: 40,
                resizeMode: 'contain',
              }}
            />
          </TouchableOpacity>
        }
      />
      <Box style={[styles.videoView]}>
        {room && <GroupCallVideoStreamView room={room} />}
      </Box>
      <RoomFooter
        roomId={roomId}
        navigation={navigation}
        callOut={callOutApi}
      />

      {Platform.OS === 'android' && (
        <AudioDeviceSelectModal
          currentDevice={room?.android_currentAudioDevice}
          devices={room?.android_availableAudioDevices ?? []}
          visible={visible}
          onSelect={async device => {
            setVisible(false);
            device && (await room?.android_selectAudioDevice(device));
          }}
        />
      )}
      {/* <View
                onLayout={({
                nativeEvent: {
                    layout: { width, height },
                },
                }) => setLayoutSize({ width, height })}
            >

            </View>
            <GroupCallVideoView 
                roomId={params.roomId}
            /> */}
    </Box>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#161616',
  },
  videoView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#161616',
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
    member_logout: user => dispatch(UserAction.member_logout(user)), //로그아웃
  }),
)(UntactCall);
