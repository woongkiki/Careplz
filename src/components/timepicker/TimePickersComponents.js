import {Box, HStack, Modal} from 'native-base';
import React, {useState, useEffect, useMemo} from 'react';
import {TouchableOpacity, Image, StyleSheet} from 'react-native';
import {reservationTime} from '../../ArrayData';
import {DefText} from '../../common/BOOTSTRAP';
import {
  colorSelect,
  deviceSize,
  fsize,
  fweight,
} from '../../common/StyleCommon';
import {BASE_URL} from '../../Utils/APIConstant';
import ToastMessage from '../ToastMessage';
import {connect} from 'react-redux';
import {actionCreators as UserAction} from '../../redux/module/action/UserAction';
import Api from '../../Api';

const TimePickersComponents = props => {
  const {
    navigation,
    timeOnpress,
    setSelectTimes,
    timeLists,
    selectDate,
    selectTime,
    timeTextTitle,
    timeNoText,
    user_lang,
    userInfo,
  } = props;

  console.log('timeLists', timeLists);

  //시간 데이터
  const [timeTable, setTimeTable] = useState([]);
  //const [selectTime, setSelectTime] = useState([]);

  const [pageText, setPageText] = useState('');

  const pageApi = () => {
    Api.send(
      'app_page',
      {
        cidx: user_lang != null ? user_lang?.cidx : userInfo?.cidx,
        code: 'commonPage',
      },
      args => {
        let resultItem = args.resultItem;
        let arrItems = args.arrItems;

        if (resultItem.result === 'Y' && arrItems) {
          console.log('공통 언어 리스트: ', resultItem, arrItems);
          setPageText(arrItems.text);

          //setSingoDataList([arrItems.text[26], arrItems.text[27], arrItems.text[28], arrItems.text[29]])
        } else {
          console.log('공통 언어 실패!', resultItem);
        }
      },
    );
  };

  useEffect(() => {
    pageApi();
  }, []);

  const seletTimeHandler = items => {
    console.log('items', items.time);
    //console.log("date", date);

    if (!selectTime.includes(items.time)) {
      if (selectTime.length == 1) {
        ToastMessage(
          pageText != '' ? pageText[6] : '시간은 1개까지 선택 가능합니다.',
        );
        return false;
      }

      //setSelectTime([...selectTime, items]);
      setSelectTimes([...selectTime, items.time]);
    } else {
      const timeRemove = selectTime.filter(item => items.time != item);
      setSelectTimes(timeRemove);
      //setSelectTimes(timeRemove);
    }
  };

  //  useEffect(() => {
  //     if(selectTime != ""){
  //         console.log("selectTime", selectTime);
  //     }
  //  }, [selectTime])

  return (
    <Box>
      <HStack
        alignItems={'center'}
        pt="20px"
        pb="20px"
        borderBottomWidth={1}
        borderBottomColor="#757575">
        <Image
          source={{uri: BASE_URL + '/images/timeIcons.png'}}
          style={{
            width: 20,
            height: 20,
            resizeMode: 'stretch',
            marginRight: 10,
          }}
        />
        <DefText
          text={timeTextTitle}
          style={[fweight.bold, {lineHeight: 21}]}
        />
      </HStack>
      <Box pt="10px" pb="20px">
        {timeLists != '' ? (
          <HStack flexWrap={'wrap'}>
            {timeLists.map((item, index) => {
              return (
                <TouchableOpacity
                  disabled={!item.status}
                  key={index}
                  style={[
                    styles.timeButton,
                    (index + 1) % 3 != 0 && {
                      marginRight: (deviceSize.deviceWidth - 40) * 0.02,
                    },
                    selectTime.includes(item.time) && {
                      backgroundColor: colorSelect.pink_de,
                      borderColor: colorSelect.pink_de,
                    },
                    !item.status && {backgroundColor: '#F2F3F5'},
                  ]}
                  onPress={() => seletTimeHandler(item)}>
                  {/* {selectTime.includes(item) && (
                    <Box
                      width="20px"
                      height="20px"
                      borderWidth={2}
                      justifyContent="center"
                      alignItems={'center'}
                      borderRadius="20px"
                      borderColor={'#fff'}
                      position="absolute"
                      top="50%"
                      left="8px"
                      marginTop="-10px">
                      <DefText
                        text={selectTime.indexOf(item) + 1}
                        style={[fsize.fs12, {color: colorSelect.white}]}
                      />
                    </Box>
                  )} */}

                  <DefText
                    text={item.time.split(' ')[1]}
                    style={[
                      styles.timeButtonText,
                      selectTime.includes(item.time) && {
                        color: colorSelect.white,
                      },
                    ]}
                  />
                  {!item.status && (
                    <Image
                      source={{uri: BASE_URL + '/newImg/disable_time_icon.png'}}
                      style={{
                        width: '100%',
                        height: '100%',
                        resizeMode: 'stretch',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                      }}
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </HStack>
        ) : (
          <Box py="40px" alignItems={'center'}>
            <DefText
              text={timeNoText}
              style={{
                color: '#666',
              }}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
};

const styles = StyleSheet.create({
  timeButton: {
    width: (deviceSize.deviceWidth - 40) * 0.32,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#73788B',
    borderRadius: 5,
    marginTop: (deviceSize.deviceWidth - 40) * 0.02,
  },
  timeButtonText: {
    ...fsize.fs15,
    lineHeight: 20,
    color: '#73788B',
  },
});

export default connect(
  ({User}) => ({
    userInfo: User.userInfo, //회원정보
    user_lang: User.user_lang,
  }),
  dispatch => ({
    member_login: user => dispatch(UserAction.member_login(user)), //로그인
    languageSet: user => dispatch(UserAction.languageSet(user)), //선택언어
  }),
)(TimePickersComponents);
