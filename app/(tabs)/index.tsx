import React from 'react';
import { Image, ImageBackground, StyleSheet, View, Text } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      {/* Background Image */}
      <ImageBackground
        source={require('@/assets/images/backImg.jpg')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        {/* Top Icons Section */}
        <View style={styles.topBar}>
          {/* Earned Money */}
          <View style={styles.topItemContainer}>
            <View style={styles.topItemBox}>
              <Image source={require('@/assets/images/dollar.png')} style={styles.topIcon} />
              <Text style={styles.topText}>1000</Text>
            </View>
          </View>

          {/* Heart Icon */}
          <View style={styles.topItemContainer}>
            <View style={styles.topItemBox}>
              <Image source={require('@/assets/images/heart.png')} style={styles.topIcon} />
              <Text style={styles.topText}>5</Text>
            </View>
          </View>

          {/* Rank Badge */}
          <Image source={require('@/assets/images/rank3.png')} style={styles.rankBadge} />
        </View>

        {/* Section Header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionText}>
            SECTION 1, UNIT 1 {'\n'}
            <Text style={styles.sectionSubText}>GETTING START WITH US</Text>
          </Text>
          <View style={styles.line} />
          <Image
            source={require('@/assets/images/book.png')} // Placeholder for book icon
            style={styles.bookIcon}
          />
        </View>

        {/* Coins */}
        <Image source={require('@/assets/images/coin.png')} style={[styles.coin, styles.coin1]} />
        <Image source={require('@/assets/images/coin.png')} style={[styles.coin, styles.coin2]} />
        <Image source={require('@/assets/images/coin.png')} style={[styles.coin, styles.coin3]} />
        <Image source={require('@/assets/images/coin.png')} style={[styles.coin, styles.coin4]} />
        <Image source={require('@/assets/images/coin.png')} style={[styles.coin, styles.coin5]} />

        {/* Speaker Icon */}
        <Image source={require('@/assets/images/speaker.png')} style={styles.speakerIcon} />

        {/* Treasure Box */}
        <Image source={require('@/assets/images/goldCrate.png')} style={styles.treasureBox} />

        {/* Arrow Icon */}
        <Image source={require('@/assets/images/arrow.png')} style={styles.arrowIcon} />
      </ImageBackground>

      {/* Horizontal Line */}
      <View style={styles.horizontalLine} />

      {/* Navigation Bar */}
      <View style={styles.navBar}>
        <Image source={require('@/assets/images/home.png')} style={styles.navIcon} />
        <Image source={require('@/assets/images/rank.png')} style={styles.navIcon} />
        <Image source={require('@/assets/images/forum.png')} style={styles.navIcon} />
        <Image source={require('@/assets/images/notification.png')} style={styles.navIcon} />
        <Image source={require('@/assets/images/settings.png')} style={styles.navIcon} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topBar: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topItemContainer: {
    flexDirection: 'row',
  },
  topItemBox: {
    backgroundColor: '#rgba(239, 221, 221, 1)', 
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 3, // Shadow for depth
  },
  topIcon: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  topText: {
    fontSize: 18,
    color: '#000',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  rankBadge: {
    width: 80,
    height: 40,
    resizeMode: 'contain',
  },
  sectionHeader: {
    position: 'absolute',
    top: 110,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(168, 216, 234, 1)', 
    borderRadius: 10,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 2,
  },
  sectionText: {
    fontSize: 16,
    color: 'rgba(99, 14, 156, 1)',
    fontWeight: 'bold',
  },
  sectionSubText: {
    fontSize: 14,
    color: 'rgba(128, 71, 136, 1)',
  },
  line: {
    height: '100%',
    width: 2,
    backgroundColor: 'rgba(163, 0, 186, 1)',
    marginHorizontal: 10,
  },
  bookIcon: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
  coin: {
    width: 70,
    height: 70,
    position: 'absolute',
    resizeMode: 'contain',
  },
  coin1: { top: '25%', left: '55%' },
  coin2: { top: '35%', left: '25%' },
  coin3: { top: '53%', left: '26%' },
  coin4: { top: '62%', left: '55%' },
  coin5: { top: '72%', left: '23%' },
  speakerIcon: {
    width: 55,
    height: 55,
    position: 'absolute',
    top: '45%',
    left: '58%',
    resizeMode: 'contain',
  },
  treasureBox: {
    width: 90,
    height: 90,
    position: 'absolute',
    bottom: 70,
    resizeMode: 'contain',
  },
  arrowIcon: {
    width: 60,
    height: 60,
    position: 'absolute',
    bottom: 90,
    left:"78%",
    resizeMode: 'contain',
  },
  horizontalLine: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    width: '100%',
    position: 'absolute',
    bottom: 80,
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 80,
    backgroundColor: 'transparent',
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  navIcon: {
    height: 50,
    width: 50,
    resizeMode: 'contain',
    opacity: 0.8,
  },
});
