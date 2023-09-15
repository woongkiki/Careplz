import {Box, HStack} from 'native-base';
import React from 'react';
import {StyleSheet, TouchableOpacity, Image} from 'react-native';
import {DefText} from '../common/BOOTSTRAP';
import {textLengthOverCut} from '../common/DataFunction';
import {colorSelect, deviceSize, fsize, fweight} from '../common/StyleCommon';
import {BASE_URL} from '../Utils/APIConstant';

const EventReviewBox = props => {
  const {
    navigation,
    eventName,
    disabled,
    textMore,
    eventWriter,
    eventDate,
    eventStart,
    eventContent,
    reportText,
    eventReviewOnpress,
    eventTitle,
    photos,
    singoOnprees,
    reviewDel,
    reviewRemoveOnpress,
    reviewanswer,
    reviewAnswerImage,
    hname,
    updateText,
    updateStatus = false,
    reviews,
    updateContent,
  } = props;

  return (
    <Box borderTopWidth={1} borderTopColor="#E3E3E3">
      <TouchableOpacity
        onPress={eventReviewOnpress}
        disabled={disabled}
        style={{paddingVertical: 20}}>
        <HStack alignItems={'center'} justifyContent="space-between">
          <HStack alignItems={'center'}>
            {eventStart == '1' && (
              <Image
                source={{uri: BASE_URL + '/images/score1Big.png'}}
                style={{
                  width: 78,
                  height: 14,
                  resizeMode: 'contain',
                  marginRight: 10,
                }}
              />
            )}
            {eventStart == '2' && (
              <Image
                source={{uri: BASE_URL + '/images/score2Big.png'}}
                style={{
                  width: 78,
                  height: 14,
                  resizeMode: 'contain',
                  marginRight: 10,
                }}
              />
            )}
            {eventStart == '3' && (
              <Image
                source={{uri: BASE_URL + '/images/score3Big.png'}}
                style={{
                  width: 78,
                  height: 14,
                  resizeMode: 'contain',
                  marginRight: 10,
                }}
              />
            )}
            {eventStart == '4' && (
              <Image
                source={{uri: BASE_URL + '/images/score4Big.png'}}
                style={{
                  width: 78,
                  height: 14,
                  resizeMode: 'contain',
                  marginRight: 10,
                }}
              />
            )}
            {eventStart == '5' && (
              <Image
                source={{uri: BASE_URL + '/images/score5Big.png'}}
                style={{
                  width: 78,
                  height: 14,
                  resizeMode: 'contain',
                  marginRight: 10,
                }}
              />
            )}

            <DefText
              text={eventStart}
              style={{...fsize.fs15, lineHeight: 21}}
            />

            <TouchableOpacity style={[styles.goodButton]}>
              <HStack alignItems={'center'} height={'100%'}>
                <DefText
                  text={'좋아요'}
                  style={[fsize.fs13, {lineHeight: 19, color: '#434856'}]}
                />
                <Image
                  source={{uri: BASE_URL + '/newImg/goodIcons.png'}}
                  style={{
                    width: 13,
                    height: 14,
                    resizeMode: 'contain',
                    marginHorizontal: 5,
                  }}
                />
                <DefText
                  text={15}
                  style={[
                    fsize.fs13,
                    fweight.bold,
                    {color: '#434856', lineHeight: 19},
                  ]}
                />
              </HStack>
            </TouchableOpacity>
          </HStack>
          <HStack alignItems={'center'}>
            {updateStatus && (
              <TouchableOpacity
                style={[
                  styles.reportButton,
                  {marginRight: 10, borderColor: colorSelect.blue},
                ]}
                onPress={() =>
                  navigation.navigate('ReviewUpdate', {
                    reviewInfo: reviews,
                    type: updateContent,
                  })
                }>
                <DefText
                  text={updateText}
                  style={[styles.reportButtonText, {color: colorSelect.blue}]}
                />
              </TouchableOpacity>
            )}
            {reportText != '' && (
              <TouchableOpacity
                style={[styles.reportButton]}
                onPress={singoOnprees}>
                <DefText text={reportText} style={[styles.reportButtonText]} />
              </TouchableOpacity>
            )}
            {reviewDel && (
              <TouchableOpacity
                style={[styles.reviewRemoveButton]}
                onPress={reviewRemoveOnpress}>
                <Image
                  source={{uri: BASE_URL + '/images/reviewRemoveIcon.png'}}
                  style={{
                    width: 13,
                    height: 13,
                    resizeMode: 'contain',
                  }}
                />
              </TouchableOpacity>
            )}
          </HStack>
        </HStack>
        <HStack mt="10px" alignItems={'center'}>
          <DefText text={eventWriter} style={[styles.reviewWriterDate]} />
          <Box
            backgroundColor={'#B2BBC8'}
            width={'1px'}
            height={'12px'}
            mx="10px"
          />
          <DefText text={eventDate} style={[styles.reviewWriterDate]} />
        </HStack>
        {(photos != null || photos != undefined) && (
          <HStack mt="15px">
            {photos.map((item, index) => {
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() =>
                    navigation.navigate('ReviewImageView', {url: item})
                  }>
                  <Image
                    source={{uri: item}}
                    style={{
                      width: (deviceSize.deviceWidth - 40) * 0.31,
                      height: (deviceSize.deviceWidth - 40) * 0.31,
                      resizeMode: 'stretch',
                      marginRight:
                        (index + 1) % 3 != 0
                          ? (deviceSize.deviceWidth - 40) * 0.035
                          : 0,
                      borderRadius: 10,
                    }}
                  />
                </TouchableOpacity>
              );
            })}
          </HStack>
        )}
        <HStack flexWrap={'wrap'}>
          <Box style={[styles.eventCateBox]} mt="15px">
            <DefText text={eventTitle} style={[styles.eventCateBoxText]} />
          </Box>
          <Box width="70%" mt="15px">
            <DefText
              text={eventName}
              style={[fsize.fs14, {lineHeight: 20, color: '#B2BBC8'}]}
            />
          </Box>
        </HStack>
        <Box mt="10px">
          <DefText text={eventContent} style={[fsize.fs14, {lineHeight: 23}]} />
        </Box>

        {reviewanswer != '' && (
          <Box>
            <HStack mt="10px" alignItems={'center'}>
              <Image
                source={{uri: reviewAnswerImage}}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 40,
                  resizeMode: 'stretch',
                  borderWidth: 1,
                  borderColor: '#f1f1f1',
                }}
              />
              <DefText
                text={hname}
                style={{...fsize.fs14, ...fweight.m, marginLeft: 15}}
              />
            </HStack>
            <Box
              backgroundColor={'rgba(255,127,178,0.1)'}
              p="20px"
              borderRadius={10}
              mt="10px">
              <DefText
                text={reviewanswer}
                style={{
                  ...fsize.fs14,
                  ...fweight.r,
                }}
              />
            </Box>
          </Box>
        )}
      </TouchableOpacity>
    </Box>
  );
};

const styles = StyleSheet.create({
  reportButton: {
    paddingHorizontal: 10,
    height: 22,
    borderRadius: 4,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D85656',
  },
  reportButtonText: {
    ...fsize.fs12,
    lineHeight: 17,
    color: '#D85656',
  },
  reviewWriterDate: {
    ...fsize.fs12,
    lineHeight: 17,
    color: '#B2BBC8',
  },
  eventCateBox: {
    paddingHorizontal: 10,
    height: 22,
    borderRadius: 4,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#B2BBC8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  eventCateBoxText: {
    ...fsize.fs12,
    lineHeight: 17,
    color: '#B2BBC8',
  },
  reviewRemoveButton: {
    width: 33,
    height: 33,
    borderRadius: 5,
    backgroundColor: '#F5F6FA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  goodButton: {
    marginLeft: 10,
    paddingHorizontal: 10,
    height: 27,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#434856',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

export default EventReviewBox;
