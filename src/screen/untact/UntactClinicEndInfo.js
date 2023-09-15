import { Box } from 'native-base';
import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { DefButton, DefText, LabelTitle } from '../../common/BOOTSTRAP';
import { colorSelect, fweight } from '../../common/StyleCommon';
import Header from '../../components/Header';
import ReservationConfirm from '../../components/reservation/ReservationConfirm';
import { BASE_URL } from '../../Utils/APIConstant';
import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../../redux/module/action/UserAction';
import Api from '../../Api';
import { numberFormat } from '../../common/DataFunction';
import Loading from '../../components/Loading';

const UntactClinicEndInfo = (props) => {

    const {navigation, userInfo, user_lang, route} = props;
    const {params} = route;

    console.log("params", params);

    const [loading, setLoading] = useState(true);
    const [pageText, setPageText] = useState("");
    const [untactResult, setUntactResult] = useState("");

    const pageLangApi = async () => {
        
        //user_lang != null ? user_lang?.cidx : userInfo?.cidx
        Api.send('app_page', {'cidx':user_lang != null ? user_lang?.cidx : userInfo?.cidx, "code":"untactClinicInfo"}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               //console.log('병원지도 메인 언어 리스트: ', resultItem, arrItems);
               setPageText(arrItems.text);
            }else{
               console.log('병원지도 메인 언어 리스트 실패!', resultItem);
               
            }
        });
    }

    const untactEndResultHandler = async () => {
        await setLoading(true)
        await Api.send('untact_callEnd', {'id':userInfo?.id, 'sendbird_roomid':params.roomId, 'cidx':user_lang != null ? user_lang?.cidx : userInfo?.cidx}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               console.log('비대면 진료 완료 내역 리스트: ', resultItem, arrItems);
               setUntactResult(arrItems);
            }else{
               console.log('병원지도 메인 언어 리스트 실패!', resultItem);
               
            }
        });
        await setLoading(false)
    }

    useEffect(() => {
        pageLangApi();
        untactEndResultHandler();
    }, [])

    return (
        <Box flex={1} backgroundColor={'#fff'}>
            <Header 
                headerTitle={ pageText != "" ? pageText[0] : "진료 내역"}
                backButtonStatus={true}
                navigation={navigation}
            />
            {
                loading ?
                <Loading />
                :
                <ScrollView>
                    <Box p='20px'>
                        <LabelTitle 
                            text={ pageText != "" ? pageText[1] : "비대면 진료"}
                        />
                        <Box mt='30px'>
                            <ReservationConfirm
                                icon={{uri:BASE_URL + "/images/untactHospitalIcon.png"}}
                                iconWidth={18}
                                iconHeight={18}
                                iconResize='contain'
                                label={ pageText != "" ? pageText[2] : '병원'}
                                confirmText={
                                    untactResult.hname
                                }
                                dates={""}
                            />
                        </Box>
                        <Box mt='30px'>
                            <ReservationConfirm
                                icon={{uri:BASE_URL + "/images/untactDoctor.png"}}
                                iconWidth={18}
                                iconHeight={18}
                                iconResize='contain'
                                label={ pageText != "" ? pageText[3] : '담당의사'}
                                confirmText={
                                    untactResult.hdname
                                }
                                dates={""}
                            />
                        </Box>
                        <Box mt='30px'>
                            <ReservationConfirm
                                icon={{uri:BASE_URL + "/images/untactClinicName.png"}}
                                iconWidth={18}
                                iconHeight={18}
                                iconResize='contain'
                                label={ pageText != "" ? pageText[4] : '진료대상'}
                                confirmText={
                                    untactResult.name
                                }
                                dates={""}
                            />
                        </Box>
                        <Box mt='30px'>
                            <ReservationConfirm
                                icon={{uri:BASE_URL + "/images/untactEffect.png"}}
                                iconWidth={18}
                                iconHeight={18}
                                iconResize='contain'
                                label={ pageText != "" ? pageText[5] : '증상'}
                                confirmText={
                                    untactResult.category
                                }
                                dates={""}
                            />
                        </Box>
                        <Box mt='30px'>
                            <ReservationConfirm
                                icon={{uri:BASE_URL + "/images/untactDate.png"}}
                                iconWidth={18}
                                iconHeight={18}
                                iconResize='contain'
                                label={ pageText != "" ? pageText[6] : '접수일시'}
                                confirmText={
                                    untactResult.rdatetime
                                }
                                dates={""}
                            />
                        </Box>
                        <Box mt='30px'>
                            <ReservationConfirm
                                icon={{uri:BASE_URL + "/images/untactEndDate.png"}}
                                iconWidth={18}
                                iconHeight={18}
                                iconResize='contain'
                                label={ pageText != "" ? pageText[7] : '진료완료'}
                                confirmText={
                                    untactResult.rdatetime
                                }
                                dates={""}
                            />
                        </Box>
                        {
                            untactResult.price != "" &&
                            <Box mt='30px'>
                                <ReservationConfirm
                                    icon={{uri:BASE_URL + "/images/untactPrice.png"}}
                                    iconWidth={18}
                                    iconHeight={18}
                                    iconResize='contain'
                                    label={ pageText != "" ? pageText[8] : '진료비'}
                                    confirmText={
                                        numberFormat(untactResult.price) + "원"
                                    }
                                    dates={""}
                                />
                            </Box>
                        }
                    </Box>
                </ScrollView>
            }
            <DefButton 
                text={ pageText != "" ? pageText[9] : "약받기"}
                btnStyle={{backgroundColor:colorSelect.pink_de, borderRadius:0}}
                txtStyle={{color:colorSelect.white, ...fweight.m}}
                onPress={()=>navigation.navigate("UntactTakeMedicine", {"idx":untactResult.idx})}
            />
        </Box>
    );
};

export default connect(
    ({ User }) => ({
        userInfo: User.userInfo, //회원정보
        user_lang: User.user_lang,
        userPosition: User.userPosition
    }),
    (dispatch) => ({
        member_login: (user) => dispatch(UserAction.member_login(user)), //로그인
        languageSet: (user) => dispatch(UserAction.languageSet(user)), //선택언어
    })
)(UntactClinicEndInfo);