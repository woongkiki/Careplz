import {Box, HStack} from 'native-base';
import React, {useCallback, useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {actionCreators as UserAction} from '../../redux/module/action/UserAction';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import ChatHeader from './ChatHeader';
import {GiftedChat, Composer, Send, Bubble} from 'react-native-gifted-chat';
import Loading from '../../components/Loading';
import {Image, TouchableOpacity} from 'react-native';
import {BASE_URL} from '../../Utils/APIConstant';
import {DefText} from '../../common/BOOTSTRAP';
import {numberFormat} from '../../common/DataFunction';
import {
  colorSelect,
  deviceSize,
  fsize,
  fweight,
} from '../../common/StyleCommon';

const ChatView = props => {
  const {navigation, route, userInfo, user_lang} = props;
  const {name} = route;
  const {top} = useSafeAreaInsets();

  const [loading, setLoading] = useState(true);
  const [messages, setMessage] = useState([]);

  const chatApi = async () => {
    await setLoading(true);
    await setMessage([
      {
        _id: 1,
        text: 'Hello developer',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'React Native',
          avatar: 'https://placeimg.com/140/140/any',
        },
      },
    ]);
    await setLoading(false);
  };

  //전송
  const onSend = useCallback((messages = []) => {
    setMessage(previousMessages =>
      GiftedChat.append(previousMessages, messages),
    );
  }, []);

  useEffect(() => {
    chatApi();

    return (cleanUp = () => {
      console.log('chating clean!');
    });
  }, []);

  return (
    <Box flex={1} backgroundColor={'#fff'} pt={top + 'px'}>
      <ChatHeader
        navigation={navigation}
        userInfo={userInfo}
        user_lang={user_lang}
      />
      <HStack px="20px" flexWrap={'wrap'} pt="20px">
        <Box>
          <Image
            source={{uri: BASE_URL + '/images/chatEventThumb.png'}}
            style={{
              width: 68,
              height: 68,
              resizeMode: 'contain',
            }}
          />
        </Box>
        <Box width={deviceSize.deviceWidth - 108} pl="20px">
          <DefText
            text={'지방이식 2차포함 129만원'}
            style={[fsize.fs17, fweight.bold, {lineHeight: 25}]}
          />
          <DefText
            text={numberFormat(1290000) + '원'}
            style={[fsize.fs14, fweight.bold, {lineHeight: 20, marginTop: 5}]}
          />
        </Box>
        <Box position={'absolute'} bottom={0} right={'20px'}>
          <TouchableOpacity
            style={{
              paddingHorizontal: 10,
              height: 26,
              justifyContent: 'center',
              backgroundColor: colorSelect.navy,
              borderRadius: 4,
            }}>
            <DefText
              text={'이벤트 내용 확인하기'}
              style={[
                fsize.fs13,
                fweight.bold,
                {color: '#fff', lineHeight: 26},
              ]}
            />
          </TouchableOpacity>
        </Box>
      </HStack>
      {loading ? (
        <Loading />
      ) : (
        <GiftedChat
          messages={messages}
          label="전송"
          placeholder="메세지를 입력하세요"
          alignTop
          autoCapitalize="none"
          locale={'ko'}
          timeFormat={'LT'}
          color={'#333333'}
          onSend={messages => onSend(messages)}
          user={{
            _id: userInfo?.id,
          }}
          messagesContainerStyle={{
            backgroundColor: '#fff',
            paddingHorizontal: 0,
          }}
          textInputProps={{autoCapitalize: 'none'}}
          showUserAvatar={false}
          wrapInSafeArea={false}
          renderAvatarOnTop={true}
          inverted={true}
        />
      )}
    </Box>
  );
};

export default connect(
  ({User}) => ({
    userInfo: User.userInfo, //회원정보
    user_lang: User.user_lang,
  }),
  dispatch => ({
    member_login: user => dispatch(UserAction.member_login(user)), //로그인
    languageSet: user => dispatch(UserAction.languageSet(user)), //선택언어
  }),
)(ChatView);
