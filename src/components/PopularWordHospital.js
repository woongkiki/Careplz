import React from 'react';
import { Box, HStack } from 'native-base';
import { TouchableOpacity, StyleSheet } from 'react-native'; 
import { DefText } from '../common/BOOTSTRAP';
import { colorSelect, fsize, fweight } from '../common/StyleCommon';

const PopularWordHospital = (props) => {

    const {navigation, rankSchData, setSchText, title, appPage} = props;

    const schHospital = (keyword) => {

        setSchText(keyword);
        navigation.navigate("HospitalMap", {"schText":keyword});

    }

    return (
        <Box p='20px'>
            <Box>
                <DefText 
                    text={ title != "" ? title : "인기 검색어"}
                    style={[styles.label]}
                />
            </Box>
            <Box>
                 {
                    rankSchData != "" &&
                    <HStack flexWrap={'wrap'}>
                        {
                            rankSchData.map((item, index) => {
                                return(
                                    <TouchableOpacity
                                        style={[styles.recentButton]}
                                        key={index}
                                        onPress={
                                            appPage == "Untact" ?
                                            ()=>navigation.navigate("UntactMap", {"schText":item.keyword})
                                            :
                                            ()=>navigation.navigate("HospitalMap", {"schText":item.keyword})
                                        }
                                    >
                                        <DefText 
                                            text={item.keyword}
                                            style={[
                                                fsize.fs14,
                                                {lineHeight:20}
                                            ]}
                                        />
                                    </TouchableOpacity>
                                )
                            })
                        }
                    </HStack>
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

export default PopularWordHospital;