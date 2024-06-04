import React, {
  useContext,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import {GameContext} from '../App';
import ShopView from './Shop';
import Sound from 'react-native-sound';
import Snackbar from 'react-native-snackbar';

const GameView = ({navigation}) => {
  const songs = useMemo(
    () => [
      {uri: require('../assets/songs/Yellow.mp3'), name: 'Yellow'},
      {uri: require('../assets/songs/ScissorSeven.mp3'), name: 'Scissor Seven'},
      {uri: require('../assets/songs/ForestFly.mp3'), name: 'Forest Fly'},
      {
        uri: require('../assets/songs/KillTheLights.mp3'),
        name: 'Kill The Lights',
      },
      {uri: require('../assets/songs/Shawty.mp3'), name: 'Shawty'},
    ],
    [],
  );

  const sound = useRef(null);
  const levelRef = useRef(level);
  const scoreRef = useRef(score);
  const timerIntervalRef = useRef(null);

  const {
    gold,
    setGold,
    clickMultiplier,
    setClickMultiplier,
    goldMultiplier,
    setGoldMultiplier,
    start,
    setStart,
    score,
    setScore,
    // eslint-disable-next-line no-unused-vars
    damageDone,
    setDamageDone,
    level,
    setLevel,
    enemyHealth,
    setEnemyHealth,
    timer,
    setTimer,
    paused,
    setPaused,
    currentSongIndex,
    setCurrentSongIndex,
    isPlaying,
    setIsPlaying,
    shopVisible,
    setShopVisible,
    isMuted,
    setIsMuted,
  } = useContext(GameContext);

  // Update refs whenever level or score changes
  useEffect(() => {
    levelRef.current = level;
    scoreRef.current = score;
  }, [level, score]);

  Sound.setCategory('Playback');

  const startMusic = () => {
    if (sound.current) {
      sound.current.stop(() => {
        sound.current.play();
      });
    }
  };
  const resetGame = useCallback(() => {
    setScore(0);
    setGold(0);
    setClickMultiplier(1);
    setGoldMultiplier(1);
    setLevel(1);
    setEnemyHealth(25);
    setTimer(10);
    setStart(false);
    setCurrentSongIndex(0);
    setIsPlaying(false);
    startMusic();
  }, [
    setScore,
    setGold,
    setClickMultiplier,
    setGoldMultiplier,
    setLevel,
    setEnemyHealth,
    setTimer,
    setStart,
    setCurrentSongIndex,
    setIsPlaying,
  ]);

  useEffect(() => {
    resetGame();
  }, [resetGame]);

  const setNewSong = useCallback(() => {
    if (sound.current) {
      sound.current.stop(() => {
        sound.current.release();
      });
    }
    sound.current = new Sound(
      songs[currentSongIndex].uri,
      Sound.MAIN_BUNDLE,
      error => {
        if (error) {
          console.log('Error loading sound: ', error);
          return;
        }
        console.log(
          'duration in seconds: ' +
            sound.current.getDuration() +
            ' number of channels: ' +
            sound.current.getNumberOfChannels(),
        );
        if (isPlaying) {
          sound.current.play(success => {
            if (success) {
              console.log('successfully finished playing');
            } else {
              console.log('playback failed due to audio decoding errors');
            }
          });
        }
      },
    );
    sound.current.play();
    setIsPlaying(true);
  }, [currentSongIndex, isPlaying, setIsPlaying, songs]);

  useEffect(() => {
    setNewSong();
  }, [setNewSong]);

  const muteMusic = () => {
    if (!sound.current || !isPlaying) {
      Alert.alert('No song playing currently');
    } else {
      let currentVolume = sound.current.getVolume();
      if (currentVolume !== 0) {
        sound.current.setVolume(0);
        console.log('Current Volume: ' + sound.current.getVolume());
        setIsMuted(true);
      } else {
        sound.current.setVolume(1);
        console.log('Current Volume: ' + sound.current.getVolume());
        setIsMuted(false);
      }
    }
  };

  const startGame = () => {
    setStart(true);
    sound.current.play();
    setIsPlaying(true);
  };

  useEffect(() => {
    if (start && !paused) {
      timerIntervalRef.current = setInterval(() => {
        setTimer(prevTimer => {
          if (prevTimer > 0) {
            return prevTimer - 1;
          } else {
            clearInterval(timerIntervalRef.current);
            navigation.navigate('GameOverScreen', {
              level: levelRef.current,
              score: scoreRef.current,
            });
            if (sound.current) {
              sound.current.stop(() => {
                sound.current.release();
              });
            }
            return prevTimer;
          }
        });
      }, 1000);
    }

    return () => {
      clearInterval(timerIntervalRef.current);
    };
  }, [start, paused, setTimer, navigation]);

  const incrementClicks = () => {
    setScore(prevScore => prevScore + clickMultiplier);
    setGold(prevGold => prevGold + goldMultiplier);
    const damage = clickMultiplier;
    setDamageDone(damage);
    setEnemyHealth(prevHealth => {
      const newHealth = prevHealth - damage;
      if (damage >= prevHealth) {
        levelUp();
      }
      return newHealth;
    });
  };

  const levelUp = useCallback(() => {
    setLevel(prevLevel => {
      const newLevel = prevLevel + 1;
      Snackbar.show({
        text: `Congratulations! Level: ${newLevel}`,
        duration: Snackbar.LENGTH_SHORT,
      });
      setGold(prevGold => prevGold + goldMultiplier * newLevel * 15);
      setDamageDone(0);
      setEnemyHealth(25 * newLevel * 1.1);
      setTimer(10);

      // Check if level is a multiple of 5 + 1
      if (newLevel % 5 === 1) {
        setStart(false);
        const songIndex = Math.floor((newLevel - 1) / songs.length);
        setCurrentSongIndex(songIndex);
        Alert.alert(`New Song Unlocked: \nTitle: ${songs[songIndex].name}`);
      }
      return newLevel;
    });
  }, [
    setLevel,
    setGold,
    setDamageDone,
    setEnemyHealth,
    setTimer,
    goldMultiplier,
    setStart,
    songs,
    setCurrentSongIndex,
  ]);

  const openShop = () => {
    setPaused(true);
    setShopVisible(true);
  };

  const closeShop = () => {
    setPaused(false);
    setShopVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.mainContainer}>
        <Text style={styles.title}>Level: {level}</Text>
        <Text style={styles.timer}>Time Left: {timer} seconds</Text>
        <View style={styles.mainInfoContainer}>
          <Text style={styles.score}>Score: {score}</Text>
          <Text style={styles.score}>
            Enemy Health: {enemyHealth.toFixed(1)}
          </Text>
        </View>
        <View style={styles.sideInfoContainer}>
          <Text style={styles.score}>Gold: ${gold.toFixed(2)}</Text>
          <Text style={styles.score}>
            Click Multiplier: {clickMultiplier.toFixed(1)}x
          </Text>
          <Text style={styles.score}>
            Gold Multiplier: {goldMultiplier.toFixed(1)}x
          </Text>
        </View>
        {!start ? (
          <TouchableOpacity style={styles.mainButton} onPress={startGame}>
            <Text style={styles.mainButtonText}>Start</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.mainButton} onPress={incrementClicks}>
            <Text style={styles.mainButtonText}>Click me!</Text>
          </TouchableOpacity>
        )}
        <View style={styles.menuButtons}>
          <TouchableOpacity style={styles.button} onPress={openShop}>
            <Text style={styles.buttonText}>Shop</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={resetGame}>
            <Text style={styles.buttonText}>Reset</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('MainMenuScreen')}>
            <Text style={styles.buttonText}>Main Menu</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.musicContainer}>
          <View style={styles.musicControls}>
            {isMuted ? (
              <TouchableOpacity
                style={styles.controlButton}
                onPress={muteMusic}>
                <Text style={styles.controlText}>Unmute</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.controlButton}
                onPress={muteMusic}>
                <Text style={styles.controlText}>Mute</Text>
              </TouchableOpacity>
            )}
            <View style={styles.musicInfo}>
              <Text style={styles.musicText}>
                {songs[currentSongIndex].name}
              </Text>
              <Text style={styles.artistText}>by Dragon</Text>
            </View>
          </View>
        </View>
      </View>
      <Modal
        animationType="fade"
        visible={shopVisible}
        onRequestClose={closeShop}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ShopView
              gold={gold}
              setGold={setGold}
              clickMultiplier={clickMultiplier}
              setClickMultiplier={setClickMultiplier}
              goldMultiplier={goldMultiplier}
              setGoldMultiplier={setGoldMultiplier}
              closeShop={closeShop}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  mainContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainInfoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  sideInfoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuButtons: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  title: {
    fontSize: 30,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  score: {
    fontSize: 15,
    marginBottom: 5,
  },
  button: {
    fontSize: 18,
    alignItems: 'center',
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
  mainButton: {
    backgroundColor: 'red',
    padding: 35,
    borderRadius: 5,
    marginTop: 25,
    marginBottom: 25,
    color: '#000',
  },
  mainButtonText: {
    fontSize: 50,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  musicContainer: {
    flex: 1,
    padding: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    position: 'fixed',
    bottom: 0,
    width: 100,
    lineHeight: 1,
  },
  musicInfo: {
    flex: 1,
    flexDirection: 'row',
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 10,
    paddingBottom: 5,
    gap: 10,
  },
  musicText: {
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  artistText: {
    textAlign: 'center',
  },
  controlButton: {
    padding: 5,
    borderRadius: 5,
    backgroundColor: '#FFD700',
  },
  controlText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default GameView;
