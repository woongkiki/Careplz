import { Box, HStack } from 'native-base';
import React from 'react';
import { StyleSheet } from 'react-native';
import { DefText } from '../../common/BOOTSTRAP';
import { colorSelect, fsize, fweight } from '../../common/StyleCommon';

const ReservationCheck = (props) => {

    const {rtime, rdate, hospital, subject, reserTitle, cfText} = props;

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
            <HStack
                alignItems={'center'}
                mt='10px'
            >
                <DefText 
                    text={ hospital }
                    style={[styles.mediumText]}
                />
                <DefText 
                    text="/"
                    style={[
                        styles.mediumText,
                        {marginHorizontal:5}
                    ]}
                />
                <DefText 
                    text={subject}
                    style={[styles.mediumText]}
                />
            </HStack>
            <DefText 
                text={rdate + " " + rtime + " " + cfText}
                style={[styles.grayText]}
            />
        </Box>
    );
};

const styles = StyleSheet.create({
    titleBold: {
        ...fweight.bold,
        color:colorSelect.navy
    },
    mediumText: {
        ...fsize.fs14,
        ...fweight.m
    },
    grayText: {
        ...fsize.fs14,
        color:'#6C6C6C',
        marginTop:10
    },
})

export default ReservationCheck;