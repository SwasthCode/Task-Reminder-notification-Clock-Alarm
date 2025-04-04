import React, { useEffect } from 'react';
import { View } from 'react-native';
import notifee, { EventType } from '@notifee/react-native';
import ReminderList from './src/components/ReminderList';
import FloatingButton from './src/components/FloatingButton';
import AddReminderModal from './src/components/AddReminderModal';
import SoundModal from './src/components/SoundModal'; // 🔔 import it
import { ReminderProvider, useReminderStore } from './src/context/ReminderContext';

const MainApp = () => {
  const {
    loadReminders,
    modalVisible,
    setModalVisible,
    soundModalVisible,
    currentReminderTitle,
    stopSound,
    setCurrentReminderTitle,
    setSoundModalVisible,
    playSound,
  } = useReminderStore();

  useEffect(() => {
    loadReminders();
    notifee.createChannel({ id: 'reminder', name: 'Reminders' });

    // 🧠 Listen to foreground events
    const unsubscribe = notifee.onForegroundEvent(({ type, detail }) => {
      if (type === EventType.DELIVERED) {

        console.log("detail.notification?.title==>",detail.notification?.title)
        setCurrentReminderTitle(detail.notification?.title || 'Reminder');
        setSoundModalVisible(true);
        playSound();
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: '#f2f2f2', padding: 16 }}>
      <ReminderList />
      <FloatingButton onPress={() => setModalVisible(true)} />
      <AddReminderModal visible={modalVisible} onClose={() => setModalVisible(false)} />
      
      {/* 👇 Yahan pe modal call karega */}
      <SoundModal
        visible={soundModalVisible}
        title={currentReminderTitle}
        onStop={stopSound}
      />
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
