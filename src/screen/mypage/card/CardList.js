import React from 'react';
import { Box } from 'native-base';
import { DefText } from '../../common/BOOTSTRAP';

//등록한 카드 리스트 
const CardList = (props) => {
    
    const {navigation} = props;

    return (
        <Box flex={1} backgroundColor='#fff' >
            <DefText text='등록한 카드 리스트' />
        </Box>
    );
};

export default CardList;