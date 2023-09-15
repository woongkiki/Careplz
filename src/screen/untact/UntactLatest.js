import React from 'react';
import { Box } from 'native-base';
import { DefText } from '../../common/BOOTSTRAP';

//최근 비대면 진료 내역
const UntactLatest = (props) => {
    
    const {navigation} = props;

    return (
        <Box flex={1} backgroundColor='#fff' >
            <DefText text='최근 비대면 진료 내역' />
        </Box>
    );
};

export default UntactLatest;