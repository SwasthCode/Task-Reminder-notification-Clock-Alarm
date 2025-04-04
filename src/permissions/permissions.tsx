import { Alert, Linking, Platform } from 'react-native';
import notifee from '@notifee/react-native';

export const openExactAlarmPermissionSettings = () => {
  if (Platform.OS === 'android' && Platform.Version >= 31) {
    Linking.openSettings(); // Opens settings page for the app
  }
};

export const requestPermissions = async () => {
  if (Platform.OS === 'android') {
    // 🔔 Notification Permission (Android 13+)
    const settings = await notifee.requestPermission();
    if (settings.authorizationStatus >= 1) {
      console.log('Notification permission granted');
    } else {
      console.warn('Notification permission denied');
    }

    // ⏰ Exact Alarm Permission (Android 12+)
    if (Platform.Version >= 31) {
      Alert.alert(
        'Exact Alarm Permission',
        'Please enable "Schedule exact alarms" in system settings to allow alarms to work correctly.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: openExactAlarmPermissionSettings },
        ]
      );
    }
  }
};
