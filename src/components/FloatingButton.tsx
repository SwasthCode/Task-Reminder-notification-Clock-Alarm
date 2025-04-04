import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import Sound from 'react-native-sound';

interface Props {
  onPress: () => void;
}



export default function FloatingButton({ onPress }: Props) {
  return (
    <>
      <TouchableOpacity
        onPress={onPress}
        style={{
          position: 'absolute',
          bottom: 30,
          right: 30,
          backgroundColor: '#007AFF',
          borderRadius: 50,
          width: 60,
          height: 60,
          justifyContent: 'center',
          alignItems: 'center',
          elevation: 5,
        }}>
        <Text style={{ color: '#fff', fontSize: 30 }}>+</Text>
      </TouchableOpacity>

      {/* <TouchableOpacity
        onPress={playSound}
        style={{
          position: 'absolute',
          bottom: 30,
          right: 30,
          backgroundColor: '#FF3B30',
          borderRadius: 50,
          width: 60,
          height: 60,
          justifyContent: 'center',
          alignItems: 'center',
          elevation: 5,
        }}>
        <Text style={{ color: '#fff', fontSize: 20 }}>▶️</Text>
      </TouchableOpacity> */}
    </>
  );
}
