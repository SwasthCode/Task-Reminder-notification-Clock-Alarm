import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

interface Props {
  onPress: () => void;
}

export default function FloatingButton({ onPress }: Props) {
  return (
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
  );
}
