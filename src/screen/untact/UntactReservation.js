import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Box, HStack } from 'native-base';
import { DefButton, DefText, LabelTitle } from '../../common/BOOTSTRAP';
import Header from '../../components/Header';
import { Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { colorSelect, deviceSize, fsize, fweight } from '../../common/StyleCommon';
import BoxLine from '../../components/BoxLine';
import Checkbox from '../../components/Checkbox';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { popularUntact, symptomClinic } from '../../ArrayData';
import { BASE_URL } from '../../Utils/APIConstant';
import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../../redux/module/action/UserAction';
import Loading from '../../components/Loading';
import Api from '../../Api';
import { numberFormat } from '../../common/DataFunction';
import ToastMessage from '../../components/ToastMessage';

//비대면 진료 예약하기
const UntactReservation = (props) => {

    const {navigation, userInfo, user_lang, route} = props; 
    const {params} = route;

    //console.log("비대면 예약", params);

    const [loading, setLoading] = useState(true);
    const [pageText, setPageText] = useState("");
    const [won, setWon] = useState( user_lang?.cidx == 0 ? "원" : "won" );
    const [hospitalInfo, setHospitalInfo] = useState("");
    const [hospitalCategory, setHospitalCategory] = useState([]);
    const [reReservation, setReReservation] = useState(false);
    const [catcode, setCatcode] = useState(params.catcode);

    //파일 첨부 체크
    const [fileCheck, setFileCheck] = useState(false);

    //비대면 예약
    const apiLoad = async () => {
        await setLoading(true);
        //페이지 언어리스트
        await Api.send('app_page', {'cidx': user_lang != null ? user_lang?.cidx : userInfo?.cidx, "code":"untactReser1"}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               //console.log('비대면 예약하기 메인 언어 리스트: ', resultItem, arrItems.text);
               setPageText(arrItems.text);
            }else{
               console.log('비대면 예약하기 언어 리스트 실패!', resultItem);
               
            }
        });
        //최근 비대면 예약하기1
        await Api.send('untact_reservation01', {'id':userInfo?.id, 'cidx': user_lang != null ? user_lang?.cidx : userInfo?.cidx, "hidx":params.hidx, "catcode":catcode}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               console.log('비대면 예약: ', resultItem, arrItems.filechk);
               setHospitalInfo(arrItems.main);
               setHospitalCategory(arrItems.category);
               setFileCheck(arrItems.filechk)
               //setUntactClinicList(arrItems)
            }else{
               console.log('비대면 예약 실패!', resultItem);
            }
        });
        await setLoading(false);
    }

    useEffect(() => {
        apiLoad();
    }, [])

    const bottomSheetModalRef = useRef(null);

    const snapPoints = useMemo(() => ['65%', '80%']);


    const handlePresentModalPress = useCallback(()=> {
        bottomSheetModalRef.current?.present();
    }, []);

    const handleSheetChanges = useCallback((index)=> {
        console.log('handleSheetChanges', index)
    }, []);

    const renderBackdrop = useCallback(
        props => (
            <BottomSheetBackdrop
            {...props}
            pressBehavior="close"
            appearsOnIndex={0}		// 이거 추가
            disappearsOnIndex={-1}	// 이거 추가
            />
        ),
    [],);
    

    //인기 비대면 데이터
    const [popularUntactData, setPopularUntactData] = useState(popularUntact);

    //증상별 진료 데이터
    const [symptomData, setSymptomData] = useState(symptomClinic);

    //선택한 증상 및 진료
    const [selectClinic, setSelectClinic] = useState(params.selectClinic);

    const selectClinicHandler = (item) => {
        setSelectClinic(item);
        bottomSheetModalRef.current?.close();
    }

    //reservation02 호출
    const untactMyInfoHandler = async () => {

    
        const formData = new FormData();
        formData.append("method", "untact_reservation02");
        formData.append("id", userInfo?.id);
        formData.append("cidx", user_lang != null ? user_lang?.cidx : userInfo?.cidx);
        formData.append("catcode", selectClinic.catcode);
        formData.append("mcidx", "");
        //formData.append('upfile', '');
        
        const upload = await Api.multipartRequest(formData);

        if(upload.result){

            console.log("비대면 예약 파일첨부 스킵", upload);
            
            navigation.navigate("UntactDoctor", {
                "catcode":selectClinic.catcode,
                "hidx":params.hidx,
                "hname":params.hname,
                "mcidx":"",
                "clinic":selectClinic.category,
                "clinicItem":selectClinic,
                "reClinic":reReservation
            });
        }else{
            ToastMessage(upload.msg);
            return false;
        }

        
    }

    const nextNavigation = () => {
        if(selectClinic == ""){
            ToastMessage("증상을 선택하세요.");
            return false;
        }

        const param = {
            hidx:params.hidx,
            hname:params.hname,
            mcidx:"",
            catcode:selectClinic.catcode,
            clinic:selectClinic.category,
            clinicItem:selectClinic,
            reClinic:reReservation
        };

        if(fileCheck){
            console.log("의사로 넘어감");
            untactMyInfoHandler();
        }else{
            navigation.navigate("UntactReservationMyInfo", param);
        }

    }

    return (
        <GestureHandlerRootView style={{flex:1, backgroundColor:'#fff'}}>
            
            <Header 
                headerTitle={ pageText != "" ? pageText[0] : '비대면 진료'}
                backButtonStatus={true}
                navigation={navigation}
            />
            {
                loading ? 
                <Loading />
                :
                <ScrollView>
                    <Box p='20px'>
                        <Box>
                            <LabelTitle 
                                text={ pageText != "" ? pageText[1] : "진료항목"}
                            />
                            {
                                hospitalInfo != "" &&
                                <Box mt='30px'>
                                    <HStack
                                        alignItems={'center'}
                                        justifyContent='space-between'
                                    >
                                        <Box width='14%' >
                                            <Image 
                                                source={{uri:hospitalInfo.icon}}
                                                style={{
                                                    width:48,
                                                    height:48,
                                                    resizeMode:'stretch',
                                                    
                                                }}
                                            />
                                        </Box>
                                        <Box width='81%'>
                                            <DefText 
                                                text={hospitalInfo.title}
                                                style={[styles.hospital]}
                                            />
                                            <DefText 
                                                text={( pageText != "" ? pageText[2] + " : " : "진료비 평균 : " )+ numberFormat(hospitalInfo.stdprice) + won }
                                                style={[styles.priceText]}
                                            />
                                            <DefText 
                                                text={ pageText != "" ? pageText[3] : "*비급여 진료는 추가비용이 발생할 수 있어요."}
                                                style={[styles.alertText]}
                                            />
                                        </Box>
                                    </HStack>
                                    <Box
                                        position={'absolute'}
                                        height='100%'
                                        
                                        justifyContent='center'
                                        right={0}
                                    >
                                        <Image 
                                            source={require("../../images/rightArr.png")}
                                            style={{
                                                width:13,
                                                height:8,
                                                resizeMode:'contain'
                                            }}
                                        />
                                    </Box>
                                </Box>
                            }
                        </Box>
                    </Box>
                    <BoxLine />
                    <Box p='20px'>
                        <DefButton 
                            text={ pageText != "" ? pageText[4] : "신용카드 등록"}
                            btnStyle={{
                                borderWidth:1,
                                borderColor:'#D2D2DF',
                                height:50
                            }}
                            txtStyle={[fweight.m]}
                            onPress={()=>navigation.navigate("CardForm")}
                        />
                        {
                            catcode == "" &&
                            <Box mt='30px'>
                                <DefText 
                                    text={ pageText != "" ? pageText[5] : "증상을 의사선생님께 알려주세요."}
                                    style={[fweight.m, {marginBottom:15}]}
                                />
                                <Box>
                                <TouchableOpacity
                                    style={[styles.selectButton]}
                                    onPress={handlePresentModalPress}
                                >
                                    <HStack
                                        alignItems={'center'}
                                        justifyContent='space-between'
                                    >
                                        {
                                            selectClinic != "" ?
                                            <HStack
                                                alignItems={'center'}
                                            >
                                                <Image 
                                                    source={{uri:selectClinic.icon}}
                                                    style={{
                                                        width:24,
                                                        height:24,
                                                        resizeMode:'contain'
                                                    }}
                                                />
                                                <DefText
                                                    text={selectClinic.category}
                                                    style={[fsize.fs15, {marginLeft:12}]}
                                                />
                                            </HStack>
                                            :
                                            <DefText 
                                                text={ pageText != "" ? pageText[6] : "증상 또는 진료내용을 선택해 주세요."}
                                                style={[fsize.fs14, {color:'#BEBEBE'}]}
                                            />
                                        }
                                    
                                        <Image 
                                            source={require("../../images/downArr.png")}
                                            style={{
                                                width:12,
                                                height: 7,
                                                resizeMode:'stretch'
                                            }}
                                        />
                                    </HStack>
                                    
                                </TouchableOpacity>
                                </Box>
                            </Box>
                        }
                        
                        <Box mt='30px'>
                            <Checkbox 
                                checkStatus={reReservation}
                                checkboxText={ pageText != "" ? pageText[10] : '재진이에요'}
                                onPress={()=>setReReservation(!reReservation)}
                            />
                        </Box>
                    </Box>
                </ScrollView>
            }
            
            <DefButton 
                text={ pageText != "" ? pageText[8] : "다음"}
                btnStyle={{backgroundColor: selectClinic != "" ? colorSelect.pink_de : '#F1F1F1', borderRadius:0}}
                txtStyle={[selectClinic != "" && {color:'#fff'}]}
                disabled={ selectClinic != "" ? false : true }
                onPress={nextNavigation}
            />
            <BottomSheetModalProvider>
                <BottomSheetModal
                    ref={bottomSheetModalRef}
                    index={0}
                    snapPoints={snapPoints}
                    onChange={handleSheetChanges}
                    backdropComponent={renderBackdrop}
                    enableContentPanningGesture={false}
                >
                    <ScrollView>
                        <Box p='20px'>
                            {/* <Box>
                                
                                <LabelTitle 
                                    text="인기 비대면"
                                />
                                <HStack flexWrap={'wrap'}>
                                    {
                                        popularUntactData.map((item, index) => {
                                            return(
                                                <TouchableOpacity
                                                    style={[styles.modalCategory]}
                                                    key={index}
                                                    onPress={()=>selectClinicHandler(item)}
                                                >
                                                    <HStack
                                                        alignItems={'center'}
                                                    >
                                                        <Box
                                                            width='30px'
                                                            height='30px'
                                                            justifyContent='center'
                                                            alignItems={'center'}
                                                        >
                                                            <Image 
                                                                source={{uri:item.uri}}
                                                                style={{
                                                                    width:30,
                                                                    height:30,
                                                                    resizeMode:'contain'
                                                                }}
                                                            />
                                                        </Box>
                                                        <DefText 
                                                            text={item.symptom}
                                                            style={[styles.modalCategoryText]}
                                                        />
                                                    </HStack>
                                                </TouchableOpacity>
                                            )
                                        })
                                    }
                                </HStack>
                            </Box> */}
                            <Box>
                                <LabelTitle 
                                    text={ pageText != "" ? pageText[7] : "증상별 진료"}
                                />
                                <HStack 
                                    flexWrap={'wrap'}
                                >
                                {
                                    hospitalCategory.map((item, index) => {
                                        return(
                                            <TouchableOpacity
                                                key={index}
                                                style={[styles.modalCategory]}
                                                onPress={()=>selectClinicHandler(item)}
                                            >
                                                <HStack
                                                    alignItems={'center'}
                                                    
                                                >
                                                    <Box
                                                        width='30px'
                                                        height='30px'
                                                        justifyContent='center'
                                                        alignItems={'center'}
                                                    >
                                                        <Image 
                                                            source={{uri:item.icon}}
                                                            style={{
                                                                width:30,
                                                                height:30,
                                                                resizeMode:'contain'
                                                            }}
                                                        />
                                                    </Box>
                                                    <DefText 
                                                        text={item.category}
                                                        style={[styles.modalCategoryText]}
                                                    />
                                                </HStack>
                                            </TouchableOpacity>
                                        )
                                    })
                                }
                                </HStack>
                            </Box>
                        </Box>
                    </ScrollView>
                </BottomSheetModal>
            </BottomSheetModalProvider>
        </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
    hospital: {
        ...fsize.fs16,
        ...fweight.bold,
        color:'#191919'
    },
    priceText: {
        ...fsize.fs14,
        color:'#434856',
        marginVertical:5
    },
    alertText: {
        color:'#E11B1B',
        ...fsize.fs12
    },
    selectButton: {
        width:'100%',
        height: 48,
        borderRadius:5,
        borderWidth:1,
        borderColor:'#E1E1E1',
        justifyContent:'center',
        paddingHorizontal:15
    },
    modalCategory: {
        width: (deviceSize.deviceWidth - 60) * 0.5,
        justifyContent:'center',
        marginTop:20,
        paddingHorizontal:10
    },
    modalCategoryText: {
        ...fsize.fs13,
        ...fweight.bold,
        marginLeft:12
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
)(UntactReservation);