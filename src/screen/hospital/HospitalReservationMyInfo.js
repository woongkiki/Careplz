import React from 'react';
import { Box } from 'native-base';
import { DefText } from '../../common/BOOTSTRAP';

//병원 예약시 내 정보 입력하기
const HospitalReservationMyInfo = (props) => {

    const {navigation} = props;

    return (
        <Box flex={1} backgroundColor='#fff' >
            <DefText text="병원 예약시 내 정보 입력하기" />
        </Box>
    );
};

export default HospitalReservationMyInfo;