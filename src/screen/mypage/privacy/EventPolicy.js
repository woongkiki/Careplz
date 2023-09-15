import React from 'react';
import { Box } from 'native-base';
import { DefText } from '../../../common/BOOTSTRAP';
import Header from '../../../components/Header';

const EventPolicy = (props) => {

    const {navigation} = props;

    return (
        <Box backgroundColor={'#fff'} flex={1}>
            <Header 
                headerTitle="혜택, 이용정보 수신 약관"
                backButtonStatus={true}
                navigation={navigation}
            />
        </Box>
    );
};

export default EventPolicy;