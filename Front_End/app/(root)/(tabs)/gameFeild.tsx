import React, { useState } from 'react';
import { Image, ImageBackground, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Alert, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Animated } from 'react-native';
import { router } from 'expo-router';


interface UserProgress {
  completedCoins: string[];
  coins: number;
  hearts: number;
  treasureClaimed: boolean;
  nextHeartTime: string | null;
}

interface GameFieldProps {
  userId: string;
}

export default function GameField({ userId }: GameFieldProps) {

  const handleRankPress = () => {
    router.push('/(root)/ranking');
  };

  const [isTransitioning, setIsTransitioning] = useState(false);
  const rotateAnim = React.useRef(new Animated.Value(0)).current;

  // State to manage the visibility of the text box for the book icon
  const [isTextBoxVisible, setIsTextBoxVisible] = useState(false);

  // State to manage the visibility of the text box for Coin 1
  const [isCoin1TextVisible, setIsCoin1TextVisible] = useState(false);

  // State to manage the unit number
  const [unitNumber, setUnitNumber] = useState(1);

  const [selectedCoin, setSelectedCoin] = useState<string | null>(null);
  const [showQuestion, setShowQuestion] = useState(false);
  const [completedCoins, setCompletedCoins] = useState<string[]>([]);

  const [hearts, setHearts] = useState(3);
  const [coins, setCoins] = useState(0);
  const [showCoinModal, setShowCoinModal] = useState(false);
  const [showHeartModal, setShowHeartModal] = useState(false);

  const [showTreasureModal, setShowTreasureModal] = useState(false);
  const [treasureClaimed, setTreasureClaimed] = useState(false);

  const [nextHeartTime, setNextHeartTime] = useState<Date | null>(null);
  const [timeUntilNextHeart, setTimeUntilNextHeart] = useState<string>('');

  const handleCloseQuestion = () => {
    setShowQuestion(false);
    setSelectedCoin(null);
  };

  const toggleTextBox = () => {
    setIsTextBoxVisible(!isTextBoxVisible);
  };
  const toggleCoin1TextBox = () => {
    setIsCoin1TextVisible(!isCoin1TextVisible);
  };

  const updateUnitNumber = React.useCallback(() => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    
    Animated.sequence([
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      })
    ]).start(() => {
      setUnitNumber(prev => (prev === 1 ? 2 : 1));
      rotateAnim.setValue(0);
      setIsTransitioning(false);
    });
  }, [isTransitioning, rotateAnim]);

  const toggleCoinModal = () => {
    setShowCoinModal(!showCoinModal);
  };
  
  const toggleHeartModal = () => {
    setShowHeartModal(!showHeartModal);
  };
  
  const buyHeart = async () => {
    if (coins >= 10) {
      setCoins(prevCoins => prevCoins - 10);
      setHearts(prevHearts => prevHearts + 1);
      Alert.alert("Success!", "You bought 1 heart!");
      await saveProgress();
    } else {
      Alert.alert("Not enough coins!", "You need 10 coins to buy a heart.");
    }
  };

  const toggleTreasureModal = () => {
    if (!treasureClaimed) {
      setShowTreasureModal(true);
    }
  };
  
  const claimTreasure = async () => {
    setCoins(prevCoins => prevCoins + 50);
    setTreasureClaimed(true);
    setShowTreasureModal(false);
    Alert.alert("Success!", "You claimed 50 coins!");
    await saveProgress();
  };

