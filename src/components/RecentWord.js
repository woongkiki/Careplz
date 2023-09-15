import { Box, HStack } from 'native-base';
import React from 'react';
import { StyleSheet, TouchableOpacity, Image } from 'react-native';
import { DefText } from '../common/BOOTSTRAP';
import { fsize, fweight } from '../common/StyleCommon';

const RecentWord = (props) => {

    const {navigation, recentSchData, setDelIdx, allRecentRemove, titles, allDeleteText} = props;


    const removeRecent = (item) => {
        setDelIdx(item);
    }

    return (
        <Box>
            <HStack alignItems={'center'} justifyContent='space-between'>
                <DefText 
                    text={titles}
                    style={[styles.label]}
                />
                <TouchableOpacity
                    onPress={allRecentRemove}
                >
                    <DefText 
                        text={allDeleteText}
                        style={[fsize.fs12, {color:'#808080'}]}
                    />
                </TouchableOpacity>
            </HStack>
            <Box mt='10px'>
                <HStack flexWrap={'wrap'}>
                    {
                        recentSchData.map((item, index) => {
                            return(
                                <TouchableOpacity
                                    style={[styles.recentButton]}
                                    key={index}
                                    onPress={()=>navigation.navigate("SearchResult", {"schText":item})}
                                >
                                    <HStack
                                        alignItems={'center'}
                                    >
                                        <DefText 
                                            text={item}
                                            style={[
                                                fsize.fs14,
                                                {lineHeight:20, marginRight:10}
                                            ]}
                                        />
                                        <TouchableOpacity
                                            onPress={()=>removeRecent(item)}
                                        >
                                            <Image 
                                                source={require("../images/schRemoveIcon.png")}
                                                style={{
                                                    width:12,
                                                    height:12,
                                                    resizeMode:'contain'
                                                }}
                                            />
                                        </TouchableOpacity>
                                    </HStack>
                                </TouchableOpacity>
                            )
                        })
                    }
                </HStack>
            </Box>
        </Box>
    );
};

const styles = StyleSheet.create(({
    label: {
        ...fsize.fs14,
        ...fweight.bold,
        color:'#000000'
    },
    recentButton: {
        paddingHorizontal:15,
        paddingVertical:10,
        borderRadius:15,
        overflow: 'hidden',
        backgroundColor:'#E9ECEF',
        marginRight:10,
        marginTop:10
    },
}))

export default RecentWord;