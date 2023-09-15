import React from 'react';
import { Box } from 'native-base';
import { DefText } from '../../common/BOOTSTRAP';

//병원 예약상세
const HospitalReservationInfo = (props) => {

    const {navigation} = props;

    return (
        <Box flex={1} backgroundColor='#fff' >
            <DefText text="병원 예약상세" />
        </Box>
    );
};

export default HospitalReservationInfo;