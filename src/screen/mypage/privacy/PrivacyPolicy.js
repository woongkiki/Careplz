import React from 'react';
import { Box } from 'native-base';
import { DefText } from '../../../common/BOOTSTRAP';
import Header from '../../../components/Header';


//알림 설정
const PrivacyPolicy = (props) => {
    
    const {navigation} = props;

    return (
        <Box flex={1} backgroundColor='#fff' >
           <Header 
                headerTitle="개인정보처리방침"
                backButtonStatus={true}
                navigation={navigation}
           />
        </Box>
    );
};

export default PrivacyPolicy;