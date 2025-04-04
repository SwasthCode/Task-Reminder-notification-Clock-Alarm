// HomeScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, TouchableOpacity } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
// import { Ionicons } from '@expo/vector-icons';

interface Reminder {
  id: string;
  title: string;
  time: string;
}

const HomeScreen = () => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const navigation = useNavigation();

//   useEffect(() => {
//     const loadReminders = async () => {
//       const stored = await AsyncStorage.getItem('reminders');
//       if (stored) setReminders(JSON.parse(stored));
//     };
//     const unsubscribe = navigation.addListener('focus', loadReminders);
//     return unsubscribe;
//   }, []);

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <FlatList
        data={reminders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ padding: 15, backgroundColor: '#eee', marginBottom: 10, borderRadius: 10 }}>
            <Text style={{ fontWeight: 'bold' }}>{item.title}</Text>
            <Text>{item.time}</Text>
          </View>
        )}
      />
      <TouchableOpacity
        style={{
          position: 'absolute', bottom: 30, right: 30,
          backgroundColor: '#1e90ff', borderRadius: 30, padding: 20,
        }}
        onPress={() => navigation.navigate('AddReminder')}
      >
        <Text>ok</Text>
        {/* <Ionicons name="add" size={24} color="#fff" /> */}
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreen;
