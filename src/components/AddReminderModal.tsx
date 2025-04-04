import React, { useState } from 'react';
import { Modal, Text, TextInput, TouchableOpacity, View, FlatList } from 'react-native';
import DatePicker from 'react-native-date-picker';
import { useReminderStore } from '../context/ReminderContext';

interface Props {
  visible: boolean;
  onClose: () => void;
}

export default function AddReminderModal({ visible, onClose }: Props) {
  const [title, setTitle] = useState('');
  const [dates, setDates] = useState<Date[]>([]);
  const [tempDate, setTempDate] = useState<Date>(new Date());
  const [open, setOpen] = useState(false);
  const { addReminder } = useReminderStore();

  const handleAdd = async () => {
    if (!title.trim() || dates.length === 0) return;

    for (const date of dates) {
      await addReminder(title, dates);
    }

    onClose();
    setTitle('');
    setDates([]);
  };

  const handleDateConfirm = (selectedDate: Date) => {
    setOpen(false);
    setDates(prev => [...prev, selectedDate]);
  };

  const removeDate = (indexToRemove: number) => {
    setDates(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={{ flex: 1, backgroundColor: '#000000aa', justifyContent: 'center' }}>
        <View style={{ backgroundColor: '#fff', margin: 20, padding: 20, borderRadius: 10 }}>
          <TextInput
            placeholder="Enter reminder title"
            value={title}
            onChangeText={setTitle}
            style={{ borderBottomWidth: 1, marginBottom: 10 }}
          />

          <TouchableOpacity onPress={() => setOpen(true)}>
            <Text style={{ color: '#007AFF', marginBottom: 10 }}>
              + Add Date & Time
            </Text>
          </TouchableOpacity>

          <DatePicker
            modal
            mode="datetime"
            open={open}
            date={tempDate}
            onConfirm={handleDateConfirm}
            onCancel={() => setOpen(false)}
            onDateChange={setTempDate}
          />

          {/* List of selected times */}
          {dates.length > 0 && (
            <View style={{ marginBottom: 10 }}>
              <Text style={{ fontWeight: 'bold' }}>Selected Times:</Text>
              <FlatList
                data={dates}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => (
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 4 }}>
                    <Text>⏰ {item.toLocaleString()}</Text>
                    <TouchableOpacity onPress={() => removeDate(index)}>
                      <Text style={{ color: 'red', fontWeight: 'bold', marginLeft: 10 }}>❌</Text>
                    </TouchableOpacity>
                  </View>
                )}
              />
            </View>
          )}

          <TouchableOpacity
            onPress={handleAdd}
            style={{ backgroundColor: '#007AFF', padding: 12, borderRadius: 8 }}
          >
            <Text style={{ color: '#fff', textAlign: 'center' }}>Add Reminder</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
