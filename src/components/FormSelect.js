import {Box, HStack, Select} from 'native-base';
import React from 'react';
import {Image, StyleSheet} from 'react-native';
import {DefText} from '../common/BOOTSTRAP';
import {colorSelect, fsize, fweight} from '../common/StyleCommon';

const FormSelect = props => {
  const {
    navigation,
    labelOn,
    labelHorizontal,
    labelIcon,
    labelIconUri,
    labelIconWidth,
    labelIconHeight,
    labelIconResize,
    label,
    labelStyle,
    label2on,
    label2,
    label2Style,
    placeholder,
    value,
    onValueChange,
    data,
    selectWidth,
    selectItemLabel,
    selectItemVal,
    type = 'nation',
  } = props;

  return (
    <Box>
      {labelOn ? (
        labelHorizontal ? (
          <HStack style={[styles.labelTextHorizontalBox]}>
            {labelIcon && (
              <Image
                source={{uri: labelIconUri}}
                style={[
                  {
                    width: labelIconWidth,
                    height: labelIconHeight,
                    resizeMode: labelIconResize,
                    marginRight: 10,
                  },
                ]}
              />
            )}
            <DefText
              text={label}
              style={[styles.labelText, {marginBottom: 0}, labelStyle]}
            />
            {label2on && (
              <DefText text={label2} style={[styles.labelText2, label2Style]} />
            )}
          </HStack>
        ) : (
          <DefText text={label} style={[styles.labelText, labelStyle]} />
        )
      ) : (
        <></>
      )}
      <Select
        placeholder={placeholder}
        value={value}
        onValueChange={onValueChange}
        height={'48px'}
        style={[
          fsize.fs14,
          {
            paddingLeft: 15,
          },
        ]}
        borderColor={colorSelect.navy}
        borderWidth={1}
        width={selectWidth}>
        {data != '' &&
          data.map((item, index) => {
            let labels =
              type == 'nation'
                ? item.flag + ' ' + item.orig_name
                : item.flag + ' ' + item.language;

            return <Select.Item label={labels} value={item.idx} key={index} />;
          })}
      </Select>
    </Box>
  );
};

const styles = StyleSheet.create({
  labelText: {
    ...fweight.bold,
    ...fsize.fs15,
    marginBottom: 10,
    lineHeight: 28,
  },
  labelTextHorizontalBox: {
    alignItems: 'center',
    marginBottom: 10,
  },
  labelText2: {
    ...fsize.fs12,
  },
});

export default FormSelect;
