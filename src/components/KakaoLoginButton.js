import React, { useEffect } from 'react';
import { TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Box } from 'native-base';
import { DefText } from '../common/BOOTSTRAP';
import ToastMessage from '../components/ToastMessage';
import {
    KakaoOAuthToken,
    KakaoProfile,
    getProfile as getKakaoProfile,
    login,
    logout,
    unlink,
} from '@react-native-seoul/kakao-login';
import { colorSelect, deviceSize, loginButtonStyle, loginButtonText } from '../common/StyleCommon';
import { BASE_URL } from '../Utils/APIConstant';
import messaging from '@react-native-firebase/messaging';
import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';

const KakaoLoginButton = (props) => {

    const {navigation, member_login, user_lang} = props;

     //카카오 로그인
     const KakaoSignInHandler = async () => {
        try{

            const appToken = await messaging().getToken(); // 앱 토큰

            const token = await login();
            if(token.scopes != undefined){
                const profile = await getKakaoProfile();
    
                const params = {
                    snskey: profile.id,
                    email: profile.email,
                    sns: 'kakao',
					sns_id: 'kakao_' + profile.id,
                    token: appToken
                }
                
                //console.log("카카오 로그인 정보::", profile);

                kakaoLoginHandler(params);
                // //console.log('params::::', params);
            }
        } catch(error){
            console.log('카카오 로그인 실패 error', error);
            ToastMessage("로그인을 취소하셨습니다.");
        }
    }


    const kakaoLoginHandler = async (profile) => {

        //console.log('profile', profile);
        const formData = new FormData();
        formData.append("method", "member_snsLogin");
        formData.append("sns", "kakao");
        formData.append("snskey", profile.snskey);
        formData.append("token", profile.token);
        formData.append("cidx", user_lang != null ? user_lang.cidx : 0);


       
        const login = await member_login(formData);

        if(login.result.join){
            console.log("kakao login::", login.result);
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
            onPress={KakaoSignInHandler} 
            style={[styles.loginButton]}
        >
            <Image 
                source={{uri:BASE_URL + "/images/kakaoLogo.png"}}
                style={{
                    width:19,
                    height: 17,
                    resizeMode:'stretch'
                }}
            />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    loginButton: {
        ...loginButtonStyle,
        backgroundColor:'#fae300'
    },
    loginButtonText: {
        ...loginButtonText,
        color:'#371d1e'
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
)(KakaoLoginButton);