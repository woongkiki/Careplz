import React, { useCallback, useEffect, useState } from 'react';
import { Box, HStack } from 'native-base';
import { ScrollView, TouchableOpacity, Image, FlatList, StyleSheet } from 'react-native';
import { DefButton, DefText, LabelTitle } from '../../common/BOOTSTRAP';
import Header from '../../components/Header';
import { BASE_URL } from '../../Utils/APIConstant';
import { colorSelect, fsize, fweight } from '../../common/StyleCommon';
import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../../redux/module/action/UserAction';
import Api from '../../Api';

const pharmacyData = [
    {
        idx:1,
        pharmacy:"A약국",
        address:"경기도 부천시 길주로 272"
    },
    {
        idx:2,
        pharmacy:"B약국",
        address:"경기도 부천시 길주로 200"
    }
]

//비대면 처방 직접 받으러 갈 약국 선택
const UntactPharmacy = (props) => {
    
    const {navigation, userInfo, user_lang, route} = props;
    const {params} = route;

    console.log("params", params);

    const [selectPharmacy, setSelectPharmacy] = useState("");

    const [pageText, setPageText] = useState("");
    const [pharmacyList, setPharmacyList] = useState([]);

    const pageLangApi = async () => {
        //user_lang != null ? user_lang?.cidx : userInfo?.cidx
        await Api.send('app_page', {'cidx':user_lang != null ? user_lang?.cidx : userInfo?.cidx, "code":"untactPharmacy"}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               //console.log('병원지도 메인 언어 리스트: ', resultItem, arrItems);
               setPageText(arrItems.text);
            }else{
               console.log('병원지도 메인 언어 리스트 실패!', resultItem);
               
            }
        });

        await Api.send('untact_drugPharmacy', {'idx':params.idx, 'cidx':user_lang != null ? user_lang?.cidx : userInfo?.cidx}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               console.log('약국 리스트 성공: ', resultItem, arrItems);
               setPharmacyList(arrItems);
            }else{
               console.log('약국 리스트 실패!', resultItem);
               
            }
        });
    }

    useEffect(() => {
        pageLangApi();
    }, [])

    const _renderItem = ({item, index}) => {
        return(
            <Box 
                px='20px'
                mt={index != 0 ? '30px' : 0}
            >
                <Box>
                    <HStack
                        alignItems={'center'}
                        mb='10px'
                    >
                        <Image 
                            source={{uri:BASE_URL + "/images/medicineIcons.png"}}
                            style={{
                                width:18,
                                height:18,
                                resizeMode:'contain',
                                marginRight:10
                            }}
                        />
                        <DefText 
                            text={item.name}
                            style={[fsize.fs15, fweight.bold]}
                        />
                    </HStack>
                    <TouchableOpacity
                        style={[
                            styles.button,
                            selectPharmacy == item.idx && 
                            {backgroundColor:colorSelect.pink_de, borderColor:colorSelect.pink_de}
                        ]}
                        onPress={()=>setSelectPharmacy(item.idx)}
                    >
                        <DefText 
                            text={item.address1 + " " + item.address2}
                            style={[
                                styles.buttonText,
                                selectPharmacy == item.idx && 
                                {color:colorSelect.white, ...fweight.m}
                            ]}
                        />
                    </TouchableOpacity>
                </Box>
            </Box>
        )
    }

    const keyExtractor = useCallback((item) => item.idx.toString(), [])

    const untactEndReq = () => {

        //console.log(selectPharmacy);

        Api.send('untact_drugDirect', {'idx':params.idx, 'id':userInfo?.id, 'hpidx':selectPharmacy, 'cidx':user_lang != null ? user_lang?.cidx : userInfo?.cidx}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               console.log('직접 수령 신청하기: ', resultItem, arrItems);
               
               navigation.navigate("UntactEndReview", {"idx":params.idx})
            }else{
               console.log('직접 수령 신청하기 실패!', resultItem);
               
            }
        });
    }

    return (
        <Box flex={1} backgroundColor='#fff' >
            <Header 
                headerTitle={ pageText != "" ? pageText[0] : "약국 선택"}
                backButtonStatus={true}
                navigation={navigation}
            />
            <FlatList 
                ListHeaderComponent={
                    ()=> {
                        return(
                            <Box p='20px' mb='10px'>
                                <LabelTitle 
                                    text={ pageText != "" ? pageText[1] : "처방 가능한 약국입니다.\n약국을 선택해 주세요."}
                                    txtStyle={{lineHeight:26}}
                                />
                            </Box>
                        )
                    }
                }
                data={pharmacyList}
                renderItem={_renderItem}
                keyExtractor={keyExtractor}
            />
            <DefButton 
                text={ pageText != "" ? pageText[2] : "신청하기"}
                btnStyle={[
                    styles.confirmButton,
                    selectPharmacy != "" &&
                    {backgroundColor:colorSelect.pink_de}
                ]}
                txtStyle={[
                    styles.confirmButtonText,
                    selectPharmacy != "" &&
                    {color:colorSelect.white}
                ]}
                onPress={
                    untactEndReq
                    //()=>navigation.navigate("UntactEndReview", {"idx":params.idx})
                }
            />
        </Box>
    );
};

const styles = StyleSheet.create({
    button: {
        width:'100%',
        height:48,
        borderRadius:5,
        alignItems:'center',
        justifyContent:'center',
        borderWidth:1,
        borderColor:'#E1E1E1'
    },
    buttonText: {
        ...fsize.fs14,
        color:'#191919'
    },
    confirmButton: {
        backgroundColor:'#F1F1F1',
        borderRadius:0,
    },
    confirmButtonText: {
        ...fweight.m,
        color:'#000'
    }
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
    })
)(UntactPharmacy);