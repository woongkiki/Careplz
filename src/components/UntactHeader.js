import React from 'react';
import { Box, HStack } from 'native-base';
import { DefText } from '../common/BOOTSTRAP';
import { Image, StyleSheet, TouchableOpacity } from 'react-native';
import { fsize, fweight } from '../common/StyleCommon';
import { BASE_URL } from '../Utils/APIConstant';
import { textLengthOverCut } from '../common/DataFunction';

const headerHeight = 50;

const UntactHeader = (props) => {

    const {navigation, headerTitle, backButtonStatus, headerIcons, imageUri, imageWidth, imageHeight, imageResize, rightButton, closeStatus, backNavigation} = props;

    return (
        <Box 
            height={headerHeight + 'px'} 
            justifyContent={'center'} 
            alignItems='center'
        >
            {
                backButtonStatus &&
                <Box
                    style={[styles.backButton]}
                >
                    <TouchableOpacity
                        onPress={backNavigation}
                    >
                        <Image 
                            source={{uri:BASE_URL + "/images/backButton.png"}}
                            style={{
                                width:28,
                                height:16,
                                resizeMode:'contain'
                            }}
                        />
                    </TouchableOpacity>
                </Box>
            }
            {
                closeStatus &&
                <Box
                    style={[styles.backButton]}
                >
                    <TouchableOpacity
                        onPress={()=>navigation.goBack()}
                    >
                        <Image 
                            source={{uri:BASE_URL + "/images/closeBtn.png"}}
                            style={{
                                width:16,
                                height:16,
                                resizeMode:'contain'
                            }}
                        />
                    </TouchableOpacity>
                </Box>
            }
            {
                headerIcons ?
                <HStack 
                    alignItems={'center'}
                >
                    <Image 
                        source={{uri:imageUri}}
                        style={{
                            width:imageWidth,
                            height:imageHeight,
                            resizeMode:imageResize,
                            marginRight:10
                        }}
                    />
                    <DefText 
                        text={headerTitle} 
                        style={[fsize.fs18, fweight.m, {lineHeight:24}]}
                    />
                </HStack>
                :
                <DefText 
                    text={ textLengthOverCut(headerTitle, 23, '..')} 
                    style={[fsize.fs18, fweight.m, {lineHeight:33}]}
                />
            }
            {
                rightButton &&
                <Box
                    style={[styles.rightContent]}
                >
                    {
                        rightButton
                    }
                </Box>
            }
            
        </Box>
    );
};

const styles = StyleSheet.create({
    backButton: {
        width:headerHeight,
        height: headerHeight,
        justifyContent:'center',
        alignItems:'flex-start',
        position: 'absolute',
        top:0,
        left: 20
    },
    rightContent: {
        position: 'absolute',
        top:0,
        right: 20,
        height: headerHeight,
        width:headerHeight,
        justifyContent:'center',
        alignItems:'flex-end',
    }
})

export default UntactHeader;