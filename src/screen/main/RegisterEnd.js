import React, { useEffect, useState } from 'react';
import { Image, StyleSheet } from 'react-native';
import { Box, HStack } from 'native-base';
import Header from '../../components/Header';
import { DefButton, DefText } from '../../common/BOOTSTRAP';
import { colorSelect, deviceSize, fsize, fweight } from '../../common/StyleCommon';
import Api from '../../Api';
import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../../redux/module/action/UserAction';
import moment from 'moment';

const today = new Date();
const todayFormat = moment(today).format("yyyy. MM. DD");

const RegisterEnd = (props) => {

    const {navigation, route, user_lang, userInfo} = props;
    const {params} = route;

    console.log("params", params);

    const [pageText, setPageText] = useState("");

    const pageLangSelect = () => {
        //user_lang != null ? user_lang?.cidx : 0
        Api.send('app_page', {'cidx': 1, "code":"registerEnd"}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               console.log('회원가입 완료 리스트: ', resultItem, arrItems);
               setPageText(arrItems.text);
            }else{
               console.log('회원가입 완료 리스트 실패!', resultItem);
               
            }
        });
    }

    useEffect(() => {
        pageLangSelect();
    }, [])

    return (
        <Box flex={1} backgroundColor='#fff'>
            <Header headerTitle={ pageText != "" ? pageText[0] : '회원가입'} navigation={navigation} />
            <Box flex={1} justifyContent='center' alignItems={'center'}>
                <Box>
                    <Image 
                        source={require("../../images/registerCheckIcon.png")}
                        style={{
                            width:70,
                            height:70,
                            resizeMode:'stretch'
                        }}
                    />
                </Box>
                <Box mt='20px' alignItems={'center'}>
                   
                        {
                            user_lang?.cidx != 0 ?
                            <HStack>
                                <DefText 
                                    text={pageText != "" ? pageText[1] : "환영합니다."}
                                    style={[styles.appText]}
                                />
                                {
                                    params != "" &&
                                    <DefText 
                                        text={" " + params.name}
                                        style={[styles.appText, fweight.bold, {color:colorSelect.pink_de}]}
                                    />
                                }
                            </HStack>
                            :
                            <HStack>
                                {
                                    params != "" &&
                                    <DefText 
                                        text={params.name}
                                        style={[styles.appText, fweight.bold, {color:colorSelect.pink_de}]}
                                    />
                                }
                                <DefText 
                                    text={pageText != "" ? " " + pageText[1] : " 환영합니다."}
                                    style={[styles.appText]}
                                />
                            </HStack>
                        }
                       
         
                    <DefText
                        text={ pageText != "" ? pageText[2] : '회원가입이 완료되었습니다.'}
                        style={[styles.appText]}
                    />
                </Box>
                <Box
                    py='15px'
                    backgroundColor={'#F2F2F2'}
                    width={deviceSize.deviceWidth - 40}
                    alignItems='center'
                    borderRadius={5}
                    overflow='hidden'
                    mt='20px'
                >
                    <HStack
                        alignItems={'center'}
                    >
                        <Image 
                            source={require("../../images/joinDateIcon.png")}
                            style={{
                                width:12,
                                height:12,
                                resizeMode:'stretch',
                                marginRight:5
                            }}
                        />
                        <DefText 
                            text={ pageText[3] + " " + todayFormat}
                            style={[styles.joinDate]}
                        />
                    </HStack>
                </Box>
            </Box>
            <Box p='20px'>
                <DefButton 
                    text={ pageText != "" ? pageText[4] : '로그인'}
                    btnStyle={{
                        backgroundColor:colorSelect.pink_de
                    }}
                    txtStyle={[fweight.m, {lineHeight:22,color:'#fff'}]}
                    onPress={()=>navigation.navigate("Login")}
                />
            </Box>
        </Box>
    );
};

const styles = StyleSheet.create({
    appText: {
        textAlign:'center',
        ...fsize.fs21,
        lineHeight:30,
        color:'#191919'
    },
    joinDate: {
        ...fsize.fs14,
        color:'#6C6C6C',
        lineHeight:17,
    }
})

export default connect(
    ({ User }) => ({
        userInfo: User.userInfo, //회원정보
        user_lang: User.user_lang
    }),
    (dispatch) => ({
        member_login: (user) => dispatch(UserAction.member_login(user)), //로그인
        languageSet: (user) => dispatch(UserAction.languageSet(user)), //로그인
    })
)(RegisterEnd);