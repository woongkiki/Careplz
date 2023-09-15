import React, { useEffect, useState } from 'react';
import { Box } from 'native-base';
import {Image, StyleSheet} from 'react-native';
import { DefButton, DefText } from '../../common/BOOTSTRAP';
import { BASE_URL } from '../../Utils/APIConstant';
import { colorSelect, fsize, fweight } from '../../common/StyleCommon';
import Header from '../../components/Header';
import Api from '../../Api';
import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../../redux/module/action/UserAction';

//비대면 처방 약 받기
const UntactTakeMedicine = (props) => {
    
    const {navigation, userInfo, user_lang, route} = props;
    const {params} = route;

    console.log("take medicine", params);

    const [pageText, setPageText] = useState("");

    const pageLangApi = () => {
        //user_lang != null ? user_lang?.cidx : userInfo?.cidx
        Api.send('app_page', {'cidx':user_lang != null ? user_lang?.cidx : userInfo?.cidx, "code":"untactTakeMedicine"}, (args)=>{

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
        pageLangApi();
    }, [])

    return (
        <Box flex={1} backgroundColor='#fff' >
            <Header 
                headerTitle={ pageText != "" ? pageText[0] : "처방 약 받기"}
                backButtonStatus={true}
                navigation={navigation}
            />
            <Box flex={1} alignItems='center' justifyContent={'center'} px='20px'>
                <Image 
                    source={{uri:BASE_URL + "/images/takeMedicineIcon.png"}}
                    style={{
                        width:82,
                        height:82,
                        resizeMode:'contain'
                    }}
                />
                <Box mt='25px'>
                    <DefText 
                        text={ pageText != "" ? pageText[1] : "처방 약 받기"}
                        style={[styles.labelTitle]}
                    />
                </Box>
                <Box mt='10px'>
                    <DefText 
                        text={ pageText != "" ? pageText[2] : "처방 받으신 약을 택배로 받으실지,\n직접 받으실지 선택해 주세요."}
                        style={[styles.smallText]}
                    />
                </Box>
                <DefButton 
                    text={ pageText != "" ? pageText[3] : "택배로 받기"}
                    btnStyle={{backgroundColor:colorSelect.pink_de, marginTop:60}}
                    txtStyle={{color:colorSelect.white, ...fweight.m}}
                    onPress={()=>navigation.navigate("UntactTakeMedicineAddr", {"idx":params.idx})}
                />
                <DefButton 
                    text={ pageText != "" ? pageText[4] : "직접 받으러 가기"}
                    btnStyle={{borderWidth:1, borderColor:'#D2D2DF', marginTop:10}}
                    txtStyle={{...fweight.m}}
                    onPress={()=>navigation.navigate("UntactPharmacy", {"idx":params.idx})}
                />
            </Box>
        </Box>
    );
};

const styles = StyleSheet.create({
    labelTitle: {
        ...fsize.fs19,
        ...fweight.bold,
        color:'#191919',
        textAlign:'center'
    },
    smallText: {
        ...fsize.fs16,
        lineHeight:27,
        color:'#141414',
        textAlign:'center'
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
)(UntactTakeMedicine);