React.useEffect(() => {
  saveProgress();
}, [hearts, coins, completedCoins, treasureClaimed, nextHeartTime, userId]);

  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    
    const updateHeartTimer = () => {
      try {
        if (nextHeartTime) {
          const now = new Date();
          const timeDiff = nextHeartTime.getTime() - now.getTime();
          
          if (timeDiff <= 0) {
            setHearts(prev => prev + 1);
            // Change to 60 minutes (60 * 60 * 1000 milliseconds)
            setNextHeartTime(new Date(Date.now() + 60 * 60 * 1000));
          } else {
            const minutes = Math.floor(timeDiff / (1000 * 60));
            const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
            setTimeUntilNextHeart(`${minutes}:${seconds.toString().padStart(2, '0')}`);
          }
        }
      } catch (error) {
        console.error('Error updating heart timer:', error);
      }
    };
  
    timer = setInterval(updateHeartTimer, 1000);
    return () => clearInterval(timer);
  }, [hearts, nextHeartTime]);

  const saveProgress = async () => {
    try {
      const progress: UserProgress = {
        completedCoins,
        coins,
        hearts,
        treasureClaimed,
        nextHeartTime: nextHeartTime?.toISOString() || null
      };
      await AsyncStorage.setItem(`userProgress_${userId}`, JSON.stringify(progress));
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  const loadProgress = async () => {
    try {
      const savedProgress = await AsyncStorage.getItem(`userProgress_${userId}`);
      if (savedProgress) {
        const progress: UserProgress = JSON.parse(savedProgress);
        setCompletedCoins(progress.completedCoins);
        setCoins(progress.coins);
        setHearts(progress.hearts);
        setTreasureClaimed(progress.treasureClaimed);
        if (progress.nextHeartTime) {
          setNextHeartTime(new Date(progress.nextHeartTime));
        }
      }
    } catch (error) {
      console.error('Error loading progress:', error);
    }
  };

  React.useEffect(() => {
    loadProgress();
  }, []);



  const questions = {
    unit1: [
      {
        id: 'coin1',
        question: "What does HTML stand for?",
        options: [
          "Hyper Text Markup Language",
          "High Tech Modern Language",
          "Hyper Transfer Markup Level"
        ],
        correct: 0
      },
      {
        id: 'coin2',
        question: "Which tag is used for creating a hyperlink?",
        options: [
          "<link>",
          "<a>",
          "<href>"
        ],
        correct: 1
      },
      {
        id: 'coin3',
        question: "What is the correct HTML element for the largest heading?",
        options: [
          "<heading>",
          "<h6>",
          "<h1>"
        ],
        correct: 2
      },
      {
        id: 'coin4',
        question: "Which HTML attribute is used to define inline styles?",
        options: [
          "style",
          "css",
          "format"
        ],
        correct: 0
      },
      {
        id: 'coin5',
        question: "Which HTML element defines the title of a document?",
        options: [
          "<meta>",
          "<head>",
          "<title>"
        ],
        correct: 2
      }
    ],
    unit2: [
      {
        id: 'coin1Unit2',
        question: "What is CSS?",
        options: [
          "Computer Style Sheets",
          "Cascading Style Sheets",
          "Creative Style System"
        ],
        correct: 1
      },
      {
        id: 'coin2Unit2',
        question: "Which property is used to change text color?",
        options: [
          "text-color",
          "font-color",
          "color"
        ],
        correct: 2
      },
      {
        id: 'coin3Unit2',
        question: "How do you add a background color?",
        options: [
          "background-color",
          "bgcolor",
          "color-background"
        ],
        correct: 0
      },
      {
        id: 'coin4Unit2',
        question: "Which CSS property controls text size?",
        options: [
          "text-size",
          "font-size",
          "text-style"
        ],
        correct: 1
      },
      {
        id: 'coin5Unit2',
        question: "How to make text bold in CSS?",
        options: [
          "font-weight: bold",
          "text-bold: true",
          "bold: true"
        ],
        correct: 0
      }
    ]
  };

  const handleCoinPress = (coinId: string) => {
    if (hearts > 0) {
      setSelectedCoin(coinId);
      setShowQuestion(true);
    } else {
      Alert.alert(
        "No Hearts Left!", 
        `Wait ${timeUntilNextHeart} minutes for next heart or buy more hearts.`
      );
    }
  };
  
  const handleAnswer = async (selectedOption: number, correctOption: number | undefined) => {
    setHearts(prev => {
      const newHearts = prev - 1;
      if (!nextHeartTime) {
        // Change to 60 minutes
        setNextHeartTime(new Date(Date.now() + 60 * 60 * 1000));
      }
      return newHearts;
    });
  
    if (selectedOption === correctOption) {
      if (selectedCoin) {
        const newCompletedCoins = [...completedCoins, selectedCoin];
        setCompletedCoins(newCompletedCoins);
      }
      Alert.alert("Correct!", "Well done!");
    } else {
      Alert.alert("Wrong Answer", "Try again!");
    }
    setShowQuestion(false);
    setSelectedCoin(null);
    await saveProgress();
  };

  const sectionIntroText = `Welcome to the Section 01! 🎮

Start your coding journey by collecting coins and answering questions. Each coin holds a question about web development basics. You have 3 hearts - use them wisely!

Complete all questions to unlock special rewards. Good luck! 🌟`;

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('@/assets/images/backImg.jpg')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.topBar}>
          <TouchableOpacity onPress={toggleCoinModal} style={styles.topItemContainer}>
            <View style={styles.topItemBox}>
              <Image source={require('@/assets/images/dollar.png')} style={styles.topIcon} />
              <Text style={styles.topText}>{coins}</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={toggleHeartModal} style={styles.topItemContainer}>
            <View style={styles.topItemBox}>
              <Image source={require('@/assets/images/heart.png')} style={styles.topIcon} />
              <Text style={styles.topText}>{hearts}</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleRankPress}>
          <Image 
            source={require('@/assets/images/rank3.png')} 
            style={styles.rankBadge} 
          />
        </TouchableOpacity>
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

        <TouchableOpacity 
  onPress={updateUnitNumber}
  disabled={isTransitioning}
  style={{ opacity: isTransitioning ? 0.5 : 1 }}
