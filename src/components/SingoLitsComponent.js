import { HStack } from 'native-base';
import React from 'react';
import { Image, TouchableOpacity } from 'react-native';
import { DefText } from '../common/BOOTSTRAP';
import { colorSelect, fsize, fweight } from '../common/StyleCommon';
import { BASE_URL } from '../Utils/APIConstant';

const SingoLitsComponent = (props) => {

    const {reason, onPress, selectReason, idx} = props;

    return (
        <TouchableOpacity
            style={{marginTop:30}}
            onPress={onPress}
        >
            <HStack
                alignItems={'center'}
                justifyContent='space-between'
            >
                <DefText 
                    text={reason}
                    style={[{
                            color: idx == selectReason ? colorSelect.navy : "#AEAEAE",    
                        },
                        idx == selectReason ? fweight.bold : fweight.r,
                        fsize.fs15
                    ]}
                />
                {
                    idx == selectReason &&
                    <Image 
                        source={{uri:BASE_URL + "/images/checkIconNavy.png"}}
                        style={{
                            width:13,
                            height:10,
                            resizeMode:'contain'
                        }}
                    />
                }
            </HStack>
        </TouchableOpacity>
    );
};

export default SingoLitsComponent;