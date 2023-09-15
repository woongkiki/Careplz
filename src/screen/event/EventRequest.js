import React from 'react';
import { Box } from 'native-base';
import { DefText } from '../../common/BOOTSTRAP';

//이벤트 신청하기
const EventRequest = (props) => {

    const {navigation} = props;

    return (
        <Box flex={1} backgroundColor='#fff' >
            <DefText text="이벤트 신청하기" />
        </Box>
    );
};

export default EventRequest;