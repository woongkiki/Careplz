import React from 'react';
import { Box } from 'native-base';
import { Image } from 'react-native';
import { DefText } from '../common/BOOTSTRAP';
import { fweight } from '../common/StyleCommon';
import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';

const EmptyPage = (props) => {

    const {navigation, emptyText, user_lang} = props;

    return (
        <Box 
            flex={1}
            alignItems='center'
            justifyContent={'center'}
            px='20px'
        >
            <Box mb='20px'>
                <Image 
                    source={require("../images/emptyIcon.png")}
                    style={{
                        width:70,
                        height: 70,
                        resizeMode:'stretch'
                    }}
                />
            </Box>
            <DefText 
                text={emptyText}
                style={[fweight.m, {textAlign:'center'}]}
                lh={ user_lang?.cidx == 9 ? 28 : ''}
            />
        </Box>
    );
};

export default connect(
    ({ User }) => ({
        userInfo: User.userInfo, //회원정보
        user_lang: User.user_lang
    })
)(EmptyPage);