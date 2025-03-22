import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

const notificationsData = [
  {
    id: '1',
    title: 'Yo, You missed some activities',
    message: 'Check your dashboard for missed activities!',
    category: 'FUN',
    color: '#FFC0CB',
    tab: 'Dashboard'
  },
  {
    id: '2',
    title: 'Hey Stark, Jarvis mentioned you',
    message: 'Jarvis mentioned you in the community forum.',
    category: 'Social',
    color: '#FFDAB9',
    tab: 'Community Forum'
  },
  {
    id: '3',
    title: 'Did you know?',
    message: 'Spending 30 minutes a day on Pause+ helps improve focus!',
    category: 'Learn',
    color: '#ADD8E6',
    tab: 'Education'
  },
  {
    id: '4',
    title: 'New Achievement Unlocked!',
    message: 'You reached Elite Master level! Check your world ranking.',
    category: 'Ranking',
    color: '#FFD700',
    tab: 'World Ranking'
  }
];
export default function NotificationScreen({ navigation }) {
  const [notifications, setNotifications] = useState(notificationsData);

  const clearNotifications = () => {
    setNotifications([]);
  };

  const renderItem = ({ item }) => (
  <TouchableOpacity onPress={() => navigation.navigate(item.tab)}>
    <View style={[styles.notificationCard, { backgroundColor: item.color }]}>
      <View style={styles.header}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.category}>{item.category}</Text>
      </View>
      <Text style={styles.message}>{item.message}</Text>
    </View>
  </TouchableOpacity>
);

  return (
    <View style={styles.container}>
      
      {/* Notifications List */}
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />

      {/* Clear All Button */}
      <TouchableOpacity style={styles.clearButton} onPress={clearNotifications}>
        <Text style={styles.clearButtonText}>Clear All</Text>
      </TouchableOpacity>
    </View>
  );
}

// Styles remain unchanged
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E6E6FA',
    padding: 20,
  },
  
  list: {
    flexGrow: 1,
  },
  notificationCard: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  category: {
    fontSize: 14,
    fontWeight: 'bold',
    backgroundColor: 'black',
    color: 'white',
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  message: {
    fontSize: 14,
    color: '#333',
  },
  clearButton: {
    backgroundColor: '#D3D3D3',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  clearButtonText: {
    fontSize: 16,
    color: '#555',
    fontWeight: 'bold',
  },
});
