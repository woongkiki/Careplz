import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {Box, HStack} from 'native-base';
import { DefText, LabelTitle } from '../../common/BOOTSTRAP';
import { colorSelect, deviceSize, fsize, fweight } from '../../common/StyleCommon';
import { Image, PermissionsAndroid, Platform, ScrollView, StatusBar, StyleSheet, TouchableOpacity } from 'react-native';
import SearchInput from '../../components/SearchInput';
import {WebView} from 'react-native-webview';
import { BASE_URL } from '../../Utils/APIConstant';
import { hospitalMapCate, hospitalMapContent, allHopistalCategory } from '../../ArrayData';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetBackdrop, BottomSheetFlatList, BottomSheetModal, BottomSheetModalProvider, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import Loading from '../../components/Loading';
import BoxLine from '../../components/BoxLine';
import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../../redux/module/action/UserAction';
import ToastMessage from '../../components/ToastMessage';
import Api from '../../Api';
import Geolocation from 'react-native-geolocation-service';
import { useIsFocused } from '@react-navigation/native';
import EmptyPage from '../../components/EmptyPage';
import { textLengthOverCut } from '../../common/DataFunction';

const UntactMap = (props) => {

    const {navigation, userInfo, user_lang, userPosition, app_positions, route} = props;
    const {params} = route;


    const [pageText, setPageText] = useState([]);
    //페이지 언어
    const pageLangSelects = () => {
        //user_lang != null ? user_lang?.cidx : userInfo?.cidx
        Api.send('app_page', {'cidx':user_lang != null ? user_lang?.cidx : userInfo?.cidx, "code":"hospitalMap"}, (args)=>{

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
        pageLangSelects();
    }, [user_lang])


    const isFocused = useIsFocused();

    //위치 좌표요청
    const geoPermissionHandler = async () => {
        if(Platform.OS === "ios"){
            await Geolocation.requestAuthorization("whenInUse");
            //console.log( Platform.OS , "좌표실행");
            getLocation();
        }else{
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: "위치정보 이용",
                    message: "고객님의 위치정보를 활용 해 병원 목록을 가져옵니다.",
                    buttonPositive: "확인"
                }
            )

            if(granted === PermissionsAndroid.RESULTS.GRANTED){
                console.log("좌표실행");
                getLocation();
            }else{
                ToastMessage("위치기반 이용이 허용되지 않았습니다.");
                return false;
            }
        }
    }

    //37.551914, 126.991851
    const [lat, setLat] = useState("37.551914"); //위도
    const [lng, setLng] = useState("126.991851"); //경도

    const [latApi, setLatApi] = useState("");
    const [lngApi, setLngApi] = useState("");

    //좌표 정보
    const getLocation = async () => {
        Geolocation.getCurrentPosition( async (position) => {
            //console.log("position", position);

            setLat(position.coords.latitude);
            setLng(position.coords.longitude);

            setLatApi(position.coords.latitude);
            setLngApi(position.coords.longitude);

            const appPositionCheck = await app_positions({"lat":position.coords.latitude, "lng":position.coords.longitude});

            console.log("appPositionCheck", appPositionCheck);

        }, (error) => {
            console.log("좌표 얻기 오류::", error);
        }, {
            showLocationDialog: true,
            enableHighAccuracy: true,
            timeout : 5000,
            //maximumAge: 10000
        }

        )
    }

    useEffect(() => {
        if(lng != "" && lat != ""){
            console.log("좌표 변화", lng, lat)
            appUrlChange(BASE_URL + "/untactMap.php?lat=" + lat + "&lng=" + lng);
        }
    }, [lat, lng])

    useEffect(() => {
        if(latApi != "" && lngApi != ""){
            hospitalListAPi();
        }
    }, [latApi, lngApi])

   

    useEffect(()=> {
          
        if(isFocused){
            geoPermissionHandler();
        }
      
    }, [isFocused])

    const [schText, setSchText] = useState("");
    const schChange = (text) => {
        setSchText(text);
    }

    const [hospitalCategoryList, setHospitalCategoryList] = useState([])

    const [selectCategory, setSelectCategory] = useState("모든 병원");

    const [mapLoading, setMapLoading] = useState(true);
    const [appDomain, setAppDomain] = useState("");

    const appUrlChange = async (urls) => {
        await setMapLoading(true);
        await setAppDomain(urls);
        await setMapLoading(false);
    }

    // useEffect(() => {
    //     if(lat != "" && lng != ""){
    //         appUrlChange(BASE_URL + "/hospitalMap.php?lat=" + lat + "&lng=" + lng);
    //     }
    // }, [lat, lng])

    useEffect(() => {
        console.log("appDomain:::::",appDomain)
    }, [appDomain])

    //목록보기 모달
    const bottomSheetModalRef = useRef(null);

    const snapPoints = useMemo(() => [1,'55%', '100%']);

    const handlePresentModalPress = useCallback(()=> {
        bottomSheetModalRef.current?.snapToIndex(1);
    }, []);

    const handleSheetChanges = useCallback((index)=> {
        console.log('handleSheetChanges', index)
    }, []);

    const renderBackdrop = useCallback(
        props => (
            <BottomSheetBackdrop
            {...props}
            pressBehavior="close"
            appearsOnIndex={0}		// 이거 추가
            disappearsOnIndex={-1}	// 이거 추가
            
            />
        ),
    [],);

    const [hospitalList, setHospitalList] = useState([]);

    //목록보기에서 병원 카테고리 눌렀을 때 나오는 모달
    const bottomSheetModalHospitalRef = useRef(null);

    const snapPointsHospital = useMemo(() => [1, '80%']);

    const handleHospitalCategoryPress = useCallback(() => {
        //bottomSheetModalRef.current?.close();
        bottomSheetModalHospitalRef.current?.snapToIndex(1);
    }, [])

    const handleHospitalChanges = useCallback((index) => {
        //console.log("handleHospitalChanges::", index);
        if(index == 0){
            bottomSheetModalHospitalRef.current?.close();
        }
    });


    const [catCodes, setCatCodes] = useState("");

    const scrollRef = useRef();
    const horizontalCategoryScrollEvent = (category, index, bottoms, catcode) => {

        
        setCatCodes(catcode); //진료과코드
        setSelectCategory(category); //카테고리명

        if(bottoms == "Y"){
            bottomSheetModalHospitalRef.current?.close();
        }

        let scrollToXvalue = user_lang.cidx != 0 ? (((deviceSize.deviceWidth - 40) * 0.3) + 15) : (((deviceSize.deviceWidth - 40) * 0.24) + 15);

        scrollRef.current?.scrollTo({
            x: scrollToXvalue * index,
            animate: true
        })
    }

   


    const hospitalApi = async () => {
        await Api.send('untact_category2', {'cidx':user_lang != null ? user_lang?.cidx : userInfo?.cidx}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               //console.log('비대면 병원 진료 과목 리스트: ', resultItem, arrItems);
               setHospitalCategoryList(arrItems);

               setSelectCategory(arrItems[0].category);
               
            }else{
               console.log('병원 진료 과목 실패!', resultItem);
               
            }
        });

       
    }

    const [nowRsv, setNowRsv] = useState(0);
    const nowRsvChg = () => {
        setNowRsv( nowRsv == 0 ? 1 : 0 );
    }

    useEffect(() => {

        console.log("nowRsv", nowRsv);
        let data = {key:"nowRsv", value:nowRsv};
        
        if(!mapLoading){
            sendWebViewMessage(data)

            hospitalListAPi();
        }
    }, [nowRsv]);

    const [page, setPage] = useState(1);

    const hospitalListAPi = async () => {

        //console.log("실행::", latApi, lngApi);
        await setPage(1);
        await Api.send('untact_hospital', {'page':1, 'cidx':user_lang?.cidx, 'lat':latApi, 'lng':lngApi, 'orderby':1, 'catcode':catCodes, 'pcr':pcr, 'fast':fast, 'cst':cst, 'rsv':rsc, 'keyword':schText, "frsv":nowRsv, "orderby":orderbySelect}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               console.log('병원  리스트: ', arrItems[0]);
               setHospitalList(arrItems);
            }else{
               console.log('병원 리스트 실패!', resultItem);
               setHospitalList([]);
            }
        });
    }

    useEffect(() => {
        hospitalApi();
    }, [user_lang])


     //webViewRef
     const webViewRef = useRef();

    const onWebViewMessage = (webviews) => {
        const jsonData = JSON.parse(webviews.nativeEvent.data);
        //console.log("webviewData:::", jsonData);

        if(jsonData.data.idx != undefined){
            console.log("jsonData", jsonData);
            navigation.navigate("UntactReservation", {"hidx":jsonData.data.idx , "hname":"", "catcode":"", "selectClinic":""})
        }

        // if(jsonData.data.lat != undefined && jsonData.data.lat != ""){
        //     setLatApi(jsonData.data.lat);
        // }
        // if(jsonData.data.lng != undefined && jsonData.data.lng != ""){
        //     setLngApi(jsonData.data.lng);
        // }
        // if(jsonData.data.lat != undefined){
        //     setLat(jsonData.data.lat);
        // }
        // if(jsonData.data.lng != undefined){
        //     setLat(jsonData.data.lng);
        // }
    }

    function sendWebViewMessage(data){
        const jsonData = JSON.stringify(data);
        
        //console.log("senddat", jsonData);
        webViewRef.current.postMessage(jsonData);
    }


   
    //pcr 검사
    const [pcr, setPcr] = useState(0);
    const pcrChange = () => {
        setPcr( pcr == 0 ? 1 : 0);
    }   
    useEffect(() => {
        console.log("pcr", pcr);
        let data = {key:"pcr", value:pcr};
        
        if(!mapLoading){
            sendWebViewMessage(data);
            //setPage(1);
            hospitalListAPi();
        }
    }, [pcr]);


    useEffect(() => {
        console.log("page변화",page);
    }, [page])

     //신속항원
     const [fast, setFast] = useState(0);
     const fastChange = () => {
         setFast( fast == 0 ? 1 : 0 );
     }
    useEffect(() => {

        //console.log("fast", fast);
        let data = {key:"fast", value:fast};
        
        if(!mapLoading){
            sendWebViewMessage(data)

            hospitalListAPi();
        }
    }, [fast]);


    //진료중
    const [cst, setCst] = useState(0);
    const cstChange = () => {
        setCst( cst == 0 ? 1 : 0 );
    }

    useEffect(() => {

        //console.log("cst", cst);
        let data = {key:"cst", value:cst};
        
        if(!mapLoading){
            sendWebViewMessage(data)

            hospitalListAPi();
        }
    }, [cst]);


    //예약
    const [rsc, setRsv] = useState(0);
    const rscChange = () => {
        setRsv( rsc == 0 ? 1 : 0 );
    }

    useEffect(() => {

        //console.log("rsc", rsc);
        let data = {key:"rsv", value:rsc};
        
        if(!mapLoading){
            sendWebViewMessage(data)

            hospitalListAPi();
        }
    }, [rsc]);

    //현재 위치로 이동
    const nowAreaMove = () => {
        //console.log("latlng",lat, lng);

        let data = {key:'latlng', value:lat + ',' + lng};

        if(!mapLoading){
            sendWebViewMessage(data)
            hospitalListAPi();
        }
        console.log("latlngData::", data);
    }

    //카테고리 변경
    useEffect(() => {
        //console.log("catCodes", catCodes);
        //console.log("schText", schText);
        let data = {key:'catcode', value:catCodes};

        if(!mapLoading){
            sendWebViewMessage(data)
            hospitalListAPi();
        }

        
    }, [catCodes]);

    useEffect(() => {

        setSchText(params.schText);
     
    }, [params])

    useEffect(() => {

        console.log("검색어 변경", schText)
        
        hospitalListAPi();
    },[schText, user_lang])


    


    const [fetchLoading, setFetchLoading] = useState(false)

    const fetchApi = async () => {
    
        await setFetchLoading(true);
        await setFetchLoading(false);

    }

    const pageAdd = async () => {

        await setPage(page + 1);
        
    }

    useEffect(() => {
        if(fetchLoading){
            pageAdd();
        }
    }, [fetchLoading])

    const hospitalListAdd = () => {
        Api.send('untact_hospital', {'page':page, 'cidx':user_lang?.cidx, 'lat':latApi, 'lng':lngApi, 'orderby':1, 'catcode':catCodes, 'pcr':pcr, 'fast':fast, 'cst':cst, 'rsv':rsc, 'keyword':schText,  "frsv":nowRsv, "orderby":orderbySelect}, (args)=>{

            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               //console.log('병원 리스트 추가: ', arrItems);

                let hospitalAdd = [...hospitalList];

                arrItems.map((item, index) => {
                    return hospitalAdd.push(item);
                })

               setHospitalList(hospitalAdd);
            }else{
               console.log('병원 리스트 추가 실패!', resultItem);
               
            }
        });
    }

    useEffect(() => {
        if(page > 1){
           
            hospitalListAdd();
        }
    }, [page])

    //정렬
    const orderlist = [{"idx":0,"orders":pageText[13]}, {"idx":1,"orders":pageText[14]}];
    const [orderbySelect, setOrderBySelect] = useState(0);

    useEffect(() => {

        console.log("orderbySelect", orderbySelect);
        hospitalListAPi();
    }, [orderbySelect])

    const selectOrderbyHandler = (orderIdx) => {
        setOrderBySelect(orderIdx);
        bottomSheetOrderRef.current?.close()
    }

    //정렬 버텀시트
    //목록보기에서 병원 카테고리 눌렀을 때 나오는 모달
    const bottomSheetOrderRef = useRef(null);

    const snapPointsOrder = useMemo(() => [1, '16.8%']);

    const handleOrderCategoryPress = useCallback(() => {
        //bottomSheetModalRef.current?.close();
        bottomSheetOrderRef.current?.snapToIndex(1);
    }, [])

    const handleOrderChanges = useCallback((index) => {
        //console.log("handleHospitalChanges::", index);
        if(index == 0){
            bottomSheetOrderRef.current?.close();
        }
    });
   
    return (
        <GestureHandlerRootView style={{flex:1, backgroundColor:'#fff'}}>
            {
                mapLoading ?
                <Loading />
                :
                <WebView
                    ref={webViewRef}
                    onMessage={webViews => onWebViewMessage(webViews)} 
                    originWhitelist={['*']}
                    source={{uri:appDomain}}
                    startInLoadingState={true}
                    renderLoading={()=>{
                        return(
                            <Loading />
                        )
                    }}
                    // onMessage={(e)=>{
                    //     console.log('e', e.nativeEvent.data);
                    //     setStartAddress(e.nativeEvent.data);
                    //     setInputAddr(e.nativeEvent.data);
                    // }}
                />
            }
                
     
             <Box p='20px' pb='20px' position={'absolute'} top={0}>
                <HStack justifyContent={'space-between'} width={deviceSize.deviceWidth - 40} flexWrap='wrap'>
                    <Box width={(deviceSize.deviceWidth - 40) * 0.87} borderRadius='22px' shadow={5}>
                        <SearchInput 
                            placeholder={ pageText != "" ? pageText[0] : "병원명, 또는 원하는 진료를 검색하세요."}
                            value={schText}
                            onChangeText={schChange}
                            inputStyle={{paddingLeft:50, backgroundColor:'#fff', borderRadius:22, borderWidth:0, lineHeight:20}}
                            positionMargin={'-24px'}
                            btnStyle={{borderRadius:22, backgroundColor:'#fff'}}
                            onPressIn={()=>navigation.navigate("UntactMapHeader", {"schText":params.schText})}
                        />
                    </Box>
                    <TouchableOpacity
                        style={{
                            width:(deviceSize.deviceWidth - 40) * 0.12,
                            height:48,
                            justifyContent:'center',
                            alignItems:'flex-end',
                        }}
                        onPress={()=>navigation.navigate("LanguageSelect", {"back":false})}
                    >
                        <Image 
                            source={require("../../images/langSelectButton.png")}
                            style={{
                                width:27,
                                height:27,
                                resizeMode:'contain'
                            }}
                        />
                    </TouchableOpacity>
                </HStack>
            </Box>
            <Box
                position={'absolute'}
                top='90px'
                left='20px'
            >
                <Box
                    shadow={5}
                    backgroundColor='#fff'
                    borderRadius={8}
                >
                    <TouchableOpacity
                        style={[
                            styles.leftButton,
                            pcr == 1 &&
                            {backgroundColor:colorSelect.pink_de},
                            user_lang?.cidx != 0 &&
                            {width:74, height:74}
                        ]}
                        onPress={pcrChange}
                    >
                        <DefText 
                            text={ pageText != "" ? pageText[1] : "PCR\n검사"}
                            style={[
                                styles.leftButtonText,
                                pcr == 1 &&
                                {color:colorSelect.white}
                            ]}
                            lh={ user_lang?.cidx == 9 ? 24 : ''}
                        />
                    </TouchableOpacity>
                </Box> 
                <Box
                    shadow={5}
                    backgroundColor='#fff'
                    mt='15px'
                    borderRadius={8}
                >
                    <TouchableOpacity
                        style={[
                            styles.leftButton,
                            fast == 1 &&
                            {backgroundColor:colorSelect.pink_de},
                            user_lang?.cidx != 0 &&
                            {width:74, height:74}
                        ]}
                        onPress={fastChange}
                    >
                        <DefText 
                            text={ pageText != "" ? pageText[2] : "신속\n항원"}
                            style={[
                                styles.leftButtonText,
                                fast == 1 &&
                                {color:colorSelect.white}
                            ]}
                            lh={ user_lang?.cidx == 9 ? 24 : ''}
                        />
                    </TouchableOpacity>
                </Box>
            </Box>
            <Box
                position={'absolute'}
                top='90px'
                right='20px'
            >
                <Box
                    shadow={9}
                    backgroundColor='#fff'
                    borderRadius={48}
                >
                    <TouchableOpacity
                        style={[
                            styles.leftButton, 
                            {borderRadius:48},
                            user_lang?.cidx != 0 &&
                            {width:74, height:74}
                        ]}
                        onPress={nowAreaMove}
                    >
                        <Image 
                            source={require("../../images/mapSpotIcon.png")}
                            style={{
                                width:23,
                                height:23,
                                resizeMode:'contain'
                            }}
                        />
                    </TouchableOpacity>
                </Box>
                <Box
                    shadow={5}
                    backgroundColor='#fff'
                    borderRadius={48}
                    mt='15px'
                >
                    <TouchableOpacity
                        style={[
                            styles.leftButton, 
                            {borderRadius:48}, cst == 1 && {backgroundColor:colorSelect.pink_de},
                            user_lang?.cidx != 0 &&
                            {width:74, height:74, paddingHorizontal:10}
                        ]}
                        onPress={cstChange}
                    >
                        <DefText 
                            text={ pageText != "" ? pageText[3] : "진료중"}
                            style={[
                                styles.leftButtonText,
                                cst == 1 && {color:colorSelect.white},
                               
                            ]}
                            lh={ user_lang?.cidx == 9 ? 24 : ''}
                        />
                    </TouchableOpacity>
                </Box>
                {/* <Box
                    shadow={5}
                    backgroundColor='#fff'
                    borderRadius={48}
                    mt='15px'
                >
                    <TouchableOpacity
                        style={[
                            styles.leftButton, 
                            {borderRadius:48},
                            rsc == 1 &&
                            {backgroundColor:colorSelect.pink_de},
                            user_lang?.cidx != 0 &&
                            {width:74, height:74, paddingHorizontal:10}
                        ]}
                        onPress={rscChange}
                    >
                        <DefText 
                            text={ pageText != "" ? pageText[4] : "예약"}
                            style={[
                                styles.leftButtonText,
                                rsc == 1 &&
                                {color:colorSelect.white}
                            ]}
                            lh={ user_lang?.cidx == 9 ? 24 : ''}
                        />
                    </TouchableOpacity>
                </Box> */}
            </Box>
            <Box
                position={'absolute'}
                bottom='0'

            >
                <Box justifyContent={'center'} alignItems='center' shadow={9}>
                    <Box backgroundColor={'#fff'} borderRadius='22px' overflow={'hidden'}>
                        <TouchableOpacity
                            style={{padding:10, paddingHorizontal:15, backgroundColor:'#fff'}}
                            onPress={handlePresentModalPress}
                        >
                            <HStack alignItems={'center'}>
                                <Image 
                                    source={require("../../images/hospitalMapListIcon.png")}
                                    style={{
                                        width:14,
                                        height:11,
                                        resizeMode:'stretch',
                                        marginRight:10
                                    }}
                                />
                                <DefText
                                    text={ pageText != "" ? pageText[5] : "목록보기"}
                                    style={[fsize.fs13, fweight.m, {lineHeight:18}]}
                                    lh={ user_lang?.cidx == 9 ? 30 : ''}
                                />
                            </HStack>
                        </TouchableOpacity>
                    </Box>
                </Box>
                <Box>
                    <ScrollView
                        ref={scrollRef}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        pagingEnabled
                        decelerationRate={'normal'}
                        snapToInterval={((deviceSize.deviceWidth - 40) * 0.24) + 15}
                        snapToAlignment={ Platform.OS === 'ios' ? 'center' : 'start'}
                        contentInset={{
                            left:0,
                            top:0,
                            bottom:0,
                            right:20
                        }}
                        contentContainerStyle={{
                            paddingRight: Platform.OS === 'android' ? 20 : 0
                        }}
                    >
                        <HStack py='20px'>
                            
                            {
                                hospitalCategoryList.map((item, index) => {
                                    return(
                                        <Box
                                            key={index}
                                            style={[
                                                styles.hospitalCateButtonBox,
                                                user_lang?.cidx != 0 && {width:((deviceSize.deviceWidth - 40) * 0.3) + 15},
                                            ]}
                                        >
                                            <Box
                                                shadow={5}
                                                style={[
                                                    styles.hospitalCateButton,
                                                    user_lang?.cidx != 0 && {width:(deviceSize.deviceWidth - 40) * 0.3, height:(deviceSize.deviceWidth - 40) * 0.3},
                                                ]}
                                            >
                                                <TouchableOpacity
                                                    style={[
                                                        styles.hospitalCateButton,
                                                        user_lang?.cidx != 0 && {width:(deviceSize.deviceWidth - 40) * 0.3, height:(deviceSize.deviceWidth - 40) * 0.3},
                                                        selectCategory == item.category && {backgroundColor:'#434856'}
                                                    ]}
                                                    onPress={()=>horizontalCategoryScrollEvent(item.category, index, "N", item.catcode)}
                                                >
                                                    <Image 
                                                        source={{uri:item.icon}}
                                                        style={{
                                                            width:27,
                                                            height:24,
                                                            resizeMode:'contain'
                                                        }}
                                                    />
                                                    <DefText
                                                        text={ textLengthOverCut(item.category, 20)}
                                                        style={[fsize.fs12, {color:'#434856', marginTop:10, textAlign:'center', lineHeight:17}, selectCategory == item.category && {color:'#fff'}]}
                                                        lh={ user_lang?.cidx == 9 ? 24 : ''}
                                                    />
                                                </TouchableOpacity>
                                            </Box>
                                        </Box>
                                    )
                                })
                            }
                            <Box
                                style={[
                                    styles.hospitalCateButtonBox,
                                    user_lang?.cidx != 0 && {width:((deviceSize.deviceWidth - 40) * 0.3) + 15},
                                ]}
                                
                            >
                                <Box
                                    shadow={5}
                                    style={[
                                        styles.hospitalCateButton,
                                        user_lang?.cidx != 0 && {width:(deviceSize.deviceWidth - 40) * 0.3, height:(deviceSize.deviceWidth - 40) * 0.3},
                                    ]}
                                >
                                    <TouchableOpacity
                                        style={[
                                            styles.hospitalCateButton,
                                            user_lang?.cidx != 0 && {width:(deviceSize.deviceWidth - 40) * 0.3, height:(deviceSize.deviceWidth - 40) * 0.3},
                                        ]}
                                        onPress={handleHospitalCategoryPress}
                                    >
                                         <Image 
                                            source={{uri:BASE_URL + "/images/plusIcon.png"}}
                                            style={{
                                                width:24,
                                                height:24,
                                                resizeMode:'stretch'
                                            }}
                                        />
                                        <DefText
                                            text={ pageText ? pageText[10] : "전체보기"}
                                            style={[fsize.fs12, {color:'#434856', marginTop:10, lineHeight:17, textAlign:'center'}]}
                                            lh={ user_lang?.cidx == 9 ? 24 : ''}
                                        />
                                    </TouchableOpacity>
                                </Box>
                            </Box>
                        </HStack>
                    </ScrollView>
                </Box>
            </Box>
            <BottomSheetModalProvider>
                <BottomSheet
                    ref={bottomSheetModalRef}
                    index={-1}
                    snapPoints={snapPoints}
                    onChange={handleSheetChanges}
                >
                    <Box 
                        
                        py='15px'
                        borderTopWidth={1}
                        borderTopColor='#E3E3E3'
                    >
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            
                        >
                        
                            <HStack
                                px='20px'
                            >
                                <TouchableOpacity
                                    style={[styles.bottomSheetButton]}
                                    onPress={handleOrderCategoryPress}
                                >
                                    <DefText 
                                        text={ orderbySelect == 0 ? pageText[13] : pageText[14]} 
                                        style={[styles.bottomSheetButtonText]}
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[
                                        styles.bottomSheetButton,
                                        {borderColor:colorSelect.navy}
                                    ]}
                                    onPress={handleHospitalCategoryPress}
                                >
                                    <HStack
                                        alignItems={'center'}
                                    >
                                        <DefText 
                                            text={selectCategory} 
                                            style={[
                                                styles.bottomSheetButtonText,
                                                {color:colorSelect.navy}
                                            ]}
                                            lh={ user_lang?.cidx == 9 ? 24 : ''}
                                        />
                                        <Image 
                                            source={{uri:BASE_URL + "/images/downArrSmall.png"}}
                                            style={{
                                                width:8,
                                                height:14,
                                                resizeMode:'contain',
                                                marginLeft:5
                                            }}
                                        />
                                    </HStack>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[
                                        styles.bottomSheetButton,
                                        cst == 1 &&
                                        {
                                            backgroundColor:colorSelect.pink_de,
                                            borderColor:colorSelect.pink_de
                                        }
                                    ]}
                                    onPress={cstChange}
                                >
                                    <DefText 
                                        text={ pageText != "" ? pageText[3] : "진료중"} 
                                        style={[
                                            styles.bottomSheetButtonText,
                                            cst == 1 &&
                                            {color:'#fff'}
                                        ]}
                                        lh={ user_lang?.cidx == 9 ? 24 : ''}
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[
                                        styles.bottomSheetButton,
                                        nowRsv == 1 &&
                                        {
                                            backgroundColor:colorSelect.pink_de,
                                            borderColor:colorSelect.pink_de
                                        }
                                    ]}
                                    onPress={nowRsvChg}
                                >
                                    <DefText 
                                        text={ pageText != "" ? pageText[6] : "바로예약"} 
                                        style={[
                                            styles.bottomSheetButtonText,
                                            nowRsv == 1 &&
                                            {color:'#fff'}
                                        ]}
                                        lh={ user_lang?.cidx == 9 ? 24 : ''}
                                    />
                                </TouchableOpacity>
                                {/* <TouchableOpacity
                                    style={[
                                        styles.bottomSheetButton,
                                        rsc == 1 && 
                                        {
                                            backgroundColor:colorSelect.pink_de,
                                            borderColor:colorSelect.pink_de
                                        }
                                    ]}
                                    onPress={rscChange}
                                >
                                    <DefText 
                                        text={ pageText != "" ? pageText[4] : "예약"} 
                                        style={[
                                            styles.bottomSheetButtonText,
                                            rsc == 1 &&
                                            {color:'#fff'}
                                        ]}
                                        lh={ user_lang?.cidx == 9 ? 24 : ''}
                                    />
                                </TouchableOpacity> */}
                            </HStack>
                        </ScrollView>
                    </Box>
                    <BoxLine />
                    <BottomSheetFlatList 
                        data={hospitalList}
                        keyExtractor={useCallback((item, index) => index.toString(), [])}
                        renderItem={
                            ({item, index}) => {
                                return(
                                    <TouchableOpacity
                                        style={{
                                            borderBottomWidth:1,
                                            borderBottomColor:"#E3E3E3"
                                        }}
                                        onPress={()=>navigation.navigate("UntactReservation", {"hidx":item.idx, "hname":"", "catcode":"", "selectClinic":""})}
                                    >
                                        <Box
                                            p='20px'
                                            pt='10px'
                                        >
                                            <HStack mb='10px' flexWrap={'wrap'}>
                                                {
                                                    item.ishot == "1" &&
                                                    <Box
                                                        p='5px'
                                                        px='10px'
                                                        borderRadius={25}
                                                        backgroundColor={colorSelect.pink_de}
                                                        mr={'10px'}
                                                        mt='10px'
                                                    >
                                                        <DefText 
                                                            text={ pageText != "" ? pageText[6] : "바로예약"}
                                                            style={[
                                                                {
                                                                    ...fsize.fs12,
                                                                    ...fweight.m,
                                                                    color:'#fff',
                                                                },
                                                            ]}
                                                            lh={ user_lang?.cidx == 9 ? 24 : ''}
                                                        />
                                                    </Box>
                                                }
                                                {
                                                    item.isppr == "1" &&
                                                    <Box
                                                        p='5px'
                                                        px='10px'
                                                        borderRadius={25}
                                                        backgroundColor={colorSelect.pink_de}
                                                        mr={'10px'}
                                                        mt='10px'
                                                    >
                                                        <DefText 
                                                            text={ pageText != "" ? pageText[7] :  "인기예약"}
                                                            style={[{
                                                                ...fsize.fs12,
                                                                ...fweight.m,
                                                                color:'#fff',
                                                            },
                                                        ]}
                                                        lh={ user_lang?.cidx == 9 ? 24 : ''}
                                                        />
                                                    </Box>
                                                }
                                                {
                                                    item.isrsv == "1" &&
                                                    <Box
                                                        p='5px'
                                                        px='10px'
                                                        borderRadius={25}
                                                        backgroundColor={'rgba(35,34,100,0.2)'}
                                                        mr={'10px'}
                                                        mt='10px'
                                                    >
                                                        <DefText 
                                                            text={ pageText != "" ? pageText[4] :  "예약"}
                                                            style={[{
                                                                ...fsize.fs12,
                                                                ...fweight.m,
                                                                color:'#232264',
                                                                
                                                            },
                                                            ]}
                                                            lh={ user_lang?.cidx == 9 ? 24 : ''}
                                                        />
                                                    </Box>
                                                }
                                            </HStack>
                                            <DefText 
                                                text={item.name}
                                                lh={ user_lang?.cidx == 9 ? 31 : ''}
                                            />
                                            <HStack
                                                alignItems={'center'}
                                                mt='10px'
                                                mb='5px'
                                            >
                                                <HStack
                                                    alignItems={'center'}
                                                    mr='10px'
                                                >
                                                    <Box 
                                                        style={{
                                                            width:9,
                                                            height:9,
                                                            borderRadius:9,
                                                            backgroundColor: item.consulting ? colorSelect.navy : "#f00",
                                                            marginRight:5,
                                                        }}
                                                    />
                                                    <DefText
                                                        text={item.consulting ?  pageText ? pageText[3] : "진료중" :  pageText ? pageText[11] : "휴진"}
                                                        style={[
                                                            styles.bottmSheetHospitalText,
                                                            !item.consulting && {color:'#f00'}
                                                        ]}
                                                        lh={ user_lang?.cidx == 9 ? 24 : ''}
                                                    />
                                                </HStack>
                                                {
                                                    item.consulting &&
                                                    <Box>
                                                        <DefText 
                                                            text={item.today_stime.substring(0,5) + " ~ " + item.today_etime.substring(0,5)}
                                                            style={[styles.bottmSheetHospitalText]}
                                                        />
                                                    </Box>
                                                }
                                            </HStack>
                                            <HStack 
                                                alignItems={'center'}
                                                flexWrap='wrap'
                                            >
                                                <Box mt='10px'>
                                                    <DefText 
                                                        text={item.meter}
                                                        style={[styles.bottmSheetHospitalText]}
                                                        lh={ user_lang?.cidx == 9 ? 14 : ''}
                                                    />
                                                </Box>
                                                <Box>
                                                    <DefText 
                                                        text={" · "} 
                                                        style={[styles.bottmSheetHospitalText]}
                                                        lh={ user_lang?.cidx == 9 ? 14 : ''}
                                                    />
                                                </Box>
                                                <Box>
                                                    <DefText
                                                        text={item.address1}
                                                        style={[styles.bottmSheetHospitalText]}
                                                        lh={ user_lang?.cidx == 9 ? 24 : ''}
                                                    />
                                                </Box>
                                                {
                                                    item.category != "" &&
                                                    <>
                                                        <Box 
                                                            style={{
                                                                width:1,
                                                                height:10,
                                                                backgroundColor:'#434856',
                                                                marginHorizontal:10
                                                            }}
                                                        />
                                                        <HStack>
                                                            <DefText 
                                                                text={item.category.join(",")}
                                                                style={[styles.bottmSheetHospitalText]}
                                                                lh={ user_lang?.cidx == 9 ? 24 : ''}
                                                            />
                                                        </HStack>
                                                    </>
                                                }
                                                
                                                
                                            </HStack>
                                            {/* <DefText
                                                text={typeof item.keyword}
                                                style={{
                                                    ...fsize.fs12,
                                                    ...fweight.m,
                                                    color:'#434856'
                                                }}
                                            /> */}
                                            {
                                                item.keyword != undefined &&
                                                <HStack flexWrap={'wrap'}>
                                                        {
                                                        item.keyword.map((k, idxs) => {
                                                            return(
                                                                <Box
                                                                    key={idxs}
                                                                    p='5px'
                                                                    borderRadius={5}
                                                                    backgroundColor='#F5F6FA'
                                                                    mr={'10px'}
                                                                    mt='10px'
                                                                >
                                                                    <DefText
                                                                        text={k}
                                                                        style={{
                                                                            ...fsize.fs12,
                                                                            ...fweight.m,
                                                                            color:'#434856'
                                                                        }}
                                                                        lh={ user_lang?.cidx == 9 ? 24 : ''}
                                                                    />
                                                                </Box>
                                                            )
                                                        })
                                                    }
                                                </HStack>
                                            }
                                            
                                        </Box>
                                    </TouchableOpacity>
                                )
                            }
                        }
                        onEndReachedThreshold={0.2}
                        onEndReached={fetchApi}
                        ListEmptyComponent={
                            <Box flex={1} py='60px'>
                                <EmptyPage
                                    emptyText={ pageText != "" ? pageText[12] : "병원목록이 없습니다."}
                                />
                            </Box>
                        }
                    />
                </BottomSheet>
                <BottomSheet
                    ref={bottomSheetModalHospitalRef}
                    index={-1}
                    snapPoints={snapPointsHospital}
                    onChange={handleHospitalChanges}
                    backdropComponent={renderBackdrop}
                >
                    <BottomSheetScrollView>
                        <Box p='20px'>
                            <LabelTitle 
                                text={ pageText != "" ? pageText[8] : "어떤 병원을 찾으시나요?"}
                                txtStyle={{lineHeight:29}}
                                lh={ user_lang?.cidx == 9 ? 31 : ''}
                            />
                            <HStack 
                                flexWrap={'wrap'}
                            >
                                {
                                    hospitalCategoryList.map((item, index) => {
                                        return(
                                            <Box
                                                key={index}
                                            >
                                                <TouchableOpacity
                                                    
                                                    onPress={()=>horizontalCategoryScrollEvent(item.category, index, "Y", item.catcode)}
                                                >
                                                    <Box
                                                        style={[
                                                            styles.bottomCategoryButton,
                                                            selectCategory == item.category && {backgroundColor:'#434856'},
                                                            (index + 1) % 3 != 0 && {marginRight:(deviceSize.deviceWidth - 40) * 0.034}
                                                        ]}
                                                        shadow={5}
                                                    >
                                                    <Image 
                                                        source={{uri:item.icon}}
                                                        style={{
                                                            width:27,
                                                            height:24,
                                                            resizeMode:'contain'
                                                        }}
                                                    />
                                                    <DefText
                                                        text={item.category}
                                                        style={[fsize.fs12, {color:'#434856', marginTop:10, textAlign:'center', lineHeight:17}, selectCategory == item.category && {color:'#fff'}]}
                                                        lh={ user_lang?.cidx == 9 ? 25 : ''}
                                                    />
                                                    </Box>
                                                </TouchableOpacity>
                                            </Box>
                                        )
                                    })
                                }
                            </HStack>
                        </Box>
                    </BottomSheetScrollView>
                </BottomSheet>
                <BottomSheet
                    ref={bottomSheetOrderRef}
                    index={-1}
                    snapPoints={snapPointsOrder}
                    onChange={handleOrderChanges}
                    backdropComponent={renderBackdrop}
                >
                    <Box>
                        {
                            orderlist.map((item, index) => {
                                return(
                                    <TouchableOpacity 
                                        key={index}
                                        style={{
                                            paddingHorizontal:20,
                                            height:45,
                                            justifyContent:"center",
                                            borderTopWidth:1,
                                            borderTopColor:"#dfdfdf"
                                        }}
                                        onPress={()=>selectOrderbyHandler(item.idx)}
                                    >
                                        <DefText 
                                            text={item.orders}
                                            style={[
                                                fsize.fs14,
                                                orderbySelect == item.idx &&
                                                {color:colorSelect.pink_de, ...fweight.bold}
                                            ]}
                                        />
                                    </TouchableOpacity>
                                )
                            })
                        }
                    </Box>
                </BottomSheet>
            </BottomSheetModalProvider>
        </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
    leftButton: {
        width:48,
        height:48,
        borderRadius:8,
        overflow: 'hidden',
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#fff'
    },
    leftButtonText: {
        textAlign:'center',
        ...fsize.fs12,
        ...fweight.bold,
        lineHeight:18
    },
    hospitalCateButtonBox: {
        width: ((deviceSize.deviceWidth - 40) * 0.24) + 15,
        alignItems:'flex-end',
    },
    hospitalCateButton: {
        width: (deviceSize.deviceWidth - 40) * 0.24,
        height: (deviceSize.deviceWidth - 40) * 0.24,
        alignItems:'center',
        justifyContent:'center',
        borderRadius:15,
        backgroundColor:'#fff',
        paddingHorizontal:5
    },
    bottomSheetButton: {
        height:30,
        borderRadius:30,
        paddingHorizontal:10,
        borderWidth:1,
        borderColor:'#B2BBC8',
        justifyContent:'center',
        marginRight:10
    },
    bottomSheetButtonText: {
        color:'#434856',
        ...fsize.fs12,
    },
    bottmSheetHospitalText: {
        ...fsize.fs13,
        color:'#434856',
        lineHeight:17
    },
    bottomCategoryButton: {
        width: (deviceSize.deviceWidth - 40) * 0.31,
        minHeight: 80,
        justifyContent:'center',
        alignItems:'center',
        borderRadius:15,
        backgroundColor:'#fff',
        marginTop:15,
        paddingHorizontal:10,
        paddingVertical:10
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
    })
)(UntactMap);