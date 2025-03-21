// Essential imports for React and React Native components
import React, { useState } from 'react';
import { 
  Image, 
  ImageBackground, 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  GestureResponderEvent 
} from 'react-native';
import { Alert, Modal } from 'react-native';

// Utility imports for storage, animations, routing, and audio
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Animated } from 'react-native';
import { router } from 'expo-router';
import { Audio } from 'expo-av';
import Slider from '@react-native-community/slider';

/**
 * Interface defining the structure of user progress data
 * Stores game state including coins, hearts, and completion status
 */
interface UserProgress {
  completedCoins: string[];    // Array of completed task IDs
  coins: number;               // User's coin balance
  hearts: number;             // Available hearts
  treasureClaimed: boolean;   // Treasure box claim status
  nextHeartTime: string | null; // Timer for next heart regeneration
  xp: number;                 // Experience points
}

/**
 * Props interface for GameField component
 */
interface GameFieldProps {
  userId: string;
}

export default function GameField({ userId }: GameFieldProps) {
  // Navigation handler for ranking page
  const handleRankPress = () => {
    router.push('/(root)/ranking');
  };

  // Animation and transition states
  const [isTransitioning, setIsTransitioning] = useState(false);
  const rotateAnim = React.useRef(new Animated.Value(0)).current;

  // UI visibility states
  const [isTextBoxVisible, setIsTextBoxVisible] = useState(false);
  const [isCoin1TextVisible, setIsCoin1TextVisible] = useState(false);
  const [unitNumber, setUnitNumber] = useState(1);

  // Audio control state
  const [volume, setVolume] = useState(1.0);

  // Game progress states
  const [selectedCoin, setSelectedCoin] = useState<string | null>(null);
  const [showQuestion, setShowQuestion] = useState(false);
  const [completedCoins, setCompletedCoins] = useState<string[]>([]);

  // Resource management states
  const [hearts, setHearts] = useState(3);
  const [coins, setCoins] = useState(0);
  const [xp, setXp] = useState<number>(0);

  // Modal visibility states
  const [showCoinModal, setShowCoinModal] = useState(false);
  const [showHeartModal, setShowHeartModal] = useState(false);
  const [showTreasureModal, setShowTreasureModal] = useState(false);
  const [treasureClaimed, setTreasureClaimed] = useState(false);

  // Heart timer states
  const [nextHeartTime, setNextHeartTime] = useState<Date | null>(null);
  const [timeUntilNextHeart, setTimeUntilNextHeart] = useState<string>('');

  // Breathing exercise states
  const [showBreathingModal, setShowBreathingModal] = useState(false);
  const [isExerciseStarted, setIsExerciseStarted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [breathingPhase, setBreathingPhase] = useState<'in' | 'out' | ''>('');
  const [timeRemaining, setTimeRemaining] = useState(120); // 2 minutes
  const breathingAnimation = React.useRef(new Animated.Value(1)).current;
  const [isExerciseCompleted, setIsExerciseCompleted] = useState(false);

  // Audio player states
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showAudioModal, setShowAudioModal] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [isAudioCompleted, setIsAudioCompleted] = useState(false);

  /**
   * Handlers for UI interaction and visibility
   */
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

  /**
   * Animation handler for unit transition
   * Manages rotation animation and unit number update
   */
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

  /**
   * Modal visibility handlers
   */
  const toggleCoinModal = () => {
    setShowCoinModal(!showCoinModal);
  };
  
  const toggleHeartModal = () => {
    setShowHeartModal(!showHeartModal);
  };
  
  /**
   * Heart purchase handler
   * Validates coin balance and updates resources
   */
  const buyHeart = async () => {
    if (coins >= 10) {
      await playCoinSound();
      setCoins(prevCoins => prevCoins - 10);
      setHearts(prevHearts => prevHearts + 1);
      Alert.alert("Success!", "You bought 1 heart!");
      await saveProgress();
    } else {
      Alert.alert("Not enough coins!", "You need 10 coins to buy a heart.");
    }
  };

  /**
   * Treasure box handlers
   * Manages treasure claiming and reward distribution
   */
  const toggleTreasureModal = () => {
    if (!treasureClaimed) {
      setShowTreasureModal(true);
    }
  };
  
  const claimTreasure = async () => {
    await playCoinSound();
    setCoins(prevCoins => prevCoins + 50);
    setTreasureClaimed(true);
    setShowTreasureModal(false);
    Alert.alert("Success!", "You claimed 50 coins!");
    await saveProgress();
  };

  /**
   * Progress auto-save effect
   * Triggers when key game states change
   */
  React.useEffect(() => {
    saveProgress();
  }, [hearts, coins, completedCoins, treasureClaimed, nextHeartTime, userId]);

  /**
   * Heart regeneration timer effect
   * Updates heart count and timer display
   */
  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    
    const updateHeartTimer = () => {
      try {
        if (nextHeartTime) {
          const now = new Date();
          const timeDiff = nextHeartTime.getTime() - now.getTime();
          
          if (timeDiff <= 0) {
            setHearts(prev => prev + 1);
            setNextHeartTime(new Date(Date.now() + 60 * 60 * 1000)); // 60 minutes
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

  /**
   * Progress save function
   * Persists game state to AsyncStorage
   */
  const saveProgress = async () => {
    try {
      const progress = {
        completedCoins,
        coins,
        hearts,
        treasureClaimed,
        nextHeartTime: nextHeartTime?.toISOString() || null,
        xp
      };
      await AsyncStorage.setItem('userProgress_1', JSON.stringify(progress));
      console.log('Saved progress - XP:', xp);
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  /**
   * Progress load function
   * Retrieves game state from AsyncStorage
   * Initializes default values if no saved progress exists
   */
  const loadProgress = async () => {
    try {
      const savedProgress = await AsyncStorage.getItem('userProgress_1');
      if (savedProgress) {
        const progress: UserProgress = JSON.parse(savedProgress);
        setCompletedCoins(progress.completedCoins || []);
        setCoins(progress.coins || 0);
        setHearts(progress.hearts || 3);
        setTreasureClaimed(progress.treasureClaimed || false);
        setXp(progress.xp || 0);
        if (progress.nextHeartTime) {
          setNextHeartTime(new Date(progress.nextHeartTime));
        }
      } else {
        // Initialize default values
        setCompletedCoins([]);
        setCoins(0);
        setHearts(3);
        setTreasureClaimed(false);
        setXp(0);
      }
    } catch (error) {
      console.error('Error loading progress:', error);
    }
  };

  const questions = {
    unit1: [
      {
        id: 'coin1',
        question: "What can you do to start a digital detox journey?",
        options: [
          "Delete all social media apps immediately",
          "Set specific time limits for app usage",
          "Block all your online friends"
        ],
        correct: 1,
        hint: "Start with small, manageable changes rather than drastic measures. Think about what you can control.",
        hintCost: 5
      },
      {
        id: 'coin2',
        question: "Which activity can help reduce phone addiction?",
        options: [
          "Practice mindful meditation",
          "Watch more YouTube videos",
          "Check notifications frequently"
        ],
        correct: 0,
        hint: "Look for activities that help you stay present and calm, away from screens.",
        hintCost: 5
      },
      {
        id: 'coin3',
        question: "How can you improve your morning routine?",
        options: [
          "Check social media first thing",
          "Set multiple alarms on your phone",
          "Avoid phone use for the first hour"
        ],
        correct: 2,
        hint: "Think about starting your day with real-world activities instead of digital ones.",
        hintCost: 5
      },
      {
        id: 'coin4',
        question: "What's a healthy way to manage social media?",
        options: [
          "Post everything you do",
          "Set designated 'phone-free' times",
          "Keep notifications always on"
        ],
        correct: 1,
        hint: "Consider setting boundaries between your online and offline life.",
        hintCost: 5
      },
      {
        id: 'coin5',
        question: "Which is a sign of digital wellness?",
        options: [
          "Feeling anxious without your phone",
          "Being present in real-life moments",
          "Constantly checking likes"
        ],
        correct: 1,
        hint: "Think about what makes you genuinely engaged with your surroundings.",
        hintCost: 5
      }
    ],
    unit2: [
      {
        id: 'coin1Unit2',
        question: "What helps create better sleep habits?",
        options: [
          "Scrolling before bed",
          "No screen time before bedtime",
          "Sleeping with phone nearby"
        ],
        correct: 1,
        hint: "Consider how screen light affects your sleep cycle and relaxation.",
        hintCost: 5
      },
      {
        id: 'coin2Unit2',
        question: "How can you improve focus?",
        options: [
          "Keep all notifications on",
          "Use 'Do Not Disturb' mode",
          "Check email every 5 minutes"
        ],
        correct: 1,
        hint: "Think about what interrupts your concentration most often.",
        hintCost: 5
      },
      {
        id: 'coin3Unit2',
        question: "What's a healthy social media habit?",
        options: [
          "Comparing yourself to others",
          "Setting boundaries for usage",
          "Following trending topics 24/7"
        ],
        correct: 1,
        hint: "Focus on habits that protect your mental well-being and time.",
        hintCost: 5
      },
      {
        id: 'coin4Unit2',
        question: "Which activity promotes digital balance?",
        options: [
          "Endless scrolling",
          "Constant status updates",
          "Regular outdoor activities"
        ],
        correct: 2,
        hint: "Consider activities that get you away from screens completely.",
        hintCost: 5
      },
      {
        id: 'coin5Unit2',
        question: "What helps maintain digital mindfulness?",
        options: [
          "Regular screen breaks",
          "Increased screen time",
          "Multiple device usage"
        ],
        correct: 0,
        hint: "Think about practices that help you step away from technology periodically.",
        hintCost: 5
      }
    ]
  };

// Add state for hint visibility
const [showHint, setShowHint] = useState(false);
const [currentHint, setCurrentHint] = useState("");
const [purchasedHints, setPurchasedHints] = useState<string[]>([]);

// Add function to handle hint purchase
const handleHintPurchase = (coinId: string, hintCost: number, hint: string) => {
  if (coins >= hintCost && !purchasedHints.includes(coinId)) {
    setCoins(prevCoins => prevCoins - hintCost);
    setPurchasedHints(prev => [...prev, coinId]);
    setCurrentHint(hint);
    setShowHint(true);
    Alert.alert("Hint Unlocked!", "Use this hint wisely!");
    saveProgress();
  } else if (purchasedHints.includes(coinId)) {
    setCurrentHint(hint);
    setShowHint(true);
  } else {
    Alert.alert("Not enough coins!", `You need ${hintCost} coins to get a hint.`);
  }
};

  const handleCoinPress = (coinId: string) => {
    // First check if the task is already completed
    if (completedCoins.includes(coinId)) {
      Alert.alert("Already Completed!", "You have already completed this task!");
      return;
    }
  
    // If not completed, check for hearts
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
    if (selectedOption === correctOption) {
      if (selectedCoin) {
        const newCompletedCoins = [...completedCoins, selectedCoin];
        setCompletedCoins(newCompletedCoins);
        
        // Increment XP by 10
        const newXp = xp + 10;
        setXp(newXp);
        
        // Save progress immediately
        await saveProgress();
        Alert.alert("Correct!", "Well done! +10 XP");
      }
    } else {
      Alert.alert("Wrong Answer", "Try again!");
    }
  
    setHearts(prev => {
      const newHearts = prev - 1;
      if (!nextHeartTime) {
        setNextHeartTime(new Date(Date.now() + 60 * 60 * 1000));
      }
      return newHearts;
    });
    
    setShowQuestion(false);
    setSelectedCoin(null);
  };

  const handleSpeakerPress = () => {
    // Check if breathing exercise is completed
    if (completedCoins.includes('breathing')) {
      Alert.alert("Already Completed!", "You have already completed this breathing exercise!");
      return;
    }
  
    if (hearts > 0) {
      setShowBreathingModal(true);
    } else {
      Alert.alert(
        "No Hearts Left!", 
        `Wait ${timeUntilNextHeart} minutes for next heart or buy more hearts.`
      );
    }
  };

  const adjustVolume = async (newVolume: number) => {
    try {
      if (sound) {
        await sound.setVolumeAsync(newVolume);
        setVolume(newVolume);
      }
    } catch (error) {
      console.error('Error adjusting volume:', error);
    }
  };
  
  const startBreathingExercise = () => {
    setIsExerciseStarted(true);
    setIsExerciseCompleted(false); // Reset completion state
    let secondsLeft = 120;
  
    const breatheIn = () => {
      setBreathingPhase('in');
      Animated.timing(breathingAnimation, {
        toValue: 1.5,
        duration: 4000,
        useNativeDriver: true,
      }).start(() => {
        breatheOut();
      });
    };
  
    const breatheOut = () => {
      setBreathingPhase('out');
      Animated.timing(breathingAnimation, {
        toValue: 1,
        duration: 4000,
        useNativeDriver: true,
      }).start(() => {
        if (secondsLeft > 0) {
          breatheIn();
        }
      });
    };
  
    breatheIn();
  
    const timer = setInterval(() => {
      secondsLeft -= 1;
      setTimeRemaining(secondsLeft);
      
      if (secondsLeft <= 0) {
        clearInterval(timer);
        setIsExerciseStarted(false);
        setBreathingPhase('');
        breathingAnimation.setValue(1);
        setIsExerciseCompleted(true); // Set exercise as completed
      }
    }, 1000);
  
    return () => clearInterval(timer);
  };
  
  const handleDone = async () => {
    setHearts(prev => {
      const newHearts = prev - 1;
      if (!nextHeartTime) {
        setNextHeartTime(new Date(Date.now() + 60 * 60 * 1000));
      }
      return newHearts;
    });
  
    // Add breathing exercise to completed tasks
    setCompletedCoins(prev => [...prev, 'breathing']);
  
    // Update XP and save immediately
    setXp(prevXp => {
      const newXp = prevXp + 10;
      saveProgress();
      return newXp;
    });
  
    setShowBreathingModal(false);
    setIsExerciseStarted(false);
    setBreathingPhase('');
    setProgress(0);
    setTimeRemaining(120);
  
    Alert.alert("Exercise Complete!", "Well done! +10 XP");
  };

  const sectionIntroText = 'Welcome to Section 01! 🌟 Collect hearts and answering questions on social media detox and digital wellness. Engage in mindful activities like quizzes, breathing exercises, and motivational guidance. You have 3 hearts—use them wisely! Complete all tasks to unlock rewards and enhance your digital well-being. Ready to begin? 🎮✨';

const playMotivationalSpeech = async () => {
  // Check if audio task is completed
  if (completedCoins.includes('audio')) {
    Alert.alert("Already Completed!", "You have already completed this motivational speech!");
    return;
  }

  if (hearts > 0) {
    setShowAudioModal(true);
    try {
      // Unload any existing sound before creating a new one
      if (sound) {
        await sound.unloadAsync();
        setSound(null);
      }
      
      const { sound: newSound } = await Audio.Sound.createAsync(
        require('@/assets/audio/motivation.mp3'),
        { shouldPlay: false },
        (status) => {
          if (status.isLoaded) {
            if (status.durationMillis) {
              setAudioProgress(status.positionMillis / status.durationMillis);
            }
            if ('isLoaded' in status && status.isLoaded && status.didJustFinish) {
              setIsPlaying(false);
              setIsAudioCompleted(true);
            }
          }
        }
      );
      setSound(newSound);
      const status = await newSound.getStatusAsync();
      if (status.isLoaded && status.durationMillis) {
        setAudioDuration(status.durationMillis / 1000);
      }
    } catch (error) {
      console.error('Error loading sound:', error);
    }
  } else {
    Alert.alert(
      "No Hearts Left!", 
      `Wait ${timeUntilNextHeart} minutes for next heart or buy more hearts.`
    );
  }
};

const handleAudioComplete = async () => {
  if (sound) {
    await sound.unloadAsync();
  }
  setSound(null);
  setIsPlaying(false);
  setIsAudioCompleted(false);
  setShowAudioModal(false);
  setAudioProgress(0);

  // Add audio task to completed tasks
  setCompletedCoins(prev => [...prev, 'audio']);

  // Update XP and save immediately
  setXp(prevXp => {
    const newXp = prevXp + 10;
    saveProgress();
    return newXp;
  });

  setHearts(prev => {
    const newHearts = prev - 1;
    if (!nextHeartTime) {
      setNextHeartTime(new Date(Date.now() + 60 * 60 * 1000));
    }
    return newHearts;
  });

  Alert.alert("Audio Complete!", "Well done! +10 XP");
};

const getBadgeImage = (xp: number) => {
  if (xp >= 500) {
    return require('@/assets/images/gold.png');
  } else if (xp >= 100) {
    return require('@/assets/images/silver.png');
  } else {
    return require('@/assets/images/bronze.png');
  }
};

const playCoinSound = async () => {
  try {
    const { sound } = await Audio.Sound.createAsync(
      require('@/assets/audio/coin.mp3'),
      { shouldPlay: true }
    );
    await sound.playAsync();
    // Unload sound after playing
    sound.setOnPlaybackStatusUpdate(async (status) => {
      if ('isLoaded' in status && status.isLoaded && status.didJustFinish) {
        await sound.unloadAsync();
      }
    });
  } catch (error) {
    console.error('Error playing coin sound:', error);
  }
};

// Add this function near the top of your component, after state declarations
const formatTimeRemaining = (timeInMinutes: number, timeInSeconds: number) => {
  const minutes = Math.floor(timeInMinutes);
  const seconds = Math.floor(timeInSeconds);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

// Update the timer display in the Heart Modal
const getTimerColor = (minutes: number) => {
  if (minutes <= 5) return '#FF6B6B'; // Red for urgent
  if (minutes <= 15) return '#FFD93D'; // Yellow for warning
  return '#4CAF50'; // Green for normal
};
// The main container of the screen
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('@/assets/images/backImg.jpg')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        {/* Top bar showing coins, hearts, and rank badge */}
        <View style={styles.topBar}>
          {/* Coin button: opens coin modal */}
          <TouchableOpacity onPress={toggleCoinModal} style={styles.topItemContainer}>
            <View style={styles.topItemBox}>
              <Image source={require('@/assets/images/dollar.png')} style={styles.topIcon} />
              <Text style={styles.topText}>{coins}</Text>
            </View>
          </TouchableOpacity>

          {/* Heart button: opens heart modal */}
          <TouchableOpacity onPress={toggleHeartModal} style={styles.topItemContainer}>
            <View style={styles.topItemBox}>
              <Image source={require('@/assets/images/heart.png')} style={styles.topIcon} />
              <Text style={styles.topText}>{hearts}</Text>
            </View>
          </TouchableOpacity>

          {/* Rank badge: navigates to rank page */}
          <TouchableOpacity onPress={handleRankPress}>
            <Image 
              source={getBadgeImage(xp)} 
              style={styles.rankBadge} 
            />
          </TouchableOpacity>
        </View>

        {/* Section header with title and subtext */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionText}>
            SECTION 1, UNIT {unitNumber} {'\n'}
            <Text style={styles.sectionSubText}>GETTING START WITH US</Text>
          </Text>
          <View style={styles.line} />

          {/* Book icon: opens section introduction */}
          <TouchableOpacity onPress={toggleTextBox}>
            <Image
              source={require('@/assets/images/book.png')}
              style={styles.bookIcon}
            />
          </TouchableOpacity>
        </View>

        {/* Arrow icon: toggles between units */}
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

        {/* Text box for showing section introduction */}
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

        {/* Coins and breathing buttons for unit 1 */}
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
            <TouchableOpacity 
            onPress={handleSpeakerPress} 
            style={[styles.coinContainer, styles.speakerIcon]}
          >
            <Image source={require('@/assets/images/breatheicon.png')} style={styles.breatheicon} />
          </TouchableOpacity>
          </>
        ) : (
          <>

            {/* Coins and speaker buttons for unit 2 */}
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
            <TouchableOpacity 
              onPress={playMotivationalSpeech} 
              style={[styles.coinContainer, styles.speakerIconUnit2]}
            >
              <Image 
                source={require('@/assets/images/speaker.png')} 
                style={[
                  styles.speakerIconUnit2,
                  isPlaying && styles.activeSpeaker
                ]} 
              />
            </TouchableOpacity>
          </>
        )}

        {/* Treasure box button */}
        <TouchableOpacity 
          onPress={toggleTreasureModal}
          disabled={treasureClaimed}
          style={[styles.treasureBoxContainer]} // Add new style
        >
          <Image 
            source={require('@/assets/images/goldCrate.png')} 
            style={[
              styles.treasureBox,
              treasureClaimed && styles.treasureBoxClaimed
            ]} 
          />
        </TouchableOpacity>

        {/* Modal for showing questions */} 
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
                {/* Show Hint Button or Hint Text */}
                {!purchasedHints.includes(selectedCoin) ? (
                  <TouchableOpacity
                    style={styles.hintButton}
                    onPress={() => {
                      const question = questions.unit1.find(q => q.id === selectedCoin);
                      if (question && question.hintCost !== undefined && question.hint) {
                        handleHintPurchase(selectedCoin, question.hintCost, question.hint);
                      }
                    }}
                  >
                    <View style={styles.hintButtonContent}>
                      <Image 
                        source={require('@/assets/images/lightbulb.png')} 
                        style={styles.hintIcon} 
                      />
                      <Text style={styles.hintButtonText}>Get Hint (5 coins)</Text>
                    </View>
                  </TouchableOpacity>
                ) : (
                  <View style={styles.hintContainer}>
                    <Image 
                      source={require('@/assets/images/lightbulb.png')} 
                      style={styles.hintIcon} 
                    />
                    <Text style={styles.hintText}>
                      {questions.unit1.find(q => q.id === selectedCoin)?.hint}
                    </Text>
                  </View>
                )}
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Modal for managing coins */}
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

      {/* Modal for managing hearts */}
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
              <View style={styles.timerContainer}>
                <Text style={[
                  styles.timerText,
                  { color: getTimerColor(parseInt(timeUntilNextHeart.split(':')[0])) }
                ]}>
                  Next heart in: {timeUntilNextHeart}
                </Text>
                <View style={styles.timerBar}>
                  <View 
                    style={[
                      styles.timerProgress,
                      {
                        width: `${(parseInt(timeUntilNextHeart.split(':')[0]) / 60) * 100}%`,
                        backgroundColor: getTimerColor(parseInt(timeUntilNextHeart.split(':')[0]))
                      }
                    ]}
                  />
                </View>
              </View>
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
      
      {/* Modal for managing Treasure */}
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

      {/* Modal for Breathing Exercise */}
      <Modal
        visible={showBreathingModal}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {!isExerciseCompleted && (
              <TouchableOpacity 
                onPress={() => setShowBreathingModal(false)}
                style={styles.closeButton}
              >
                <Image 
                  source={require('@/assets/images/close.png')} 
                  style={styles.closeIcon} 
                />
              </TouchableOpacity>
            )}

            <Text style={styles.breathingTitle}>Breathing Exercise</Text>
            
            {!isExerciseStarted && !isExerciseCompleted ? (
              <TouchableOpacity 
                style={styles.startButton}
                onPress={startBreathingExercise}
              >
                <Text style={styles.startButtonText}>Start Exercise</Text>
              </TouchableOpacity>
            ) : isExerciseCompleted ? (
              <View style={styles.exerciseContainer}>
                <Text style={styles.breathingText}>Well done!</Text>
                <TouchableOpacity 
                  style={styles.doneButton}
                  onPress={handleDone}
                >
                  <Text style={styles.doneButtonText}>Done</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.exerciseContainer}>
                <Text style={styles.breathingText}>
                  {breathingPhase === 'in' ? 'Breathe In..' : 'Breathe Out..'}
                </Text>
                
                <Animated.Image
                  source={require('@/assets/images/breathe.png')}
                  style={[
                    styles.breatheImage,
                    {
                      transform: [{ scale: breathingAnimation }]
                    }
                  ]}
                />
                
                <Text style={styles.timerText}>
                  Time remaining: {Math.floor(timeRemaining / 60)}:
                  {(timeRemaining % 60).toString().padStart(2, '0')}
                </Text>
              </View>
            )}
          </View>
        </View>
      </Modal>

      {/* Modal for managing Audio */}
      <Modal
        visible={showAudioModal}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {!isAudioCompleted && !isPlaying && (
              <TouchableOpacity 
                onPress={() => {
                  if (sound) {
                    sound.unloadAsync();
                  }
                  setShowAudioModal(false);
                  setIsPlaying(false);
                }}
                style={styles.closeButton}
              >
                <Image 
                  source={require('@/assets/images/close.png')} 
                  style={styles.closeIcon} 
                />
              </TouchableOpacity>
            )}

            {isPlaying && (
              <View style={styles.volumeControlContainer}>
                <Image 
                  source={require('@/assets/images/soundLow.png')} 
                  style={styles.volumeIcon} 
                />
                <Slider
                  style={styles.volumeSlider}
                  minimumValue={0}
                  maximumValue={1}
                  value={volume}
                  onValueChange={adjustVolume}
                  minimumTrackTintColor="#A8D8EA"
                  maximumTrackTintColor="#000000"
                  thumbTintColor="#A8D8EA"
                />
                <Image 
                  source={require('@/assets/images/soundHigh.png')} 
                  style={styles.volumeIcon} 
                />
              </View>
            )}

            <Text style={styles.modalTitle}>Listen and Get Motivated!</Text>
            
            {!isPlaying && !isAudioCompleted ? (
              <TouchableOpacity 
                style={styles.startButton}
                onPress={async () => {
                  try {
                    if (sound) {
                      await sound.playAsync();
                      setIsPlaying(true);
                    }
                  } catch (error) {
                    console.error('Error playing sound:', error);
                  }
                }}
              >
                <Text style={styles.startButtonText}>Start Listening</Text>
              </TouchableOpacity>
            ) : isAudioCompleted ? (
              <View style={styles.completionContainer}>
                <Text style={styles.completionText}>Well done!</Text>
                <TouchableOpacity 
                  style={styles.doneButton}
                  onPress={handleAudioComplete}
                >
                  <Text style={styles.doneButtonText}>Done</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.audioControlsContainer}>
                <View style={styles.progressBarContainer}>
                  <View 
                    style={[
                      styles.progressBar, 
                      { width: `${audioProgress * 100}%` }
                    ]} 
                  />
                </View>
                
                <Text style={styles.timerText}>
                  {Math.floor((audioProgress * audioDuration) / 60)}:
                  {Math.floor((audioProgress * audioDuration) % 60).toString().padStart(2, '0')} / 
                  {Math.floor(audioDuration / 60)}:
                  {Math.floor(audioDuration % 60).toString().padStart(2, '0')}
                </Text>

                <TouchableOpacity 
                  style={styles.audioControlButton}
                  onPress={async () => {
                    if (sound) {
                      if (isPlaying) {
                        await sound.pauseAsync();
                      } else {
                        await sound.playAsync();
                      }
                      setIsPlaying(!isPlaying);
                    }
                  }}
                >
                  <Image 
                    source={isPlaying ? 
                      require('@/assets/images/pause.png') : 
                      require('@/assets/images/play.png')
                    } 
                    style={styles.audioControlIcon} 
                  />
                  <Text style={styles.audioControlText}>
                    {isPlaying ? 'Pause' : 'Continue'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
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
    width: 100,
    height: 60,
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

audioControlsContainer: {
  alignItems: 'center',
  justifyContent: 'center',
  padding: 20,
},
audioControlButton: {
  backgroundColor: '#A8D8EA',
  flexDirection: 'row',
  alignItems: 'center',
  paddingVertical: 15,
  paddingHorizontal: 30,
  borderRadius: 25,
  marginTop: 20,
},
audioControlIcon: {
  width: 24,
  height: 24,
  marginRight: 10,
  tintColor: '#333',
},
audioControlText: {
  fontSize: 18,
  color: '#333',
  fontWeight: 'bold',
},
volumeControlContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  paddingHorizontal: 20,
  marginTop: 10,
},
volumeSlider: {
  flex: 1,
  height: 40,
  marginHorizontal: 10,
},
volumeIcon: {
  width: 24,
  height: 24,
  resizeMode: 'contain',
},
progressBarContainer: {
  width: '100%',
  height: 10,
  backgroundColor: '#eee',
  borderRadius: 5,
  marginVertical: 20,
  overflow: 'hidden',
},
progressBar: {
  height: '100%',
  backgroundColor: '#A8D8EA',
  borderRadius: 5,
},
completionContainer: {
  alignItems: 'center',
  padding: 20,
},
completionText: {
  fontSize: 24,
  fontWeight: 'bold',
  color: '#4CAF50',
  marginBottom: 20,
},
activeSpeaker: {
  opacity: 0.7,
  transform: [{ scale: 1.1 }]
},
playPauseButton: {
  backgroundColor: '#A8D8EA',
  width: 60,
  height: 60,
  borderRadius: 30,
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: 20,
},
playPauseIcon: {
  width: 30,
  height: 30,
  resizeMode: 'contain',
},
buttonContainer: {
  alignItems: 'center',
  marginVertical: 20,
},
audioButton: {
  backgroundColor: '#A8D8EA',
  width: 60,
  height: 60,
  borderRadius: 30,
  justifyContent: 'center',
  alignItems: 'center',
},
audioButtonIcon: {
  width: 30,
  height: 30,
  resizeMode: 'contain',
},
audioTitle: {
  fontSize: 24,
  fontWeight: 'bold',
  color: '#333',
  textAlign: 'center',
  marginTop: 20,
  marginBottom: 30,
},

  breatheicon:{
    width: 75,
    height: 75,
    position: 'absolute',
    top: '45%',
    left: '58%',
    resizeMode: 'contain',
  },

  breatheImage: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginVertical: 20,
  },
  breathingTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginVertical: 20,
  },
  startButton: {
    backgroundColor: '#A8D8EA',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 20,
  },
  startButtonText: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  exerciseContainer: {
    alignItems: 'center',
    padding: 20,
  },
  breathingText: {
    fontSize: 20,
    fontWeight: 'bold',
    fontStyle: 'italic',
    color: 'purple',
    marginBottom: 20,
  },
  breathingProgressContainer: {
    width: '100%',
    height: 20,
    backgroundColor: '#eee',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 20,
  },
  breathingProgressBar: {
    height: '100%',
    backgroundColor: '#A8D8EA',
    borderRadius: 10,
  },
  doneButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 20,
  },
  doneButtonText: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
    treasureBox: {
      width: '130%',
      height: '130%',
      position: 'absolute',
      top:420,
      right: 150,
      resizeMode: 'contain',
    },
    treasureBoxContainer: {
      position: 'absolute',
      top: 250,
      right: 0,
      width: 90,
      height: 90,
      zIndex: 1, 
      padding: 10, 
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
  timerContainer: {
    alignItems: 'center',
    marginVertical: 15,
    width: '100%',
  },
  timerBar: {
    width: '100%',
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  timerProgress: {
    height: '100%',
    borderRadius: 3,
  },
  hintButton: {
    backgroundColor: 'rgba(71, 3, 105, 0.26)',
    padding: 7,
    borderRadius: 20,
    marginVertical: 10,
    width: '80%',
    alignSelf: 'center',
  },
  hintButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hintIcon: {
    width: 35,
    height: 25,
    marginRight: 8,
  },
  hintButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 14,
  },
  hintContainer: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    padding: 12,
    borderRadius: 8,
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
    alignSelf: 'center',
  },
  hintText: {
    color: '#000',
    fontSize: 14,
    fontStyle: 'italic',
    flex: 1,
    marginLeft: 8,
  }
});