import React, { useState } from 'react';
import { Modal, Text, TextInput, TouchableOpacity, View } from 'react-native';
import DatePicker from 'react-native-date-picker';
import { useReminderStore } from '../context/ReminderContext';

interface Props {
  visible: boolean;
  onClose: () => void;
}

export default function AddReminderModal({ visible, onClose }: Props) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState<Date>(new Date());
  const [open, setOpen] = useState(false);
  const { addReminder } = useReminderStore();

  const handleAdd = async () => {
    if (!title.trim()) return;

    console.log("TITLE ==>", title, "DATE ==>", date?.toLocaleString());
    await addReminder(title, date); // Date object pass kar rahe ho
    onClose();
    setTitle('');
    setDate(new Date());
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={{ flex: 1, backgroundColor: '#000000aa', justifyContent: 'center' }}>
        <View style={{ backgroundColor: '#fff', margin: 20, padding: 20, borderRadius: 10 }}>
          <TextInput
            placeholder="Enter reminder"
            value={title}
            onChangeText={setTitle}
            style={{ borderBottomWidth: 1, marginBottom: 10 }}
          />
          <TouchableOpacity onPress={() => setOpen(true)}>
            <Text style={{ color: '#007AFF', marginBottom: 10 }}>Pick Date & Time</Text>
          </TouchableOpacity>

          <DatePicker
            modal
            mode="datetime"
            open={open}
            date={date}
            onConfirm={selectedDate => {
              setOpen(false);
              setDate(selectedDate);
            }}
            onCancel={() => setOpen(false)}
          />

          <TouchableOpacity onPress={handleAdd} style={{ backgroundColor: '#007AFF', padding: 12, borderRadius: 8 }}>
            <Text style={{ color: '#fff', textAlign: 'center' }}>Add Reminder</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
