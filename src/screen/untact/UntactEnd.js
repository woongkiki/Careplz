import React, {useEffect, useState} from 'react';
import {Box} from 'native-base';
import {Image, StyleSheet} from 'react-native';
import {DefButton, DefText} from '../../common/BOOTSTRAP';
import {BASE_URL} from '../../Utils/APIConstant';
import {colorSelect, fsize, fweight} from '../../common/StyleCommon';
import Header from '../../components/Header';
import Api from '../../Api';
import {connect} from 'react-redux';
import {actionCreators as UserAction} from '../../redux/module/action/UserAction';
import UntactHeader from '../../components/UntactHeader';
//import { SendbirdCalls } from '@sendbird/calls-react-native';

//비대면 진료 완료 - 3자통화 완료
const UntactEnd = props => {
  const {navigation, userInfo, user_lang, route} = props;
  const {params} = route;

  console.log(params);

  const [pageText, setPageText] = useState('');
  const [untactResult, setUntactResult] = useState('');

  const pageLangApi = async () => {
    //user_lang != null ? user_lang?.cidx : userInfo?.cidx
    await Api.send(
      'app_page',
      {
        cidx: user_lang != null ? user_lang?.cidx : userInfo?.cidx,
        code: 'untactEnd',
      },
      args => {
        let resultItem = args.resultItem;
        let arrItems = args.arrItems;

        if (resultItem.result === 'Y' && arrItems) {
          //console.log('병원지도 메인 언어 리스트: ', resultItem, arrItems);
          setPageText(arrItems.text);
        } else {
          console.log('병원지도 메인 언어 리스트 실패!', resultItem);
        }
      },
    );
    await Api.send(
      'untact_callEnd',
      {
        id: userInfo?.id,
        sendbird_roomid: params.roomId,
        cidx: user_lang != null ? user_lang?.cidx : userInfo?.cidx,
      },
      args => {
        let resultItem = args.resultItem;
        let arrItems = args.arrItems;

        if (resultItem.result === 'Y' && arrItems) {
          console.log('비대면 진료 완료 내역 리스트: ', resultItem, arrItems);
          setUntactResult(arrItems);
        } else {
          console.log('병원지도 메인 언어 리스트 실패!', resultItem);
        }
      },
    );
  };

  const [enterParam, setEnterParam] = useState({
    audioEnabled: true,
    videoEnabled: true,
  });

  const enterUntactRoom = async () => {
    //만들어진 룸으로 입장
    const roomIds = params.roomId;
    const room = await SendbirdCalls.fetchRoomById(roomIds);

    try {
      if (room) {
        await room.enter(enterParam);
        //replace(GroupRoutes.ROOM, { roomId: room.roomId });
        await callInApi();
        navigation.navigate('UntactCall', {
          roomId: room.roomId,
          isCreate: true,
        });
      }
    } catch (e) {
      console.log('[GroupCallEnterRoomScreen::ERROR] enter - ', e);
      //alert({ title: 'Enter a room', message: getErrorMessage(e) });
    }
  };

  const callInApi = () => {
    Api.send(
      'untact_callIn',
      {
        id: userInfo?.id,
        sendbird_roomid: params.roomId,
        cidx: user_lang != null ? user_lang?.cidx : userInfo?.cidx,
      },
      args => {
        let resultItem = args.resultItem;
        let arrItems = args.arrItems;

        if (resultItem.result === 'Y' && arrItems) {
          console.log('비대면 영상통화 입장 ㄱ: ', resultItem, arrItems);
          navigation.navigate('UntactCall', {
            roomId: params.roomId,
            isCreate: true,
          });
        } else {
          console.log('비대면 영상통화 입장 실패!', resultItem);
        }
      },
    );
  };

  useEffect(() => {
    pageLangApi();
  }, []);

  return (
    <Box flex={1} backgroundColor="#fff">
      <UntactHeader
        headerTitle=""
        backButtonStatus={true}
        navigation={navigation}
        backNavigation={enterUntactRoom}
      />
      <Box flex={1} alignItems={'center'} justifyContent="center" px="20px">
        <Image
          source={{uri: BASE_URL + '/images/untactEndIcon.png'}}
          style={{
            width: 77,
            height: 82,
            resizeMode: 'contain',
          }}
        />
        <Box mt="25px">
          <DefText
            text={pageText != '' ? pageText[0] : '비대면 진료가 끝났어요.'}
            style={[styles.labelTitle]}
          />
        </Box>
        <Box mt="10px">
          <DefText
            text={
              pageText != ''
                ? pageText[1]
                : '비대면 지료가 끝나면\n등록한 카드가 자동결제 됩니다.'
            }
            style={[styles.smallText]}
          />
        </Box>

        <DefButton
          text={pageText != '' ? pageText[2] : '진료내역을 확인하세요.'}
          btnStyle={{backgroundColor: colorSelect.pink_de, marginTop: 60}}
          txtStyle={{color: colorSelect.white, ...fweight.m}}
          onPress={() =>
            navigation.navigate('UntactClinicEndInfo', {roomId: params.roomId})
          }
        />
        <DefButton
          text={pageText != '' ? pageText[3] : '약은 이렇게 받아요.'}
          btnStyle={{borderWidth: 1, borderColor: '#D2D2DF', marginTop: 10}}
          txtStyle={{...fweight.m}}
          onPress={() =>
            navigation.navigate('UntactTakeMedicine', {idx: untactResult.idx})
          }
        />
      </Box>
    </Box>
  );
};

const styles = StyleSheet.create({
  labelTitle: {
    ...fsize.fs19,
    ...fweight.bold,
    color: '#191919',
    textAlign: 'center',
  },
  smallText: {
    ...fsize.fs16,
    lineHeight: 27,
    color: '#141414',
    textAlign: 'center',
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
)(UntactEnd);
