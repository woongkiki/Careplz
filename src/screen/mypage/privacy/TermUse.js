import React from 'react';
import { Box } from 'native-base';
import { DefText } from '../../../common/BOOTSTRAP';
import Header from '../../../components/Header';

const TermUse = (props) => {

    const {navigation} = props;

    return (
        <Box backgroundColor={'#fff'} flex={1}>
            <Header 
                headerTitle="서비스 이용약관"
                backButtonStatus={true}
                navigation={navigation}
            />
        </Box>
    );
};

export default TermUse;