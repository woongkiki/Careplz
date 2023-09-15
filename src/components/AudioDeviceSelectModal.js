import { Box, CheckIcon } from 'native-base';
import React from 'react';
import { Modal, Platform, Pressable, StyleSheet, TouchableOpacity, View } from 'react-native';
import { DefText } from '../common/BOOTSTRAP';
import { fsize, fweight } from '../common/StyleCommon';

const AudioDeviceSelectModal = (props) => {

    const {currentDevice, devices, visible, onSelect} = props;

    return (
        <Modal
            transparent
            hardwareAccelerated
            visible={visible}
            style={{ margin: 0 }}
            animationType={'fade'}
            onRequestClose={() => onSelect(null)}
        >
            <Box
                style={[menuStyles.container]}
            >
                <Box
                    style={[menuStyles.body]}
                >
                    <Box style={{ padding: 16 }}>
                        <DefText 
                            text={"Select audio device"} 
                            style={{...fweight.bold}}
                        />
                    </Box>
                    {
                        devices.map((device) => {
                            return(
                                <TouchableOpacity
                                    key={device}
                                    onPress={() => onSelect(device)}
                                    style={menuStyles.button}
                                >
                                    <DefText 
                                        text={device}
                                        style={{ flex: 1, height: 24, ...fsize.fs14 }}
                                    />
                                    {
                                        currentDevice === device &&
                                        <CheckIcon 
                                            width={12}
                                            height={12}
                                        />
                                    }
                                </TouchableOpacity>
                            )
                        })
                    }
                </Box>
            </Box>
        </Modal>
    );
};

const menuStyles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(0,0,0,0.55)',
    },
    body: {
      borderRadius: 12,
      width: 260,
      backgroundColor: '#FFFFFF',
    },
    button: {
      paddingVertical: 12,
      paddingHorizontal: 16,
      flexDirection: 'row',
      alignItems: 'center',
    },
    close: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

export default AudioDeviceSelectModal;