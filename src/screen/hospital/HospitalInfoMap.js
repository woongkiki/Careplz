import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Box, HStack} from 'native-base';
import {DefButton, DefText, LabelTitle} from '../../common/BOOTSTRAP';
import {WebView} from 'react-native-webview';
import Header from '../../components/Header';
import {BASE_URL} from '../../Utils/APIConstant';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const HospitalInfoMap = props => {
  const {navigation, route} = props;
  const {params} = route;

  //console.log(params);
  const {top} = useSafeAreaInsets();

  return (
    <Box flex={1} backgroundColor="#fff" pt={top + 'px'}>
      <Header
        headerTitle={params.name}
        navigation={navigation}
        backButtonStatus={true}
      />
      <WebView
        originWhitelist={['*']}
        source={{uri: BASE_URL + '/hospitalInfoMap.php?idx=' + params?.idx}}
        // startInLoadingState={true}
        // renderLoading={()=>{
        //     return(
        //         <Loading />
        //     )
        // }}
        style={{
          opacity: 0.99,
          minHeight: 1,
        }}
      />
    </Box>
  );
};

export default HospitalInfoMap;
