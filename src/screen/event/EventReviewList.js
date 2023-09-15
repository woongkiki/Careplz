import { Box } from 'native-base';
import React, { useCallback, useEffect, useState } from 'react';
import Api from '../../Api';
import Header from '../../components/Header';
import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../../redux/module/action/UserAction';
import Loading from '../../components/Loading';
import { FlatList } from 'react-native';
import EventReviewBox from '../../components/EventReviewBox';
import EmptyPage from '../../components/EmptyPage';

const EventReviewList = (props) => {

    const {navigation, route, userInfo, user_lang} = props;
    const {params} = route;

    const [loading, setLoading] = useState(true);
    const [pageText, setPageText] = useState("");
    const [reviewList, setReviewList] = useState([]);

    const pageChange = () => {
        Api.send('app_page', {'cidx':user_lang != null ? user_lang?.cidx : userInfo?.cidx, "code":"eventInfo"}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               //console.log('병원이벤트 언어 리스트: ', resultItem, arrItems);
               setPageText(arrItems.text);

               //setSingoDataList([arrItems.text[26], arrItems.text[27], arrItems.text[28], arrItems.text[29]])
            }else{
               console.log('병원이벤트 상세 언어 실패!', resultItem);
            }
        });
    }

    const eventReviewApi = () => {
        Api.send('event_reviewList', {'heidx':params.idx, "cidx": user_lang != null ? user_lang.cidx : userInfo?.cidx, "id":userInfo?.id, "orderby":1, 'isphoto':0}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
                //console.log("이벤트 리뷰 목록 성공", arrItems);
                setReviewList(arrItems);
            }else{
                console.log('이벤트 리뷰 목록 실패!', resultItem);
                setReviewList("");
            }
        });
    }

    const reveiwApi = async () => {
        await setLoading(true);
        await pageChange();
        await eventReviewApi();
        await setLoading(false);
    }

    useEffect(() => {
        reveiwApi();
    }, []);

    const renderItems = ({item, index}) => {
        return(
            <Box>
                <EventReviewBox 
                    navigation={navigation}
                    eventWriter={item.name}
                    eventTitle={pageText[23]}
                    eventName={params.name}
                    eventDate={item.wdate}
                    eventStart={item.star}
                    eventContent={item.content}
                    reportText={pageText[22]}
                    //eventReviewOnpress={()=>navigation.navigate("Review", {"idx":item.idx, "eventName":eventInfo.name, "eventTitle":pageText[23], "reportText":pageText[22]})}
                    photos={item?.photo}

                    reviewanswer={item.answer}
                    reviewAnswerImage={item.hicon}
                    hname={item.hname}
                    //singoOnprees={()=>reportReview(item.idx)}
                />
            </Box>
        )
    }

    const keyExtractor = useCallback((item) => item.idx.toString(), [])

    return (
        <Box flex={1} backgroundColor={"#fff"}>
            <Header 
                headerTitle='리뷰'
                backButtonStatus={true}
                navigation={navigation}
            />
            {
                loading ? 
                <Loading />
                :
                <FlatList 
                    data={reviewList}
                    renderItem={renderItems}
                    keyExtractor={keyExtractor}
                />
            }
        </Box>
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
)(EventReviewList);