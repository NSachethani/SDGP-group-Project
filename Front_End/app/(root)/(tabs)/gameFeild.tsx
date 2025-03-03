import React, { useState } from 'react';
import { Image, ImageBackground, StyleSheet, View, Text, TouchableOpacity } from 'react-native';

export default function GameField() {
  // State to manage the visibility of the text box for the book icon
  const [isTextBoxVisible, setIsTextBoxVisible] = useState(false);

  // State to manage the visibility of the text box for Coin 1
  const [isCoin1TextVisible, setIsCoin1TextVisible] = useState(false);

  // State to manage the unit number
  const [unitNumber, setUnitNumber] = useState(1);

  const toggleTextBox = () => {
    setIsTextBoxVisible(!isTextBoxVisible);
  };

  const toggleCoin1TextBox = () => {
    setIsCoin1TextVisible(!isCoin1TextVisible);
  };

  const updateUnitNumber = () => {
    setUnitNumber((prevUnitNumber) => (prevUnitNumber === 1 ? 2 : 1)); // Toggle between 1 and 2
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('@/assets/images/backImg.jpg')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.topBar}>
          <View style={styles.topItemContainer}>
            <View style={styles.topItemBox}>
              <Image source={require('@/assets/images/dollar.png')} style={styles.topIcon} />
              <Text style={styles.topText}>1000</Text>
            </View>
          </View>

          <View style={styles.topItemContainer}>
            <View style={styles.topItemBox}>
              <Image source={require('@/assets/images/heart.png')} style={styles.topIcon} />
              <Text style={styles.topText}>5</Text>
            </View>
          </View>

          <Image source={require('@/assets/images/rank3.png')} style={styles.rankBadge} />
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionText}>
            SECTION 1, UNIT {unitNumber} {'\n'}
            <Text style={styles.sectionSubText}>GETTING START WITH US</Text>
          </Text>
          <View style={styles.line} />

          <TouchableOpacity onPress={toggleTextBox}>
            <Image
              source={require('@/assets/images/book.png')}
              style={styles.bookIcon}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={updateUnitNumber}>
          <Image
            source={unitNumber === 1
              ? require('@/assets/images/arrow.png')
              : require('@/assets/images/upArrow.png')}
            style={styles.arrowIcon}
          />
        </TouchableOpacity>

        {isTextBoxVisible && (
          <View style={styles.textBox}>
            <Text style={styles.textBoxText}>Section Intro..</Text>
          </View>
        )}

        {unitNumber === 1 ? (
          <>
            <TouchableOpacity onPress={toggleCoin1TextBox} style={[styles.coinContainer, styles.coin1]}>
            <Image source={require('@/assets/images/coin.png')} style={[styles.coin, styles.coin1]}/>
            </TouchableOpacity>

            <TouchableOpacity onPress={toggleCoin1TextBox} style={[styles.coinContainer, styles.coin2]}>
            <Image source={require('@/assets/images/coin.png')} style={[styles.coin, styles.coin2]} />
            </TouchableOpacity>

            <TouchableOpacity onPress={toggleCoin1TextBox} style={[styles.coinContainer, styles.coin3]}>
            <Image source={require('@/assets/images/coin.png')} style={[styles.coin, styles.coin3]} />
            </TouchableOpacity>

            <TouchableOpacity onPress={toggleCoin1TextBox} style={[styles.coinContainer, styles.coin4]}>
            <Image source={require('@/assets/images/coin.png')} style={[styles.coin, styles.coin4]} />
            </TouchableOpacity>

            <TouchableOpacity onPress={toggleCoin1TextBox} style={[styles.coinContainer, styles.coin5]}>
            <Image source={require('@/assets/images/coin.png')} style={[styles.coin, styles.coin5]} />
            </TouchableOpacity>

            <TouchableOpacity onPress={toggleCoin1TextBox} style={[styles.coinContainer, styles.speakerIcon]}>
            <Image source={require('@/assets/images/speaker.png')} style={styles.speakerIcon} />
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity onPress={toggleCoin1TextBox} style={[styles.coinContainer, styles.coin1Unit2]}>
            <Image source={require('@/assets/images/coin.png')} style={[styles.coin, styles.coin1Unit2]}/>
            </TouchableOpacity>

            <TouchableOpacity onPress={toggleCoin1TextBox} style={[styles.coinContainer, styles.coin2Unit2]}>
            <Image source={require('@/assets/images/coin.png')} style={[styles.coin, styles.coin2Unit2]} />
            </TouchableOpacity>

            <TouchableOpacity onPress={toggleCoin1TextBox} style={[styles.coinContainer, styles.coin3Unit2]}>
            <Image source={require('@/assets/images/coin.png')} style={[styles.coin, styles.coin3Unit2]} />
            </TouchableOpacity>

            <TouchableOpacity onPress={toggleCoin1TextBox} style={[styles.coinContainer, styles.coin4Unit2]}>
            <Image source={require('@/assets/images/coin.png')} style={[styles.coin, styles.coin4Unit2]} />
            </TouchableOpacity>

            <TouchableOpacity onPress={toggleCoin1TextBox} style={[styles.coinContainer, styles.coin5Unit2]}>
            <Image source={require('@/assets/images/coin.png')} style={[styles.coin, styles.coin5Unit2]} />
            </TouchableOpacity>

            <TouchableOpacity onPress={toggleCoin1TextBox} style={[styles.coinContainer, styles.speakerIconUnit2]}>
            <Image source={require('@/assets/images/speaker.png')} style={styles.speakerIconUnit2} />
            </TouchableOpacity>
          </>
        )}

{isCoin1TextVisible && (
  <View style={styles.textBox}>
    <Text style={styles.textBoxText}>Hello!</Text>
  </View>
)}

        <Image source={require('@/assets/images/goldCrate.png')} style={styles.treasureBox} />
      </ImageBackground>

      <View style={styles.horizontalLine} />
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
    backgroundColor: 'rgba(239, 221, 221, 1)',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 3,
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
  textBox: {
    position: 'absolute',
    top: '40%',
    left: '10%',
    right: '10%',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 10,
    padding: 20,
    elevation: 4,
    alignItems: 'center',
    zIndex: 10,
  },
  textBoxText: {
    fontSize: 16,
    color: 'rgba(99, 14, 156, 1)',
    textAlign: 'center',
  },
  coinContainer: {
    position: 'absolute',
    width: 70,
    height: 70,
  },
  coin: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  coin1: { top: '25%', left: '45%' },
  coin2: { top: '35%', left: '25%' },
  coin3: { top: '53%', left: '26%' },
  coin4: { top: '62%', left: '55%' },
  coin5: { top: '72%', left: '23%' },
  coin1Unit2: { top: '25%', left: '30%' },
  coin2Unit2: { top: '35%', left: '55%' },
  coin3Unit2: { top: '50%', left: '60%' },
  coin4Unit2: { top: '60%', left: '35%' },
  coin5Unit2: { top: '72%', left: '60%' },
  speakerIconUnit2: {
    width: 55,
    height: 55,
    position: 'absolute',
    top: '45%',
    left: '26%',
    resizeMode: 'contain',
  },
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
    bottom: 60,
    right: 170,
    resizeMode: 'contain',
  },
  horizontalLine: {
    height: 2,
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    position: 'absolute',
    bottom: 0,
  },
  arrowIcon: {
    position: 'absolute',
    top: 265,
    left: '30%',
    width: 70,
    height: 70,
    resizeMode: 'contain',
  },
});