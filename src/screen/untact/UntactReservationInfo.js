import React from 'react';
import { Box } from 'native-base';
import { DefText } from '../../common/BOOTSTRAP';

//비대면 진료 예약 상세
const UntactReservationInfo = (props) => {
    
    const {navigation} = props;

    return (
        <Box flex={1} backgroundColor='#fff' >
            <DefText text='비대면 진료 예약 상세' />
        </Box>
    );
};

export default UntactReservationInfo;