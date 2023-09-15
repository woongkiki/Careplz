import { useIsFocused } from '@react-navigation/native';
import { Box, HStack } from 'native-base';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Image, Platform, ScrollView, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { eventCateList, popularEvent, subCategory } from '../../ArrayData';
import { DefText } from '../../common/BOOTSTRAP';
import { colorSelect, deviceSize, fsize, fweight } from '../../common/StyleCommon';
import BoxLine from '../../components/BoxLine';
import EmptyPage from '../../components/EmptyPage';
import EventBox from '../../components/EventBox';
import Header from '../../components/Header';
import { BASE_URL } from '../../Utils/APIConstant';

const EventList = (props) => {

    const {navigation, route} = props;
    const {params} = route;


    const [selectCategory, setSelectCategory] = useState(params.category);
    const [eventCategorys, setEventCategorys] = useState(eventCateList);
    const [selectSubCategory, setSelectSubCategory] = useState("");
    const [eventSubCategorys, setEventSubCategorys] = useState(subCategory);

    const [contentList, setContentList] = useState(popularEvent);

    const [categoryShow, setCategoryShow] = useState(false);

    const [wishEvent, setWishEvent] = useState([]);

    const wishEventAdd = (wish) => {
        if(!wishEvent.includes(wish)){
            setWishEvent([...wishEvent, wish]);
        }else{
            const wishRemove = wishEvent.filter(item => wish !== item);
            setWishEvent(wishRemove);
        }
    }

    const scrollRef = useRef(null);

    const buttonRef = useRef();

    const selectCategoryEvent = (category, index) => {
        
        setSelectCategory(category);

        if(index != 0){
            setIndexNumber(index);
        }

        
    }

    

     const [indexNumber, setIndexNumber] = useState(0);

     useEffect(() => {
        if(params != ""){
            let fromIndex = eventCategorys.indexOf(params);
            
            if(fromIndex != ""){
                setIndexNumber(fromIndex);
            }
        }
    }, [params])

    // useEffect(() => {

    //     scrollRef.current?.scrollToIndex({
    //         index:indexNumber,
    //         animated:false
    //     })

    // }, [indexNumber]);

    

    const keyExtractor = useCallback((item) => item.idx.toString(), [])

    return (
        <Box flex={1} backgroundColor='#fff'>
            <Header 
                headerTitle={ selectCategory != "" && selectCategory}
                backButtonStatus={true}
                navigation={navigation}
                rightButton={
                    <HStack>
                        <TouchableOpacity
                            style={{
                                marginRight:10
                            }}
                        >
                            <Image 
                                source={{uri:BASE_URL + "/images/searchIconBlack.png"}}
                                style={{
                                    width:15,
                                    height:15,
                                    resizeMode:'contain'
                                }}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Image 
                                source={{uri:BASE_URL + "/images/bookmarkIconBlacks.png"}}
                                style={{
                                    width:24,
                                    height: 15,
                                    resizeMode:'contain'
                                }}
                            />
                        </TouchableOpacity>
                    </HStack>
                }
            />
            
                <Box >
                    <BoxLine />
                </Box>
                <Box borderBottomWidth={1} borderBottomColor='#D2DCE8'>
                    <FlatList 
                        ref={scrollRef}
                        initialScrollIndex={indexNumber}
                        horizontal={false}
                        showsVerticalScrollIndicator={false}
                        data={eventCategorys}
                        contentContainerStyle={{paddingLeft:20, paddingRight:20, paddingBottom:60}}
                        renderItem={
                            ({item, index}) => {
                                return(
                                    <TouchableOpacity
                                        style={[
                                            styles.categoryButton,
                                            
                                            item.category == selectCategory &&
                                            {borderBottomWidth:4, borderBottomColor:colorSelect.pink_de}
                                        ]}
                                        onPress={()=>selectCategoryEvent(item.category, index)}
                                    >
                                        <DefText 
                                            text={item.category}
                                            style={[
                                                {color:'#B2BBC8', lineHeight:55}, 
                                                item.category == selectCategory &&
                                                [{color:colorSelect.pink_de}, fweight.bold],
                                            ]}
                                            
                                        />
                                    </TouchableOpacity>
                                )
                            }
                        }
                        keyExtractor={keyExtractor}
                        onScrollToIndexFailed={(e) => {
                            console.log("scrollFailed", e);
                            scrollRef.current?.scrollToOffset({offset:e.averageItemLength * e.index, animate:false});
                            setTimeout(() => {
                                if(eventCategorys.length !== 0 && scrollRef != null){
                                    scrollRef.current?.scrollToIndex({
                                        index:e.index,
                                        animated:false
                                    })
                                }
                            }, 10)
                        }}
                    />
                    <Box
                        position={'absolute'}
                        right={'0px'}
                        top='0'
                        
                        backgroundColor={'#fff'}
                        height='55px'
                        alignItems={'center'}
                        justifyContent='center'
                        width='40px'
                    >
                        <TouchableOpacity
                            onPress={()=>setCategoryShow(!categoryShow)}
                        >
                            <Image 
                                source={
                                    categoryShow ?
                                    require("../../images/arrUp.png")
                                    :
                                    require("../../images/arrDown.png")
                                }
                                style={{
                                    width:14,
                                    height: 8,
                                    resizeMode:'stretch'
                                }}
                            />
                        </TouchableOpacity>
                    </Box>
                </Box>
                
                <Box px='20px'>
                {
                    contentList != "" ?
                    contentList.map((item, index) => {
                        return(
                            <EventBox 
                                key={index}
                                mt={ index != 0 ? 40 : 30} 
                                uri={item.uri}
                                eventName={ item.eventName }
                                hospital={item.hospital}
                                score={item.score}
                                good={item.good}
                                percent={item.eventPercent}
                                orPrice={item.eventOrPrice}
                                price={item.eventPrice}
                                values={item.value}
                                bookmarkonPress={() => wishEventAdd(index)}
                                bookmarData={wishEvent.includes(index)}
                                eventInfoMove={()=>navigation.navigate("EventInfo", item)}
                            />
                        )
                    })
                    :
                    <EmptyPage
                        emptyText={"등록된 이벤트가 없습니다."}
                    />
                }
                </Box>
            
            {
                categoryShow &&
                <Box
                    flex={1}
                    backgroundColor='#fff'
                    position={'absolute'}
                    bottom={0}
                    
                    width={deviceSize.deviceWidth}
                    height={ Platform.OS === 'android' ? deviceSize.deviceHeight - 192 : deviceSize.deviceHeight - 249}
                >
                    <ScrollView>
                        <HStack
                            flexWrap={'wrap'}
                            px={'20px'}
                            pb='20px'
                            pt='10px'
                        >
                        {
                            eventCategorys.map((item, index) => {
                                return(
                                    <TouchableOpacity
                                        key={index}
                                        style={[
                                            styles.categoryAllButton,
                                            (index + 1) % 3 === 0 ?
                                            {marginRight:0} : {marginRight:(deviceSize.deviceWidth - 40) * 0.02},
                                            selectCategory == item.category &&
                                            {backgroundColor:'#D2D2DF', borderColor:colorSelect.navy}
                                        ]}
                                        onPress={()=>setSelectCategory(item.category)}
                                    >
                                        <Image 
                                            source={{uri:item.uri}}
                                            style={{
                                                width:52,
                                                height:40,
                                                resizeMode:'contain'
                                            }}
                                        />
                                        <DefText
                                            text={item.category}
                                            style={[styles.categoryAllButtonText]}
                                        />
                                    </TouchableOpacity>
                                )
                            })
                        }
                        </HStack>
                    </ScrollView>
                </Box>
            }
            
        </Box>
    );
};

const styles = StyleSheet.create({
    categoryButton: {
        height: 55,
        justifyContent:'center'
    },
    orderText: {
        ...fsize.fs13,
        ...fweight.bold,
        marginRight:10,
        lineHeight:19
    },
    categoryAllButton: {
        width:(deviceSize.deviceWidth - 40) * 0.32,
        height: (deviceSize.deviceWidth - 40) * 0.32,
        borderRadius:15,
        borderWidth:1,
        borderColor:'#D2DBE6',
        justifyContent:'center',
        alignItems:'center',
        marginTop:(deviceSize.deviceWidth - 40) * 0.02
    },
    categoryAllButtonText: {
        ...fsize.fs13,
        ...fweight.m,
        marginTop:10
    }
})

export default EventList;