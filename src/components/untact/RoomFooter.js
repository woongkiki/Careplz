import { Box, HStack } from 'native-base';
import React from 'react';
import {Image, TouchableOpacity} from 'react-native';
import { BASE_URL } from '../../Utils/APIConstant';
import useGroupCallRoom from './useGroupCallRoom';

const RoomFooter = (props) => {

    const {navigation, roomId, callOut} = props;

    console.log("roomFooter", roomId);
    const { room, toggleLocalParticipantAudio, toggleLocalParticipantVideo } = useGroupCallRoom(roomId);

    const exit = () => {
        room?.exit();
        callOut();
        navigation.replace("UntactEnd", {"roomId":roomId});
    };

    return (
        <Box backgroundColor={'#161616'} py='15px' justifyContent={'center'} alignItems='center'>
            <HStack>
                <TouchableOpacity onPress={toggleLocalParticipantAudio}>
                    <Image
                        source={{uri:
                            room?.localParticipant?.isAudioEnabled ?
                            BASE_URL + "/images/btnAudioOff.png"
                            :
                            BASE_URL + "/images/btnAudioOffSelected.png"
                        }}
                        alt="닫기"
                        style={{
                            width:40,
                            height:40,
                            resizeMode:'contain'
                        }}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    style={{marginHorizontal:15}}
                    onPress={toggleLocalParticipantVideo}
                >
                    <Image
                        source={{uri:
                            room?.localParticipant?.isVideoEnabled ? 
                            BASE_URL + "/images/btnVideoOff.png"
                            :
                            BASE_URL + "/images/btnVideoOffSelected.png"
                        }}
                        alt="닫기"
                        style={{
                            width:40,
                            height:40,
                            resizeMode:'contain'
                        }}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={exit}>
                    <Image
                        source={{uri:BASE_URL + "/images/btnCallEnd.png"}}
                        alt="닫기"
                        style={{
                            width:40,
                            height:40,
                            resizeMode:'contain'
                        }}
                    />
                </TouchableOpacity>
            </HStack>
        </Box>
    );
};

export default RoomFooter;