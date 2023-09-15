import React, { useEffect } from 'react';
import { Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Box } from 'native-base';
import messaging from '@react-native-firebase/messaging';
import {
    GoogleSignin,
    GoogleSigninButton,
    statusCodes,
} from "@react-native-google-signin/google-signin";
import { deviceSize, loginButtonStyle } from '../common/StyleCommon';
import { BASE_URL } from '../Utils/APIConstant';
import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import ToastMessage from './ToastMessage';

const GoogleLoginButton = (props) => {

    const {navigation, member_login, user_lang} = props;

    //구글로그인
    const googleSignInHandler = async () => {
        try{
            const appToken = await messaging().getToken(); // 앱 토큰
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();

            const authStatus = await messaging().requestPermission();
            const enable = 
                authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
                authStatus === messaging.AuthorizationStatus.PROVISIONAL;
            
            const params = {
                snskey: userInfo.user.id,
                email: userInfo.user.email,
                sns: 'google',
                token: appToken
            }


            googleLoginHandler(params);

            
        }catch(e){
            console.log('구글로그인 실패::', e);
        }
    }

    const googleLoginHandler = async (profile) => {

        
        const formData = new FormData();
        formData.append("method", "member_snsLogin");
        formData.append("sns", profile.sns);
        formData.append("snskey", profile.snskey);
        formData.append("token", profile.token);
        formData.append("cidx", user_lang != null ? user_lang.cidx : 0);

        const login = await member_login(formData);

        console.log("profile", profile);
        console.log('구글로그인 하기::', login);

        if(login.state){
            if(login.result.join){
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
        }else{
           // ToastMessage(login.msg);
            
        }
    }

     //로그인 관련 실행
     useEffect(()=> {
        GoogleSignin.configure({
            webClientId: "126165042634-sd6rm3rm19smd45jui5g8gaq6oeac7bd.apps.googleusercontent.com",
            offlineAccess: true,
            hostedDomain: "",
            forceConsentPrompt: true,
        })

        return() => {
            
        }
    }, [])

    return (
        // <Box
        //     width='60px'
        //     height={'60px'}
        //     justifyContent={'center'}
        //     alignItems='center'
        //     borderRadius={60}
        //     overflow='hidden'
        // >
        //     <GoogleSigninButton 
        //         style={[styles.loginButton]}
        //         size={GoogleSigninButton.Size.Icon}
        //         color={GoogleSigninButton.Color.White}
        //         onPress={()=>googleSignInHandler()}
        //     />
        // </Box>
        <TouchableOpacity 
            onPress={()=>googleSignInHandler()} 
            style={[styles.loginButton]}
        >
            <Image 
                source={{uri:BASE_URL + "/images/googleIcon.png"}}
                style={{
                    width:20,
                    height: 20,
                    resizeMode:'stretch'
                }}
            />
        </TouchableOpacity>
    );
};


const styles = StyleSheet.create({
    loginButton: {
        ...loginButtonStyle,
        backgroundColor:'#fff',
        borderWidth:1,
        borderColor:'#CECECE'
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
)(GoogleLoginButton);