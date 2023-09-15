import React from "react";
import { TouchableOpacity, TextInput, Platform, Dimensions, StyleSheet, Image } from 'react-native';
import { Box, Text, Input, HStack} from 'native-base';
import { colorSelect, deviceSize, fsize, fweight } from "./StyleCommon";
import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';

const DefTexts = (props) => {

    const {text, style, onLayout, user_lang} = props;

    return (
        <Text style={[fweight.r, fsize.fs16, {color:colorSelect.black}, style]} onLayout={onLayout}>{text}</Text>
    );
};

export default connect(
    ({ User }) => ({
        userInfo: User.userInfo, //회원정보
        user_lang: User.user_lang
    }),
    (dispatch) => ({
        member_login: (user) => dispatch(UserAction.member_login(user)), //로그인
        languageSet:(user) => dispatch(UserAction.languageSet(user))
    })
)(DefTexts);