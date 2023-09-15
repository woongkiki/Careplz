import React, { useState } from 'react';
import { Box, HStack } from 'native-base';
import { DefButton, DefInput, DefText } from '../../common/BOOTSTRAP';
import Header from '../../components/Header';
import { colorSelect, deviceSize, fsize, fweight } from '../../common/StyleCommon';
import { Image, StyleSheet } from 'react-native';

const PasswordSearchResult = (props) => {

    const {navigation} = props;

    return (
        <Box flex={1} backgroundColor='#fff'>
            <Header 
                headerTitle='비밀번호 찾기'
                navigation={navigation}
            />
            <Box
                flex={1}
                alignItems='center'
                justifyContent={'center'}
            >
                <Image 
                    source={require("../../images/passwordSearchIcon.png")}
                    style={{
                        width:70,
                        height:70,
                        resizeMode:'stretch'
                    }}
                />
                <Box mt='20px'>
                    <HStack alignItems={'center'} justifyContent='center'>
                        <DefText 
                            text="홍길동님!"
                            style={[styles.appText, fweight.bold]}
                        />
                        <DefText 
                            text=" 임시비밀번호가"
                            style={[styles.appText]}
                        />
                    </HStack>
                    <HStack alignItems={'center'}>
                        <DefText 
                            text="honggildong1234@test.com" 
                            style={[styles.appText, {color:colorSelect.pink_de}]}
                        />
                        <DefText 
                            text="로"
                            style={[styles.appText]}
                        />
                    </HStack>
                  
                    <DefText 
                        text="발송되었습니다." 
                        style={[styles.appText]}
                    />
                </Box>
                <Box
                    py='15px'
                    backgroundColor={'#F2F2F2'}
                    width={deviceSize.deviceWidth - 40}
                    alignItems='center'
                    borderRadius={5}
                    overflow='hidden'
                    mt='20px'
                >
                    <HStack
                        alignItems={'center'}
                    >
                        <Image 
                            source={require("../../images/joinDateIcon.png")}
                            style={{
                                width:12,
                                height:12,
                                resizeMode:'stretch',
                                marginRight:5
                            }}
                        />
                        <DefText 
                            text={"가입일시 2020. 12. 12"}
                            style={[styles.joinDate]}
                        />
                    </HStack>
                </Box>
            </Box>
            <Box p='20px'>
                <DefButton 
                    btnStyle={[
                        {
                            backgroundColor:colorSelect.pink_de
                        }
                    ]}
                    text='로그인'
                    txtStyle={[fweight.m, {lineHeight:22,color:'#fff'}]}
                    onPress={()=>navigation.navigate("Login")}
                />
            </Box>
        </Box>
    );
};

const styles = StyleSheet.create({
    appText: {
        textAlign:'center',
        ...fsize.fs21,
        lineHeight:30,
        color:'#191919'
    },
    joinDate: {
        ...fsize.fs14,
        color:'#6C6C6C',
        lineHeight:17,
    }
})

export default PasswordSearchResult;