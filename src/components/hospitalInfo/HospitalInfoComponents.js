import React, { useState } from 'react';
import { Box, HStack } from 'native-base';
import { TouchableOpacity, Image, StyleSheet } from 'react-native';
import { DefText } from '../../common/BOOTSTRAP';
import { colorSelect, deviceSize, fsize, fweight } from '../../common/StyleCommon';
import BoxLine from '../BoxLine';
const HospitalInfoComponents = (props) => {

    const {navigation} = props;

    const [timeShow, setTimeShow] = useState(false);

    return (
        <Box
        >
            <Box
                p='20px'
            >
                <DefText 
                    text="진료시간"
                    style={[styles.hospitalInfoTitle]}
                />
                <HStack
                    alignItems={'center'}
                    mt='10px'
                >
                    <Box 
                        style={{
                            width:9,
                            height: 9,
                            borderRadius:9,
                            backgroundColor:colorSelect.navy,
                            marginRight:5,
                        }}
                    />
                    <DefText 
                        text="진료 중입니다."
                        style={{
                            ...fsize.fs13,
                            lineHeight:17,
                            color:'#434856'
                        }}
                    />
                </HStack>
                <Box 
                    mt='20px'
                    p='20px' 
                    backgroundColor='rgba(166,185,207,0.3)'
                    borderRadius={15}
                >
                    <HStack 
                    >
                        <Box
                            style={[styles.timeBox]}
                        >
                            <DefText 
                                text="오늘"
                                style={[styles.timeBoxLabel]}
                            />
                            <DefText 
                                text="09:00 ~ 18:00"
                                style={[styles.timeBoxText]}
                            />
                        </Box>
                        <Box
                            style={[styles.timeBox]}
                        >
                            <DefText 
                                text="점심시간"
                                style={[styles.timeBoxLabel]}
                            />
                            <DefText 
                                text="13:00 ~ 14:00"
                                style={[styles.timeBoxText]}
                            />
                        </Box>
                    </HStack>
                </Box>
                <Box 
                    mt='20px'
                    p='20px' 
                    pb='15px'
                    backgroundColor='rgba(166,185,207,0.1)'
                    borderRadius={15}
                >
                    <HStack 
                        
                        flexWrap='wrap'
                    >
                        <Box
                            style={[styles.timeBox]}
                        >
                            <DefText 
                                text="월요일"
                                style={[styles.timeBoxLabel]}
                            />
                            <DefText 
                                text="09:00 ~ 18:00"
                                style={[styles.timeBoxText]}
                            />
                        </Box>
                        <Box
                            style={[styles.timeBox]}
                        >
                            <DefText 
                                text="화요일"
                                style={[styles.timeBoxLabel]}
                            />
                            <DefText 
                                text="09:00 ~ 18:00"
                                style={[styles.timeBoxText]}
                            />
                        </Box>
                        
                    </HStack>
                    {
                        timeShow &&
                        <Box>
                            <HStack 
                                flexWrap='wrap'
                                mt='30px'
                            >
                                <Box
                                    style={[styles.timeBox]}
                                >
                                    <DefText 
                                        text="수요일"
                                        style={[styles.timeBoxLabel]}
                                    />
                                    <DefText 
                                        text="09:00 ~ 18:00"
                                        style={[styles.timeBoxText]}
                                    />
                                </Box>
                                <Box
                                    style={[styles.timeBox]}
                                >
                                    <DefText 
                                        text="목요일"
                                        style={[styles.timeBoxLabel]}
                                    />
                                    <DefText 
                                        text="09:00 ~ 18:00"
                                        style={[styles.timeBoxText]}
                                    />
                                </Box>
                                
                            </HStack>
                            <HStack 
                                flexWrap='wrap'
                                mt='30px'
                            >
                                <Box
                                    style={[styles.timeBox]}
                                >
                                    <DefText 
                                        text="금요일"
                                        style={[styles.timeBoxLabel]}
                                    />
                                    <DefText 
                                        text="09:00 ~ 18:00"
                                        style={[styles.timeBoxText]}
                                    />
                                </Box>
                                <Box
                                    style={[styles.timeBox]}
                                >
                                    <DefText 
                                        text="토요일"
                                        style={[
                                            styles.timeBoxLabel,
                                            {color:'#0C43B7'}
                                        ]}
                                    />
                                    <DefText 
                                        text="09:00 ~ 18:00"
                                        style={[
                                            styles.timeBoxText,
                                            {color:'#0C43B7'}
                                        ]}
                                    />
                                </Box>
                            </HStack>
                            <HStack 
                                flexWrap='wrap'
                                mt='30px'
                            >
                                <Box
                                    style={[styles.timeBox]}
                                >
                                    <DefText 
                                        text="일요일"
                                        style={[
                                            styles.timeBoxLabel,
                                            {color:'#FC4C4E'}
                                        ]}
                                    />
                                    <DefText 
                                        text="휴진"
                                        style={[
                                            styles.timeBoxText,
                                            {color:'#FC4C4E'}
                                        ]}
                                    />
                                </Box>
                                <Box
                                    style={[styles.timeBox]}
                                >
                                    <DefText 
                                        text="공휴일"
                                        style={[
                                            styles.timeBoxLabel,
                                            {color:'#FC4C4E'}
                                        ]}
                                    />
                                    <DefText 
                                        text="휴진"
                                        style={[
                                            styles.timeBoxText,
                                            {color:'#FC4C4E'}
                                        ]}
                                    />
                                </Box>
                            </HStack>
                            <HStack 
                                flexWrap='wrap'
                                mt='30px'
                            >
                                <Box
                                    style={[styles.timeBox]}
                                >
                                    <DefText 
                                        text="평일 점심시간"
                                        style={[
                                            styles.timeBoxLabel,
                                        ]}
                                    />
                                    <DefText 
                                        text="14:00 ~ 15:00"
                                        style={[
                                            styles.timeBoxText,
                                        ]}
                                    />
                                </Box>
                                <Box
                                    style={[styles.timeBox]}
                                >
                                    <DefText 
                                        text="주말 점심시간"
                                        style={[
                                            styles.timeBoxLabel,
                                        ]}
                                    />
                                    <DefText 
                                        text="13:00 ~ 14:00"
                                        style={[
                                            styles.timeBoxText,
                                        ]}
                                    />
                                </Box>
                            </HStack>
                        </Box>
                    }
                    
                    <TouchableOpacity
                        style={{
                            width: '100%',
                            paddingTop:15,
                            alignItems:'center',
                            borderTopWidth:1,
                            borderTopColor:'#E3E3E3',
                            marginTop:20
                        }}
                        onPress={()=>setTimeShow(!timeShow)}
                    >
                        <HStack
                            alignItems={'center'}
                        >
                            <Image 
                                source={
                                    !timeShow ?
                                    require("../../images/downArrHopistal.png")
                                    :
                                    require("../../images/upArrHopistal.png")
                                }
                                style={{
                                    width:13,
                                    height:7,
                                    resizeMode:'contain',
                                    marginRight:10
                                }}
                            />
                            <DefText 
                                text={ timeShow ? "접기" : "펼치기"}
                                style={{
                                    ...fsize.fs13,
                                    color:'#434856'
                                }}
                            />
                        </HStack>
                    </TouchableOpacity>
                </Box>
            
            </Box>
            <BoxLine />
            <Box
                p='20px'
            >
                <DefText 
                    text="병원소개"
                    style={[styles.hospitalInfoTitle]}
                />
                <Box mt='15px'>
                    <DefText 
                        text={"병원소개글병원소개글병원소개글병원소개글병원소개글병원소개글병원소개글병원소개글병원소개글병원소개글병원.."}
                        style={{
                            ...fsize.fs15,
                            color:'#707070'
                        }}
                    />
                </Box>
            </Box>
            <BoxLine />
            <Box
                p='20px'
            >
                <HStack
                    alignItems={'center'}
                    justifyContent='space-between'
                >
                    <DefText 
                        text="위치"
                        style={[styles.hospitalInfoTitle]}
                    />
                    <TouchableOpacity
                        style={[styles.titleButton]}
                    >
                        <DefText 
                            text="주소복사"
                            style={[styles.titleButtonText]}
                        />
                    </TouchableOpacity>
                </HStack>
                <Box mt='15px'>
                    <DefText 
                        text="경기 부천시 길주로272"
                        style={[styles.addressText]}
                    />
                    <DefText 
                        text="신중동역 500m이내"
                        style={[styles.addressText, {marginTop:5}]}
                    />
                </Box>
                <Box
                    height='200px'
                    borderRadius={10}
                    backgroundColor='#f1f1f1'
                    mt='20px'
                >

                </Box>
            </Box>
        </Box>
    );
};

