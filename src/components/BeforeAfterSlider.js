import {Box} from 'native-base';
import React, {useState} from 'react';
import Compare, {
  Before,
  After,
  DefaultDragger,
  Dragger,
} from 'react-native-before-after-slider-v2';
import {deviceSize} from '../common/StyleCommon';
import {Image, View} from 'react-native';
import {BASE_URL} from '../Utils/APIConstant';

const BeforeAfterSlider = props => {
  const {navigation, afterImage, beforeImage} = props;

  const [state, setState] = useState({scrollEnabled: true});

  const onMoveStart = () => {
    setState({scrollEnabled: false});
  };
  const onMoveEnd = () => {
    setState({scrollEnabled: true});
  };

  return (
    <Box>
      <Compare
        initial={(deviceSize.deviceWidth - 40) / 2}
        draggerWidth={50}
        width={deviceSize.deviceWidth - 40}
        onMoveStart={onMoveStart}
        onMoveEnd={onMoveEnd}>
        <Before>
          <Image
            source={{
              uri: afterImage,
            }}
            style={{
              width: deviceSize.deviceWidth - 40,
              height: deviceSize.deviceWidth / 2,
              resizeMode: 'stretch',
            }}
          />
        </Before>
        <After>
          <Image
            source={{
              uri: beforeImage,
            }}
            style={{
              width: deviceSize.deviceWidth - 40,
              height: deviceSize.deviceWidth / 2,
              resizeMode: 'stretch',
            }}
          />
        </After>
        <Dragger>
          <View
            style={{
              position: 'absolute',
              top: 0,
              right: 24,
              bottom: 0,
              left: 24,
              backgroundColor: '#fff',
              width: 2,
            }}></View>
          <View
            style={{
              position: 'absolute',
              top: deviceSize.deviceWidth / 4.5,
              left: 8,
              width: 35,
              height: 35,
              marginTop: -17,
              borderRadius: 20,
            }}>
            <Image
              source={{uri: BASE_URL + '/newImg/basliderIcon.png'}}
              style={{
                width: 35,
                height: 35,
                resizeMode: 'contain',
              }}
            />
          </View>
        </Dragger>
      </Compare>
    </Box>
  );
};

export default BeforeAfterSlider;
