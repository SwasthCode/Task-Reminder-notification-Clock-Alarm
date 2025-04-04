import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';
import notifee, {
  TimestampTrigger,
  TriggerType,
  AndroidStyle,
  AndroidImportance,
} from '@notifee/react-native';
import { Platform } from 'react-native';
import Sound from 'react-native-sound';

export interface Reminder {
  id: string;
  title: string;
  time: number;
  times?: number[]; // ⬅️ required for multiple time reminders
}

const ReminderContext = createContext<any>(null);

export const ReminderProvider = ({ children }: { children: React.ReactNode }) => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [soundModalVisible, setSoundModalVisible] = useState(false);
  const [currentReminderTitle, setCurrentReminderTitle] = useState('');

  const loadReminders = async () => {
    const jsonValue = await AsyncStorage.getItem('@reminders');
    if (jsonValue) setReminders(JSON.parse(jsonValue));
  };

  const saveReminders = async (newReminders: Reminder[]) => {
    try {
      setReminders(newReminders);
      await AsyncStorage.setItem('@reminders', JSON.stringify(newReminders));
      console.log("Reminders Saved:", newReminders);
    } catch (error) {
      console.error("Error saving reminders:", error);
    }
  };

  const addReminder = async (title: string, times: Date[]) => {
    if (!title.trim() || times.length === 0) return;

    const timestamps = times.map(t => t.getTime());

    const existingReminder = reminders.find(r => r.title === title);

    let newTimesToSchedule = timestamps;
    let updatedReminders: any;

    if (existingReminder && existingReminder.times) {
      const mergedTimes = [...new Set([...existingReminder.times, ...timestamps])].sort((a, b) => a - b);
      newTimesToSchedule = timestamps.filter(t => !existingReminder.times?.includes(t));
      updatedReminders = reminders.map(r =>
        r.title === title ? { ...r, times: mergedTimes } : r
      );
    } else {
      const newReminder = {
        id: uuid.v4().toString(),
        title,
        times: timestamps,
      };
      updatedReminders = [...reminders, newReminder];
    }

    await saveReminders(updatedReminders);

    for (const time of newTimesToSchedule) {
      const reminder = { id: uuid.v4().toString(), title, time };
      await scheduleAlarmClock(reminder);
    }
  };

  const removeReminder = async (id: string) => {
    const updated = reminders.filter(r => r.id !== id);
    await saveReminders(updated);
  };

  const scheduleAlarmClock = async (reminder: Reminder) => {
    const channelId = await notifee.createChannel({
      id: 'reminder',
      name: 'Reminder Notifications',
      importance: AndroidImportance.HIGH,
      sound: 'alarm',
    });

    const trigger: TimestampTrigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: reminder.time,
    };

    await notifee.createTriggerNotification(
      {
        id: reminder.id,
        title: '⏰ Alarm',
        body: reminder.title,
        android: {
          channelId,
          pressAction: { id: 'default' },
          sound: Platform.OS === 'android' ? 'alarm' : 'alarm.mp3',
          importance: AndroidImportance.HIGH,
          actions: [
            {
              title: '🛑 Stop',
              pressAction: { id: 'stop' },
            },
            {
              title: '😴 Snooze',
              pressAction: { id: 'snooze' },
            },
          ],
          style: {
            type: AndroidStyle.BIGTEXT,
            text: reminder.title,
          },
        },
      },
      trigger
    );
  };

  let soundInstance: Sound | null = null;

  const playSound = () => {
    soundInstance = new Sound('tone.mp3', Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.log('Failed to load the sound', error);
        return;
      }
      soundInstance?.play((success) => {
        if (!success) console.log('Playback error');
      });
    });
  };

  const stopSound = () => {
    if (soundInstance) {
      soundInstance.stop();
      soundInstance.release();
      soundInstance = null;
    }
    setSoundModalVisible(false);
  };

  return (
    <ReminderContext.Provider
      value={{
        reminders,
        modalVisible,
        setModalVisible,
        loadReminders,
        addReminder,
        removeReminder,
        soundModalVisible,
        setSoundModalVisible,
        currentReminderTitle,
        setCurrentReminderTitle,
        stopSound,
        playSound,
      }}
    >
      {children}
    </ReminderContext.Provider>
  );
};

export const useReminderStore = () => useContext(ReminderContext);
