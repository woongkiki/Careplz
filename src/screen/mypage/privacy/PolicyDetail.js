import {Box} from 'native-base';
import React, {useEffect, useState} from 'react';
import {ScrollView} from 'react-native';
import Header from '../../../components/Header';
import MenuButton from '../../../components/MenuButton';
import {connect} from 'react-redux';
import {actionCreators as UserAction} from '../../../redux/module/action/UserAction';
import ToastMessage from '../../../components/ToastMessage';
import Api from '../../../Api';
import Loading from '../../../components/Loading';
import RenderHtml from 'react-native-render-html';
import Font from '../../../common/Font';
import StyleHtml from '../../../common/StyleHtml';
import {deviceSize} from '../../../common/StyleCommon';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import BottomNavi from '../../../components/bottom/BottomNavi';

const systemFonts = [...Font.NotoRegular, 'NotoSansKR-Regular'];

const WebRender = React.memo(function WebRender({html}) {
  return (
    <RenderHtml
      source={{html: html}}
      ignoredStyles={['width', 'height', 'margin', 'padding']}
      ignoredTags={['head', 'script', 'src']}
      imagesMaxWidth={deviceSize.deviceWidth - 40}
      contentWidth={deviceSize.deviceWidth}
      tagsStyles={StyleHtml}
      systemFonts={systemFonts}
      ignoredDomTags={['g-popup', 'g-section-with-header', 'g-review-stars']}
    />
  );
});

const PolicyDetail = props => {
  const {navigation, userInfo, user_lang, route} = props;
  const {params, name} = route;

  const {top} = useSafeAreaInsets(0);

  const [loading, setLoading] = useState(true);
  const [policyTitle, setPolicyTitle] = useState('');
  const [policyContent, setPolicyContent] = useState('');

  const policyDetailAPI = async () => {
    await setLoading(true);
    await Api.send(
      'member_agreementDetail',
      {
        idx: params.idx,
        cidx: user_lang != null ? user_lang.cidx : userInfo.cidx,
      },
      args => {
        let resultItem = args.resultItem;
        let arrItems = args.arrItems;

        if (resultItem.result === 'Y' && arrItems) {
          //console.log('약관 상세 불러오기 성공: ', resultItem, arrItems);
          setPolicyTitle(arrItems.title);
          setPolicyContent(arrItems.content);
        } else {
          console.log('약관 상세 불러오기 실패!', resultItem);
        }
      },
    );
    await setLoading(false);
  };

  useEffect(() => {
    policyDetailAPI();
  }, []);

  return (
    <Box flex={1} backgroundColor="#fff" pt={top + 'px'}>
      <Header
        headerTitle={policyTitle != '' ? policyTitle : '약관 및 정책'}
        backButtonStatus={true}
        navigation={navigation}
      />
      {loading ? (
        <Loading />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <Box p="20px">
            {policyContent != '' && <WebRender html={policyContent} />}
          </Box>
        </ScrollView>
      )}
      <BottomNavi screenName={name} navigation={navigation} />
    </Box>
  );
};

export default connect(({User}) => ({
  userInfo: User.userInfo, //회원정보
  user_lang: User.user_lang,
}))(PolicyDetail);
