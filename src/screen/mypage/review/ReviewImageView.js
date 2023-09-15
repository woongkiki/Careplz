import { Box } from 'native-base';
import React, { useEffect, useState } from 'react';
import Loading from '../../../components/Loading';
import { DefText } from '../../../common/BOOTSTRAP';
import { colorSelect } from '../../../common/StyleCommon';
import { Image, TouchableOpacity } from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import { BASE_URL } from '../../../Utils/APIConstant';

const ReviewImageView = (props) => {

    const { navigation, route } = props;
    const { params } = route;

    console.log(params);

    const [loading, setLoading] = useState(true);
    const [images, setImages] = useState([]);

    const loadingApi = async () => {
        await setLoading(true);

        let newArr = [];
        let imageData = {'url' : params?.url };
        newArr.push(imageData);
        await setImages(newArr);
        //await setImages([params.uri]);
        await setLoading(false);
    }

    useEffect(() => {
        loadingApi();
    }, [])

    return (
        <Box flex={1} backgroundColor={'#000'}>
            {
                loading ?
                <Loading />
                :
                <Box flex={1}>
                    <Box position={'absolute'} top='35px' left='25px' zIndex={99}>
                        <TouchableOpacity onPress={()=>navigation.goBack()}>
                           <Image 
                                source={{uri:BASE_URL + "/images/backWhite.png"}}
                                style={{
                                    width:32,
                                    height:20,
                                    resizeMode:'contain'
                                }}
                           />
                        </TouchableOpacity>
                    </Box>
                    <ImageViewer 
                        imageUrls={images}
                    />
                </Box>
            }
        </Box>
    );
};

export default ReviewImageView;