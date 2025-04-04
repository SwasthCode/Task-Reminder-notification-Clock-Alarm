import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';
import notifee, { TimestampTrigger, TriggerType, AndroidStyle } from '@notifee/react-native';

export interface Reminder {
  id: string;
  title: string;
  time: number;
}

export default function useReminderStore() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  console.log('STATE REMINDER===>',reminders)

  const loadReminders = async () => {
    const jsonValue = await AsyncStorage.getItem('@reminders');
    console.log('LOAD REMINDER===>',jsonValue)
    if (jsonValue) setReminders(JSON.parse(jsonValue));
  };

  const saveReminders = async (newReminders: Reminder[]) => {
    console.log("Reminder Saved!")
    setReminders(newReminders);
    await AsyncStorage.setItem('@reminders', JSON.stringify(newReminders));
  };

  const addReminder = async (title: string, time: Date) => {

      console.log("ADD Reminder Runs.. .");
      console.log("HANDLE ADD RUNS");
      console.log("TITLE:", title);
      console.log("DATE:", time);
      console.log("UID:", uuid.v4());
      const newReminder= {
          id: uuid.v4(),
          title,
          time: time.getTime(),
        };
        console.log("ADD Reminder Runs...",newReminder)
    const updated = [...reminders, newReminder];

    console.log('updated==>',updated)
    await saveReminders(updated);
    await scheduleNotification(newReminder);
  };

  const removeReminder = async (id: string) => {
    const updated = reminders.filter(r => r.id !== id);
    await saveReminders(updated);
  };

  const scheduleNotification = async (reminder: Reminder) => {
    console.log("Reminder scheduleNotification!")
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

  return {
    reminders,
    modalVisible,
    setModalVisible,
    loadReminders,
    addReminder,
    removeReminder,
  };
}
