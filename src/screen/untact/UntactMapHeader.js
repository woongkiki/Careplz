import React, { useEffect, useState } from 'react';
import { TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Box, HStack } from 'native-base';
import { DefText } from '../../common/BOOTSTRAP';
import { deviceSize, fsize, fweight } from '../../common/StyleCommon';
import SearchInput from '../../components/SearchInput';
import ToastMessage from '../../components/ToastMessage';
import { rankSch, subjectData, hospitalSchData, hospitalrankSch } from '../../ArrayData';
import BoxLine from '../../components/BoxLine';
import RecentWord from '../../components/RecentWord';
import PopularWord from '../../components/PopularWord';
import SubjectWord from '../../components/SubjectWord';
import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../../redux/module/action/UserAction';
import Api from '../../Api';
import messaging from '@react-native-firebase/messaging';
import PopularWordHospital from '../../components/PopularWordHospital';

//병원검색
const UntactMapHeader = (props) => {

    const {navigation, userInfo, user_lang, route} = props;
    const {params} = route;

    //console.log("schText::", params);

    const [pageText, setPageText] = useState([]);
    //페이지 언어
    const pageLangSelects = () => {
        Api.send('app_page', {'cidx':user_lang != null ? user_lang?.cidx : userInfo?.cidx, "code":"hospitalSearch"}, (args)=>{

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

    useEffect(() => {
        pageLangSelects();
    }, [])

    useEffect(() => {
        setSchText(params.schText);
    }, [params])

    //검색어
    const [schText, setSchText] = useState("");
    const schChange = (text) => {
        setSchText(text);
    }

    const schEvent = () => {
        // if(schText == ""){
        //     ToastMessage("검색어를 한글자 이상 입력하세요.");
        //     return false;
        // }   

        navigation.navigate("UntactMap", {"schText":schText});
        //navigation.navigate("SearchResult", {"schText":schText});
    }

    const [recentSchData, setRecentSchData] = useState([]);
    const [rankSchData, setRankSchData] = useState([]);
    const [subjectSchData, setSubjectSchData] = useState([]);

    const schWordApi = async () => {
        const token = await messaging().getToken(); // 앱 토큰
        await Api.send('hospital_keyword', {'cidx':user_lang != null ? user_lang?.cidx : userInfo?.cidx, "token":token}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               console.log('병원 검색 키워드: ', resultItem, arrItems);
               setRankSchData(arrItems.hot);
               setSubjectSchData(arrItems.subj);
            }else{
               console.log('병원 검색 키워드 실패!', resultItem);
               
            }
        });
    }

    useEffect(() => {
        schWordApi();
    }, [])


    const [selectSubject, setSelectSubject] = useState("");

    return (
        <Box flex={1} backgroundColor='#fff' >
            <Box p='20px' pb='20px'>
                <HStack justifyContent={'space-between'} width={deviceSize.deviceWidth - 40} flexWrap='wrap'>
                    <Box width={(deviceSize.deviceWidth - 40) * 0.85}>
                        <SearchInput 
                            placeholder={ pageText != "" ? pageText[0] : "검색어를 입력하세요."}
                            value={schText}
                            onChangeText={schChange}
                            inputStyle={{paddingLeft:15, backgroundColor:'#F2F3F5', borderWidth:0, lineHeight:20}}
                            positionMargin={'-24px'}
                            buttonPositionRight={0}
                            onPress={schEvent}
                            onSubmitEditing={schEvent}
                        />
                    </Box>
                    <TouchableOpacity
                        style={{
                            width:(deviceSize.deviceWidth - 40) * 0.14,
                            height:48,
                            justifyContent:'center',
                            alignItems:'flex-end',
                        }}
                        onPress={()=>navigation.goBack()}
                    >
                        <DefText 
                            text={ pageText != "" ? pageText[1] : "취소"}
                            style={[fsize.fs14, {color:'#191919'}]}
                        />
                    </TouchableOpacity>
                </HStack>
            </Box>
            <ScrollView>
                {
                    recentSchData != "" &&
                    <>
                        <Box pt='0' p='20px'>
                            <RecentWord 
                                recentSchData={recentSchData}
                                navigation={navigation}
                                titles={pageText != "" ? pageText[2] : "최근 검색어"}
                                allDeleteText={pageText != "" ? pageText[3] : "전체 삭제"}
                            />
                        </Box>
                        <BoxLine />
                    </>
                }
                 {
                    rankSchData != "" && 
                    <>
                        <PopularWordHospital 
                            rankSchData={rankSchData}
                            navigation={navigation}
                            setSchText={setSchText}
                            title={pageText != "" ? pageText[4] : "인기 검색어"}
                            appPage={"Untact"}
                        />
                        <BoxLine />
                    </>
                }
                 {
                    subjectSchData != "" && 
                    <SubjectWord 
                        subjectSchData={subjectSchData}
                        navigation={navigation}
                        setSchText={setSchText}
                        title={pageText != "" ? pageText[5] : "주제별 검색"}
                        appPage={"Untact"}
                    />
                }
            </ScrollView>
            {/* <ScrollView>
                {
                    recentSchData != "" &&
                    <>
                        <Box pt='0' p='20px'>
                            <RecentWord 
                                recentSchData={recentSchData}
                                navigation={navigation}
                            />
                        </Box>
                        <BoxLine />
                    </>
                }
                {
                    rankSchData != "" && 
                    <>
                        <PopularWord 
                            rankSchData={rankSchData}
                            navigation={navigation}
                        />
                        <BoxLine />
                    </>
                }
                {
                    subjectSchData != "" && 
                    <SubjectWord 
                        subjectSchData={subjectSchData}
                        navigation={navigation}
                    />
                }
            </ScrollView> */}
        </Box>
    );
};

const styles = StyleSheet.create({
    label: {
        ...fsize.fs14,
        ...fweight.bold,
        color:'#000000'
    },
})

export default connect(
    ({ User }) => ({
        userInfo: User.userInfo, //회원정보
        user_lang: User.user_lang,
        userPosition: User.userPosition
    }),
    (dispatch) => ({
        member_login: (user) => dispatch(UserAction.member_login(user)), //로그인
        languageSet: (user) => dispatch(UserAction.languageSet(user)), //선택언어
        app_positions: (user) => dispatch(UserAction.app_positions(user)), //현재 좌표
    })
)(UntactMapHeader);