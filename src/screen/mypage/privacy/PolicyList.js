import {Box} from 'native-base';
import React, {useEffect, useState} from 'react';
import Header from '../../../components/Header';
import MenuButton from '../../../components/MenuButton';
import {connect} from 'react-redux';
import {actionCreators as UserAction} from '../../../redux/module/action/UserAction';
import ToastMessage from '../../../components/ToastMessage';
import Api from '../../../Api';
import Loading from '../../../components/Loading';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import BottomNavi from '../../../components/bottom/BottomNavi';

const PolicyList = props => {
  const {navigation, userInfo, user_lang, route} = props;
  const {name} = route;

  //앱 페이지 로딩
  const [loading, setLoading] = useState(true);

  //앱 페이지 텍스트
  const [pageText, setPageText] = useState([]);

  //약관 목록
  const [policyListData, setPolicyListData] = useState([]);

  const pageLanguage = async () => {
    await setLoading(true);
    //user_lang != null ? user_lang.cidx : userInfo.cidx
    await Api.send(
      'app_page',
      {
        cidx: user_lang != null ? user_lang.cidx : userInfo.cidx,
        code: 'policy',
      },
      args => {
        let resultItem = args.resultItem;
        let arrItems = args.arrItems;

        if (resultItem.result === 'Y' && arrItems) {
          //console.log('약관 및 정책 언어 리스트: ', resultItem, arrItems.text);
          setPageText(arrItems.text);
        } else {
          console.log('약관 및 정책 언어 리스트 실패!', resultItem);
        }
      },
    );
    await Api.send(
      'member_agreementList',
      {cidx: user_lang != null ? user_lang.cidx : userInfo.cidx},
      args => {
        let resultItem = args.resultItem;
        let arrItems = args.arrItems;

        if (resultItem.result === 'Y' && arrItems) {
          //console.log('약관 목록 불러오기 성공: ', resultItem, arrItems);
          setPolicyListData(arrItems);
        } else {
          console.log('약관 목록 불러오기 실패!', resultItem);
        }
      },
    );
    await setLoading(false);
  };

  useEffect(() => {
    pageLanguage();
  }, []);

  const {top} = useSafeAreaInsets();

  return (
    <Box flex={1} backgroundColor="#fff" pt={top + 'px'}>
      <Header
        headerTitle={pageText != '' ? pageText[0] : '약관 및 정책'}
        backButtonStatus={true}
        navigation={navigation}
      />
      {loading ? (
        <Loading />
      ) : (
        <Box px="20px" pb="20px" flex={1}>
          {policyListData != '' &&
            policyListData.map((item, index) => {
              return (
                <MenuButton
                  key={index}
                  btnText={item.title}
                  btnStyle={{
                    borderBottomWidth: 1,
                    borderBottomColor: '#E3E3E3',
                  }}
                  onPress={() =>
                    navigation.navigate('PolicyDetail', {idx: item.idx})
                  }
                  notichk={''}
                />
              );
            })}
        </Box>
      )}
      <BottomNavi screenName={name} navigation={navigation} />
    </Box>
  );
};

export default connect(({User}) => ({
  userInfo: User.userInfo, //회원정보
  user_lang: User.user_lang,
}))(PolicyList);
