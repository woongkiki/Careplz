import { Box } from 'native-base';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView } from 'react-native';
import EventReviewBox from '../../components/EventReviewBox';
import Header from '../../components/Header';
import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../../redux/module/action/UserAction';
import Api from '../../Api';
import messaging from '@react-native-firebase/messaging';
import BottomSheet, { BottomSheetBackdrop, BottomSheetModal, BottomSheetModalProvider, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import SingoLitsComponent from '../../components/SingoLitsComponent';
import { DefButton, LabelTitle } from '../../common/BOOTSTRAP';
import { colorSelect, fweight } from '../../common/StyleCommon';
import ToastMessage from '../../components/ToastMessage';

const Review = (props) => {

    const {navigation, route, userInfo, user_lang} = props;
    const {params} = route;

    console.log(params);

    const [reviewDetailInfo, setReviewInfo] = useState("")

    const eventReviewDetailApi = async () => {
        const token = await messaging().getToken(); // 앱 토큰 
       
        await Api.send('event_reviewDetail', {'idx':params.idx, "cidx": user_lang != null ? user_lang.cidx : userInfo?.cidx, "id":userInfo?.id, "token":token}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
                console.log("이벤트 리뷰 상세 불러오기 성공", arrItems);
                setReviewInfo(arrItems);
            }else{
                console.log('이벤트 리뷰 상세 불러오기 실패!', resultItem);
                
            }
        });
      
    }

    useEffect(() => {
        eventReviewDetailApi();
    }, [])

    const [pageText, setPageText] = useState("");

    const pageApi = () => {
        Api.send('app_page', {'cidx':user_lang != null ? user_lang?.cidx : userInfo?.cidx, "code":"eventInfo"}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               //console.log('병원이벤트 상세 언어 리스트: ', resultItem, arrItems);
               setPageText(arrItems.text);

               

               setSingoDataList([arrItems.text[26], arrItems.text[27], arrItems.text[28], arrItems.text[29]])
            }else{
               console.log('병원이벤트 상세 언어 실패!', resultItem);
               
            }
        });
    }

    useEffect(() => {
        pageApi();
    }, [])

     //신고하기 모달
     const bottomSheetModalRef = useRef(null);

     const snapPoints = useMemo(() => [1,'48%']);
 
     const handlePresentModalPress = useCallback(()=> {
         bottomSheetModalRef.current?.snapToIndex(1);
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
 
     const [singoDataList, setSingoDataList] = useState([pageText[26], pageText[27], pageText[28], pageText[29]])
 
     const [reportIdx, setReportIdx] = useState("");
     const reportReview = (idx) => {
 
         console.log("idx",idx);
         setReportIdx(idx);
         handlePresentModalPress();
     }

     //신고하기 선택
    const [selectSingo, setSelectSingo] = useState("");

     const singoCloseHandler = () => {

        if(reportIdx == ""){
            ToastMessage("신고하실 리뷰를 선택하세요.");
            return false;
        }

        if(selectSingo == ""){
            ToastMessage("신고 이유를 선택하세요.");
            return false;
        }

        console.log(reportIdx, selectSingo);

        Api.send('event_reviewReport', {'idx':reportIdx, 'cidx':user_lang != null ? user_lang?.cidx : userInfo?.cidx, 'id':userInfo?.id, "reason":selectSingo}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               console.log('리뷰 신고하기 성공: ', resultItem, arrItems);
               
               ToastMessage(resultItem.message);
               bottomSheetModalRef.current?.close();

            }else{
               console.log('리뷰 신고하기 실패!', resultItem);
               ToastMessage(resultItem.message);
            }
        });
    }

    return (
        <GestureHandlerRootView style={{flex:1, backgroundColor:'#fff'}}>
            <Header 
                headerTitle='리뷰'
                backButtonStatus={true}
                navigation={navigation}
            />
            <ScrollView>
                <Box py='20px'>
                    <EventReviewBox 
                        navigation={navigation}
                        eventName={params.eventName}
                        disabled={true}
                        textMore={true}
                        eventStart={reviewDetailInfo.star}
                        eventWriter={reviewDetailInfo.name}
                        eventDate={reviewDetailInfo.wdate}
                        eventContent={reviewDetailInfo.content}
                        eventTitle={params.eventTitle}
                        reportText={params.reportText}
                        photos={reviewDetailInfo?.photo}
                        singoOnprees={()=>reportReview(params.idx)}

                        reviewanswer={reviewDetailInfo.answer}
                        reviewAnswerImage={reviewDetailInfo.hicon}
                        hname={reviewDetailInfo.hname}

                        updateContent={"evt"}
                        updateStatus={reviewDetailInfo.editable}
                        updateText={pageText[35]}
                        reviews={reviewDetailInfo}
                    />
                </Box>
            </ScrollView>
            <BottomSheetModalProvider>
                <BottomSheet
                    ref={bottomSheetModalRef}
                    index={-1}
                    snapPoints={snapPoints}
                    onChange={handleSheetChanges}
                    backdropComponent={renderBackdrop}
                >
                    <Box
                        p='20px'
                    >
                        <LabelTitle 
                            text={ pageText != "" ? pageText[25] : "신고하는 이유를 선택해 주세요."}
                        />
                        <Box>
                            {
                                singoDataList.map((item, index) => {
                                    return(
                                        <SingoLitsComponent
                                            key={index}
                                            reason={item}
                                            onPress={()=>setSelectSingo(index)}
                                            idx={index}
                                            selectReason={selectSingo}
                                        />
                                    )
                                })
                            }
                        </Box>
                        <Box mt='30px'>
                            <DefButton
                                btnStyle={{backgroundColor: colorSelect.pink_de}}
                                text={ pageText != "" ? pageText[30] : "신고하기"}
                                txtStyle={{color:'#fff', ...fweight.m}}
                                onPress={singoCloseHandler}
                                disabled={false}
                            />
                        </Box>
                    </Box>
                </BottomSheet>
            </BottomSheetModalProvider>
        </GestureHandlerRootView>
    );
};

export default connect(
    ({ User }) => ({
        userInfo: User.userInfo, //회원정보
        user_lang: User.user_lang
    }),
    (dispatch) => ({
        member_login: (user) => dispatch(UserAction.member_login(user)), //로그인
        languageSet: (user) => dispatch(UserAction.languageSet(user)), //선택언어
    })
)(Review);