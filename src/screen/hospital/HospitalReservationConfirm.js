import React, { useCallback, useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Box, HStack, Modal } from 'native-base';
import { DefButton, DefText } from '../../common/BOOTSTRAP';
import Header from '../../components/Header';
import { colorSelect, deviceSize, fsize, fweight } from '../../common/StyleCommon';
import BoxLine from '../../components/BoxLine';
import FormInput from '../../components/FormInput';
import { BASE_URL } from '../../Utils/APIConstant';
import { phoneFormat } from '../../common/DataFunction';
import FormSelect from '../../components/FormSelect';
import ReservationConfirm from '../../components/reservation/ReservationConfirm';
import ReservationRequest from '../../components/reservation/ReservationRequest';
import ReservationCheck from '../../components/reservation/ReservationCheck';
import ReservationCancle from '../../components/reservation/ReservationCancle';
import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../../redux/module/action/UserAction';
import Api from '../../Api';
import ToastMessage from '../../components/ToastMessage';

//진료 타입 예시
//const type = ["일반진료", "예방접종", "건강검진", "기타"];

const type = [
    {
        idx:1,
        label:'일반진료',
        val: '일반진료',
    },
    {
        idx:2,
        label:'예방접종',
        val: '예방접종',
    },
    {
        idx:3,
        label:'건강검진',
        val: '건강검진',
    },
    {
        idx:4,
        label:'기타',
        val: '기타',
    },
]