>
<Animated.Image
  source={unitNumber === 2  // Changed from unitNumber === 1
    ? require('@/assets/images/upArrow.png')
    : require('@/assets/images/arrow.png')}
  style={[
    styles.arrowIcon,
    {
      transform: [{
        rotate: rotateAnim.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '180deg']
        })
      }]
    }
  ]}
/>
</TouchableOpacity>

        {isTextBoxVisible && (
          <View style={styles.textBox}>
            <TouchableOpacity 
              onPress={toggleTextBox}
              style={styles.closeButton}
            >
              <Image 
                source={require('@/assets/images/close.png')} 
                style={styles.closeIcon} 
              />
            </TouchableOpacity>
            <Image
              source={require('@/assets/images/book.png')}
              style={styles.textBoxIcon}
            />
            <Text style={styles.textBoxTitle}>Section Introduction</Text>
            <Text style={styles.textBoxText}>{sectionIntroText}</Text>
          </View>
        )}

        {unitNumber === 1 ? (
          <>
            <TouchableOpacity 
              onPress={() => handleCoinPress('coin1')} 
              style={[styles.coinContainer, styles.coin1]}
            >
              <Image 
                source={completedCoins.includes('coin1') 
                  ? require('@/assets/images/coin2.png') 
                  : require('@/assets/images/coin.png')
                } 
                style={[styles.coin, styles.coin1]}
              />
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => handleCoinPress('coin2')} 
              style={[styles.coinContainer, styles.coin2]}
            >
              <Image 
                source={completedCoins.includes('coin2') 
                  ? require('@/assets/images/coin2.png') 
                  : require('@/assets/images/coin.png')
                } 
                style={[styles.coin, styles.coin1]}
              />
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => handleCoinPress('coin3')} 
              style={[styles.coinContainer, styles.coin3]}
            >
              <Image 
                source={completedCoins.includes('coin3') 
                  ? require('@/assets/images/coin2.png') 
                  : require('@/assets/images/coin.png')
                } 
                style={[styles.coin, styles.coin1]}
              />
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => handleCoinPress('coin4')} 
              style={[styles.coinContainer, styles.coin4]}
            >
              <Image 
                source={completedCoins.includes('coin4') 
                  ? require('@/assets/images/coin2.png') 
                  : require('@/assets/images/coin.png')
                } 
                style={[styles.coin, styles.coin1]}
              />
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => handleCoinPress('coin5')} 
              style={[styles.coinContainer, styles.coin5]}
            >
              <Image 
                source={completedCoins.includes('coin5') 
                  ? require('@/assets/images/coin2.png') 
                  : require('@/assets/images/coin.png')
                } 
                style={[styles.coin, styles.coin1]}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleCoin1TextBox} style={[styles.coinContainer, styles.speakerIcon]}>
            <Image source={require('@/assets/images/speaker.png')} style={styles.speakerIcon} />
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity 
              onPress={() => handleCoinPress('coin1Unit2')} 
              style={[styles.coinContainer, styles.coin1Unit2]}
            >
              <Image 
                source={completedCoins.includes('coin1Unit2') 
                  ? require('@/assets/images/coin2.png') 
                  : require('@/assets/images/coin.png')
                } 
                style={[styles.coin, styles.coin1Unit2]}
              />
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => handleCoinPress('coin2Unit2')} 
              style={[styles.coinContainer, styles.coin2Unit2]}
            >
              <Image 
                source={completedCoins.includes('coin2Unit2') 
                  ? require('@/assets/images/coin2.png') 
                  : require('@/assets/images/coin.png')
                } 
                style={[styles.coin, styles.coin1Unit2]}
              />
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => handleCoinPress('coin3Unit2')} 
              style={[styles.coinContainer, styles.coin3Unit2]}
            >
              <Image 
                source={completedCoins.includes('coin3Unit2') 
                  ? require('@/assets/images/coin2.png') 
                  : require('@/assets/images/coin.png')
                } 
                style={[styles.coin, styles.coin1Unit2]}
              />
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => handleCoinPress('coin4Unit2')} 
              style={[styles.coinContainer, styles.coin4Unit2]}
            >
              <Image 
                source={completedCoins.includes('coin4Unit2') 
                  ? require('@/assets/images/coin2.png') 
                  : require('@/assets/images/coin.png')
                } 
                style={[styles.coin, styles.coin1Unit2]}
              />
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => handleCoinPress('coin5Unit2')} 
              style={[styles.coinContainer, styles.coin5Unit2]}
            >
              <Image 
                source={completedCoins.includes('coin5Unit2') 
                  ? require('@/assets/images/coin2.png') 
                  : require('@/assets/images/coin.png')
                } 
                style={[styles.coin, styles.coin1Unit2]}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleCoin1TextBox} style={[styles.coinContainer, styles.speakerIconUnit2]}>
            <Image source={require('@/assets/images/speaker.png')} style={styles.speakerIconUnit2} />
            </TouchableOpacity>
          </>
        )}

      <TouchableOpacity 
        onPress={toggleTreasureModal}
        disabled={treasureClaimed}
      >
        <Image 
          source={require('@/assets/images/goldCrate.png')} 
          style={[
            styles.treasureBox,
            treasureClaimed && styles.treasureBoxClaimed
          ]} 
        />
      </TouchableOpacity>


        <Modal
        visible={showQuestion}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedCoin && (
              <>
                <TouchableOpacity 
            onPress={handleCloseQuestion}
            style={styles.closeButton}
          >
            <Image 
              source={require('@/assets/images/close.png')} 
              style={styles.closeIcon} 
            />
          </TouchableOpacity>

                <Text style={styles.questionText}>
                  {unitNumber === 1 
                    ? questions.unit1.find(q => q.id === selectedCoin)?.question
                    : questions.unit2.find(q => q.id === selectedCoin)?.question
                  }
                </Text>
                {(unitNumber === 1 
                  ? questions.unit1.find(q => q.id === selectedCoin)?.options
                  : questions.unit2.find(q => q.id === selectedCoin)?.options
                )?.map((option, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.optionButton}
                    onPress={() => handleAnswer(index, 
                      unitNumber === 1 
                        ? questions.unit1.find(q => q.id === selectedCoin)?.correct
                        : questions.unit2.find(q => q.id === selectedCoin)?.correct
                    )}
                  >
                    <Text style={styles.optionText}>{option}</Text>
                  </TouchableOpacity>
                ))}
              </>
            )}
          </View>
        </View>
      </Modal>


      <Modal
        visible={showCoinModal}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity 
              onPress={toggleCoinModal}
              style={styles.closeButton}
            >
              <Image 
                source={require('@/assets/images/close.png')} 
                style={styles.closeIcon} 
              />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Coins</Text>
            <Text style={styles.modalText}>Current Coins: {coins}</Text>
            <TouchableOpacity style={styles.modalButton}>
              <Image source={require('@/assets/images/buy.png')} style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Buy Coins</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton}>
              <Image source={require('@/assets/images/video.png')} style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Watch Ad for Coins</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
  visible={showHeartModal}
  transparent={true}
  animationType="slide"
