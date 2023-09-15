import React from 'react';
import {Box} from 'native-base';
import { deviceSize } from '../../common/StyleCommon';
import { Platform, ScrollView, StyleSheet } from 'react-native';
import { DefText } from '../../common/BOOTSTRAP';

const CARD_WIDTH = deviceSize.deviceWidth * 0.24;
const CARD_HEIGHT = deviceSize.deviceWidth * 0.24;

const SPACING_FOR_CARD_INSET = 20;

const cards = [
    {"name":"Card1"},
    {"name":"Card2"},
    {"name":"Card3"},
    {"name":"Card4"},
    {"name":"Card5"},
    {"name":"Card5"},
    {"name":"Card5"},
    {"name":"Card5"},
    {"name":"Card5"},
]

const HospitalMap2 = (props) => {



    return (
        <Box >
            <ScrollView
                horizontal
                pagingEnabled
                decelerationRate={0}
                snapToInterval={CARD_WIDTH + 15}
                snapToAlignment={ Platform.OS === 'ios' ? 'center' : 'start'}
                showsHorizontalScrollIndicator={false}
                contentInset={{
                    left:SPACING_FOR_CARD_INSET,
                    top:0,
                    bottom:0,
                    right:SPACING_FOR_CARD_INSET
                }}
                contentContainerStyle={{
                    paddingHorizontal: Platform.OS === 'android' ? SPACING_FOR_CARD_INSET : 0
                }}
            >
                {
                    cards.map((item, index) => {
                        return(
                            <Box
                                key={index}
                                style={[
                                    styles.cardStyle,
                                    (index + 1) == cards.length && {width:CARD_WIDTH}
                                ]}
                            >
                                <Box
                                    style={[
                                        styles.cardStyleInner,
                                       
                                    ]}
                                >
                                    <DefText text={item.name} />
                                </Box>
                            </Box>
                        )
                    })
                }
            </ScrollView>
        </Box>
    );
};

const styles = StyleSheet.create({
    cardStyle: {
        width: CARD_WIDTH + 15,
        height: CARD_HEIGHT,
    },
    cardStyleInner: {
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        backgroundColor:'green',
        justifyContent:'center',
        alignItems:'center',
        borderRadius: 15
    }
})

export default HospitalMap2;