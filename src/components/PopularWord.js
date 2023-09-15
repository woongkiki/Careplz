import React from 'react';
import { Box, HStack } from 'native-base';
import { TouchableOpacity, StyleSheet } from 'react-native'; 
import { DefText } from '../common/BOOTSTRAP';
import { colorSelect, fsize, fweight } from '../common/StyleCommon';

const PopularWord = (props) => {

    const {navigation, rankSchData, titles} = props;

    

    return (
        <Box p='20px'>
            <Box>
                <DefText 
                    text={titles}
                    style={[styles.label]}
                />
            </Box>
            <Box>
                {
                    rankSchData != "" &&
                    rankSchData.map((item, index) => {
                        return(
                            <TouchableOpacity
                                style={[styles.popularButton]}
                                key={index}
                                onPress={()=>navigation.navigate("SearchResult", {"schText":item.keyword})}
                            >
                                <HStack alignItems={'center'}>
                                    <DefText 
                                        text={item.prior}
                                        style={[fweight.bold, {color:colorSelect.pink_de, marginRight:20}]}
                                    />
                                    <DefText 
                                        text={item.keyword}
                                    />
                                </HStack>
                            </TouchableOpacity>
                        )
                    })
                }
            </Box>
        </Box>
    );
};

const styles = StyleSheet.create({
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
    popularButton: {
        paddingVertical:20,
        borderBottomWidth:1,
        borderBottomColor:'#E3E3E3'
    }
})

export default PopularWord;