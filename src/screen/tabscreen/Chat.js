import React from 'react';
import {Box} from 'native-base';
import { DefText } from '../../common/BOOTSTRAP';

const Chat = (props) => {

    const {navigation} = props;

    return (
        <Box>
            <DefText text="예약하기" />
        </Box>
    );
};

export default Chat;