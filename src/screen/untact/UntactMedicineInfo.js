import React from 'react';
import { Box } from 'native-base';
import { DefText } from '../../common/BOOTSTRAP';

//약받기 설명
const UntactMedicineInfo = (props) => {
    
    const {navigation} = props;

    return (
        <Box flex={1} backgroundColor='#fff' >
            <DefText text='약받기 설명' />
        </Box>
    );
};

export default UntactMedicineInfo;