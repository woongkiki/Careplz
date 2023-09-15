import React from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import UserApi from '../api/UserApi';
export const MEBMER_LOGIN = 'user/MEBMER_LOGIN';
export const MEMBER_COMMENT = 'user/MEMBER_COMMENT';
export const MEMBER_INFO = 'user/MEMBER_INFO';
export const MEMBER_OTHER_INFO = 'user/MEMBER_OTHER_INFO';
export const MEMBER_JOIN = 'user/MEMBER_JOIN';
export const WISH_LIST = 'user/WISH_LIST';
export const WISH_LIST_FLEX = 'user/WISH_LIST_FLEX';
export const MEMBER_PUSH_LIST = 'user/MEMBER_PUSH_LIST';
export const MEMBER_KEYWORD_LIST = 'user/MEMBER_KEYWORD_LIST';
export const MEMBER_LOGOUT = 'user/MEMBER_LOGOUT';
export const MEMBER_CHAT_CNT = 'user/MEMBER_CHAT_CNT';
export const LANGUAGE_SET = 'user/LANGUAGE_SET';
export const APP_POSITION = 'user/APP_POSITION';
export const NOTI_CHK = 'user/NOTI_CHK';

export const actionCreators = {
  //언어셋
  languageSet: user => async dispatch => {
    try {
      const response = await UserApi.languageSet(user);

      console.log('언어셋', response);

      if (response != '') {
        await dispatch({
          type: LANGUAGE_SET,
          payload: response,
        });

        AsyncStorage.setItem('language', response.cidx);

        return {state: true, result: response, msg: '언어셋'};
      } else {
        await dispatch({
          type: LANGUAGE_SET,
          payload: null,
        });
        return {state: false, msg: '언어셋을 선택하세요.'};
      }
    } catch (error) {
      return {state: false, msg: ''};
    }
  },
  app_positions: user => async dispatch => {
    try {
      const response = await UserApi.app_positions(user);

      console.log('좌표', response);

      if (response != '') {
        await dispatch({
          type: APP_POSITION,
          payload: response,
        });

        return {state: true, result: response, msg: '현재 위치 좌표'};
      } else {
        await dispatch({
          type: APP_POSITION,
          payload: null,
        });
        return {state: false, msg: '현재 위치 좌표 실패'};
      }
    } catch (error) {
      return {state: false, msg: ''};
    }
  },
  //회원 예약체크
  notichk: user => async dispatch => {
    try {
      const response = await UserApi.notichk(user);

      //console.log("회원 예약 체크", response);

      if (response != '') {
        await dispatch({
          type: NOTI_CHK,
          payload: response,
        });

        return {state: true, result: response, msg: '회원 예약 체크'};
      } else {
        await dispatch({
          type: NOTI_CHK,
          payload: null,
        });
        return {state: false, msg: '회원 예약 체크 실패'};
      }
    } catch (error) {
      return {state: false, msg: ''};
    }
  },
  //회원 로그인
  member_login: user => async dispatch => {
    try {
      const response = await UserApi.member_login(user);

      //console.log('member login userAction response:::::', response);

      if (response.result) {
        await dispatch({
          type: MEBMER_LOGIN,
          payload: response.data,
        });

        AsyncStorage.setItem('id', response.data.id);

        return {
          state: true,
          result: response.data,
          msg: response.msg,
          //pwds : response.data.mb_password
        };
      } else {
        await dispatch({
          type: MEBMER_LOGIN,
          payload: null,
        });
        return {state: false, msg: response.msg, ids: ''};
      }
    } catch (error) {
      return {state: false, msg: error, ids: ''};
    }
  },
  member_comment: user => async dispatch => {
    try {
      const response = await UserApi.member_comment(user);
      // console.log('member_login ::: ', response);

      if (response.result) {
        await dispatch({
          type: MEMBER_COMMENT,
          payload: response.data,
        });

        return {state: true, msg: response.msg};
      } else {
        await dispatch({
          type: MEMBER_COMMENT,
          payload: null,
        });
        return {state: false, msg: response.msg, ids: ''};
      }
    } catch (error) {
      return {state: false, msg: '', id: ''};
    }
  },
  //회원 정보확인
  member_info: user => async dispatch => {
    try {
      const response = await UserApi.member_info(user);

      if (response.result) {
        await dispatch({
          type: MEBMER_LOGIN,
          payload: response.data,
        });
        return {state: true, result: response.data, msg: response.msg};
      } else {
        await dispatch({
          type: MEBMER_LOGIN,
          payload: null,
        });
        return {state: false, msg: response.msg, result: response.data};
      }
    } catch (error) {
      return {state: false, msg: '', nick: ''};
    }
  },
  //다른 회원 정보확인
  member_other_info: user => async dispatch => {
    try {
      const response = await UserApi.member_profile(user);

      if (response.result) {
        await dispatch({
          type: MEMBER_OTHER_INFO,
          payload: response.data,
        });
        return {state: true, nick: response.data.nick};
      } else {
        await dispatch({
          type: MEMBER_OTHER_INFO,
          payload: null,
        });
        return {state: false, msg: response.msg, nick: ''};
      }
    } catch (error) {
      return {state: false, msg: '', nick: ''};
    }
  },
  //회원가입
  member_join: user => async dispatch => {
    try {
      const response = await UserApi.member_join(user);

      if (response.result) {
        await dispatch({
          type: MEMBER_JOIN,
          payload: response.data,
        });
        return {state: true, msg: response.msg};
      } else {
        await dispatch({
          type: MEMBER_JOIN,
          payload: null,
        });
        return {state: false, msg: response.msg};
      }
    } catch (error) {
      return {state: false, msg: response.msg, nick: ''};
    }
  },

  //관심 목록 리스트
  wish_set: (data, count) => async dispatch => {
    try {
      const response = await UserApi.market_list(data);
      if (response.result) {
        await dispatch({
          type: MARKET_UESR_LIST,
          payload: response.data,
          count: count,
        });

        return {state: true};
      } else {
        return {state: false, msg: response.msg};
      }
    } catch (error) {
      return {state: false, msg: ''};
    }
  },

  //관심목록 리스트
  wish_list: (data, count, type) => async dispatch => {
    try {
      const response = await UserApi.wish_list(data);

      if (response.result) {
        await dispatch({
          type: type === 1 ? WISH_LIST : WISH_LIST_FLEX,
          payload: response.data,
          count: count,
        });
        return {state: true};
      } else {
        return {state: false, msg: response.msg};
      }
    } catch (error) {
      return {state: false, msg: ''};
    }
  },
  //회원 정보 변경
  member_update: user => async dispatch => {
    try {
      const response = await UserApi.member_update(user);

      return response;
    } catch (error) {
      return {result: false};
    }
  },
  //푸시정보 리스트
  member_push_list: data => async dispatch => {
    try {
      const response = await UserApi.member_push(data);

      if (response.result) {
        await dispatch({
          type: MEMBER_PUSH_LIST,
          payload: response.data,
        });

        return {state: true};
      } else {
        return {state: false, msg: response.msg};
      }
    } catch (error) {
      return {state: false, msg: ''};
    }
  },
  //푸시 업데이트
  member_push_update: data => async dispatch => {
    try {
      const response = await UserApi.member_push(data);

      if (response.result) {
        await dispatch({
          type: MEMBER_PUSH_LIST,
          payload: response.data,
        });

        return {state: true};
      } else {
        return {state: false, msg: response.msg};
      }
    } catch (error) {
      return {state: false, msg: ''};
    }
  },
  //키워드 정보 조회 key(list)
  member_keyword: data => async dispatch => {
    try {
      const response = await UserApi.member_keyword(data);

      if (response.result) {
        await dispatch({
          type: MEMBER_KEYWORD_LIST,
          payload: response.data,
        });

        return {state: true};
      } else {
        return {state: false, msg: response.msg};
      }
    } catch (error) {
      return {state: false, msg: ''};
    }
  },
  //로그아웃
  member_logout: data => async dispatch => {
    try {
      const response = await UserApi.member_logout(data);

      if (response) {
        //AsyncStorage.removeItem('language');
        AsyncStorage.removeItem('id');
      }

      await dispatch({
        type: MEMBER_LOGOUT,
      });
      return response;
    } catch (error) {
      return {state: false, msg: ''};
    }
  },
  //탈퇴하기
  member_out: data => async dispatch => {
    try {
      const response = await UserApi.member_out(data);

      AsyncStorage.removeItem('id');

      await dispatch({
        type: MEMBER_LOGOUT,
      });
      return response;
    } catch (error) {
      return {state: false, msg: ''};
    }
  },
  //채팅
  member_chatCnt: user => async dispatch => {
    try {
      const response = await UserApi.member_chatCnt(user);

      if (response.result) {
        await dispatch({
          type: MEMBER_CHAT_CNT,
          payload: response.data,
        });
        return {state: true, result: response.data, msg: response.msg};
      } else {
        await dispatch({
          type: MEMBER_CHAT_CNT,
          payload: null,
        });
        return {state: false, msg: response.msg, nick: ''};
      }
    } catch (error) {
      return {state: false, msg: '', nick: ''};
    }
  },
};
