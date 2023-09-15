import { Box, HStack } from 'native-base';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { DefText } from '../../common/BOOTSTRAP';
import { fsize, fweight } from '../../common/StyleCommon';
import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../../redux/module/action/UserAction';

const NoticeBox = (props) => {

    const {navigation, title, writer, datetime, onPress, user_lang} = props;

    return (
        <TouchableOpacity
            style={[styles.noticeButton]}
            onPress={onPress}
        >
            <Box px='20px'>
                <DefText 
                    text={title}
                    style={[styles.noticeTitle]}
                    lh={ user_lang?.cidx == 9 ? 30 : ''}
                />
                <HStack
                    alignItems={'center'}
                    justifyContent='space-between'
                    mt='10px'
                >
                    <DefText 
                        text={writer}
                        style={[styles.noticeWriter]}
                        lh={ user_lang?.cidx == 9 ? 28 : ''}
                    />
                    <DefText 
                        text={datetime}
                        style={[styles.noticeDatetime]}
                        lh={ user_lang?.cidx == 9 ? 28 : ''}
                    />
                </HStack>
            </Box>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    noticeButton: {
        paddingVertical:20,
        borderBottomWidth:1,
        borderBottomColor:'#D8D8D8'
    },
    noticeTitle: {
        ...fweight.bold,
        color:'#010101'
    },
    noticeWriter: {
        ...fsize.fs15,
        color:'#535353',
    },
    noticeDatetime: {
        ...fsize.fs13,
        color:'#AEAEAE'
    }
})

export default connect(
    ({ User }) => ({
        userInfo: User.userInfo, //회원정보
        user_lang: User.user_lang
    })
)(NoticeBox);