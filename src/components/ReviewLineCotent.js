import React from 'react';
import {HStack, Box} from 'native-base';
import { DefText } from '../common/BOOTSTRAP';
import { colorSelect, fsize, fweight } from '../common/StyleCommon';

const ReviewLineCotent = (props) => {

    const {navigation, reviewTitle, reviewPercent, reviewCnt, lineStyle} = props;

    return (
        <HStack
            alignItems={'center'}
            flexWrap='wrap'
            style={[
                lineStyle
            ]}
        >
            <Box
                width='40%'
                alignItems='center'
                
            >
                <Box width='68%' >
                    <DefText 
                        text={reviewTitle}
                        style={{
                            color:'#191919',
                            ...fsize.fs12,
                            ...fweight.bold
                        }}
                    />
                </Box>
            </Box>
            <Box
                width={'40%'}
                backgroundColor='#D2D2DF'
                height='7px'
                borderRadius={4}
            >
                <Box 
                    position={'absolute'}
                    left={0}
                    top={0}
                    backgroundColor={colorSelect.navy}
                    height='7px'
                    width={reviewPercent}
                    borderRadius={4}
                />
            </Box>
            <Box
                width='20%'
                alignItems='center'
            >
                <DefText 
                    text={reviewCnt} 
                    style={{
                        color:'#191919',
                        ...fsize.fs12,
                        ...fweight.bold
                    }}
                />
            </Box>
        </HStack>
    );
};

export default ReviewLineCotent;