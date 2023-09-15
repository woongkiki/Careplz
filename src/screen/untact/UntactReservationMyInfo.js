import React, { useEffect, useState } from 'react';
import { Box, HStack, Modal } from 'native-base';
import { DefButton, DefText, LabelTitle } from '../../common/BOOTSTRAP';
import Header from '../../components/Header';
import { Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { colorSelect, deviceSize, fsize, fweight } from '../../common/StyleCommon';
import ImagePicker from 'react-native-image-crop-picker';
import ToastMessage from '../../components/ToastMessage';
import Loading from '../../components/Loading';
import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../../redux/module/action/UserAction';
import Api from '../../Api';
import { BASE_URL } from '../../Utils/APIConstant';

//비대면 진료 예약시 개인정보 입력
const UntactReservationMyInfo = (props) => {

    const {navigation, route, userInfo, user_lang} = props;
    const {params} = route;

    console.log(params);

    const [loading, setLoading] = useState(true);
    const [pageText, setPageText] = useState("");
    const [imageSelect, setImageSelect] = useState("");

    const apiLoad = async () => {
        await setLoading(true);
        //페이지 언어리스트
        await Api.send('app_page', {'cidx': user_lang != null ? user_lang?.cidx : userInfo?.cidx, "code":"untactMyinfo"}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               console.log('비대면 예약하기 개인정보 입력 언어 리스트: ', resultItem, arrItems.text);
               setPageText(arrItems.text);
            }else{
               console.log('비대면 개인정보 입력 언어 리스트 실패!', resultItem);
               
            }
        });
        
        await setLoading(false);
    }

    useEffect(() => {
        apiLoad();
    }, []);

    const untactMyInfoHandler = async () => {

    
        const formData = new FormData();
        formData.append("method", "untact_reservation02");
        formData.append("id", userInfo?.id);
        formData.append("cidx", user_lang != null ? user_lang?.cidx : userInfo?.cidx);
        formData.append("catcode", params.catcode);
        formData.append("mcidx", params.mcidx);
        formData.append("mcidx", params.mcidx);
        formData.append('upfile', {'uri' : imageSelect.uri, 'name': imageSelect.name, 'type': imageSelect.type});
        
        const upload = await Api.multipartRequest(formData);

        if(upload.result){

            console.log("비대면 예약 개인정보 입력 완료", upload);
            
            navigation.navigate("UntactDoctor", {
                "catcode":params.catcode,
                "hidx":params.hidx,
                "hname":params.hname,
                "mcidx":params.mcidx,
                "clinic":params.clinic,
                "clinicItem":params.clinicItem,
                "reClinic":params.reClinic
            });
        }else{
            ToastMessage(upload.msg);
            return false;
        }

        //최근 비대면 예약하기1
        // Api.send('untact_reservation02', {'id':userInfo?.id, 'cidx': user_lang != null ? user_lang?.cidx : userInfo?.cidx, "catcode":params.catcode, "mcidx":params.mcidx}, (args)=>{

        //     let resultItem = args.resultItem;
        //     let arrItems = args.arrItems;
    
        //     if(resultItem.result === 'Y' && arrItems) {
        //        console.log('비대면 예약하기: ', resultItem, arrItems);
        //        //setUntactClinicList(arrItems);
        //        navigation.navigate("UntactDoctor", {
        //             "catcode":params.catcode,
        //             "hidx":params.hidx,
        //             "hname":params.hname,
        //             "mcidx":params.mcidx,
        //             "clinic":params.clinic,
        //             "clinicItem":params.clinicItem,
        //             "reClinic":params.reClinic
        //         });
        //     }else{
        //        console.log('비대면 예약하기 실패!', resultItem);
        //     }
        // });
    }

    const [cameraModal, setCameraModal] = useState(false);

    //사진등록
    const profileImageUpload = () => {
        
        ImagePicker.openPicker({
            width: deviceSize.deviceWidth,
            height: deviceSize.deviceWidth,
            cropping: true,
            compressImageMaxWidth: deviceSize.deviceWidth * 1.5,
            compressImageMaxHeight: deviceSize.deviceWidth * 1.5,
            compressImageQuality: 0.7,
          }).then(image => {

            const my_photo = {
                uri: image.path,
                type: image.mime,
                name: 'profileImg_' + userInfo?.id  + '.jpg'
                //name: image.filename
            }

            console.log("my_photo",image);

            setImageSelect(my_photo);

            setCameraModal(false);
            
          }).catch(e => {
            
            if(e.message == "Cannot run camera on simulator"){
                ToastMessage("시뮬레이터에서는 카메라를 실행할 수 없습니다.");
            }else{
                ToastMessage("카메라 촬영을 취소하셨습니다.");
            }
            
          });
    }

    const profileCameraUpload = () => {
        ImagePicker.openCamera({
            width: deviceSize.deviceWidth,
            height: deviceSize.deviceWidth,
            cropping: false,
            compressImageMaxWidth: deviceSize.deviceWidth * 1.5,
            compressImageMaxHeight: deviceSize.deviceWidth * 1.5,
            compressImageQuality: 0.7,
        }).then(image => {


            console.log("camera image", image);

            const my_photo = {
                uri: image.path,
                type: image.mime,
                name: 'profileImg_' + userInfo?.id  + '.jpg'
                //name: image.filename
            }

            setImageSelect(my_photo);
            
            setCameraModal(false);
            
        }).catch(e => {
            
            if(e.message == "Cannot run camera on simulator"){
                ToastMessage("시뮬레이터에서는 카메라를 실행할 수 없습니다.");
            }else{
                ToastMessage("카메라 촬영을 취소하셨습니다.");
            }
        
        });
    }


    return (
        <Box flex={1} backgroundColor='#fff' >
            <Header 
                headerTitle={ pageText != "" ? pageText[0] : "개인정보"}
                backButtonStatus={true}
                navigation={navigation}
            />
            {
                loading ?
                <Loading />
                :
                <ScrollView>
                    <Box p='20px'>
                        <Box>
                            <LabelTitle 
                                text={ pageText != "" ? pageText[1] : "개인정보는 한번만 필요해요."}
                            />
                            <Box mt='5px'>
                                <DefText 
                                    text={ pageText != "" ? pageText[2] : "병원진료 외의 용도로는 절대 사용하지 않습니다.\n안심하고 등록해 주세요."}
                                    style={[styles.labelSubText]}
                                />
                            </Box>
                        </Box>
                        <Box mt='30px'>
                            <DefText 
                                text={ pageText != "" ? pageText[3] : "외국인 인증 (여권, 외국인 등록증)"}
                                style={[fweight.bold, fsize.fs15]}
                            />
                            <DefButton 
                                text={ pageText != "" ? pageText[4] : "여권 또는 신분증 사진 등록"}
                                btnStyle={{backgroundColor:'#7E7E7E', marginTop:10, height:'auto', paddingVertical:15}}
                                txtStyle={[{color:'#fff'}, fweight.m, fsize.fs15]}
                                onPress={()=>setCameraModal(true)}
                            />
                        </Box>
                        {
                            imageSelect != "" &&
                            <Box mt='30px'>
                                <Image 
                                    source={{uri:imageSelect.uri}}
                                    style={{
                                        width:deviceSize.deviceWidth - 40,
                                        height:200,
                                        resizeMode:'stretch'
                                    }}
                                />
                            </Box>
                        }
                    </Box>
                    
                </ScrollView>
            }
            <DefButton 
                text={ pageText != "" ? pageText[5] : "다음"}
                btnStyle={{backgroundColor: imageSelect != "" ? colorSelect.pink_de : '#f1f1f1', borderRadius:0}}
                txtStyle={{color: imageSelect != "" && '#fff' }}
                disabled={ imageSelect != "" ? false : true }
                onPress={untactMyInfoHandler}
            />
             <Modal isOpen={cameraModal} onClose={()=>setCameraModal(false)}>
                <Modal.Content width={deviceSize.deviceWidth - 40} p='20px'>
                    <Modal.Body p='0'>
                        <HStack
                            alignItems={'center'}
                            justifyContent='space-between'
                        >
                            <TouchableOpacity
                                style={[styles.cameraModalButton]}
                                onPress={profileCameraUpload}
                            >
                                <HStack
                                    alignItems={'center'}
                                >
                                    <Image source={{uri:BASE_URL + "/images/aiCameraIcon.png"}} alt='갤러리' style={{width:22, height:19, resizeMode:'contain'}} />
                                    <DefText 
                                        text="카메라"
                                        style={[styles.cameraModalButtonText]}
                                    />
                                </HStack>
                            </TouchableOpacity>
                       
                            <TouchableOpacity
                                style={[styles.cameraModalButton]}
                                //onPress={galleryOpen}
                                onPress={profileImageUpload}
                            >
                                <HStack
                                    alignItems={'center'}
                                >
                                    <Image source={{uri:BASE_URL + "/images/aiGallIcon.png"}} alt='갤러리' style={{width:22, height:19, resizeMode:'contain'}} />
                                    <DefText 
                                        text="갤러리"
                                        style={[styles.cameraModalButtonText]}
                                    />
                                </HStack>
                            </TouchableOpacity>
                        </HStack>
                    </Modal.Body>
                </Modal.Content>
            </Modal>
        </Box>
    );
};

const styles = StyleSheet.create({
    labelSubText: {
        ...fsize.fs14,
        lineHeight:22,
        color:'#929292'
    },
    cameraModalButton: {
        width: '48%',
        height:48,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:colorSelect.navy,
        borderRadius:10
    },
    cameraModalButtonText: {
        ...fsize.fs14,
        color:colorSelect.white,
        lineHeight:19,
        marginLeft:10
    }
})

export default connect(
    ({ User }) => ({
        userInfo: User.userInfo, //회원정보
        user_lang: User.user_lang
    }),
    (dispatch) => ({
        member_login: (user) => dispatch(UserAction.member_login(user)), //로그인
        languageSet: (user) => dispatch(UserAction.languageSet(user)), //언어
        member_logout: (user) => dispatch(UserAction.member_logout(user)), //로그아웃
    })
)(UntactReservationMyInfo);