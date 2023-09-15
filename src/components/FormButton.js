import { Box, HStack } from 'native-base';
import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { DefButton, DefInput, DefText } from '../common/BOOTSTRAP';
import { colorSelect, deviceSize, fsize, fweight } from '../common/StyleCommon';
import { BASE_URL } from '../Utils/APIConstant';

const FormButton = (props) => {

    const {navigation, text, btnStyle, txtStyle, labelOn, labelHorizontal, labelIcon, labelIconUri, labelIconWidth, labelIconHeight, labelIconResize, label, labelStyle, label2on, label2, label2Style, onPress, btndisabled} = props;

    return (
        <Box>
            {
                labelOn ?
                    labelHorizontal ?
                    <HStack
                        style={[styles.labelTextHorizontalBox]}
                    >
                        {
                            labelIcon &&
                            <Image 
                                source={{uri:labelIconUri}}
                                style={[
                                    {
                                        width:labelIconWidth,
                                        height:labelIconHeight,
                                        resizeMode:labelIconResize,
                                        marginRight: 10,
                                    },
                                ]}
                            />
                        }
                        <DefText 
                            text={label} 
                            style={[styles.labelText, {marginBottom:0}, labelStyle]}
                        />
                        {
                            label2on &&
                            <DefText 
                                text={label2} 
                                style={[styles.labelText2, label2Style]}
                            />
                        }
                    </HStack>
                    :
                    <DefText 
                        text={label} 
                        style={[styles.labelText, labelStyle]}
                    />
                :
                <></>
            }
            <DefButton 
                text={text} 
                btnStyle={[{borderWidth:1, borderColor:'#E1E1E1', alignItems:'flex-start', paddingLeft:15}, btnStyle]}
                txtStyle={[styles.btnText, txtStyle]}
                onPress={onPress}
                disabled={btndisabled}
            />
        </Box>
    );
};

const styles = StyleSheet.create({
    labelText: {
        ...fweight.bold,
        ...fsize.fs15,
        marginBottom:10
    },
    labelTextHorizontalBox: {
        alignItems:'center',
        marginBottom:10
    },
    labelText2: {
        ...fsize.fs12,
        color:'#BEBEBE'
    },
    btnText: {
        color:'#BEBEBE',
        ...fsize.fs15
    }
})

export default FormButton;