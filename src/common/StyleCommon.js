import {Dimensions, Platform} from 'react-native';
import Font from './Font';

export const fsize = {
  fs12: {
    fontSize: 12,
    lineHeight: 15,
  },
  fs13: {
    fontSize: 13,
    lineHeight: 16,
  },
  fs14: {
    fontSize: 14,
    lineHeight: 17,
  },
  fs15: {
    fontSize: 15,
    lineHeight: 18,
  },
  fs16: {
    fontSize: 16,
    lineHeight: 19,
  },
  fs17: {
    fontSize: 17,
    lineHeight: 20,
  },
  fs18: {
    fontSize: 18,
    lineHeight: 21,
  },
  fs19: {
    fontSize: 19,
    lineHeight: 22,
  },
  fs20: {
    fontSize: 20,
    lineHeight: 23,
  },
  fs21: {
    fontSize: 21,
    lineHeight: 24,
  },
  fs22: {
    fontSize: 22,
    lineHeight: 25,
  },
  fs23: {
    fontSize: 23,
    lineHeight: 26,
  },
  fs24: {
    fontSize: 24,
    lineHeight: 27,
  },
  fs32: {
    fontSize: 32,
    lineHeight: 35,
  },
};

export const fweight = {
  black: {
    ...Platform.select({
      android: {
        fontFamily: Font.NotoBlack,
      },
      ios: {
        fontFamily: Font.NotoBlack,
        fontWeight: '900',
      },
    }),
  },
  bold: {
    ...Platform.select({
      android: {
        fontFamily: Font.NotoBold,
      },
      ios: {
        fontFamily: Font.NotoBold,
        fontWeight: '700',
      },
    }),
  },
  dl: {
    ...Platform.select({
      android: {
        fontFamily: Font.NotoDemiLight,
      },
      ios: {
        fontFamily: Font.NotoDemiLight,
        fontWeight: '300',
      },
    }),
  },
  light: {
    ...Platform.select({
      android: {
        fontFamily: Font.NotoLight,
      },
      ios: {
        fontFamily: Font.NotoLight,
        fontWeight: '300',
      },
    }),
  },
  m: {
    ...Platform.select({
      android: {
        fontFamily: Font.NotoMedium,
      },
      ios: {
        fontFamily: Font.NotoMedium,
        fontWeight: '500',
      },
    }),
  },
  r: {
    ...Platform.select({
      android: {
        fontFamily: Font.NotoRegular,
      },
      ios: {
        fontFamily: Font.NotoRegular,
        fontWeight: '400',
      },
    }),
  },
  thin: {
    ...Platform.select({
      android: {
        fontFamily: Font.NotoThin,
      },
      ios: {
        fontFamily: Font.NotoThin,
        fontWeight: '100',
      },
    }),
  },
};

export const colorSelect = {
  red: '#f00',
  white: '#fff',
  black: '#000',
  blue: '#00f',
  green: '#0f0',
  yellow: '#ff0',
  gray_dfdfdf: '#dfdfdf',
  pink_de: '#FF7FB2',
  navy: '#232264',
};

export const deviceSize = {
  deviceWidth: Dimensions.get('window').width,
  deviceHeight: Dimensions.get('window').height,
};

export const loginButtonStyle = {
  width: 55,
  height: 55,
  borderRadius: 55,
  justifyContent: 'center',
  alignItems: 'center',
  overflow: 'hidden',
};

export const loginButtonText = {
  ...fweight.m,
  color: '#fff',
};
