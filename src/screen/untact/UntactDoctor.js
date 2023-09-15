import React, { useCallback, useEffect, useState } from 'react';
import { Box, HStack } from 'native-base';
import { DefButton, DefText, LabelTitle } from '../../common/BOOTSTRAP';
import Header from '../../components/Header';
import Loading from '../../components/Loading';
import { FlatList, Image, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { doctorList } from '../../ArrayData';
import { useIsFocused } from '@react-navigation/native';
import Checkbox from '../../components/Checkbox';
import { colorSelect, fsize, fweight } from '../../common/StyleCommon';
import EmptyPage from '../../components/EmptyPage';
import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../../redux/module/action/UserAction';
import Api from '../../Api';

//비대면 진료 예약시 의사 선택
const UntactDoctor = (props) => {
    
    const {navigation, route, userInfo, user_lang} = props;
    const {params} = route;

    console.log("params",params);

    const isFocused = useIsFocused();

    const [loading, setLoading] = useState(true);
    const [pageText, setPageText] = useState("");
    const [doctorRandom, setDoctorRandom] = useState(false);
    const [doctorData, setDoctorData] = useState([]);
    const [selectDoctor, setSelectDoctor] = useState("");

    const apiLoad = async () => {
        await setLoading(true);
        //페이지 언어리스트
        await Api.send('app_page', {'cidx': user_lang != null ? user_lang?.cidx : userInfo?.cidx, "code":"untactDoctor"}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               //console.log('비대면 예약하기 의사선택 언어 리스트: ', resultItem, arrItems.text);
               setPageText(arrItems.text);
            }else{
               console.log('비대면 의사선택 언어 리스트 실패!', resultItem);
               
            }
        });
        //최근 비대면 의사목록
        await Api.send('untact_reservation03', {'catcode':params.catcode, 'cidx': user_lang != null ? user_lang?.cidx : userInfo?.cidx, "hidx":params.hidx}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               console.log('비대면 예약 의사목록: ', resultItem, arrItems);
               setDoctorData(arrItems);
               //setUntactClinicList(arrItems)
            }else{
               console.log('비대면 예약 의사목록 실패!', resultItem);
            }
        });
        await setLoading(false);
    }

    const [hospitalIdx, setHospitalIdx] = useState("");
    const [hospitalName, setHospitalName] = useState("");

    const doctorRandomHandler = () => {

        let randomIdx = Math.floor(Math.random() * doctorData.length);

        if(!doctorRandom){
            setDoctorRandom(!doctorRandom);
            
            setSelectDoctor(doctorData[randomIdx].hdidx);
            setHospitalIdx(doctorData[randomIdx].hidx);
            setHospitalName(doctorData[randomIdx].hname);
        }else{
            setDoctorRandom(!doctorRandom);
            setSelectDoctor("");
        }
        
    }

    const doctorSelectHandler = (index, hidx, hname) => {
        console.log("hidx", hidx);
        setSelectDoctor(index);
        setHospitalIdx(hidx);
        setHospitalName(hname);
    }

    const reservationApi = () => {

        console.log("selectDoctor", selectDoctor);
        Api.send('untact_reservation04', {"id":userInfo?.id, "hdidx":selectDoctor, "cidx":user_lang != null ? user_lang?.cidx : userInfo?.cidx}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               console.log('비대면 예약 의사, 병원선택: ', resultItem, arrItems);
               navigation.navigate("UntactReservationDateTime", {
                "catcode":params.catcode,
                "hidx":params.hidx != "" ? params.hidx : hospitalIdx,
                "hname":params.hname,
                "mcidx":params.mcidx,
                "clinic":params.clinic,
                "clinicItem":params.clinicItem,
                "reClinic":params.reClinic,
                "hname":hospitalName
               });
            }else{
               console.log('비대면 예약 의사, 병원선택 실패!', resultItem);
            }
        });
    }

    const renderItems = ({item, index}) => {
        return(
            <Box px='20px' mb={ '20px'}>
                <HStack
                    backgroundColor={'#fff'}
                    borderRadius='18px'
                    shadow={8}
                    padding='20px'
                    alignItems={'center'}
                    justifyContent='space-between'
                >
                    <HStack
                        alignItems={'center'}
                        width={'80%'}
                    >
                        <Box
                            width='56px'
                            height='56px'
                            backgroundColor={'#f1f1f1'}
                            borderRadius='56px'
                            overflow={'hidden'}
                        >
                            <Image 
                                source={{uri:item.icon}}
                                style={{
                                    width:56,
                                    height:56,
                                    resizeMode:'cover'
                                }}
                            />
                        </Box>
                        <Box
                            ml='10px'
                            width='70%'
                        >
                            <DefText 
                                text={item.name}
                                style={[styles.doctor]}
                            />
                            <DefText 
                                text={ item.hname }
                                style={[styles.hospital]}
                            />
                        </Box>
                    </HStack>
                    <TouchableOpacity
                        style={[styles.selectButton, selectDoctor == item.hdidx && {backgroundColor:colorSelect.navy}]}
                        onPress={()=>doctorSelectHandler(item.hdidx, item.hidx, item.hname)}
                    >
                        <DefText 
                            text={ pageText != "" ? pageText[3] : "선택"}
                            style={[styles.selectButtonText, selectDoctor == item.hdidx && {color:colorSelect.white}]}
                        />
                    </TouchableOpacity>
                </HStack>
            </Box>
        )
    }


    const keyExtractor = useCallback((item, index) => index.toString(), []);

 
    useEffect(() => {
        if(isFocused){
            apiLoad();
        }
    }, [isFocused]);

    return (
        <Box flex={1} backgroundColor='#fff' >
            <Header 
                headerTitle={ pageText != "" ? pageText[0] : "의사 선택"}
                backButtonStatus={true}
                navigation={navigation}
            />
            {
                loading ?
                <Loading />
                :
                doctorData != "" ?
                    <FlatList 
                        ListHeaderComponent={
                            <Box
                                p='20px'   
                            >
                                <LabelTitle 
                                    text={ pageText != "" ? pageText[1] : "의사 선생님을 선택해주세요."}
                                />
                                <Box
                                    alignItems={'flex-end'}
                                    mt='15px'
                                >
                                    <Checkbox 
                                        checkboxText={ pageText != "" ? pageText[2] : '의사선택 랜덤'}
                                        checkStatus={doctorRandom}
                                        onPress={doctorRandomHandler}
                                        txtStyle={[fsize.fs14]}
                                    />
                                </Box>
                            </Box>
                        }
                        data={doctorData}
                        keyExtractor={keyExtractor}
                        renderItem={renderItems}
                    />
                    :
                    <EmptyPage 
                        emptyText={ "등록된 의사가 없습니다."}
                    />
            }
            {
                doctorData != "" &&
                <DefButton 
                    text={ pageText != "" ? pageText[4] : "확인"}
                    btnStyle={{backgroundColor: selectDoctor != "" ? colorSelect.pink_de : '#f1f1f1', borderRadius:0}}
                    txtStyle={{color: selectDoctor != "" && '#fff' }}
                    disabled={ selectDoctor != "" ? false : true }
                    onPress={reservationApi}
                />
            }
           
        </Box>
    );
};

const styles = StyleSheet.create({
    doctor: {
        ...fweight.bold,
    },
    hospital: {
        ...fsize.fs14,
        color:'#919191',
        marginTop:5
    },
    selectButton: {
        paddingHorizontal:13,
        paddingVertical:10,
        borderRadius:10,
        overflow: 'hidden',
        backgroundColor:'#F1F1F1'
    },
    selectButtonText: {
        ...fsize.fs13,
        ...fweight.m
    }
})

export default connect(
    ({ User }) => ({
        userInfo: User.userInfo, //회원정보
        user_lang: User.user_lang
    }),
    (dispatch) => ({
        member_login: (user) => dispatch(UserAction.member_login(user)), //로그인
        languageSet: (user) => dispatch(UserAction.languageSet(user)), //언어
        member_logout: (user) => dispatch(UserAction.member_logout(user)), //로그아웃
    })
)(UntactDoctor);