import { Box, HStack } from 'native-base';
import React, { useEffect, useState } from 'react';
import { Image } from 'react-native';
import Header from '../../components/Header';
import StartIcons from '../../components/review/StartIcons';
import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../../redux/module/action/UserAction';
import { BASE_URL } from '../../Utils/APIConstant';
import { DefButton, DefText } from '../../common/BOOTSTRAP';
import { colorSelect, fsize, fweight } from '../../common/StyleCommon';
import Api from '../../Api';
import ToastMessage from '../../components/ToastMessage';
import Loading from '../../components/Loading';
const UntactEndReview = (props) => {

    const {navigation, userInfo, user_lang, route} = props;
    const {params} = route;

    console.log("진료 평가", params);

    const [loading, setLoading] = useState(true);
    const [starIdx, setStarIdx] = useState("");
    const [start1, setStar1] = useState(false);
    const [start2, setStar2] = useState(false);
    const [start3, setStar3] = useState(false);
    const [start4, setStar4] = useState(false);
    const [start5, setStar5] = useState(false);
    const [untactInfo, setUntactInfo] = useState("");
    const [pageText, setPageText] = useState("");

    const startSelectEvent = (idx) => {

        setStarIdx(idx);
        if(idx == 5){
            setStar5(true);
            setStar4(true);
            setStar3(true);
            setStar2(true);
            setStar1(true);
        }else if(idx == 4){
            setStar5(false);
            setStar4(true);
            setStar3(true);
            setStar2(true);
            setStar1(true);
        }else if(idx == 3){
            setStar5(false);
            setStar4(false);
            setStar3(true);
            setStar2(true);
            setStar1(true);
        }else if(idx == 2){
            setStar5(false);
            setStar4(false);
            setStar3(false);
            setStar2(true);
            setStar1(true);
        }else if(idx == 1){
            setStar5(false);
            setStar4(false);
            setStar3(false);
            setStar2(false);
            setStar1(true);
        }
    }

    const untactReviewInfo = async () => {
        await setLoading(true);
        //user_lang != null ? user_lang?.cidx : userInfo?.cidx
        await Api.send('app_page', {'cidx':user_lang != null ? user_lang?.cidx : userInfo?.cidx, "code":"untactReviews"}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               console.log('병원 리뷰작성 언어 리스트: ', resultItem, arrItems);
               setPageText(arrItems.text);
            }else{
               console.log('병원 리뷰작성 리스트 실패!', resultItem);
               
            }
        });
        await Api.send('untact_star1', {'idx':params.idx, 'id':userInfo?.id, 'cidx':user_lang != null ? user_lang?.cidx : userInfo?.cidx}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               //console.log('비대면 진료평가 정보 가져오기', resultItem, arrItems);
               
               setUntactInfo(arrItems);

            }else{
               console.log('비대면 진료평가 정보 가져오기 실패!', resultItem);
            }
        });
        await setLoading(false);
    }

    useEffect(() => {
        untactReviewInfo();
    }, []);

    const untactReviewHandler = () => {

        if(starIdx == ""){
            ToastMessage("별점을 선택하세요.");
            return false;
        }

        Api.send('untact_star2', {'idx':params.idx, 'id':userInfo?.id, 'cidx':user_lang != null ? user_lang?.cidx : userInfo?.cidx, "star":starIdx}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               console.log('비대면 진료평가 하기', resultItem, arrItems);
               
               ToastMessage(pageText[3]);
               navigation.reset({routes: [{name: "TabNavi", screen: "Event"}]});

            }else{
               console.log('비대면 진료평가 하기', resultItem);

               ToastMessage("오류가 발생했습니다.");
            }
        });
    }

    return (
        <Box flex={1} backgroundColor='#fff' >
            <Header 
                headerTitle={ pageText != "" ? pageText[0] : "진료평가"}
                backButtonStatus={true}
                navigation={navigation}
            />
            {
                loading ?
                <Loading />
                :
                <Box flex={1} justifyContent={"center"} alignItems={"center"}>
                    <Image 
                        source={{uri:BASE_URL + "/images/hospitalIcons.png"}}
                        style={{
                            width:63,
                            height:60,
                            resizeMode:'contain'
                        }}
                    />
                    <HStack mt='25px'>
                        <StartIcons 
                            onPress={()=>startSelectEvent(1)}
                            btnStatus={start1}
                        />
                        <StartIcons 
                            btnstyle={[
                                {marginLeft:13}
                            ]}
                            onPress={()=>startSelectEvent(2)}
                            btnStatus={start2}
                        />
                        <StartIcons 
                            btnstyle={[
                                {marginLeft:13}
                            ]}
                            onPress={()=>startSelectEvent(3)}
                            btnStatus={start3}
                        />
                        <StartIcons 
                            btnstyle={[
                                {marginLeft:13}
                            ]}
                            onPress={()=>startSelectEvent(4)}
                            btnStatus={start4}
                        />
                        <StartIcons 
                            btnstyle={[
                                {marginLeft:13}
                            ]}
                            onPress={()=>startSelectEvent(5)}
                            btnStatus={start5}
                        />
                    </HStack>
                    <Box mt='30px' px='20px'>
                        <DefText 
                            text={ pageText != "" ? pageText[1] : "비대면 진료는 잘 받으셨나요?\n만족도를 체크해주세요."}
                            style={[{
                                textAlign:'center',
                                ...fsize.fs19,
                                lineHeight:27,
                                },
                            ]}
                        />
                        {
                            untactInfo != "" &&
                            <HStack justifyContent={'center'} mt='20px'>
                                <DefText 
                                    text={untactInfo.hname}
                                    style={[fweight.bold]}
                                />
                                <DefText 
                                    text={untactInfo.hdname}
                                    style={[{marginLeft:10}]}
                                />
                            </HStack>
                        }
                    </Box>
                </Box>
            }   
            <DefButton
                text={ pageText[2] }
                txtStyle={{color: starIdx != "" ? colorSelect.white : colorSelect.black }}
                btnStyle={{borderRadius:0, backgroundColor: starIdx != "" ? colorSelect.pink_de : '#F1F1F1'}}
                disabled={starIdx != "" ? false : true}
                onPress={untactReviewHandler}
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
)(UntactEndReview);