import React from 'react';
import { Box, HStack } from 'native-base';
import { TouchableOpacity, StyleSheet, Image } from 'react-native'; 
import { DefText } from '../common/BOOTSTRAP';
import { colorSelect, fsize, fweight } from '../common/StyleCommon';

const SubjectWord = (props) => {

    const {navigation, subjectSchData, title, appPage} = props;

    return (
        <Box p='20px'>
            <DefText 
                text={ title != "" ? title : "주제별 검색"}
                style={[styles.label]}
            />
            <Box mt='5px'>
                <HStack flexWrap={'wrap'}>
                    {
                        subjectSchData.map((item, index) => {
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

export default SubjectWord;