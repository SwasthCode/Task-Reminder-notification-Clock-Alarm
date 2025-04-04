import React, { createContext, useContext, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';
import notifee, { TimestampTrigger, TriggerType, AndroidStyle } from '@notifee/react-native';
import { Platform } from 'react-native';
// import AlarmManager from 'react-native-alarm-manager';

export interface Reminder {
  id: string;
  title: string;
  time: number;
}

const ReminderContext = createContext<any>(null);

export const ReminderProvider = ({ children }: { children: React.ReactNode }) => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  const loadReminders = async () => {
    const jsonValue = await AsyncStorage.getItem('@reminders');
    if (jsonValue) setReminders(JSON.parse(jsonValue));
  };

  const saveReminders = async (newReminders: Reminder[]) => {
    setReminders(newReminders);
    await AsyncStorage.setItem('@reminders', JSON.stringify(newReminders));
  };

  const addReminder = async (title: string, time: Date) => {
    const newReminder = {
      id: uuid.v4(),
      title,
      time: time.getTime(),
    };

    const updated = [...reminders, newReminder];
    await saveReminders(updated);
    await scheduleNotification(newReminder);
    // await scheduleAlarmClock(newReminder);
  };

  const removeReminder = async (id: string) => {
    const updated = reminders.filter(r => r.id !== id);
    await saveReminders(updated);
  };

  const scheduleNotification = async (reminder: Reminder) => {
    const trigger: TimestampTrigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: reminder.time,
    };

    await notifee.createTriggerNotification(
      {
        title: 'Reminder',
        body: reminder.title,
        android: {
          channelId: 'reminder',
          pressAction: { id: 'default' },
          style: { type: AndroidStyle.BIGTEXT, text: reminder.title },
        },
      },
      trigger
    );
  };


  // const scheduleAlarmClock = async (reminder: Reminder) => {
  //   try {
  //     const alarm:any = {
  //       alarmId: reminder.id,
  //       timestamp: reminder.time, // UNIX ms timestamp
  //       title: reminder.title,
  //       message: 'Your alarm is ringing!',
  //       soundName: 'default',
  //       allowWhileIdle: true,
  //       exact: true,
  //       repeatInterval: 0, // 0 = no repeat
  //     };
  
  //     AlarmManager.schedule(
  //       alarm,
  //       (msg) => console.log('Alarm scheduled successfully:', msg),
  //       (err) => console.log('Alarm scheduling failed:', err)
  //     );
  //   } catch (err) {
  //     console.error('Error in scheduleAlarmClock:', err);
  //   }
  // };


  return (
    <ReminderContext.Provider
      value={{
        reminders,
        modalVisible,
        setModalVisible,
        loadReminders,
        addReminder,
        removeReminder,
      }}
    >
      {children}
    </ReminderContext.Provider>
  );
};

export const useReminderStore = () => useContext(ReminderContext);
