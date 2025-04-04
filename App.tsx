import React, { useEffect } from 'react';
import { View } from 'react-native';
import notifee from '@notifee/react-native';
import ReminderList from './src/components/ReminderList';
import FloatingButton from './src/components/FloatingButton';
import AddReminderModal from './src/components/AddReminderModal';
import { ReminderProvider, useReminderStore } from './src/context/ReminderContext';
import { requestPermissions } from './src/permissions/permissions';

const MainApp = () => {
  const { loadReminders, modalVisible, setModalVisible } = useReminderStore();

  useEffect(() => {
    // requestPermissions();
    loadReminders();
    notifee.createChannel({ id: 'reminder', name: 'Reminders' });
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: '#f2f2f2', padding: 16 }}>
      <ReminderList />
      <FloatingButton onPress={() => setModalVisible(true)} />
      <AddReminderModal visible={modalVisible} onClose={() => setModalVisible(false)} />
    </View>
  );
};

export default function App() {
  return (
    <ReminderProvider>
      <MainApp />
    </ReminderProvider>
  );
}
