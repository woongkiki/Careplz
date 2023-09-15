import React, { useEffect, useState } from 'react';
import { Box, HStack, Modal } from 'native-base';
import { DefButton, DefText } from '../../../common/BOOTSTRAP';
import Header from '../../../components/Header';
import { ScrollView, StyleSheet } from 'react-native';
import { colorSelect, deviceSize, fsize, fweight } from '../../../common/StyleCommon';
import Checkbox from '../../../components/Checkbox';
import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../../../redux/module/action/UserAction';
import Api from '../../../Api';
import Loading from '../../../components/Loading';
import ToastMessage from '../../../components/ToastMessage';

//회원탈퇴
const AccountLeave = (props) => {
    
    const {navigation, user_lang, userInfo, member_out} = props;

    const [leaveAgree, setLeaveAgree] = useState(false);
    const leaveAgreeHandler = () => {
        setLeaveAgree(!leaveAgree);
    }

    const [leaveModal, setLeaveModal] = useState(false);

    const [loading, setLoading] = useState(true);
    const [pageText, setPageText] = useState("");
    const [leaveInfo, setLeaveInfo] = useState("");

    const appPageApi = async () => {
        ///user_lang != null ? user_lang?.cidx : userInfo?.cidx
        await setLoading(true);
        await Api.send('app_page', {'cidx':user_lang != null ? user_lang?.cidx : userInfo?.cidx, "code":"memberLeave"}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               //console.log('회원탈퇴 언어 리스트: ', resultItem, arrItems);
               setPageText(arrItems.text);
            }else{
               console.log('회원탈퇴 언어 리스트 실패!', resultItem);
               
            }
        });
        await Api.send('member_outinfo', {'cidx':user_lang != null ? user_lang?.cidx : userInfo?.cidx}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               console.log('회원탈퇴 안내사항 리스트: ', resultItem, arrItems);
               setLeaveInfo(arrItems);
            }else{
               console.log('회원탈퇴 안내사항 실패!', resultItem);
               
            }
        });
        await setLoading(false);
    }

    const memberOutHandler = async () => {

        const formData = new FormData();
        formData.append('method', 'member_out');
        formData.append('id', userInfo?.id) ;
        formData.append('cidx', user_lang != null ? user_lang?.cidx : userInfo?.cidx) ;

        const leave = await member_out(formData);

        console.log("leave:::",leave)

        if(leave.result){
            ToastMessage(leave.msg);
            setLeaveModal(false);
            navigation.reset({
                routes: [{ name: 'Intro' }],
            });  
        }else{
            ToastMessage(leave.msg);
            setLeaveModal(false);
            return false;
        }
    }

    useEffect(() => {
        appPageApi();

        return() => {

        }
    }, [])

    return (
        <Box flex={1} backgroundColor='#fff' >
           <Header 
            navigation={navigation} 
            backButtonStatus={true}
            headerTitle={ pageText != "" ? pageText[0] : '회원탈퇴'}
           />
           {
            loading ?
            <Loading />
            :
            <ScrollView>
                <Box p='20px'>
                    <Box pb='20px' mb='20px' borderBottomWidth={1} borderBottomColor='#E3E3E3'>
                        <DefText
                            text={ pageText != "" ? pageText[1] : "그동안 케어해줘?를 이용해 주셔서 감사합니다.\n탈퇴하시기 전, 안내사항을 꼭 확인해 주세요."}
                            style={[fsize.fs18, fweight.bold, {lineHeight:26}]}
                        />
                    </Box>
                    <Box>
                        <DefText 
                            text={ pageText != "" ? pageText[2] : "관리자 작성 안내사항"} 
                            style={[styles.labelTitle]}
                        />
                        <Box 
                            borderWidth={1}
                            borderColor='#e3e3e3'
                            borderRadius={10}
                            marginTop='15px'
                            height='200px'
                        >
                            <ScrollView>
                                <Box p='20px'>
                                    <DefText 
                                        text={leaveInfo.out_info}
                                        style={[fsize.fs13, {color:"#434856"}]}
                                    />
                                </Box>
                            </ScrollView>
                        </Box>
                    </Box>
                    <Box mt='20px'>
                        <Checkbox 
                            checkboxText={ pageText != "" ? pageText[3] : '안내사항 확인 후 탈퇴에 동의합니다.'}
                            checkStatus={leaveAgree}
                            onPress={leaveAgreeHandler}
                            txtStyle={[fsize.fs14, fweight.r]}
                        />
                    </Box>
                </Box>
            </ScrollView>
           }
           
           <DefButton
                text={ pageText != "" ? pageText[4] : "다음"}
                btnStyle={{backgroundColor:leaveAgree ? colorSelect.pink_de : '#F1F1F1', borderRadius:0}}
                txtStyle={{color:leaveAgree ? colorSelect.white : colorSelect.black}}
                disabled={ leaveAgree ? false : true}
                onPress={()=>setLeaveModal(true)}
           />
           <Modal isOpen={leaveModal} onClose={()=>setLeaveModal(false)}>
                <Modal.Content width={deviceSize.deviceWidth - 40} p='0'>
                    <Modal.Body p='20px'>
                        <Box>
                            <Box
                                pb='20px'
                                borderBottomWidth={1}
                                borderBottomColor='#ccc'
                                alignItems={'center'}
                            >
                                <DefText 
                                    text={ pageText != "" ? pageText[6] : "알림"}
                                    style={[fsize.fs17, fweight.bold]}
                                />
                            </Box>
                            <Box mt='20px'>
                                <DefText 
                                    text={ pageText != "" ? pageText[5] : "정말 회원탈퇴를 진행하시겠습니까?\n케어해줘? 서비스의 이용 기록이 모두 삭제됩니다."}
                                    style={[{textAlign:'center', color:'#191919', lineHeight:24}, fsize.fs14]}
                                />
                            </Box>
                            <HStack mt='30px' justifyContent={'space-between'}>
                            <DefButton 
                                text={ pageText != "" ? pageText[7] : "확인"}
                                btnStyle={[styles.modalButton, {backgroundColor:colorSelect.navy}]}
                                txtStyle={[fweight.m, {color:colorSelect.white}]}
                                onPress={memberOutHandler}
                            />
                            <DefButton 
                                text={ pageText != "" ? pageText[8] :  "취소"}
                                btnStyle={[styles.modalButton, {backgroundColor:'#F1F1F1'}]}
                                onPress={()=>setLeaveModal(false)}
                            />
                            </HStack>
                        </Box>
                    </Modal.Body>
                </Modal.Content>
           </Modal>
        </Box>
    );
};

const styles = StyleSheet.create({
    labelTitle: {
        ...fsize.fs15,
        ...fweight.bold,
        color:'#191919'
    },
    modalButton: {
        width: '48%',
        height:50,
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
        app_positions: (user) => dispatch(UserAction.app_positions(user)), //현재 좌표
        member_out: (user) => dispatch(UserAction.member_out(user)), //로그아웃
    })
)(AccountLeave);