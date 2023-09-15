import React, { useCallback, useEffect, useState } from 'react';
import { Box, HStack } from 'native-base';
import { DefText } from '../../common/BOOTSTRAP';
import Header from '../../components/Header';
import { untactList } from '../../ArrayData';
import { useIsFocused } from '@react-navigation/native';
import Loading from '../../components/Loading';
import { FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { colorSelect, fsize, fweight } from '../../common/StyleCommon';
import EmptyPage from '../../components/EmptyPage';
import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../../redux/module/action/UserAction';
import Api from '../../Api';

//비대면 진료내역
const UntactClinicInfo = (props) => {
    
    const {navigation, userInfo, user_lang} = props;

    const isFocused = useIsFocused();

    const [loading, setLoading] = useState(true);
    const [pageText, setPageText] = useState("");
    const [untactClinicList, setUntactClinicList] = useState([]);


    const apiLoad = async () => {
        await setLoading(true);
        //페이지 언어리스트
        await Api.send('app_page', {'cidx': user_lang != null ? user_lang?.cidx : userInfo?.cidx, "code":"untactRecently"}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               //console.log('비대면 진료 메인 언어 리스트: ', resultItem, arrItems.text);
               setPageText(arrItems.text);
            }else{
               console.log('비대면 진료 메인 언어 리스트 실패!', resultItem);
               
            }
        });

        //최근 비대면 진료내역
        await Api.send('untact_recently', {'id':userInfo?.id, 'cidx': user_lang != null ? user_lang?.cidx : userInfo?.cidx, "page":1}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               console.log('최근 비대면 진료내역 리스트: ', resultItem, arrItems);
               setUntactClinicList(arrItems)
            }else{
               console.log('최근 비대면 진료내역 리스트 실패!', resultItem);
               setUntactClinicList([])
            }
        });
        await setLoading(false);
    }

    useEffect(() => {
        if(isFocused){
            apiLoad();
        }

        return() => {
            setUntactClinicList([]);
        }
    }, [isFocused]);

    const renderItems = ({item, index}) => {

        return(
            <Box 
                p='20px'
                borderBottomWidth={1}
                borderBottomColor='#E3E3E3'
            >
                <Box width='55%'>
                    {
                        item.rdate != "" &&
                        <Box mb='10px'>
                        <DefText 
                            text={item.rdate}
                            style={[styles.dateText]}
                        />
                        </Box>
                    }
                    <Box mb='10px'>
                        <DefText 
                            text={item.hname}
                            style={[styles.hospitalText]}
                        />
                    </Box>
                    <HStack
                        alignItems={'center'}
                    >
                        <DefText 
                            text={item.dname}
                            style={[styles.subjectDoctor]}
                        />
                        <Box 
                            style={[styles.subjectDoctorLine]}
                        />
                        <DefText 
                            text={item.category}
                            style={[styles.subjectDoctor]}
                        />
                    </HStack>
                </Box>
                <Box
                    position={'absolute'}
                    right='20px'
                    top='55%'
                >
                    <TouchableOpacity
                        style={[styles.reservationButton]}
                        onPress={()=>navigation.navigate("UntactReservation", {"hidx":item.hidx, "hname":item.hname, "catcode":"", "selectClinic":""})}
                    >
                        <DefText 
                            text={ pageText != "" ? pageText[1] : "예약하기"}
                            style={[styles.reservationButtonText]}
                        />
                    </TouchableOpacity>
                </Box>
            </Box>
        )

    }

    const keyExtractor = useCallback((item) => item.idx.toString(), [])

    return (
        <Box flex={1} backgroundColor='#fff' >
            <Header 
                navigation={navigation}
                backButtonStatus={true}
                headerTitle={ pageText != "" ? pageText[0] : "최근 비대면 진료 내역"}
            />
            {
                loading ?
                <Loading />
                :
                untactClinicList == "" ?
                <EmptyPage
                    emptyText={ pageText != "" ? pageText[2] : '최근 비대면 진료내역이 없습니다.'}
                />
                :
                <FlatList 
                    data={untactClinicList}
                    renderItem={renderItems}
                    keyExtractor={keyExtractor}
                />
            }
        </Box>
    );
};

const styles = StyleSheet.create({
    dateText: {
        ...fsize.fs13,
        color:'#9E9E9E'
    },
    hospitalText: {
        ...fsize.fs17,
        ...fweight.bold,
        color:"#191919",
    },
    subjectDoctor: {
        ...fsize.fs17,
        color:'#191919'
    },
    subjectDoctorLine: {
        width:1,
        height:12,
        backgroundColor:'#D5D5D5',
        marginHorizontal:10
    },
    reservationButton: {
        backgroundColor:colorSelect.navy,
        paddingHorizontal:10,
        height:33,
        justifyContent:'center',
        alignItems:'center',
        borderRadius:10
    },
    reservationButtonText: {
        color:colorSelect.white,
        ...fsize.fs13,
        ...fweight.m,
        lineHeight:18
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
)(UntactClinicInfo);