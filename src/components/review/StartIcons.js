import React from 'react';
import { Image, TouchableOpacity } from 'react-native';
import { BASE_URL } from '../../Utils/APIConstant';

const StartIcons = (props) => {

    const {btnstyle, btnStatus, onPress, imgStyle} = props;

    return(
        <TouchableOpacity
            style={[btnstyle]}
            onPress={onPress}
        >
            <Image 
                source={{uri: btnStatus ? BASE_URL + "/images/startOn.png" : BASE_URL + "/images/startOff.png"}}
                style={[
                    {
                        width:29,
                        height:29,
                        resizeMode:'stretch'
                    },
                    imgStyle
                ]}
            />
        </TouchableOpacity>
    )
};

export default StartIcons;