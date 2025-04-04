import React from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useReminderStore } from '../context/ReminderContext';

export default function ReminderList() {
  const { reminders, removeReminder } = useReminderStore();


  console.log('reminders==>', reminders)
  return (
    <SafeAreaView>
      <Text style={{ fontSize: 18, textAlign: 'center', color: '#000' }}>Task Reminder</Text>
      <FlatList
        data={reminders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onLongPress={() => removeReminder(item.id)}
            style={{
              backgroundColor: '#fff',
              marginBottom: 12,
              padding: 16,
              borderRadius: 10,
              elevation: 3,
            }}>
            <Text style={{ fontSize: 16, fontWeight: '600' }}>{item.title}</Text>
            {/* <Text style={{ color: '#888' }}>{new Date(item.time).toLocaleString()}</Text> */}
            <Text style={{ color: '#888' }}>
              {item?.times?.map((time:any) => new Date(time).toLocaleString()).join(', ')}
            </Text>

          </TouchableOpacity>
        )}
      />


      <Text style={{ fontSize: 18, textAlign: 'center', color: '#000' }}>Long Press to DELETE</Text>


    </SafeAreaView>
  );
}
