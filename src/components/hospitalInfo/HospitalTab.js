import { Box, HStack } from 'native-base';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { DefText } from '../../common/BOOTSTRAP';
import { textLengthOverCut } from '../../common/DataFunction';
import { colorSelect, deviceSize, fsize, fweight } from '../../common/StyleCommon';

const tabHeight = 50;

const HospitalTab = (props) => {

    const {onPress1, onPress2, onPress3, tabCategory, tabName1, tabName2, tabName3, user_lang} = props;

    return (
        <HStack
            borderBottomWidth={1}
            borderBottomColor='#D2DCE8'
        >
            <TouchableOpacity
                onPress={onPress1}
                style={[styles.tabButton]}
            >
                <HStack
                    height={tabHeight + 'px'}
                    alignItems={'center'}
                    borderBottomWidth={4}
                    borderBottomColor={ tabCategory == "병원정보" ? colorSelect.pink_de : colorSelect.white }
                >
                    <DefText 
                        text={ tabName1 ? textLengthOverCut(tabName1, 15, '') : "병원정보"}
                        style={[
                            styles.tabButtonText,
                            tabCategory == "병원정보" && {color:colorSelect.pink_de, ...fweight.bold}
                        ]}
                    />
                </HStack>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={onPress2}
                style={[styles.tabButton]}
                
            >
                <HStack
                    height={tabHeight + 'px'}
                    alignItems={'center'}
                    borderBottomWidth={4}
                    borderBottomColor={ tabCategory == "진료정보" ? colorSelect.pink_de : colorSelect.white }
                >
                    <DefText 
                        text={ tabName2 ? textLengthOverCut(tabName2, 15, '') : "진료정보"}
                        style={[
                            styles.tabButtonText,
                            tabCategory == "진료정보" && {color:colorSelect.pink_de, ...fweight.bold}
                        ]}
                    />
                </HStack>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={onPress3}
                style={[styles.tabButton]}
            >
                <HStack
                    height={tabHeight + 'px'}
                    alignItems={'center'}
                    borderBottomWidth={4}
                    borderBottomColor={ tabCategory == "리뷰" ? colorSelect.pink_de : colorSelect.white }
                >
                    <DefText 
                        text={ tabName3 ? textLengthOverCut(tabName3, 15, '') : "리뷰"}
                        style={[
                            styles.tabButtonText,
                            tabCategory == "리뷰" && {color:colorSelect.pink_de, ...fweight.bold}
                        ]}
                    />
                </HStack>
            </TouchableOpacity>
        </HStack>
    );
};

const styles = StyleSheet.create({
    tabButton: {
        width:deviceSize.deviceWidth / 3,
        height:tabHeight,
        alignItems:'center',
        justifyContent:'center'
    },
    tabButtonText: {
        ...fsize.fs14,
        color:'#191919',
        lineHeight:tabHeight
    },
})

export default HospitalTab;