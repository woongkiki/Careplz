import React, { useEffect, useState } from 'react';
import { Box, HStack } from 'native-base';
import { DefButton, DefText } from '../../common/BOOTSTRAP';
import Header from '../../components/Header';
import {ScrollView, StyleSheet, TouchableOpacity, Image, ActivityIndicator} from 'react-native';
import { colorSelect, deviceSize, fsize, fweight } from '../../common/StyleCommon';
import BoxLine from '../../components/BoxLine';
import FormInput from '../../components/FormInput';
import { BASE_URL } from '../../Utils/APIConstant';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import FormButton from '../../components/FormButton';
import Checkbox from '../../components/Checkbox';
import ToastMessage from '../../components/ToastMessage';
import Api from '../../Api';
import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../../redux/module/action/UserAction';
import UploadLoading from '../../components/UploadLoading';

const UntactReservationConfirm = (props) => {

    const {navigation, route, userInfo, user_lang} = props;
    const {params} = route;

    //console.log("request:::", params);

    const [pageText, setPageText] = useState("");
    
    const pageLanguage = () => {
        //user_lang != null ? user_lang?.cidx : userInfo?.cidx
        Api.send('app_page', {'cidx': user_lang != null ? user_lang?.cidx : userInfo?.cidx, "code":"hospitalReserRequest"}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               console.log('비대면 예약하기 예약신청 언어 리스트: ', resultItem, arrItems.text);
               setPageText(arrItems.text);
            }else{
               console.log('비대면 의사선택 예약신청 리스트 실패!', resultItem);
               
            }
        });
    }

    useEffect(() => {
        pageLanguage();
    }, [])

    //예약자 이름
    const [rname, setRname] = useState("");
    const rnameChange = (name) => {
        setRname(name);
    }

    //생년월일
    const [birthday, setBirthDay] = useState("");
    const [birthdayPickerVisible, setBirthdayPickerVisible] = useState(false);

    const showBirthdayPicker = () => {
        setBirthdayPickerVisible(true);
    }

    const hideBirthdayPicker = () => {
        setBirthdayPickerVisible(false);
    }

    const birthdayPickerSelect = (day) => {
        let days = moment(day);
        days = days.format('YYYY.MM.DD');
        setBirthDay(days);
        hideBirthdayPicker();
    }

    //전달사항
    const [rmessage, setrMessage] = useState(params.selectClinic);
    const rmessageChange = (m) => {
        setrMessage(m);
    }

    //재방문 여부
    const [reVisitStatus, setReVisitStatus] = useState(false);

    const [uploadLoad, setUploadLoad] = useState(false);
    const reservationRequest = async () => {

        let selectTimeItem = params.selectTime.join(",");

        console.log("selectTimeItem", selectTimeItem);
        await setUploadLoad(true);
        
        await Api.send('untact_reservation06', {'id':userInfo?.id, "cidx":user_lang != null ? user_lang?.cidx : userInfo?.cidx, "datetime":selectTimeItem }, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               console.log('비대면 예약신청 완료: ', resultItem, arrItems);

               ToastMessage(resultItem.message);
               navigation.navigate('TabNavi', {
                    screen: "Untact",
                });
            }else{
               console.log('비대면 예약신청 완료 실패!', resultItem);
               
            }
        });

        await setUploadLoad(false);
    }


    useEffect(() => {

        if(userInfo){
            setRname(userInfo?.name);
            setBirthDay(userInfo.birthday)
        }
    }, [])

    return (
        <Box flex={1} backgroundColor='#fff' >
            <Header 
                headerTitle={ pageText != "" ? pageText[0] : "비대면 예약요청"}
                backButtonStatus={true}
                navigation={navigation}
            />
            <ScrollView>
                <Box p='20px'>
                    <Box>
                        <Box
                            alignItems={'center'}
                            pb='20px'
                            borderBottomWidth={1}
                            borderBottomColor='#E3E3E3'
                        >
                            <DefText 
                                text={params.hname}
                                style={{
                                    ...fsize.fs18,
                                    ...fweight.bold
                                }}
                            />
                        </Box>
                        <Box
                            alignItems={'center'}
                            
                        >
                            {
                                params.selectTime != "" &&
                                <HStack flexWrap={'wrap'}>
                                    {
                                        params.selectTime.map((item, index) => {
                                            return(
                                                <Box
                                                    key={index}
                                                    borderRadius={5}
                                                    backgroundColor={colorSelect.pink_de}
                                                    width={(deviceSize.deviceWidth - 40) * 0.48}
                                                    height={35}
                                                    alignItems='center'
                                                    justifyContent={'center'}
                                                    mt='15px'
                                                    mr={ (index + 1) % 2 != 0 ? (deviceSize.deviceWidth - 40) * 0.039 : 0 }
                                                >
                                                    <DefText 
                                                        text={item}
                                                        style={[
                                                            styles.selectBoxsRightText,
                                                            {color:colorSelect.white}
                                                        ]}
                                                    />
                                                </Box>
                                            )
                                        })
                                    }
                                </HStack>
                            }
                        </Box>
                    </Box>
                </Box>
                <BoxLine />
                <Box px='20px' py='30px'>
                    <FormInput 
                        labelOn={true}
                        label={ pageText != "" ? pageText[1] : '예약자'}
                        placeholder={ '예약자 이름을 입력해 주세요.'}
                        value={rname}
                        onChangeText={rnameChange}
                        editable={false}
                        labelHorizontal={true}
                        labelIcon={true}
                        labelIconUri={BASE_URL + "/images/nameIcon.png"}
                        labelIconWidth={18}
                        labelIconHeight={18}
                        labelIconResize='contain'
                        inputStyle={{lineHeight:20}}
                    />
                    <Box
                        style={[styles.inputMargin]}
                    >
                        <FormButton 
                            labelOn={true}
                            label={ pageText != "" ? pageText[2] : '생년월일'}
                            text={birthday != "" ? birthday : "생년월일을 선택해주세요."}
                            btnStyle={{backgroundColor:  "#fff"}}
                            txtStyle={{color:'#000', lineHeight:20} }
                            labelHorizontal={true}
                            labelIcon={true}
                            labelIconUri={BASE_URL + "/images/birthIcon.png"}
                            labelIconWidth={18}
                            labelIconHeight={18}
                            labelIconResize='contain'
                            onPress={showBirthdayPicker}
                            maximumDate={new Date()}
                            btndisabled={true}
                        />
                    </Box>
                    <Box
                        style={[styles.inputMargin]}
                    >
                        <HStack mb='10px'>
                            <Image 
                                source={{uri:BASE_URL + "/images/messageIcons.png"}}
                                style={{
                                    width:17,
                                    height:18,
                                    resizeMode:'contain',
                                    marginRight: 10,
                                }}
                            />
                            <DefText 
                                text={ pageText != "" ? pageText[3] : "전달사항"}
                                style={{
                                    ...fweight.bold,
                                    ...fsize.fs15,
                                }}
                            />
                        </HStack>
                        <TouchableOpacity
                            style={[styles.selectButton]}
                            disabled={true}
                            //onPress={handlePresentModalPress}
                        >
                            <HStack
                                alignItems={'center'}
                                justifyContent='space-between'
                            >
                                {
                                    params.clinic != "" ?
                                    <DefText
                                        text={params.clinic}
                                        style={[fsize.fs15]}
                                    />
                                    :
                                    <DefText 
                                        text="전달사항이 없습니다"
                                        style={[fsize.fs15, {color:'#BEBEBE'}]}
                                    />
                                }
                            </HStack>
                            
                        </TouchableOpacity>
                        {/* <Box style={[styles.inputMargin]}>
                            <HStack>
                            <Checkbox 
                                checkboxText='재방문이에요'
                                checkStatus={reVisitStatus}
                                onPress={()=>setReVisitStatus(!reVisitStatus)}
                            />
                            </HStack>
                        </Box> */}
                    </Box>
                </Box>
            </ScrollView>
            <DefButton 
                text={ pageText != "" ? pageText[5] : "예약요청"}
                btnStyle={{backgroundColor:colorSelect.pink_de, borderRadius:0}}
                txtStyle={{color:colorSelect.white}}
                onPress={reservationRequest}
            />
            <DateTimePickerModal
                isVisible={birthdayPickerVisible}
                mode="date"
                onConfirm={birthdayPickerSelect}
                onCancel={hideBirthdayPicker}
                maximumDate={new Date()} 
                display={'spinner'}
            />

            {
                uploadLoad &&
                <UploadLoading 
                    loadingText={ pageText != "" ? pageText[10] : "예약요청중입니다\n잠시만 기다려주세요"}
                />
            }
        </Box>
    );
};

const styles = StyleSheet.create({
    inputMargin: {
        marginTop:30
    },
    selectButton: {
        width:'100%',
        height: 48,
        borderRadius:5,
        borderWidth:1,
        borderColor:'#E1E1E1',
        justifyContent:'center',
        paddingHorizontal:15
    },
})

export default connect(
    ({ User }) => ({
        userInfo: User.userInfo, //회원정보
        user_lang: User.user_lang,
    }),
    (dispatch) => ({
        member_login: (user) => dispatch(UserAction.member_login(user)), //로그인
        languageSet: (user) => dispatch(UserAction.languageSet(user)), //선택언어
    })
)(UntactReservationConfirm);