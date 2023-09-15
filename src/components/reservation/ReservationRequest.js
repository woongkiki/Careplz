import { Box } from 'native-base';
import React from 'react';
import { StyleSheet } from 'react-native';
import { DefText } from '../../common/BOOTSTRAP';
import { fsize, fweight } from '../../common/StyleCommon';

const ReservationRequest = (props) => {

    const {reserTitle, reserText} = props;

    return (
        <Box
            backgroundColor={'#fff'}
            borderRadius={10}
            shadow={8}
            p='20px'
            alignItems={'center'}
        >
            <DefText 
                text={reserTitle}
                style={[styles.titleBold]}
            />
            <DefText 
                text={reserText}
                style={[styles.grayText]}
            />
        </Box>
    );
};

const styles = StyleSheet.create({
    titleBold: {
        ...fweight.bold
    },
    grayText: {
        ...fsize.fs14,
        color:'#6C6C6C',
        marginTop:10
    },
})

export default ReservationRequest;