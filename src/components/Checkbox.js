import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Box, HStack, CheckIcon } from 'native-base';
import { DefText } from '../common/BOOTSTRAP';
import { colorSelect, fweight } from '../common/StyleCommon';
import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';

const Checkbox = (props) => {

    const {navigation, onPress, checkboxStyle, checkStatus, checkboxText, txtStyle, user_lang} = props;

    return (
        <TouchableOpacity
            onPress={onPress}
        >
            <HStack
                alignItems={'center'}
            >
                <Box
                    style={
                        [
                            {
                                width:22,
                                height:22,
                                justifyContent:'center',
                                alignItems:'center',
                                borderWidth:1,
                                borderColor: checkStatus ? colorSelect.navy : '#DDDDE3',
                                backgroundColor: checkStatus ? colorSelect.navy : colorSelect.white,
                                borderRadius:5,
                                overflow: 'hidden'
                            },
                            checkboxStyle
                        ]
                    }
                >
                    {
                        checkStatus &&
                        <CheckIcon
                            width='12px'
                            height='12px'
                            color={colorSelect.white}
                        />
                    }
                </Box>
                {
                    checkboxText != "" &&
                    <DefText 
                        text={checkboxText} 
                        style={[{marginLeft:10, color:'#191919'}, fweight.m, txtStyle]}
                        lh={ user_lang?.cidx == 9 ? 26 : ''}
                    />
                }
            </HStack>
        </TouchableOpacity>
    );
};

export default connect(
    ({ User }) => ({
        userInfo: User.userInfo, //회원정보
        user_lang: User.user_lang
    })
)(Checkbox);