import {Box, CheckIcon, HStack} from 'native-base';
import React, {useCallback, useEffect, useState} from 'react';
import {
  ScrollView,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import {nationList} from '../../ArrayData';
import {DefButton, DefText} from '../../common/BOOTSTRAP';
import {colorSelect, fweight} from '../../common/StyleCommon';
import Header from '../../components/Header';
import SearchInput from '../../components/SearchInput';
import Api from '../../Api';
import {connect} from 'react-redux';
import {actionCreators as UserAction} from '../../redux/module/action/UserAction';
import ToastMessage from '../../components/ToastMessage';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const langData = [
  {
    idx: 1,
    lang: '한국어',
  },
  {
    idx: 2,
    lang: '영어',
  },
];

const LanguageSelect = props => {
  const {navigation, languageSet, user_lang, userInfo, route} = props;
  const {params} = route;

  console.log('params', params);

  const [pageText, setPageText] = useState('');

  const pageTextApi = () => {
    Api.send(
      'app_page',
      {cidx: user_lang != null ? user_lang.cidx : 0, code: 'langaugeSelect'},
      args => {
        let resultItem = args.resultItem;
        let arrItems = args.arrItems;

        if (resultItem.result === 'Y' && arrItems) {
          console.log('이벤트 메인 언어 리스트: ', resultItem, arrItems.text);
          setPageText(arrItems.text);
        } else {
          console.log('이벤트 메인 언어 리스트 실패!', resultItem);
        }
      },
    );
  };

  useEffect(() => {
    pageTextApi();
  }, []);

  const languageListApi = () => {
    Api.send('app_country', {}, args => {
      let resultItem = args.resultItem;
      let arrItems = args.arrItems;

      if (resultItem.result === 'Y' && arrItems) {
        //console.log('언어팩 리스트: ', resultItem, arrItems);
        setLangList(arrItems);
      } else {
        console.log('언어팩 리스트 실패!', resultItem);
      }
    });
  };

  useEffect(() => {
    languageListApi();
  }, []);

  const [langList, setLangList] = useState([]);

  //언어 검색
  const [langSearch, setLangSearch] = useState('');
  const langSerachChange = lang => {
    setLangSearch(lang);
  };

  //선택된 언어
  const [selectLang, setSelectLang] = useState('');
  const selectLangEvent = (lang, lang2, idx) => {
    setSelectLang(lang);
    setSelectLang2(lang2);
    setSelectIdx(idx);
  };

  const [selectLang2, setSelectLang2] = useState('');

  const [selectIdx, setSelectIdx] = useState('');

  const renderItems = ({item, index}) => {
    return (
      <TouchableOpacity
        style={[styles.langBox]}
        onPress={() => selectLangEvent(item.name, item.language, item.idx)}>
        <Box borderBottomColor={'#E3E3E3'} borderBottomWidth={1} py="10px">
          <HStack alignItems={'center'}>
            {/* <Box mr='15px'>
                            <Image 
                                source={{uri:item.icon}}
                                style={{
                                    width:26,
                                    height:18,
                                    resizeMode:'contain'
                                }}
                            />
                        </Box> */}
            <DefText
              text={item.flag}
              style={{marginRight: 12, lineHeight: 45}}
            />
            <DefText
              text={item.language}
              style={[fweight.m, {lineHeight: 45}]}
            />
          </HStack>
        </Box>
        {selectLang == item.name && (
          <Box
            width="20px"
            height="20px"
            borderRadius={'40px'}
            overflow="hidden"
            backgroundColor={colorSelect.navy}
            alignItems="center"
            justifyContent="center"
            position={'absolute'}
            top="50%"
            marginTop="-10px"
            right={'20px'}>
            <CheckIcon
              style={{
                width: 12,
                height: 12,
                color: colorSelect.white,
              }}
            />
          </Box>
        )}
      </TouchableOpacity>
    );
  };

  //키 설정
  const keyExtractor = useCallback(item => item.idx.toString(), []);

  const lagnSelectHandler = async selectIdx => {
    const langSelects = await languageSet({cidx: selectIdx});

    console.log(userInfo);

    ToastMessage('언어가 선택되었습니다.');

    //navigation.navigate("Login");
    if (params.back) {
      navigation.navigate('Login');
    } else {
      navigation.goBack();
    }
  };

  const {top} = useSafeAreaInsets();

  return (
    <Box flex={1} backgroundColor="#fff" pt={top + 'px'}>
      <Header headerTitle={pageText != '' ? pageText[0] : '언어선택'} />
      <FlatList
        // ListHeaderComponent={
        //     <Box pt='20px' px='20px' mb='10px'>
        //         <SearchInput
        //             placeholder="각 나라의 언어를 검색해 주세요."
        //             value={langSearch}
        //             onChangeText={langSerachChange}
        //             inputStyle={{paddingLeft:50, backgroundColor:'#F2F3F5', borderWidth:0, lineHeight:20}}
        //             positionMargin={'-24px'}
        //         />
        //     </Box>
        // }
        data={langList}
        renderItem={renderItems}
        keyExtractor={keyExtractor}
      />
      <DefButton
        text={
          selectLang2 != ''
            ? '(' +
              selectLang2 +
              ')' +
              (pageText != '' ? ' ' + pageText[1] : ' 선택')
            : pageText != ''
            ? pageText[1]
            : '선택'
        }
        btnStyle={{
          backgroundColor: selectLang != '' ? colorSelect.pink_de : '#F1F1F1',
          borderRadius: 0,
        }}
        disabled={selectLang != '' ? false : true}
        txtStyle={{color: selectLang != '' ? '#fff' : '#000', lineHeight: 48}}
        onPress={() => lagnSelectHandler(selectIdx)}
      />
    </Box>
  );
};

const styles = StyleSheet.create({
  langBox: {
    paddingHorizontal: 20,
  },
});

export default connect(
  ({User}) => ({
    userInfo: User.userInfo, //회원정보
    user_lang: User.user_lang,
  }),
  dispatch => ({
    member_login: user => dispatch(UserAction.member_login(user)), //로그인
    languageSet: user => dispatch(UserAction.languageSet(user)),
  }),
)(LanguageSelect);