>
  <View style={styles.modalContainer}>
    <View style={styles.modalContent}>
      <TouchableOpacity 
        onPress={toggleHeartModal}
        style={styles.closeButton}
      >
        <Image 
          source={require('@/assets/images/close.png')} 
          style={styles.closeIcon} 
        />
      </TouchableOpacity>
      <Text style={styles.modalTitle}>Hearts</Text>
      <Text style={styles.modalText}>Current Hearts: {hearts}</Text>
      {nextHeartTime && (
        <Text style={styles.timerText}>Next heart in: {timeUntilNextHeart}</Text>
      )}
      <TouchableOpacity 
        style={[styles.modalButton, coins < 10 && styles.disabledButton]}
        onPress={buyHeart}
        disabled={coins < 10}
      >
        <Text style={styles.buttonText}>Buy Heart (10 coins)</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>
      <Modal
        visible={showTreasureModal}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, styles.treasureModalContent]}>
            <TouchableOpacity 
              onPress={() => setShowTreasureModal(false)}
              style={styles.closeButton}
            >
              <Image 
                source={require('@/assets/images/close.png')} 
                style={styles.closeIcon} 
              />
            </TouchableOpacity>
            
            <Image 
              source={require('@/assets/images/congrats.png')} 
              style={styles.congratsImage} 
            />
            
            <Text style={styles.treasureTitle}>Congratulations!</Text>
            
            <Image 
              source={require('@/assets/images/dollar.png')} 
              style={styles.treasureCoinImage} 
            />
            
            <Text style={styles.treasureText}>You won 50 coins!</Text>
            
            <TouchableOpacity 
              style={styles.claimButton}
              onPress={claimTreasure}
            >
              <Text style={styles.claimButtonText}>CLAIM NOW!</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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

  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
  modalText: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    marginBottom: 15,
  },
  modalButton: {
    backgroundColor: '#A8D8EA',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  buttonIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  buttonText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
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
    top: '20%',
    left: '10%',
    right: '10%',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 15,
    padding: 25,
    elevation: 5,
    alignItems: 'center',
    zIndex: 10,
    borderWidth: 1,
    borderColor: 'rgba(168, 216, 234, 0.5)',
  },
  textBoxIcon: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
    marginBottom: 15,
  },
  textBoxTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'rgba(99, 14, 156, 1)',
    marginBottom: 15,
    textAlign: 'center',
  },
  textBoxText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'left',
    lineHeight: 24,
    padding: 10,
  },

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  questionText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
    marginTop: 30,
  },
  optionButton: {
    backgroundColor: '#A8D8EA',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  optionText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  closeButton: {
    position: 'absolute',
    right: 10,
    top: 10,
    zIndex: 1,
  },
  closeIcon: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
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
    top:250,
    right: -50,
    resizeMode: 'contain',
  },
  
treasureModalContent: {
  alignItems: 'center',
  paddingTop: 30,
  paddingBottom: 30,
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
},
congratsImage: {
  width: 200,
  height: 100,
  resizeMode: 'contain',
  marginBottom: 20,
},
treasureTitle: {
  fontSize: 28,
  fontWeight: 'bold',
  color: '#FFD700',
  textAlign: 'center',
  marginBottom: 20,
  textShadowColor: 'rgba(0, 0, 0, 0.2)',
  textShadowOffset: { width: 1, height: 1 },
  textShadowRadius: 2,
},
treasureCoinImage: {
  width: 80,
  height: 80,
  resizeMode: 'contain',
  marginBottom: 10,
},
treasureText: {
  fontSize: 22,
  color: '#333',
  textAlign: 'center',
  marginBottom: 30,
},
claimButton: {
  backgroundColor: '#4CAF50',
  paddingHorizontal: 40,
  paddingVertical: 15,
  borderRadius: 25,
  elevation: 5,
},
claimButtonText: {
  color: 'white',
  fontSize: 18,
  fontWeight: 'bold',
},
treasureBoxClaimed: {
  opacity: 0.5,
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
    backfaceVisibility: 'hidden', 
  },
  
  timerText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 15,
  },
});