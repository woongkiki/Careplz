import React, {useState} from 'react';
//import { SendbirdCalls, AudioDeviceRoute, Participant, Room, SendbirdError } from '@sendbird/calls-react-native';
import {useForceUpdate} from '../../hooks/useForceUpdate';
import {useNavigation} from '@react-navigation/native';
import {useLayoutEffectAsync} from '../../hooks/useEffectAsync';

const useGroupCallRoom = roomId => {
  const forceUpdate = useForceUpdate();

  const {canGoBack, goBack} = useNavigation();

  const [room, setRoom] = useState(null);
  const [isFetched, setIsFetched] = useState(false);
  const [currentAudioDeviceIOS, setCurrentAudioDeviceIOS] = useState({
    inputs: [],
    outputs: [],
  });

  const toggleLocalParticipantAudio = () => {
    if (room?.localParticipant?.isAudioEnabled) {
      room.localParticipant.muteMicrophone();
    } else {
      room?.localParticipant?.unmuteMicrophone();
    }
  };

  const toggleLocalParticipantVideo = () => {
    if (room?.localParticipant?.isVideoEnabled) {
      room.localParticipant.stopVideo();
    } else {
      room?.localParticipant?.startVideo();
    }
  };

  const flipCameraFrontAndBack = async () => {
    try {
      await room?.localParticipant?.switchCamera();
    } catch (e) {
      console.log('[useGroupCallRoom::ERROR] RoomScreen switchCamera - ', e);
    }
  };

  useLayoutEffectAsync(async () => {
    const room = await SendbirdCalls.getCachedRoomById(roomId);
    if (room) {
      setRoom(room);
      setIsFetched(true);

      return room.addListener({
        onPropertyUpdatedManually() {
          forceUpdate();
        },

        onDeleted() {
          canGoBack() && goBack();
        },
        onError(e, participant) {
          console.log(
            '[useGroupCallRoom] onError(e, participant) - ',
            e,
            participant,
          );
        },

        onRemoteParticipantEntered(participant) {
          forceUpdate();
          console.log(
            '[useGroupCallRoom] onRemoteParticipantEntered(participant) - ',
            participant,
          );
        },
        onRemoteParticipantExited(participant) {
          forceUpdate();
          console.log(
            '[useGroupCallRoom] onRemoteParticipantExited(participant) - ',
            participant,
          );
        },
        onRemoteParticipantStreamStarted(participant) {
          forceUpdate();
          console.log(
            '[useGroupCallRoom] onRemoteParticipantStreamStarted(participant) - ',
            participant,
          );
        },
        onRemoteVideoSettingsChanged(participant) {
          forceUpdate();
          console.log(
            '[useGroupCallRoom] onRemoteVideoSettingsChanged(participant) - ',
            participant,
          );
        },
        onRemoteAudioSettingsChanged(participant) {
          forceUpdate();
          console.log(
            '[useGroupCallRoom] onRemoteAudioSettingsChanged(participant) - ',
            participant,
          );
        },

        onAudioDeviceChanged({platform, data}) {
          console.log(
            '[useGroupCallRoom] onAudioDeviceChanged(platform, data) - ',
            data,
          );

          if (platform === 'ios') {
            setCurrentAudioDeviceIOS(data.currentRoute);
          } else {
            forceUpdate();
          }
        },

        onCustomItemsUpdated(updatedKeys) {
          forceUpdate();
          console.log(
            '[useGroupCallRoom] onCustomItemsUpdated(updatedKeys) - ',
            updatedKeys,
          );
        },
        onCustomItemsDeleted(deletedKeys) {
          forceUpdate();
          console.log(
            '[useGroupCallRoom] onCustomItemsDeleted(deletedKeys) - ',
            deletedKeys,
          );
        },
      });
    }

    return () => 0;
  }, []);

  return {
    room,
    isFetched,
    currentAudioDeviceIOS,
    toggleLocalParticipantAudio,
    toggleLocalParticipantVideo,
    flipCameraFrontAndBack,
  };
};

export default useGroupCallRoom;
