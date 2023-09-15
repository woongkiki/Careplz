import { Box, HStack } from 'native-base';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { DefText } from '../../common/BOOTSTRAP';
import { colorSelect, deviceSize, fsize, fweight } from '../../common/StyleCommon';

const ReviewQaBox = (props) => {

    const { borderStatus, qaTitle, selectA, onPress, onPress2, onPress3, btnText1 = '별로에요', btnText2 = "보통이에요", btnText3 = "좋아요" } = props;

    return(
        <Box
            py='30px'
            borderBottomWidth={ !borderStatus ? 1 : 0}
            borderBottomColor='#E3E3E3'
        >
            <DefText 
                text={qaTitle}
                style={[styles.reviewTitle]}
            />
            <HStack
                alignItems={'center'}
                justifyContent='space-between'
                mt='15px'
            >
                <TouchableOpacity
                    style={[
                        styles.reviewButton,
                        selectA == "0" &&
                        {backgroundColor:colorSelect.navy, borderColor:colorSelect.navy}
                    ]}
                    onPress={onPress}
                >
                    <DefText 
                        text={btnText1}
                        style={[
                            styles.reviewButtonText,
                            selectA == "0" &&
                            {color:colorSelect.white}
                        ]}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.reviewButton,
                        selectA == "1" &&
                        {backgroundColor:colorSelect.navy, borderColor:colorSelect.navy}
                    ]}
                    onPress={onPress2}
                >
                    <DefText 
                        text={btnText2}
                        style={[
                            styles.reviewButtonText,
                            selectA == "1" &&
                            {color:colorSelect.white}
                        ]}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.reviewButton,
                        selectA == "2" &&
                        {backgroundColor:colorSelect.navy, borderColor:colorSelect.navy}
                    ]}
                    onPress={onPress3}
                >
                    <DefText 
                        text={btnText3}
                        style={[
                            styles.reviewButtonText,
                            selectA == "2" &&
                            {color:colorSelect.white}
                        ]}
                    />
                </TouchableOpacity>
            </HStack>
        </Box>
    )
};

const styles = StyleSheet.create({
    reviewTitle: {
        ...fsize.fs15,
        ...fweight.bold,
        color:'#191919'
    },
    reviewButton: {
        width: (deviceSize.deviceWidth - 40) * 0.31,
        height: 48,
        borderRadius:5,
        alignItems:'center',
        justifyContent:'center',
        borderWidth:1,
        borderColor:'#E1E1E1'
    },
    reviewButtonText: {
        ...fsize.fs14,
        color:'#191919'
    },
    selectText: {
        ...fsize.fs13,
        ...fweight.bold,
        color:'#BEBEBE'
    },
    cameraSelectButton: {
        width: (deviceSize.deviceWidth - 40) * 0.26,
        height: (deviceSize.deviceWidth - 40) * 0.26,
        borderRadius:5,
        alignItems:'center',
        justifyContent:'center',
        borderWidth:1,
        borderColor:'#E1E1E1'
    },
    cameraModalButton: {
        width: (deviceSize.deviceWidth - 80) * 0.48,
        height:48,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:colorSelect.navy,
        borderRadius:10
    },
    cameraModalButtonText: {
        ...fsize.fs14,
        color:colorSelect.white,
        lineHeight:19,
        marginLeft:10
    }
})

export default ReviewQaBox;