const styles = StyleSheet.create({
    hospitalName: {
        ...fsize.fs23,
        ...fweight.bold,
        lineHeight:28
    },
    hospitalInfoText: {
        ...fsize.fs15,
        lineHeight:20,
        color:'#434856'
    },
    tabButton: {
        width:deviceSize.deviceWidth / 3,
        height:54,
        alignItems:'center',
        justifyContent:'center'
    },
    tabButtonText: {
        ...fsize.fs14,
        color:'#191919',
        lineHeight:50
    },
    timeBox: {
        width:(deviceSize.deviceWidth - 80) * 0.5
    },
    timeBoxLabel: {
        ...fsize.fs13,
        ...fweight.bold,
        color: "#191919"
    },
    timeBoxText: {
        ...fsize.fs15,
        color:'#191919',
        marginTop:10
    },
    hospitalInfoTitle: {
        ...fsize.fs20,
        ...fweight.bold, 
        lineHeight:23
    },
    titleButton: {
        paddingHorizontal:10,
        height: 28,
        borderRadius:10,
        backgroundColor:'rgba(210, 210, 223, 0.5)',
        justifyContent:'center'
    },
    titleButtonText: {
        ...fsize.fs12,
        lineHeight:28
    },
    addressText: {
        ...fsize.fs14,
        color:'#434856'
    },
    subjectBox: {
        height:40,
        paddingHorizontal:20,
        borderRadius:10,
        backgroundColor:'#D2D2DF',
        justifyContent:'center'
    },
    subjectBoxText: {
        ...fsize.fs14,
        lineHeight:40
    }
})

export default HospitalInfoComponents;