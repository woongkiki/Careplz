import { Box, HStack } from 'native-base';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { DefText } from '../../common/BOOTSTRAP';
import { colorSelect, deviceSize, fsize, fweight } from '../../common/StyleCommon';
import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../../redux/module/action/UserAction';

const ReservationBox = (props) => {

    const {navigation, name, hospital, hospitalSubject, cancleState, cancleReason, checkDate, requestDate, reservationDate, reservationTime, wdate, reserLang, reserLang2, reserLang3, reserLang4, user_lang, reserCancle, reserCancleTitme, reserIdx, reserType} = props;

    //console.log("requestDate", requestDate.length);

    const reservationViewNavi = (types) => {
        console.log("예약타입::", types);
        if(types == "1"){
            navigation.navigate("HospitalReservationView", {"idx":reserIdx});
        }else if(types == "2"){
            navigation.navigate("UntactReservationView", {"idx":reserIdx});
        }else{
            navigation.navigate("EventReservationView", {"idx":reserIdx});
        }
    }

    return (
        <TouchableOpacity
            style={[styles.reservationBox]}
            onPress={()=>reservationViewNavi(reserType)}
        >
            <DefText text={name} style={[styles.reserName]} />
            <HStack
                alignItems={'center'}
                mt='10px'
                flexWrap={'wrap'}
            >
                <Box maxWidth={(deviceSize.deviceWidth - 82) * 0.29}>
                    <DefText
                        text={hospital}
                        style={[styles.reserhospital]}
                        lh={ user_lang?.cidx == 9 ? 26 : ''}
                    />
                </Box>
                <Box 
                    width={"2px"}
                    height={"12px"}
                    backgroundColor={"#D5D5D5"}
                    mx='10px'
                />
                <Box width={(deviceSize.deviceWidth - 82) * 0.61} >
                    <DefText
                        text={hospitalSubject}
                        style={[styles.reserhospital]}
                        lh={ user_lang?.cidx == 9 ? 26 : ''}
                    />
                </Box>
            </HStack>
            { //예약확정
                cancleState == "RA" &&
                <Box mt='10px'>
                    {
                        requestDate != "" &&
                        requestDate.map((item, index) => {
                            return(
                                <DefText
                                    key={index} 
                                    text={
                                        requestDate.length == (index + 1) ?
                                        item + " " + reserLang
                                        :
                                        item
                                    }
                                    style={[styles.reserText]}
                                    lh={ user_lang?.cidx == 9 ? 26 : ''}
                                />
                            )
                        })
                    }
                </Box>
            }
            {
                cancleState == "RB" &&
                <Box mt='10px'>
                    {/* <DefText text="RB" /> */}
                    {
                        requestDate != "" &&
                        requestDate.map((item, index) => {
                            return(
                                <DefText
                                    key={index} 
                                    text={
                                        requestDate.length == (index + 1) ?
                                        item + " " + reserLang
                                        :
                                        item
                                    }
                                    style={[styles.reserText]}
                                    lh={ user_lang?.cidx == 9 ? 26 : ''}
                                />
                            )
                        })
                    }
                    <HStack mt='5px' alignItems={'center'} flexWrap='wrap'>
                        <DefText 
                            text={reservationDate + " " + reservationTime + " " + reserLang2}
                            style={[styles.reserText, fweight.bold, {color:colorSelect.navy}]}
                            lh={ user_lang?.cidx == 9 ? 26 : ''}
                        />
                        <DefText
                            text={reserLang3}
                            style={[styles.reserText, ]}
                            lh={ user_lang?.cidx == 9 ? 26 : ''}
                        />
                    </HStack>
                </Box>
            }
            {
                cancleState == "RD" &&
                <Box mt='10px'>
                    {/* <DefText text="RB" /> */}
                    {
                        requestDate != "" &&
                        requestDate.map((item, index) => {
                            return(
                                <DefText
                                    key={index} 
                                    text={
                                        requestDate.length == (index + 1) ?
                                        item + " " + reserLang
                                        :
                                        item
                                    }
                                    style={[styles.reserText]}
                                    lh={ user_lang?.cidx == 9 ? 26 : ''}
                                />
                            )
                        })
                    }
                    <HStack mt='5px' alignItems={'center'} flexWrap='wrap'>
                        <DefText 
                            text={reservationDate + " " + reservationTime + " " + reserLang4}
                            style={[styles.reserText, fweight.bold, {color:colorSelect.navy}]}
                            lh={ user_lang?.cidx == 9 ? 26 : ''}
                        />
                        <DefText
                            text={reserLang3}
                            style={[styles.reserText, ]}
                            lh={ user_lang?.cidx == 9 ? 26 : ''}
                        />
                    </HStack>
                </Box>
            }
            {
                cancleState == "RC" &&
                <Box mt='10px'>
                    {
                        requestDate != "" &&
                        requestDate.map((item, index) => {
                            return(
                                <DefText
                                    key={index} 
                                    text={
                                        requestDate.length == (index + 1) ?
                                        item + " " + reserLang
                                        :
                                        item
                                    }
                                    style={[styles.reserText]}
                                    lh={ user_lang?.cidx == 9 ? 26 : ''}
                                />
                            )
                        })
                    }
                    {/* <DefText 
                        text={requestDate +  " " + reserLang}
                        style={[styles.reserText]}
                    /> */}
                    <HStack mt='5px' alignItems={'center'}>
                        <DefText 
                            text={reserCancle}
                            style={[styles.reserText, fweight.bold, {color:'#E11B1B'}]}
                        />
                        <DefText
                            text={reserLang3}
                            style={[styles.reserText, ]}
                            lh={ user_lang?.cidx == 9 ? 26 : ''}
                        />
                    </HStack>
                    {
                        cancleReason != "" &&
                        <DefText
                            text={ reserCancleTitme + " : " + cancleReason}
                            style={[styles.reserText, fweight.bold, {marginTop:10}]}
                            lh={ user_lang?.cidx == 9 ? 26 : ''}
                        />
                    }
                </Box>
            }
            <Box mt='10px'>
                <DefText text={wdate} style={[styles.reserDatetime]} />
            </Box>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    reservationBox: {
        padding:20,
        borderWidth:1,
        borderColor:'#D6D6D6',
        borderRadius:5
    },
    reserName: {
        ...fweight.bold,
        color:'#191919'
    },
    reserhospital: {
        ...fsize.fs14,
        color:'#7D7D7D'
    },
    reserText: {
        ...fsize.fs14,
        marginTop:5,
    },
    reserDatetime: {
        ...fsize.fs14,
        color:'#AAAAAA'
    }
})

export default connect(
    ({ User }) => ({
        userInfo: User.userInfo, //회원정보
        user_lang: User.user_lang
    })
)(ReservationBox);