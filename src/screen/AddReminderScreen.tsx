// AddReminderScreen.tsx
import React, { useState } from 'react';
import { View, TextInput, Button, Platform } from 'react-native';
// import DateTimePicker from '@react-native-community/datetimepicker';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import uuid from 'react-native-uuid';
// import PushNotification from 'react-native-push-notification';
// import AlarmManager from 'react-native-alarm-manager';

const AddReminderScreen = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date());

//   const handleSave = async () => {
//     const id = 123;
//     // const id = uuid.v4().toString();
//     const newReminder = { id, title, time: date.toISOString() };

//     // const existing = await AsyncStorage.getItem('reminders');
//     const reminders = existing ? JSON.parse(existing) : [];

//     reminders.push(newReminder);
//     await AsyncStorage.setItem('reminders', JSON.stringify(reminders));

//     const timeInMillis = new Date(date).getTime();
//     AlarmManager.scheduleAlarm({
//       id: Number(id.replace(/[^0-9]/g, '').slice(0, 6)), // alarm ID must be number
//       time: timeInMillis,
//       allowWhileIdle: true,
//       callback: () => {
//         PushNotification.localNotification({
//           title: 'Reminder',
//           message: title,
//         });
//       },
//     });

//     navigation.goBack();
//   };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <TextInput
        placeholder="Reminder Title"
        value={title}
        onChangeText={setTitle}
        style={{ borderBottomWidth: 1, marginBottom: 20 }}
      />
      {/* {Platform.OS === 'android' && (
        <DateTimePicker value={date} mode="datetime" display="default" onChange={(_, selected) => setDate(selected || date)} />
      )} */}
      <Button title="Save Reminder"
    //    onPress={handleSave}
       />
    </View>
  );
};

export default AddReminderScreen;
