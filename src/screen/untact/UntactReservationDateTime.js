import React, { useEffect, useState } from 'react';
import { Box, HStack, Modal, VStack } from 'native-base';
import { TouchableOpacity, ScrollView, StyleSheet, Image } from 'react-native';
import { DefButton, DefText } from '../../common/BOOTSTRAP';
import Header from '../../components/Header';
import { colorSelect, deviceSize, fsize, fweight } from '../../common/StyleCommon';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import moment from 'moment';
import XDate from 'xdate';
import BoxLine from '../../components/BoxLine';
import { BASE_URL } from '../../Utils/APIConstant';
import { reservationTime } from '../../ArrayData';
import ToastMessage from '../../components/ToastMessage';
import CalendarComponent from '../../components/datepicker/CalendarComponent';
import TimePickersComponents from '../../components/timepicker/TimePickersComponents';
import Api from '../../Api';
import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../../redux/module/action/UserAction';

//병원 예약 시간 선택
const UntactReservationDateTime = (props) => {

    const {navigation, route, user_lang, userInfo} = props;
    const {params} = route;

    //console.log("비대면 예약시간선택", params);

    const today = new Date();
    const todays = moment(today).format("yy-MM-DD");
    const todayMonth = moment(today).format("yy-MM");

    //console.log("today", moment(today).format("yyMMDD"));

    const [pageText, setPageText] = useState("");
    
    const pageLanguage = () => {
        //user_lang != null ? user_lang?.cidx : userInfo?.cidx
        Api.send('app_page', {'cidx': user_lang != null ? user_lang?.cidx : userInfo?.cidx, "code":"hospitalReserTime"}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               //console.log('비대면 예약하기 예약신청 언어 리스트: ', resultItem, arrItems.text);
               setPageText(arrItems.text);
            }else{
               console.log('비대면 의사선택 예약신청 리스트 실패!', resultItem);
               
            }
        });
    }

    useEffect(() => {
        pageLanguage();
    }, [])

    const [checkDate, setCheckDate] = useState([]);

    const [selectDates, setSelectDate] = useState([]);
    const [showDate, setShowDate] = useState("");
    //달력 날짜 선택
    const selectDate = (date) => {
        const dates = {};
        const sDate = new XDate(date);
        
        dates[sDate.toString('yyyy-MM-dd')] = {
            selected: true,
            selectedColor: colorSelect.pink_de
        }

         setShowDate(date); //날짜에 표시용
         setNowMonth(date);
         setSelectDate(dates); //달력에 날짜 선택함 표시

         console.log('dates',dates);

    }



    //시간 데이터
    const [selectTime, setSelectTime] = useState([]);

    const nextNavigation = () => {

        // if(selectTime.length < 5){
        //     ToastMessage( pageText != "" ? pageText[20] : "예약 시간은 5개이상 선택해주세요.");
        //     return false;
        // }
        if(selectTime.length > 3){
            ToastMessage(pageText != "" ? pageText[20] : "예약 시간은 3개까지 선택해주세요.");
            return false;
        }

        navigation.navigate("UntactReservationConfirm", {
            "hidx":params.hidx,
            "hname":params.hname,
            "selectDates":showDate,
            "selectTime":selectTime,
            "catcode":params.catcode,
            "mcidx":params.mcidx,
            "clinic":params.clinic,
            "clinicItem":params.clinicItem,
            "reClinic":params.reClinic
        })
    }

    //야간 새벽 진료 안내
    const [infoModal, setInfoModal] = useState(false);

    useEffect(() => {
        if(showDate == todays){
            setInfoModal(true);
        }
    }, [showDate]);


    const [nowMonth, setNowMonth] = useState(todayMonth);

    const [dateStatus, setDateStatus] = useState([]);
    const [timeList, setTimeList] = useState([]);

    const [todayTime, setTodayTime] = useState("");
    
    //달력표시
    const calendarsAPI = () => {
        Api.send('untact_reservation05', {'id':userInfo?.id, 'cidx':user_lang != null ? user_lang?.cidx : userInfo?.cidx, "date":nowMonth}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               console.log('비대면 병원 달력 상테 정보: ', resultItem, arrItems);

               setDateStatus(arrItems.date);

               timeSave(arrItems.time);

               setTodayTime(arrItems.untact_stime);
               //notResDate(arrItems.date);
            //    console.log(Object.keys(arrItems.date));
            //    console.log(Object.values(arrItems.date));
            }else{
               console.log('비대면 병원 달력 상테 실패!', resultItem);
               
            }
        });
    }

    const timeSave = (time) => {
        

        let timeArr = Object.keys(time);
        let timeStatueArr = Object.values(time);

        let times = [];

        timeArr.map((item, index) => {

            //return times.push({"selectDate":showDate,"times":item, "status":timeStatueArr[index]});
            return times.push(showDate + " " + item);
            //console.log("items", item);
        })

        setTimeList(times);
    }

    useEffect(() => {

        if(nowMonth != ""){
            calendarsAPI();
        }

    }, [nowMonth])

    return (
        <Box flex={1} backgroundColor='#fff' >
            <Header
                navigation={navigation}
                headerTitle={ pageText != "" ? pageText[0] : "예약신청"}
                backButtonStatus={true}
            />
            <ScrollView>
                <Box p='20px'>
                    {
                        user_lang?.cidx != 0 ?
                        <DefText 
                            text={ userInfo?.name + ",\n" + pageText[1] }
                            style={[
                                fweight.m,
                                {lineHeight:27}
                            ]}
                        />
                        :
                        <DefText 
                            text={ userInfo?.name + "님,\n" + pageText[1] }
                            style={[
                                fweight.m,
                                {lineHeight:27}
                            ]}
                        />
                    }
                </Box>
                <BoxLine />
                <Box px='20px' pb='10px'>
                    <CalendarComponent 
                        navigation={navigation}
                        onDayPress={ (day) => selectDate(day.dateString) }
                        markedDates={{
                            ...dateStatus,
                            ...selectDates,
                        }}
                        nowMonth={setNowMonth}
                        user_lang={user_lang?.cidx}
                        dateTitle={pageText != "" ? pageText[2] : "날짜 선택"}
                    />
                </Box>
                {
                     showDate != "" &&
                     <>
                        <BoxLine />
                        <Box px='20px'>
                            <TimePickersComponents 
                                navigation={navigation}
                                selectTime={selectTime}
                                setSelectTimes={setSelectTime}
                                timeLists={timeList}
                                selectDate={showDate}
                                timeTextTitle={ pageText != "" ? pageText[10] : "상담 시작 시간" }
                                timeNoText={ pageText != "" ? pageText[21] : "상담 가능한 시간이 없습니다." }
                            />
                        </Box>
                     </>
                }
                {
                    (showDate != "" && selectTime != "") &&
                    <>
                    <BoxLine />
                    <Box p='20px'>
                        <HStack alignItems={'center'} pb='20px' mb='10px' borderBottomWidth={1} borderBottomColor='#757575'>
                            <Image
                                source={{uri:BASE_URL + '/images/timeIcons.png'}}
                                style={{
                                    width: 20,
                                    height:20,
                                    resizeMode:'stretch',
                                    marginRight:10
                                }}
                            />
                            <DefText 
                                text={ pageText != "" ? pageText[12] : "선택 일정"}
                                style={[fweight.bold, {lineHeight:21}]}
                            />
                        </HStack>
                        {
                            (showDate != "" && selectTime != "") &&
                            <VStack 
                                style={[styles.selectBoxs]}
                            >
                                <Box>
                                    <DefText 
                                        text={ pageText != "" ? pageText[13] : "예약 날짜 및 시간"}
                                        style={[styles.selectBoxsLeftLabel]}
                                    />
                                </Box>
                                <HStack flexWrap={'wrap'}>
                                {
                                    selectTime.map((times, idxs) => {
                                        return(
                                            <Box 
                                                key={idxs}
                                                borderRadius={5}
                                                backgroundColor={colorSelect.pink_de}
                                                width={(deviceSize.deviceWidth - 40) * 0.48}
                                                height={35}
                                                alignItems='center'
                                                justifyContent={'center'}
                                                mt='15px'
                                                mr={ (idxs + 1) % 2 != 0 ? (deviceSize.deviceWidth - 40) * 0.039 : 0 }
                                            >
                                                <DefText 
                                                    text={times}
                                                    style={[
                                                        styles.selectBoxsRightText,
                                                        {color:colorSelect.white}
                                                    ]}
                                                />
                                            </Box>
                                        )
                                    })
                                }
                               </HStack>
                            </VStack>
                        }
                    
                       
                        
                    </Box>
                    </>
                }
            </ScrollView>
            <DefButton 
                text={ pageText != "" ? pageText[18] : "다음"}
                btnStyle={[ {borderRadius:0}, (showDate != "" && selectTime != "") ? {backgroundColor:colorSelect.pink_de} : {backgroundColor:'#F1F1F1'}]}
                txtStyle={[ (showDate != "" && selectTime != "") ? {color:colorSelect.white} : {color:'#000'} ]}
                disabled={ (showDate != "" && selectTime != "") ? false :  true}
                onPress={nextNavigation}
            />
            <Modal
                isOpen={infoModal}
                onClose={()=>setInfoModal(false)}
            >
                <Modal.Content width={deviceSize.deviceWidth - 40} p='20px'>
                    <Modal.Body p='0'>
                        <Box
                            alignItems={'center'}
                            pb='20px'
                            mb='20px'
                            borderBottomWidth={1}
                            borderBottomColor='#CCCCCC'
                        >
                            <DefText 
                                text={ pageText != "" ? pageText[15] : "야간 · 새벽 진료 안내"}
                                style={[styles.modalTitle]}
                            />
                        </Box>
                        <Box>
                            <DefText 
                                text={ pageText != "" ? pageText[16] : "야간 및 새벽에는 진료가 원할하지 않을 수 있으므로 비대면 진료만 가능한점 양해 부탁드립니다."}
                                style={[styles.modalText]}
                            />
                            <DefText 
                                text={ pageText != "" ? pageText[17] + todayTime + " ~ " : "예약가능시간 : 14시 이후 ~"}
                                style={[
                                    styles.modalText,
                                    fweight.bold,
                                    {marginTop:5}
                                ]}
                            />
                            <DefButton 
                                text={ pageText != "" ? pageText[19] : "확인"}
                                onPress={()=>setInfoModal(false)}
                                btnStyle={{
                                    backgroundColor:colorSelect.navy,
                                    marginTop:30
                                }}
                                txtStyle={{
                                    color:colorSelect.white,
                                    ...fweight.m
                                }}
                            />
                        </Box>
                    </Modal.Body>
                </Modal.Content>
            </Modal>
        </Box>
    );
};

const styles = StyleSheet.create({
    timeButton: {
        width:(deviceSize.deviceWidth - 40) * 0.32,
        height: 40,
        justifyContent:'center',
        alignItems:'center',
        borderWidth:1,
        borderColor:'#73788B',
        borderRadius:5,
        marginTop:(deviceSize.deviceWidth - 40) * 0.02
    },
    timeButtonText: {
        ...fsize.fs15,
        lineHeight:20,
        color:'#73788B'
    },
    selectBoxs: {
        paddingVertical:15
    },
    selectBoxsLeftLabel: {
        ...fweight.bold,
        lineHeight:20
    },
    selectBoxsRightText: {
        lineHeight:20
    },
    modalTitle: {
        color: "#191919",
        ...fsize.fs17,
        ...fweight.bold
    },
    modalText:{
        ...fsize.fs15,
        color: "#191919",
        lineHeight:23
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
)(UntactReservationDateTime);