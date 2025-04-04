import React from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';

interface Props {
  visible: boolean;
  title: string;
  onStop: () => void;
}

const SoundModal = ({ visible, title, onStop }: Props) => {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={{
        flex: 1, justifyContent: 'center', alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)'
      }}>
        <View style={{
          backgroundColor: '#fff', padding: 20, borderRadius: 10, width: '80%'
        }}>
          <Text style={{ fontSize: 18, marginBottom: 10 , color:'#000'}}>{title}</Text>
          <TouchableOpacity
            onPress={onStop}
            style={{
              backgroundColor: '#ff3b30', padding: 10, borderRadius: 5, marginTop: 10
            }}>
            <Text style={{ color: '#fff', textAlign: 'center' }}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default SoundModal;
