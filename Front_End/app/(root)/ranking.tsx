import React from 'react';
import { View, Text, StyleSheet, Image, FlatList } from 'react-native';

interface UserItem {
  rank: number;
  name: string;
  xp: number;
}

const RankingScreen = () => {
  const users: UserItem[] = [
    { rank: 1, name: 'User not found', xp: 0 },
    { rank: 2, name: 'User not found', xp: 0 },
    { rank: 3, name: 'User not found', xp: 0 },
    { rank: 4, name: 'User not found', xp: 0 },
    { rank: 5, name: 'User not found', xp: 0 },
    { rank: 6, name: 'User not found', xp: 0 },
    { rank: 7, name: 'User not found', xp: 0 },
  ];

  const renderUser = ({ item }: { item: UserItem }) => (
    <View style={styles.userRow}>
      <Text style={styles.rankText}>#{item.rank}</Text>
      <View style={styles.userInfo}>
        <Image
          style={styles.avatar}
          source={require('@/assets/images/rank3.png')}
        />
        <Text style={styles.userName}>{item.name}</Text>
      </View>
      <Text style={styles.xpText}>{item.xp} XP</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>World Ranking</Text>
      </View>
      <View style={styles.achievementSection}>
        <Image
          source={require('@/assets/images/rank3.png')}
          style={styles.badge}
        />
        <Text style={styles.rankTitle}>Elite Master</Text>
        <Text style={styles.subtitle}>You finished #8 last week in your rank</Text>
      </View>
      <FlatList
        data={users}
        renderItem={renderUser}
        keyExtractor={(item) => item.rank.toString()}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F9',
    paddingTop: 40,
  },
  header: {
    backgroundColor: '#D8E6FF',
    padding: 20,
    marginLeft: 20,
    marginRight: 20,
    
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#4A6FA5',
  },
  achievementSection: {
    alignItems: 'center',
    marginVertical: 20,
  },
  badge: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
  rankTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FF8C42',
    marginVertical: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#6A6A6A',
  },
  list: {
    paddingHorizontal: 20,
  },
  userRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  rankText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: '#EAEAEA',
  },
  userName: {
    fontSize: 14,
    color: '#4A4A4A',
  },
  xpText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6A6A6A',
  },
});

export default RankingScreen;