//병원 예약요청 중
const HospitalReservationConfirm = (props) => {

    const {navigation, route, userInfo, user_lang} = props;
    const {params} = route;

    //console.log("params", params);
    //console.log("userInfo", userInfo);

    const [pageText, setPageText] = useState("");

    const appPageApi = () => {
        //user_lang != null ? user_lang?.cidx : userInfo?.cidx
        Api.send('app_page', {'cidx':user_lang != null ? user_lang?.cidx : userInfo?.cidx, "code":"hospitalReserConfirm"}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
              // console.log('진료예약 예약상세 언어 리스트: ', resultItem, arrItems);
               setPageText(arrItems.text);
            }else{
               console.log('진료예약 예약상세 언어 리스트 실패!', resultItem);
               
            }
        });
    }

    useEffect(() => {
        appPageApi();
    }, [])

    const [clinicName, setClinicName] = useState("");
    const clinicNameChange = (text) => {
        setClinicName(text);
    }

    const [phoneNumber, setPhoneNumber] = useState("");
    const phoneChange = (phone) => {
        setPhoneNumber(phoneFormat(phone));
    }

    const [hospitalType, setHospitalType] = useState(params.hospitalType);

    const [cancleModal, setCancleModal] = useState(false);
    const reservationCancleModal = () => {
        setCancleModal(true);
    }

    const reservationCancleHandler = () => {

        console.log("params.idx", params);
        Api.send('hospital_reservationCancel', {'idx':params.idx, 'id':userInfo?.id}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               console.log('병원 예약 취소 성공: ', resultItem, arrItems);
               ToastMessage(pageText[22]);
               setCancleModal(false);
               navigation.navigate('TabNavi', {
                    screen: "Event",
                });
            }else{
               console.log('병원 예약 취소 실패!', resultItem);
               
            }
        });
    }

    const mainMove = useCallback(() => {
        navigation.navigate('TabNavi', {
            screen: "Event",
        });
    }, [])

    return (
        <Box flex={1} backgroundColor='#fff' >
           <Header 
                headerTitle={ pageText != "" ? pageText[0] : "예약 상세"}
           />
           <ScrollView>
                <Box px='20px' py='30px'>
                    <ReservationRequest 
                        reserTitle={ pageText[0] }
                        reserText={ pageText[1] }
                    />
                </Box>
                <BoxLine />
                <Box
                    px='20px'
                    py='30px'
                >
                    <Box>
                        <ReservationConfirm 
                            icon={{uri:BASE_URL + "/images/rnameIcon.png"}}
                            iconWidth={15}
                            iconHeight={18}
                            iconResize='contain'
                            label={ pageText != "" ? pageText[7] : '진료대상'}
                            confirmText={userInfo?.name}
                            dates={""}
                        />
                    </Box>
                    <Box
                        mt='30px'
                    >
                        <ReservationConfirm 
                            icon={{uri:BASE_URL + "/images/phoneIconCheck.png"}}
                            iconWidth={15}
                            iconHeight={18}
                            iconResize='contain'
                            label={ pageText != "" ? pageText[8] : '연락처'}
                            confirmText={userInfo?.hp}
                            dates={""}
                        />
                    </Box>
                    {
                        params.selectClinic != "" &&
                        <Box
                            mt='30px'
                        >
                            <ReservationConfirm 
                                icon={{uri:BASE_URL + "/images/hopistalTypeIcon.png"}}
                                iconWidth={15}
                                iconHeight={18}
                                iconResize='contain'
                                label={ pageText != "" ? pageText[9] : '진료항목'}
                                confirmText={params.selectClinic}
                                dates={""}
                            />
                        </Box>
                    }
                    
                    {/* <Box
                        mt='30px'
                    >
                        <ReservationConfirm 
                            icon={{uri:BASE_URL + "/images/contentIcon.png"}}
                            iconWidth={15}
                            iconHeight={18}
                            iconResize='contain'
                            label='전달사항'
                            confirmText={params.rmessage != "" ? params.rmessage : "전달사항이 없습니다."}
                        />
                    </Box> */}
                    <Box
                        mt='30px'
                    >
                        <ReservationConfirm 
                            icon={{uri:BASE_URL + "/images/dateIcons.png"}}
                            iconWidth={17}
                            iconHeight={18}
                            iconResize='contain'
                            label={ pageText != "" ? pageText[11] : '선택일정'}
                            confirmText={""}
                            dates={params.selectTime}
                        />
                    </Box>
                    <Box
                        mt='40px'
                    >
                        <HStack
                            alignItems={'center'}
                            justifyContent='space-between'
                        >
                            <TouchableOpacity
                                style={[
                                    styles.button,
                                    {backgroundColor:"#7E7E7E"}
                                ]}
                                onPress={reservationCancleModal}
                            >
                                <DefText 
                                    text={ pageText != "" ? pageText[12] : "예약취소"}
                                    style={[styles.buttonText]}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                    styles.button,
                                    {backgroundColor:colorSelect.pink_de}
                                ]}
                                onPress={()=> navigation.navigate("HospitalInfo", {"idx":params.hidx})}
                            >
                                <DefText 
                                    text={ pageText != "" ? pageText[13] : "병원정보"}
                                    style={[styles.buttonText]}
                                />
                            </TouchableOpacity>
                        </HStack>
                        <TouchableOpacity
                            onPress={mainMove}
                            style={{width:deviceSize.deviceWidth - 40, height:50, borderRadius:8, justifyContent:"center", backgroundColor:colorSelect.navy, justifyContent:"center", alignItems:"center", marginTop:10}}
                        >
                            <DefText 
                                text={ pageText != "" ? pageText[24] : "메인으로"}
                                style={{color:colorSelect.white, ...fweight.m}}
                            />
                        </TouchableOpacity>
                    </Box>
                   
                </Box>
           </ScrollView>
           <Modal isOpen={cancleModal} onClose={()=>setCancleModal(false)}>
                <Modal.Content width={deviceSize.deviceWidth - 40}>
                    <Modal.Body px='20px' pt='30px' pb='20px'>
                        <Box>
                            <DefText 
                                text={ pageText != "" ? pageText[21] : "예약을 취소하시겠습니까?"} 
                                style={{color:"#191919"}}
                            />
                        </Box>
                        <HStack
                            mt={'20px'}
                            justifyContent={'space-between'}
                            alignItems={"center"}
                        >
                            <TouchableOpacity
                                style={[
                                    styles.modalButton,
                                    {backgroundColor:"#F1F1F1"}
                                ]}
                                onPress={()=>setCancleModal(false)}
                            >
                                <DefText 
                                    text={ pageText != "" ? pageText[20] : "취소"}
                                    style={{...fweight.m}}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                    styles.modalButton,
                                    {backgroundColor:colorSelect.navy}
                                ]}
                                onPress={reservationCancleHandler}
                            >
                                <DefText 
                                    text={ pageText != "" ? pageText[15] : "확인"}
                                    style={{color:colorSelect.white, ...fweight.m}}
                                />
                            </TouchableOpacity>
                        </HStack>
                    </Modal.Body>
                </Modal.Content>
            </Modal>
           {/* <DefButton 
                text="확인"
                btnStyle={{
                    backgroundColor:colorSelect.pink_de,
                    borderRadius:0
                }}
                txtStyle={{
                    color:colorSelect.white,
                    ...fweight.m
                }}
           /> */}
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
    infoBox: {
        paddingHorizontal:15,
        paddingVertical:15,
        borderRadius:5,
        backgroundColor:'#E9E9E9'
    },
    infoBoxText:{
        ...fsize.fs15
    },
    button: {
        width:(deviceSize.deviceWidth - 40) * 0.48,
        height:50,
        alignItems:'center',
        justifyContent:'center',
        borderRadius:8,
        lineHeight:52
    },
    buttonText: {
        color:'#fff',
        ...fweight.m
    },
    modalButton:{
        width: '48%',
        paddingVertical:15,
        alignItems:"center",
        justifyContent:"center",
        borderRadius:10,
    }
})

export default connect(
    ({ User }) => ({
        userInfo: User.userInfo, //회원정보
        user_lang: User.user_lang,
    }),
    (dispatch) => ({
        member_login: (user) => dispatch(UserAction.member_login(user)), //로그인
        languageSet: (user) => dispatch(UserAction.languageSet(user)), //선택언어
    })
)(HospitalReservationConfirm);