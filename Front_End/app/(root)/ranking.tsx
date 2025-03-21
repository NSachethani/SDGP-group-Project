import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, FlatList, ImageBackground } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useUser } from '@clerk/clerk-expo';

// Interface for user data structure in ranking list
interface UserItem {
  rank: number;
  name: string;
  xp: number;
}

const RankingScreen = () => {
  // State management for user XP and authentication
  const [currentUserXP, setCurrentUserXP] = useState<number>(0);
  const { user } = useUser();

  /**
   * Formats the user's full name to show only first and last name
   * @param fullName - The complete name string from Clerk
   * @returns Formatted name string or 'Loading...' if name is not available
   */
  const formatUserName = (fullName: string | null | undefined) => {
    if (!fullName) return 'Loading...';
    
    const nameParts = fullName.trim().split(' ');
    if (nameParts.length === 1) return nameParts[0];
    
    const firstName = nameParts[0];
    const lastName = nameParts[nameParts.length - 1];
    return `${firstName} ${lastName}`;
  };

  // Load and refresh XP data when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      const loadUserXP = async () => {
        try {
          const savedProgress = await AsyncStorage.getItem('userProgress_1');
          if (savedProgress) {
            const progress = JSON.parse(savedProgress);
            setCurrentUserXP(progress.xp || 0);
          }
        } catch (error) {
          console.error('Error loading XP:', error);
        }
      };

      loadUserXP();
      const interval = setInterval(loadUserXP, 500); // Refresh XP every 500ms
      return () => clearInterval(interval);
    }, [])
  );

  // Mock data for ranking list with current user at top
  const users: UserItem[] = [
    { 
      rank: 1, 
      name: formatUserName(user?.fullName || user?.username), 
      xp: currentUserXP 
    },
    { rank: 2, name: 'User not found', xp: 0 },
    { rank: 3, name: 'User not found', xp: 0 },
  ];

  /**
   * Determines which badge image to display based on XP level
   * @param xp - Current XP points
   * @returns Path to appropriate badge image
   */
  const getBadgeImage = (xp: number) => {
    if (xp >= 500) {
      return require('@/assets/images/gold.png');
    } else if (xp >= 100) {
      return require('@/assets/images/silver.png');
    } else {
      return require('@/assets/images/bronze.png');
    }
  };

  /**
   * Determines user's rank title based on XP level
   * @param xp - Current XP points
   * @returns Appropriate rank title string
   */
  const getRankTitle = (xp: number) => {
    if (xp >= 500) {
      return 'Elite Master';
    } else if (xp >= 100) {
      return 'Advanced Warrior';
    } else {
      return 'Skilled Fighter';
    }
  };

  // Render individual user row in ranking list
  const renderUser = ({ item }: { item: UserItem }) => (
    <View style={[
      styles.userRow,
      item.rank === 1 ? styles.currentUserRow : null
    ]}>
      <Text style={styles.rankText}>#{item.rank}</Text>
      <View style={styles.userInfo}>
        <Image
          style={styles.avatar}
          source={getBadgeImage(item.xp)}
        />
        <View style={styles.nameContainer}>
          <Text style={[
            styles.userName,
            item.rank === 1 ? styles.currentUserName : null
          ]}
          numberOfLines={2}
          ellipsizeMode="tail"
          >
            {item.name}
          </Text>
        </View>
      </View>
      <View style={styles.xpContainer}>
        <Text style={styles.xpText}>{item.xp} XP</Text>
      </View>
    </View>
  );

  return (
    <ImageBackground
      source={require('@/assets/images/backImg.jpg')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.container}>
        {/* Header section */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>World Ranking</Text>
        </View>

        {/* User achievement display section */}
        <View style={styles.achievementSection}>
          <Image
            source={getBadgeImage(currentUserXP)}
            style={styles.badge}
          />
          <Text style={styles.rankTitle}>{getRankTitle(currentUserXP)}</Text>
          <Text style={styles.subtitle}>Current XP: {currentUserXP}</Text>
        </View>

        {/* Ranking list */}
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

// Styles definition for the ranking screen
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
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginVertical: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
    borderRadius: 12,
    width: '100%',
  },
  rankText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    width: 40, // Fixed width for rank
    textAlign: 'center',
  },
  userInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  nameContainer: {
    flex: 1,
    paddingRight: 10,
  },
  userName: {
    fontSize: 16,
    color: '#333',
    flexWrap: 'wrap',
  },
  xpContainer: {
    width: 70, // Fixed width for XP
    alignItems: 'flex-end',
  },
  xpText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 16,
    color: '#6A6A6A',
    fontWeight: '500',
  },
  currentUserRow: {
    backgroundColor: 'rgba(168, 216, 234, 0.67)', // Light blue background for current user
  },
  currentUserName: {
    color: '#000000',
    fontWeight: 'bold',
  }
});

export default RankingScreen;
