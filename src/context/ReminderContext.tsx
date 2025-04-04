import React, { createContext, useContext, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';
import notifee, { TimestampTrigger, TriggerType, AndroidStyle, AndroidImportance } from '@notifee/react-native';
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

  // const saveReminders = async (newReminders: Reminder[]) => {
  //   setReminders(newReminders);
  //   await AsyncStorage.setItem('@reminders', JSON.stringify(newReminders));
  // };



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
  
    // Check if same title already exists
    const existingReminder: any = reminders.find(r => r.title === title);
  
    let newTimesToSchedule = timestamps;
    let updatedReminders: any;
  
    if (existingReminder) {
      // Merge and remove duplicates
      const mergedTimes = [...new Set([...existingReminder.times, ...timestamps])].sort((a, b) => a - b);
  
      // 🔍 Filter out already existing times
      newTimesToSchedule = timestamps.filter(t => !existingReminder.times.includes(t));
  
      updatedReminders = reminders.map(r =>
        r.title === title ? { ...r, times: mergedTimes } : r
      );
    } else {
      const newReminder = {
        id: uuid.v4(),
        title,
        times: timestamps,
      };
      updatedReminders = [...reminders, newReminder];
    }
  
    await saveReminders(updatedReminders);
  
    // ✅ Schedule only new times
    for (const time of newTimesToSchedule) {
      const reminder = { id: uuid.v4(), title, time };
      await scheduleAlarmClock(reminder);
    }
  };
  

  

  const removeReminder = async (id: string) => {
    const updated = reminders.filter(r => r.id !== id);
    await saveReminders(updated);
  };

 
 const scheduleNotification = async (reminder: Reminder) => {
  const channelId = await notifee.createChannel({
    id: 'reminder',
    name: 'Reminder Notifications',
    importance: AndroidImportance.HIGH,
    sound: 'default',
  });

  const trigger: TimestampTrigger = {
    type: TriggerType.TIMESTAMP,
    timestamp: reminder.time,
  };

  // Scheduled Notification
  await notifee.createTriggerNotification(
    {
      title: 'Reminder',
      body: reminder.title,
      android: {
        channelId,
        pressAction: { id: 'default' },
        sound: 'default',
        style: { type: AndroidStyle.BIGTEXT, text: reminder.title },
      },
    },
    trigger
  );

  // Immediate On-Screen Notification
  await notifee.displayNotification({
    title: 'Reminder Set!',
    body: `⏰ Scheduled for: ${new Date(reminder.time).toLocaleString()}`,
    android: {
      channelId,
      smallIcon: 'ic_launcher',
      pressAction: { id: 'default' },
      importance: AndroidImportance.HIGH,
      sound: 'default',
    },
  });
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



  const scheduleAlarmClock = async (reminder: Reminder) => {
    const channelId = await notifee.createChannel({
      id: 'reminder',
      name: 'Reminder Notifications',
      importance: AndroidImportance.HIGH,
      sound: 'alarm', // use your custom tone if available
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
