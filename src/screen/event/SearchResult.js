import React, { useCallback, useEffect, useState } from 'react';
import { Box, HStack } from 'native-base';
import { FlatList, Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import SearchInput from '../../components/SearchInput';
import { deviceSize, fsize } from '../../common/StyleCommon';
import { DefText } from '../../common/BOOTSTRAP';
import { popularEvent } from '../../ArrayData';
import EventBox from '../../components/EventBox';
import Api from '../../Api';
import messaging from '@react-native-firebase/messaging';
import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../../redux/module/action/UserAction';
import Loading from '../../components/Loading';
import EmptyPage from '../../components/EmptyPage';
import ToastMessage from '../../components/ToastMessage';
import { BASE_URL } from '../../Utils/APIConstant';

const SearchResult = (props) => {

    const {navigation, route, userInfo, user_lang} = props;
    const {params} = route;

    console.log(params);

    const [schText, setSchText] = useState(params?.schText);
    const schChange = (text) => {
        setSchText(text);
    }

    const [loading, setLoading] = useState(true);

    const [schResultData, setSchResultData] = useState([]);
    const [page, setPage] = useState(1);

    const [commonText, setCommonText] = useState("");

    const [pageText, setPageText] = useState("");

    const schResultApi = async () => {
        await setLoading(true);

        const token = await messaging().getToken(); // 앱 토큰

        await Api.send('app_page', {'cidx': user_lang != null ? user_lang.cidx : userInfo?.cidx, "code":"eventSearch"}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               console.log(' 검색 언어 리스트: ', resultItem, arrItems.text);
               setPageText(arrItems.text);
            }else{
               console.log(' 검색 언어 리스트 실패!', resultItem);
               
            }
        });

        await Api.send('app_page', {'cidx': user_lang != null ? user_lang.cidx : userInfo.cidx, "code":"commonPage"}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               console.log('공통 언어 리스트: ', resultItem, arrItems.text);
               setCommonText(arrItems.text);
            }else{
               console.log('공통 언어 리스트 실패!', resultItem);
               
            }
        });

        await Api.send('event_search', {"id":userInfo.id, 'cidx': user_lang != null ? user_lang.cidx : userInfo?.cidx, 'token':token, 'keyword':schText, "page":page}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               console.log('이벤트 검색결과 : ', arrItems);
               setSchResultData(arrItems);

            }else{
               console.log('이벤트 검색결과 실패!', resultItem);
               setSchResultData([]);
            }
        });

        await setLoading(false);
    }

    useEffect(() => {
        schResultApi();
    }, []);

    //찜
    const [wishEvent, setWishEvent] = useState([]);

    const wishEventAdd = (wish) => {
        if(!wishEvent.includes(wish)){
            setWishEvent([...wishEvent, wish]);
        }else{
            const wishRemove = wishEvent.filter(item => wish !== item);
            setWishEvent(wishRemove);
        }
    }

    //찜 목록 추가
    const wishApiHandler = (event) => {

        console.log("event", event);

        let eventIdx = schResultData.indexOf(event);

        let eventItem = [...schResultData];

        let eventidxNum = eventItem[eventIdx].idx;

        //위시체크 변경
        if(eventItem[eventIdx].wishchk == 1){
            eventItem[eventIdx].wishchk = 0;
            eventItem[eventIdx].wish = parseInt(eventItem[eventIdx].wish) - 1;
        }else{
            eventItem[eventIdx].wishchk = 1;
            eventItem[eventIdx].wish = parseInt(eventItem[eventIdx].wish) + 1;
        }
        
        setSchResultData(eventItem);

        Api.send('event_wish', {'id':userInfo?.id, 'idx':eventidxNum}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               //console.log('이벤트 찜목록 추가 결과: ', resultItem);

               if(resultItem.message == "add"){
                   ToastMessage(commonText[0]);
               }else{
                    ToastMessage(commonText[1]);
               }
            }else{
               console.log('이벤트 찜목록 추가 실패!', resultItem);
               
            }
        });
    }

    //자신감
    const renderItems = ({item, index}) => {
        return(
            <Box px='20px'>
                <EventBox 
                    mt={ index != 0 ? 40 : 30} 
                    uri={item.thumb}
                    eventName={item.name}
                    hospital={item.hname}
                    score={item.star}
                    good={item.wish}
                    percent={item.per + "%"}
                    orPrice={item.stdprice}
                    price={item.price}
                    conprice={item.conprice}
                    values={item.icon}
                    bookmarkonPress={() => wishApiHandler(item)}
                    bookmarData={item.wishchk}
                    eventInfoMove={()=>navigation.navigate("EventInfo", {"idx":item.idx, "cidx":params.cidx})}
                    area={item.area}
                /> 
                {/* <DefText text="1" /> */}
            </Box>
        )
    }


    const keyExtractor = useCallback((item, index) => index.toString(), [])

    return (
        <Box flex={1} backgroundColor='#fff'>
            <Box p='20px' pb='5px'>
                <HStack justifyContent={'space-between'} width={deviceSize.deviceWidth - 40} flexWrap='wrap'>
                    <Box
                        style={[styles.backButton]}
                    >
                        <TouchableOpacity
                            onPress={()=>navigation.goBack()}
                        >
                            <Image 
                                source={{uri:BASE_URL + "/images/backButton.png"}}
                                style={{
                                    width:28,
                                    height:16,
                                    resizeMode:'contain'
                                }}
                            />
                        </TouchableOpacity>
                    </Box>
                    <Box width={(deviceSize.deviceWidth - 40) * 0.75}>
                        <SearchInput 
                            placeholder={ pageText != "" ? pageText[0] : "시술명을 검색하세요."}
                            value={schText}
                            onChangeText={schChange}
                            inputStyle={{paddingLeft:15, backgroundColor:'#F2F3F5', borderWidth:0, lineHeight:20}}
                            positionMargin={'-24px'}
                            buttonPositionRight={0}
                            onPress={schResultApi}
                            onSubmitEditing={schResultApi}
                        />
                    </Box>
                    <TouchableOpacity
                        style={{
                            width:(deviceSize.deviceWidth - 40) * 0.12,
                            height:48,
                            justifyContent:'center',
                            alignItems:'flex-end',
                        }}
                        onPress={()=>navigation.goBack()}
                    >
                        <DefText 
                            text={pageText != "" ? pageText[1] : "취소"}
                            style={[fsize.fs14, {color:'#191919'}]}
                        />
                    </TouchableOpacity>
                </HStack>
            </Box>
            {
                loading ?
                <Loading />
                :
                <FlatList 
                    data={schResultData}
                    renderItem={renderItems}
                    keyExtractor={keyExtractor}
                    ListEmptyComponent={
                        <Box py='50px'>
                            <EmptyPage 
                                emptyText={ commonText != "" ? commonText[5] : '검색 결과가 없습니다.'}
                            />
                        </Box>
                    }
                />
            }
        </Box>
    );
};

const styles = StyleSheet.create({
    backButton: {
        
        justifyContent:'center',
        alignItems:'flex-start',
        
    },
})

export default connect(
    ({ User }) => ({
        userInfo: User.userInfo, //회원정보
        user_lang: User.user_lang
    }),
    (dispatch) => ({
        member_login: (user) => dispatch(UserAction.member_login(user)), //로그인
        languageSet: (user) => dispatch(UserAction.languageSet(user)), //선택언어
    })
)(SearchResult);