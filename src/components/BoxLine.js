import { Box } from 'native-base';
import React from 'react';
import { StyleSheet } from 'react-native';

const BoxLine = () => {
    return (
        <Box style={[styles.barLine]} />
    );
};

const styles = StyleSheet.create({
    barLine: {
        borderTopWidth:1,
        borderTopColor:'#D2DCE8',
        height:6,
        backgroundColor:'#F1F4F9'
    },
})

export default BoxLine;