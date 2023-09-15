import React, { useEffect, useState } from 'react';
import { TouchableOpacity, Platform, StyleSheet, Image } from 'react-native';
import { Box } from 'native-base';
import { DefText } from '../common/BOOTSTRAP';
import { deviceSize, loginButtonStyle, loginButtonText } from '../common/StyleCommon';
import { NaverLogin, getProfile as getNaverProfile } from "@react-native-seoul/naver-login";
import { BASE_URL } from '../Utils/APIConstant';
import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import ToastMessage from './ToastMessage';

//네이버로그인키
const iosKeys = {
    kConsumerKey: "GsYqDWxOQr_zPn09f3PB",
    kConsumerSecret: "ektn7QKo9y",
    kServiceAppName: "케어해줘",
    kServiceAppUrlScheme: "naverloginCareplz" // only for iOS
}

const androidKeys = {
    kConsumerKey: "GsYqDWxOQr_zPn09f3PB",
    kConsumerSecret: "ektn7QKo9y",
    kServiceAppName: "케어해줘"
};

const initials = Platform.OS === "ios" ? iosKeys : androidKeys;

const NaverLoginButton = (props) => {

    const {navigation, user_lang, member_login} = props;

    const [naverToken, setNaverToken] = useState(""); //네이버 로그인 완료 토큰용

    //네이버 로그인 실행
    const NaverSingInHandler = (props) => {

        return new Promise((resolve, reject) => {
            NaverLogin.login(props, (err, token) => {
              //console.log(`\n\n  Token is fetched  :: ${token} \n\n`);
              //console.log("token:::", token);
              setNaverToken(token);
              if (err) {
                console.log("naver err /// ", err);
                // if(err == "errCode: user_cancel, errDesc: user_cancel"){
                //     ToastMessage("취소");
                // }
                reject(err);
                return;
              }
              //console.log("resolve", token);
              resolve(token);
            });
          });

    }

    //네이버 회원정보 가져오기 실행
    const getNaverUserProfile = async () => {
        const profileResult = await getNaverProfile(naverToken.accessToken);
        if(profileResult.resultcode === "024"){
            ToastMessage("로그인이 실패하였습니다.");
            return false;
        }
        
        const params = {
            snskey: profileResult.response.id,
            email: profileResult.response.email,
            sns: 'naver',
            sns_id: 'naver_' + profileResult.response.id
        }

        console.log("naver userInfo::", profileResult);
        naverLoginHandler(params);

    }

    useEffect(() => {

        if(naverToken != ""){ //네이버 토큰이 존재하는 경우 네이버 회원정보 가져오기 실행
            getNaverUserProfile();
        }

        return(
            setNaverToken("")
        )
        
    }, [naverToken])

    const naverLoginHandler = async (profile) => {

        //console.log('profile', profile);
        const formData = new FormData();
        formData.append("method", "member_snsLogin");
        formData.append("sns", "naver");
        formData.append("snskey", profile.snskey);
        formData.append("token", profile.sns_id);
        formData.append("cidx", user_lang != null ? user_lang.cidx : 0);
       
        const login = await member_login(formData);

        console.log(login.result);
        if(login.result.join){
            //console.log("naver login::", login.result);
            navigation.reset({
                routes: [
                    {
                         name: 'TabNavi', 
                         screen: 'Event',
                    }
                ],
            });
        }else{
            navigation.navigate("Register", profile)
        }

        
    }

    return (
        <TouchableOpacity 
            onPress={()=>NaverSingInHandler(initials)} 
            style={[styles.loginButton]}
        >
            <Image 
                source={{uri:BASE_URL + "/images/naverIcon.png"}}
                style={{
                    width:19,
                    height: 19,
                    resizeMode:'stretch'
                }}
            />
        </TouchableOpacity>
    );
};


const styles = StyleSheet.create({
    loginButton : {
        ...loginButtonStyle,
        backgroundColor:'#03CF5D',
        marginLeft:15
    },
    loginButtonText: {
        ...loginButtonText
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
)(NaverLoginButton);