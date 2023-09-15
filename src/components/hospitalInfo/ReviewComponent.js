import React from 'react';
import { Box, HStack } from 'native-base';
import { Image, StyleSheet, TouchableOpacity } from 'react-native';
import { BASE_URL } from '../../Utils/APIConstant';
import { DefText } from '../../common/BOOTSTRAP';
import { colorSelect, deviceSize, fsize, fweight } from '../../common/StyleCommon';
import { textLengthOverCut } from '../../common/DataFunction';

const ReviewComponent = (props) => {

    const {reviewOnpress, reviewContent, reviewDate, reviewWriter, reviewRemoveOnpress, reviewWishOnpress, wishData, idx, singoOnprees, star, recom, borderT = '#E3E3E3', visitCeriText, singoText, reviewDel, photos, reviewDisable, reviewanswer, reviewAnswerImage, hname, navigation, updateStatus, reviews, updateContent, updateText} = props;

    return (
        <TouchableOpacity
            onPress={reviewOnpress}
        >
            <Box 
                py='20px'
                borderTopWidth={1}
                borderTopColor={borderT}
            >
                <HStack
                    alignItems={'center'}
                    justifyContent='space-between'
                >
                    <Box>
                        <HStack>
                            <Image 
                                source={{uri:BASE_URL + "/images/score4.png"}}
                                style={{
                                    width:74,
                                    height: 14,
                                    resizeMode:'contain',
                                    marginRight:5,
                                }}
                            />
                            <DefText 
                                text={star}
                                style={{
                                    ...fsize.fs13,
                                    ...fweight.bold,
                                }}
                            />
                        </HStack>
                        <Box mt='5px'>
                            <DefText 
                                text={visitCeriText}
                                style={{
                                    ...fsize.fs14,
                                    color:'#B2BBC8'
                                }}
                            />
                        </Box>
                    </Box>
                    <HStack>
                    {
                        updateStatus &&
                        <TouchableOpacity
                            style={[styles.reportButton, {borderColor:colorSelect.blue}]}
                            onPress={
                                ()=>navigation.navigate("ReviewUpdate", {"reviewInfo":reviews, "type":updateContent})
                            }
                        >
                            <DefText 
                                text={updateText}
                                style={[styles.reportButtonText, {color:colorSelect.blue}]}
                            />
                        </TouchableOpacity>
                    }
                    {
                        reviewDel &&
                        <TouchableOpacity
                            style={[styles.reviewRemoveButton, {marginLeft:10}]}
                            onPress={reviewRemoveOnpress}
                        >
                            <Image 
                                source={{uri:BASE_URL + "/images/reviewRemoveIcon.png"}}
                                style={{
                                    width:13,
                                    height:13,
                                    resizeMode:'contain'
                                }}
                            />
                        </TouchableOpacity>
                    }
                    </HStack>
                </HStack>
                {
                    (photos != null || photos != undefined) &&
                    <HStack 
                        mt='15px'
                    >
                        {
                            photos.map((item, index) => {
                                return(
                                    <TouchableOpacity
                                        key={index}
                                        onPress={()=>navigation.navigate("ReviewImageView", {"url":item})}
                                    >
                                        <Image
                                            source={{uri:item}}
                                            style={{
                                                width:(deviceSize.deviceWidth - 40) * 0.31,
                                                height:(deviceSize.deviceWidth - 40) * 0.31,
                                                resizeMode:'stretch',
                                                marginRight: (index + 1) % 3 != 0 ? (deviceSize.deviceWidth - 40) * 0.035 : 0,
                                                borderRadius:10,
                                            }}
                                            
                                        />
                                    </TouchableOpacity>
                                )
                            })
                        }
                    </HStack>
                }
                <Box mt='10px' mb='20px'>
                    <DefText 
                        text={reviewContent}
                        style={{
                            ...fsize.fs14,
                            lineHeight:19
                        }}
                    />
                </Box>
                <HStack
                    alignItems={'center'}
                    justifyContent='space-between'
                >
                    <HStack
                        alignItems={'center'}
                    >
                        <DefText 
                            text={reviewDate + " " + reviewWriter}
                            style={[
                                styles.reviewBottomText
                            ]}
                        />
                        <Box 
                            width='1px'
                            height='12px'
                            backgroundColor={'#B2BBC8'}
                            mx='10px'
                        />
                        <TouchableOpacity
                            onPress={singoOnprees}
                        >
                            <DefText 
                                text={singoText}
                                style={[
                                    styles.reviewBottomText
                                ]}
                            />
                        </TouchableOpacity>
                    </HStack>
                    <HStack
                        alignItems={'center'}
                    >
                        <TouchableOpacity
                            style={[
                                styles.reviewRemoveButton,
                                recom != 0 && {backgroundColor:colorSelect.pink_de}
                            ]}
                            onPress={reviewWishOnpress}
                            disabled={reviewDisable}
                        >
                            <Image 
                                source={{
                                    uri:
                                    recom != 0 ?
                                    BASE_URL + "/images/hospitalWishIconW.png"
                                    :
                                    BASE_URL + "/images/hospitalWishIcon.png"
                                }}
                                style={{
                                    width:14,
                                    height:12,
                                    resizeMode:'contain'
                                }}
                            />
                        </TouchableOpacity>
                        {
                            recom != 0 &&
                            <DefText 
                                text={recom}
                                style={{
                                    ...fsize.fs12,
                                    color:'#727272',
                                    marginLeft:10
                                }}
                            />
                        }
                    </HStack>
                    
                </HStack>
                {
                    reviewanswer != "" &&
                    <Box>
                        <HStack mt='10px' alignItems={'center'}>
                            <Image 
                                source={{uri:reviewAnswerImage}}
                                style={{
                                    width:40,
                                    height:40,
                                    borderRadius:40,
                                    resizeMode:"stretch",
                                    borderWidth:1,
                                    borderColor:"#f1f1f1"
                                }}
                            />
                            <DefText 
                                text={hname} 
                                style={{...fsize.fs14, ...fweight.m, marginLeft:15}}
                            />
                        </HStack>
                        <Box backgroundColor={'rgba(255,127,178,0.1)'} p='20px' borderRadius={10} mt='10px'>
                            <DefText 
                                text={reviewanswer}
                                style={{
                                    ...fsize.fs14,
                                    ...fweight.r
                                }}
                            />
                        </Box>
                    </Box>
                 }
            </Box>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    reviewRemoveButton: {
        width:33,
        height:33,
        borderRadius:5,
        backgroundColor:'#F5F6FA',
        alignItems:'center',
        justifyContent:'center'
    },
    reviewBottomText: {
        ...fsize.fs14,
        color:'#B2BBC8'
    },
    reportButton: {
        paddingHorizontal:10,
        height:22,
        borderRadius:4,
        overflow: 'hidden',
        justifyContent:'center',
        alignItems:'center',
        borderWidth:1,
        borderColor:'#D85656'
    },
    reportButtonText: {
        ...fsize.fs12,
        lineHeight:17,
        color:'#D85656'
    },
})

export default ReviewComponent;