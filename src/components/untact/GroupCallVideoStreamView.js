import {Box} from 'native-base';
import React, {useEffect, useState} from 'react';
import {StyleSheet, Platform, Image} from 'react-native';
import {DefText} from '../../common/BOOTSTRAP';
import {deviceSize} from '../../common/StyleCommon';
//import {GroupCallVideoView, LocalParticipant, ParticipantState} from '@sendbird/calls-react-native';
import {BASE_URL} from '../../Utils/APIConstant';

const width = deviceSize.deviceWidth;
const height = deviceSize.deviceHeight;

const MARGIN_SIZE = 2;

// const isLocalParticipant = (participant, localParticipant) => {
//     console.log("participant.participantId", participant.participantId);
//     console.log("localParticipant?.participantId", localParticipant?.participantId);
//     //participant.participantId === localParticipant?.participantId;
//   };

// const getIsEnable = (participant, localParticipant, type) => {
//     const isLocal = isLocalParticipant(participant, localParticipant);
//     if (type === 'video') {
//         return isLocal ? localParticipant?.isVideoEnabled : participant.isVideoEnabled;
//     }
// }

const GroupCallVideoStreamView = props => {
  const {room} = props;

  const [rowCol, setRowCol] = useState({row: 1, column: 1});
  const [viewSize, setViewSize] = useState({width: 0, height: 0});

  useEffect(() => {
    setRowCol(() => {
      if (room.participants.length > 2) {
        return {row: 2, column: 2};
      }
      if (room.participants.length == 2) {
        return {row: 2, column: 1};
      } else {
        return {row: 1, column: 1};
      }
    });
  }, [room.participants]);

  useEffect(() => {
    const {row, column} = rowCol;

    if (width !== 0 && height !== 0) {
      if (row > 1) {
        const layoutHeight = deviceSize.deviceHeight / 4;
        const layoutWidth = deviceSize.deviceWidth;

        setViewSize({width: layoutWidth, height: layoutHeight});
      } else {
        const layoutWidth = width / column - MARGIN_SIZE;
        const layoutHeight = layoutWidth * (height / width);

        setViewSize({width: layoutWidth, height: layoutHeight});
      }
    }
  }, [width, height, rowCol.row, rowCol.column]);

  return (
    <Box
      style={[
        styles.container,
        {
          maxWidth: viewSize.width * rowCol.column + MARGIN_SIZE * 4,
          flexWrap: rowCol.row === 1 ? 'nowrap' : 'wrap',
        },
      ]}>
      {room.participants.map((participant, index) => {
        // let idText;

        console.log(index, participant._props.user.metaData);

        if (participant._props.user.metaData.type == 'member') {
          idText = 'PATIENT : ';

          return (
            <Box
              key={participant.participantId}
              style={[
                {
                  position: 'absolute',
                  bottom: 0,
                  left: '-50%',
                  backgroundColor: '#161616',
                  width: deviceSize.deviceWidth / 2,
                  height: (deviceSize.deviceHeight - 100) / 2,
                },
              ]}>
              <GroupCallVideoView
                participant={participant}
                roomId={room.roomId}
                style={styles.videoView}
                resizeMode={'contain'}
              />
              <Box style={styles.userId}>
                {!getIsEnabled(participant, room.localParticipant, 'audio') && (
                  <Image
                    source={{uri: BASE_URL + '/images/iconAudioOffRed.png'}}
                    style={{
                      width: 11,
                      height: 11,
                      resizeMode: 'contain',
                      marginRight: 4,
                    }}
                  />
                )}
                <DefText
                  text={idText + participant.user.nickname}
                  style={{color: 'rgba(255,255,255,0.88)'}}
                />
              </Box>
            </Box>
          );
        } else if (participant._props.user.metaData.type == 'translator') {
          idText = 'TRANSLATOR : ';

          return (
            <Box
              key={participant.participantId}
              style={[
                {
                  position: 'absolute',
                  bottom: 0,
                  right: '-50%',
                  backgroundColor: '#161616',
                  width: deviceSize.deviceWidth / 2,
                  height: (deviceSize.deviceHeight - 100) / 2,
                },
              ]}>
              <GroupCallVideoView
                participant={participant}
                roomId={room.roomId}
                style={styles.videoView}
                resizeMode={'contain'}
              />
              <Box style={styles.userId}>
                {!getIsEnabled(participant, room.localParticipant, 'audio') && (
                  <Image
                    source={{uri: BASE_URL + '/images/iconAudioOffRed.png'}}
                    style={{
                      width: 11,
                      height: 11,
                      resizeMode: 'contain',
                      marginRight: 4,
                    }}
                  />
                )}
                <DefText
                  text={idText + participant.user.nickname}
                  style={{color: 'rgba(255,255,255,0.88)'}}
                />
              </Box>
            </Box>
          );
        } else {
          idText = 'HOSPITAL : ';

          return (
            <Box
              key={participant.participantId}
              style={[
                {
                  position: 'absolute',
                  top: 0,
                  left: '-50%',
                  backgroundColor: '#161616',
                  width: deviceSize.deviceWidth,
                  height: (deviceSize.deviceHeight - 100) / 3,
                },
              ]}>
              <GroupCallVideoView
                participant={participant}
                roomId={room.roomId}
                style={styles.videoView}
                resizeMode={'contain'}
              />
              <Box style={styles.userId}>
                {!getIsEnabled(participant, room.localParticipant, 'audio') && (
                  <Image
                    source={{uri: BASE_URL + '/images/iconAudioOffRed.png'}}
                    style={{
                      width: 11,
                      height: 11,
                      resizeMode: 'contain',
                      marginRight: 4,
                    }}
                  />
                )}
                <DefText
                  text={idText + participant.user.nickname}
                  style={{color: 'rgba(255,255,255,0.88)'}}
                />
              </Box>
            </Box>
          );
        }
      })}
    </Box>
  );
};

const isLocalParticipant = (participant, localParticipant) => {
  return participant.participantId === localParticipant?.participantId;
};

const getIsEnabled = (participant, localParticipant, type) => {
  const isLocal = isLocalParticipant(participant, localParticipant);
  if (type === 'video') {
    return isLocal
      ? localParticipant?.isVideoEnabled
      : participant.isVideoEnabled;
  } else {
    // audio
    return isLocal
      ? localParticipant?.isAudioEnabled
      : participant.isAudioEnabled;
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  videoView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2C2C2C',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#BDBDBD',
  },
  userId: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    height: 20,
    backgroundColor: 'rgba(0,0,0,0.55)',
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
});

export default GroupCallVideoStreamView;
