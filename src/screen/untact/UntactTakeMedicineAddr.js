import React, { useEffect, useState } from 'react';
import { Box, HStack, Modal } from 'native-base';
import { ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DefButton, DefText } from '../../common/BOOTSTRAP';
import Header from '../../components/Header';
import FormInput from '../../components/FormInput';
import { BASE_URL } from '../../Utils/APIConstant';
import { phoneFormat } from '../../common/DataFunction';
import { colorSelect, deviceSize, fsize, fweight } from '../../common/StyleCommon';
import Postcode from '@actbase/react-daum-postcode';
import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../../redux/module/action/UserAction';
import Api from '../../Api';
import ToastMessage from '../../components/ToastMessage';
import UploadLoading from '../../components/UploadLoading';

//비대면 처방 약 배송받을 주소
const UntactTakeMedicineAddr = (props) => {
    
    const {navigation, userInfo, user_lang, route} = props;
    const {params} = route;

    console.log("medicine addr", params);

    const [pageText, setPageText] = useState("");

    const pageLangApi = () => {
        //user_lang != null ? user_lang?.cidx : userInfo?.cidx
        Api.send('app_page', {'cidx':user_lang != null ? user_lang?.cidx : userInfo?.cidx, "code":"untactMedicineAddr"}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               //console.log('병원지도 메인 언어 리스트: ', resultItem, arrItems);
               setPageText(arrItems.text);
            }else{
               console.log('병원지도 메인 언어 리스트 실패!', resultItem);
               
            }
        });
    }

    useEffect(() => {
        pageLangApi();
    }, [])

    //수령인
    const [receiveName, setReceiveName] = useState("");
    const rcvChange = (rcv) => {
        setReceiveName(rcv);
    }

    //연락처
    const [phoneNumber, setPhoneNumber] = useState("");
    const phoneNumberChange = (phone) => {
        setPhoneNumber(phoneFormat(phone));
    }

    const [addrZip, setAddrZip] = useState("");

    const [addr, setAddress] = useState("");
    const addrChange = (addr) => {
        setAddress(addr);
    }

    const [address2, setAddress2] = useState("");
    const addrChange2 = (addr) => {
        setAddress2(addr)
    }

    const [addrModal, setAddrModal] = useState(false);

    const addrHandler = (addzip, address) => {
        setAddrZip(addzip);
        setAddress(address);
    }

    const [reqContent, setReqContent] = useState("");
    const reqContentChange = (req) => {
        setReqContent(req);
    }

    const [uploadLoad, setUploadLoad] = useState(false);

    const medicineDelivery = async () => {

        if(addrZip == ""){
            ToastMessage("주소를 선택하세요.");
            return false;
        }

        if(addr == ""){
            ToastMessage("주소를 선택하세요.");
            return false;
        }


        await setUploadLoad(true);
        await Api.send('untact_drugDelivery', {'idx':params.idx, 'id':userInfo?.id, 'cidx':user_lang != null ? user_lang?.cidx : userInfo?.cidx, 'post':addrZip, 'address':addr + " " + address2, 'memo':reqContent}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               console.log('병원지도 메인 언어 리스트: ', resultItem, arrItems);
               
               ToastMessage("배송지 정보가 입력되었습니다.");
               //navigation.navigate("HospitalReview", {"idx":3, "name":"노랑병원"})
               navigation.navigate("UntactEndReview", {"idx":params.idx})
            }else{
               console.log('병원지도 메인 언어 리스트 실패!', resultItem);
               
               ToastMessage("오류가 발생했습니다.");
            }
        });
        await setUploadLoad(false);
    }

    return (
        <Box flex={1} backgroundColor='#fff' >
            <Header
                headerTitle={ pageText != "" ? pageText[0] : "배송지 정보"}
                backButtonStatus={true}
                navigation={navigation}
            />
            <ScrollView>
                <Box p='20px'>
                    <Box>
                        <FormInput 
                            labelOn={true}
                            label={ pageText != "" ? pageText[1] : '수령인'}
                            placeholder={'수령인 이름을 입력해 주세요.'}
                            value={userInfo?.name}
                            onChangeText={rcvChange}
                            editable={false}
                            labelHorizontal={true}
                            labelIcon={true}
                            labelIconUri={BASE_URL + "/images/addrRcvNameIcon.png"}
                            labelIconWidth={18}
                            labelIconHeight={18}
                            labelIconResize='contain'
                            inputStyle={{lineHeight:18, backgroundColor:"#E9E9E9"}}
                        />
                    </Box>
                    <Box mt='30px'>
                        <FormInput 
                            labelOn={true}
                            label={ pageText != "" ? pageText[2] : '연락처'}
                            placeholder={'연락처를 입력하세요. (-를 빼고 입력하세요.)'}
                            value={userInfo?.hp}
                            onChangeText={phoneNumberChange}
                            editable={true}
                            labelHorizontal={true}
                            labelIcon={true}
                            labelIconUri={BASE_URL + "/images/phoneIconCheck.png"}
                            labelIconWidth={18}
                            labelIconHeight={18}
                            labelIconResize='contain'
                            keyboardType='number-pad'
                            maxLength={13}
                            inputStyle={{lineHeight:20, backgroundColor:"#E9E9E9"}}
                        />
                    </Box>
                    <Box mt='30px'>
                        <FormInput 
                            labelOn={true}
                            label={ pageText != "" ? pageText[3] : '배송 받을 주소'}
                            placeholder={ pageText != "" ? pageText[5] : '도로명 주소를 검색해주세요.'}
                            value={addr}
                            //onChangeText={addrChange}
                            editable={false}
                            labelHorizontal={true}
                            labelIcon={true}
                            labelIconUri={BASE_URL + "/images/medicinAddr.png"}
                            labelIconWidth={18}
                            labelIconHeight={18}
                            labelIconResize='contain'
                            inputStyle={{lineHeight: addr != "" ? 20 : 18}}
                            inputButton={true}
                            inputButtonText={ pageText != "" ? pageText[7] : "검색"}
                            inputButtonPress={()=>setAddrModal(true)}
                            btnStyle={{backgroundColor:colorSelect.navy}}
                            subtext={ pageText != "" ? pageText[4] : "약을 배송 받을 정확한 주소를 입력해 주세요."}
                            subTextStyle={{color:'#E11B1B'}}
                        />
                        <Box mt='10px'>
                            <FormInput 
                                labelOn={false}
                                label={'배송 받을 주소'}
                                placeholder={ pageText != "" ? pageText[6] : '상세 주소를 입력해 주세요.'}
                                value={address2}
                                onChangeText={addrChange2}
                                editable={true}
                                labelHorizontal={true}
                                labelIcon={true}
                                labelIconUri={BASE_URL + "/images/medicinAddr.png"}
                                labelIconWidth={18}
                                labelIconHeight={18}
                                labelIconResize='contain'
                                inputStyle={{lineHeight:18}}
                            />
                        </Box>
                    </Box>
                    <Box mt='30px'>
                        <FormInput 
                            labelOn={true}
                            label={ pageText != "" ? pageText[8] : '요청사항'}
                            placeholder={ pageText != "" ? pageText[9] : '요청사항을 입력해 주세요.'}
                            value={reqContent}
                            onChangeText={reqContentChange}
                            editable={true}
                            labelHorizontal={true}
                            labelIcon={true}
                            labelIconUri={BASE_URL + "/images/medicineReq.png"}
                            labelIconWidth={18}
                            labelIconHeight={18}
                            labelIconResize='contain'
                            multiline={true}
                            textAlignVertical='top'
                            inputStyle={{height:190, paddingTop:15}}
                        />
                    </Box>
                </Box>
            </ScrollView>
            <DefButton 
                text={ pageText != "" ? pageText[10] : "배송신청"}
                btnStyle={{backgroundColor:"#F1F1F1", borderRadius:0}}
                txtStyle={{...fsize.fs16, ...fweight.m}}
                onPress={
                    medicineDelivery
                }
            />
            <Modal isOpen={addrModal} onClose={()=>setAddrModal(false)}>
                <SafeAreaView style={{flex:1}}>
                    <HStack
                        height='45px'
                        backgroundColor={'#fff'}
                        alignItems='center'
                        justifyContent={'space-between'}
                        borderBottomWidth={1}
                        borderBottomColor={'#dfdfdf'}
                        px='20px'
                    >
                        <DefText
                            text="주소를 입력하세요."
                            style={[
                                fsize.fs15,
                                fweight.bold
                            ]}
                        />
                        <TouchableOpacity
                            onPress={()=>setAddrModal(false)}
                        >
                           <Image 
                                source={require("../../images/menuClose.png")}
                                alt="닫기"
                                style={{
                                    width:deviceSize.deviceWidth / 19.5,
                                    height:deviceSize.deviceWidth / 19.5,
                                    resizeMode:'contain'
                                }}
                           />
                        </TouchableOpacity>
                    </HStack>
                    <Postcode 
                        style={{
                            width:deviceSize.deviceWidth,
                            flex:1,
                        }}
                        jsOptions={{
                            animation: true,
                            hideMapBtn: true
                        }}
                        onSelected={(data) => {
                            addrHandler(data.zonecode, data.address)
                            setAddrModal(false);
                        }}
                    />
                </SafeAreaView>
            </Modal>
            {
                uploadLoad &&
                <UploadLoading
                    loadingText={pageText[11]}
                />
            }
        </Box>
    );
};

export default connect(
    ({ User }) => ({
        userInfo: User.userInfo, //회원정보
        user_lang: User.user_lang,
        userPosition: User.userPosition
    }),
    (dispatch) => ({
        member_login: (user) => dispatch(UserAction.member_login(user)), //로그인
        languageSet: (user) => dispatch(UserAction.languageSet(user)), //선택언어
    })
)(UntactTakeMedicineAddr);