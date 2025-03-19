import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, FlatList, ImageBackground } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useUser } from '@clerk/clerk-expo';  // Add this import

interface UserItem {
  rank: number;
  name: string;
  xp: number;
}

const RankingScreen = () => {
  const [currentUserXP, setCurrentUserXP] = useState<number>(0);
  const { user } = useUser(); // Add this to get current user

  // Add this function to format the user's name
  const formatUserName = (fullName: string | null | undefined) => {
    if (!fullName) return 'Loading...';
    
    const nameParts = fullName.trim().split(' ');
    if (nameParts.length === 1) return nameParts[0];
    
    const firstName = nameParts[0];
    const lastName = nameParts[nameParts.length - 1];
    return `${firstName} ${lastName}`;
  };

  // Update useFocusEffect to be more responsive
  useFocusEffect(
    React.useCallback(() => {
      const loadUserXP = async () => {
        try {
          const savedProgress = await AsyncStorage.getItem('userProgress_1');
          if (savedProgress) {
            const progress = JSON.parse(savedProgress);
            setCurrentUserXP(progress.xp || 0);
            console.log('Current XP:', progress.xp);
          }
        } catch (error) {
          console.error('Error loading XP:', error);
        }
      };

      // Load XP immediately when screen comes into focus
      loadUserXP();

      // Set up interval to check for XP updates
      const interval = setInterval(loadUserXP, 500);
      return () => clearInterval(interval);
    }, [])
  );

  // Update the users array to use the formatted name
  const users: UserItem[] = [
    { 
      rank: 1, 
      name: formatUserName(user?.fullName || user?.username), 
      xp: currentUserXP 
    },
    { rank: 2, name: 'User not found', xp: 0 },
    { rank: 3, name: 'User not found', xp: 0 },
  ];

  // Update getBadgeImage function to return correct badges based on XP
  const getBadgeImage = (xp: number) => {
    if (xp >= 500) {
      return require('@/assets/images/gold.png');
    } else if (xp >= 100) {
      return require('@/assets/images/silver.png');
    } else {
      return require('@/assets/images/bronze.png');
    }
  };

  // Function to determine rank title based on XP
  const getRankTitle = (xp: number) => {
    if (xp >= 500) {
      return 'Elite Master';
    } else if (xp >= 100) {
      return 'Advanced Warrior';
    } else {
      return 'Skilled Fighter';
    }
  };

  const renderUser = ({ item }: { item: UserItem }) => (
    <View style={[
      styles.userRow,
      item.rank === 1 ? styles.currentUserRow : null // Add highlight for current user
    ]}>
      <Text style={styles.rankText}>#{item.rank}</Text>
      <View style={styles.userInfo}>
        <Image
          style={styles.avatar}
          source={getBadgeImage(item.xp)}
        />
        <Text style={[
          styles.userName,
          item.rank === 1 ? styles.currentUserName : null // Add highlight for current user name
        ]}>
          {item.name}
        </Text>
      </View>
      <Text style={styles.xpText}>{item.xp} XP</Text>
    </View>
  );

  return (
    <ImageBackground
      source={require('@/assets/images/backImg.jpg')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>World Ranking</Text>
        </View>
        <View style={styles.achievementSection}>
          <Image
            source={getBadgeImage(currentUserXP)}
            style={styles.badge}
          />
          <Text style={styles.rankTitle}>{getRankTitle(currentUserXP)}</Text>
          <Text style={styles.subtitle}>Current XP: {currentUserXP}</Text>
        </View>
        <FlatList
          data={users}
          renderItem={renderUser}
          keyExtractor={(item) => item.rank.toString()}
          contentContainerStyle={styles.list}
        />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
  },
  container: {
    flex: 1,
    paddingTop: 40,
    backgroundColor: 'transparent', 
  },
  header: {
    backgroundColor: 'rgba(216, 230, 255, 0.9)', 
    borderRadius: 15,
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
    width: 150,
    height:150,
    resizeMode: 'contain',
  },
  rankTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: 'red',
    marginVertical: 10,
  },
  list: {
    paddingHorizontal: 20,
  },
  userRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
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
    width: 50,
    height: 50,
    marginRight: 10,
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
  subtitle: {
    fontSize: 16,
    color: '#6A6A6A',
    fontWeight: '500',
  },
  currentUserRow: {
    backgroundColor: 'rgba(168, 216, 234, 0.5)', // Light blue background for current user
  },
  currentUserName: {
    color: '#000000',
    fontWeight: 'bold',
  }
});

export default RankingScreen;
