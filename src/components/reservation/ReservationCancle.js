import { Box, HStack } from 'native-base';
import React from 'react';
import { StyleSheet } from 'react-native';
import { DefText } from '../../common/BOOTSTRAP';
import { colorSelect, fsize, fweight } from '../../common/StyleCommon';

const ReservationCancle = (props) => {

    const {hospital, hename, cmemo, reserTitle, cancleTexts, reasons} = props;

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
                    text={ hospital != "" ? hospital : "-"}
                    style={[styles.mediumText]}
                />
                {/* <DefText 
                    text="/"
                    style={[
                        styles.mediumText,
                        {marginHorizontal:5}
                    ]}
                />
                <DefText 
                    text={ hename != "" ? hename : "내과"}
                    style={[styles.mediumText]}
                /> */}
            </HStack>
            <DefText 
                text={cancleTexts}
                style={[styles.grayText]}
            />
            {
                cmemo != "" &&
                <Box
                    mt='10px'
                >
                    <DefText 
                        text={reasons + " : " + cmemo}
                        style={[styles.cancleText]}
                    />
                </Box>
            }
            
        </Box>
    );
};

const styles = StyleSheet.create({
    titleBold: {
        ...fweight.bold,
        color:"#E11B1B"
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
    cancleText: {
        ...fsize.fs14,
        ...fweight.m
    }
})

export default ReservationCancle;