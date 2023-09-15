import { Box } from 'native-base';
import React from 'react';
import { ActivityIndicator } from 'react-native';
import { DefText } from '../common/BOOTSTRAP';
import { colorSelect, deviceSize, fweight } from '../common/StyleCommon';

const UploadLoading = (props) => {

    const {loadingText} = props;

    return (
        <Box 
            flex={1}
            backgroundColor={"rgba(0,0,0,0.6)"}
            position={'absolute'}
            width={deviceSize.deviceWidth}
            height={'100%'}
            alignItems={"center"}
            justifyContent={"center"}
        >
            <ActivityIndicator 
                size={'large'}
                color={"#fff"}
            />
            <DefText 
                text={loadingText} 
                style={[fweight.m, {color:colorSelect.white, marginTop:20, textAlign:'center'}]}
            />
        </Box>
    );
};

export default UploadLoading;