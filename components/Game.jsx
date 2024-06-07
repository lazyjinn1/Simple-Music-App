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
import RadialGradient from 'react-native-radial-gradient';

const GameView = ({navigation}) => {
  const songs = useMemo(
    () => [
      {uri: require('../assets/songs/Yellow.mp3'), name: 'Yellow'},
      {uri: require('../assets/songs/Business.mp3'), name: 'Business'},
      {uri: require('../assets/songs/Joji.mp3'), name: 'Joji'},
      {uri: require('../assets/songs/Bankroll.mp3'), name: 'Bankroll'},
      {uri: require('../assets/songs/FuckItUp.mp3'), name: 'Fuck It Up'},
      {uri: require('../assets/songs/Latina.mp3'), name: 'Latina'},
      {uri: require('../assets/songs/ScissorSeven.mp3'), name: 'Scissor Seven'},
      {uri: require('../assets/songs/Tinh.mp3'), name: 'Tinh'},
      {uri: require('../assets/songs/30Clip.mp3'), name: '30 Clip'},
      {
        uri: require('../assets/songs/LeaveItBehindCalifornia.mp3'),
        name: 'Leave It Behind California',
      },
      {uri: require('../assets/songs/OnlyBad.mp3'), name: 'Only Bad'},
      {uri: require('../assets/songs/ForestFly.mp3'), name: 'Forest Fly'},
      {uri: require('../assets/songs/PariahNexus.mp3'), name: 'Pariah Nexus'},
      {uri: require('../assets/songs/TheChorus.mp3'), name: 'The Chorus'},
      {
        uri: require('../assets/songs/ImmersiveRealEstate.mp3'),
        name: 'Immersive Real Estate',
      },
      {
        uri: require('../assets/songs/KillTheLights.mp3'),
        name: 'Kill The Lights',
      },
      {uri: require('../assets/songs/Pluto.mp3'), name: 'Pluto'},
      {uri: require('../assets/songs/Pokemon.mp3'), name: 'Pokemon'},
      {uri: require('../assets/songs/LosAngeles.mp3'), name: 'Los Angeles'},
      {uri: require('../assets/songs/Shawty.mp3'), name: 'Shawty'},
      {uri: require('../assets/songs/Enough.mp3'), name: 'Enough'},
      {uri: require('../assets/songs/Camera.mp3'), name: 'Camera'},
      {uri: require('../assets/songs/Vietnamese.mp3'), name: 'Vietnamese'},
      {
        uri: require('../assets/songs/TalkingToBrunoMars.mp3'),
        name: 'Talking To Bruno Mars',
      },
      {uri: require('../assets/songs/Butterfly.mp3'), name: 'Butterfly'},
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
    showNext,
    setShowNext,
    showPrev,
    setShowPrev,
    isDisabled,
    setIsDisabled,
    startTimer,
    setStartTimer,
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

  const startGame = () => {
    setStart(true);
    sound.current.play();
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
      setGold(prevGold => prevGold + goldMultiplier * newLevel);
      setDamageDone(0);
      setEnemyHealth(25 * newLevel * 1.1);
      setTimer(10);

      // Check if level is a multiple of 3 + 1
      if (newLevel % 3 === 1) {
        setStart(false);
        setIsDisabled(true);
        const newSongIndex = Math.floor((newLevel - 1) / 3);
        Alert.alert(`Unlocked a new Song: \n${songs[newSongIndex].name}`);
        const startInterval = setInterval(() => {
          setStartTimer(prevStartTimer => {
            if (prevStartTimer > 1) {
              return prevStartTimer - 1;
            } else {
              clearInterval(startInterval);
              setIsDisabled(false);
              return 3;
            }
          });
        }, 1000);
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
    setIsDisabled,
    songs,
    setStartTimer,
  ]);

  const openShop = () => {
    setPaused(true);
    setShopVisible(true);
  };

  const closeShop = () => {
    setPaused(false);
    setShopVisible(false);
  };

  const showPrevNextButtons = useCallback(() => {
    if (
      !start &&
      level > 3 &&
      level > currentSongIndex * 3 &&
      currentSongIndex > 0
    ) {
      setShowPrev(true);
    } else {
      setShowPrev(false);
    }
    if (
      !start &&
      level > 3 &&
      level > (currentSongIndex + 1) * 3 &&
      currentSongIndex < songs.length - 1
    ) {
      setShowNext(true);
    } else {
      setShowNext(false);
    }
  }, [currentSongIndex, level, setShowNext, setShowPrev, songs.length, start]);

  useEffect(() => {
    showPrevNextButtons();
  }, [showPrevNextButtons]);

  const nextSong = () => {
    if (currentSongIndex === songs.length - 1) {
      sound.current.release;
      setCurrentSongIndex(0); // Loop back to the first song
    } else {
      sound.current.release;
      setCurrentSongIndex(currentSongIndex + 1);
    }
  };

  const prevSong = () => {
    if (currentSongIndex === 0) {
      sound.current.release;
      setCurrentSongIndex(songs.length - 1); // Loop back to the last song
    } else {
      sound.current.release;
      setCurrentSongIndex(currentSongIndex - 1);
    }
  };

  const playSong = () => {
    sound.current.play();
    setIsPlaying(true);
  };

  return (
    <RadialGradient
      style={styles.container}
      colors={['white', 'blue']}
      stops={[0.1, 1]}
      center={[50, 100]}
      radius={600}>
      <View style={styles.mainContainer}>
        <Text style={styles.title}>Level: {level}</Text>
        <Text style={styles.timer}>Time Left: {timer} seconds</Text>
        <View style={styles.mainInfoContainer}>
          <Text style={styles.stats}>Score: {score}</Text>
          <Text style={styles.stats}>
            Enemy Health: {enemyHealth.toFixed(1)}
          </Text>
        </View>
        <View style={styles.sideInfoContainer}>
          <Text style={styles.stats}>Gold: ${gold.toFixed(2)}</Text>
          <Text style={styles.stats}>
            Click Multiplier: {clickMultiplier.toFixed(1)}x
          </Text>
          <Text style={styles.stats}>
            Gold Multiplier: {goldMultiplier.toFixed(1)}x
          </Text>
        </View>

        {!start ? (
          isDisabled ? (
            <TouchableOpacity style={styles.mainButtonShoot} disabled={true}>
              <Text style={styles.mainButtonText}>{startTimer}</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.mainButtonStart}
              onPress={startGame}>
              <Text style={styles.mainButtonText}>Start</Text>
            </TouchableOpacity>
          )
        ) : (
          <TouchableOpacity
            style={styles.mainButtonShoot}
            onPress={incrementClicks}>
            <Text style={styles.mainButtonText}>Shoot!</Text>
          </TouchableOpacity>
        )}
        <View style={styles.musicContainer}>
          <Text style={styles.musicTitle}>♪ ♪ ♪</Text>
          <View style={styles.musicInfo}>
            <TouchableOpacity
              style={showPrev ? styles.controlButton : styles.invisibleButton}
              onPress={prevSong}
              disabled={!showPrev}>
              <Text style={styles.controlText}>◄</Text>
            </TouchableOpacity>
            <View style={styles.songContainer}>
              <TouchableOpacity
                style={styles.musicText}
                onPress={playSong}
                disabled={!isPlaying}>
                <Text style={styles.musicText}>
                  {songs[currentSongIndex].name}
                </Text>
              </TouchableOpacity>
              <Text style={styles.artistText}>by Dragon</Text>
            </View>
            <TouchableOpacity
              style={showNext ? styles.controlButton : styles.invisibleButton}
              onPress={nextSong}
              disabled={!showNext}>
              <Text style={styles.controlText}>►</Text>
            </TouchableOpacity>
          </View>
        </View>
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
    </RadialGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'darkblue',
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
  stats: {
    fontSize: 15,
    marginBottom: 5,
  },
  button: {
    fontSize: 18,
    alignItems: 'center',
    backgroundColor: '#28a745',
    padding: 8,
    borderRadius: 5,
    marginVertical: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
  mainButtonStart: {
    backgroundColor: 'green',
    padding: 35,
    borderRadius: 50,
    marginTop: 25,
    marginBottom: 25,
  },
  mainButtonShoot: {
    backgroundColor: 'red',
    padding: 35,
    borderRadius: 50,
    marginTop: 25,
    marginBottom: 25,
  },
  mainButtonText: {
    fontSize: 50,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    padding: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    margin: 5,
    padding: 10,
    borderRadius: 40,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  musicContainer: {
    alignItems: 'center',
    textAlign: 'center',
    bottom: 0,
    paddingHorizontal: 15,
    paddingBottom: 8,
    position: 'fixed',
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 20,
  },
  musicTitle: {
    fontSize: 35,
    marginTop: 5,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  musicInfo: {
    flexDirection: 'row',
    fontWeight: 'bold',
    alignItems: 'center',
    gap: 15,
  },
  musicText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  songContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  artistText: {
    textAlign: 'center',
  },
  controlButton: {
    padding: 8,
    borderRadius: 5,
    backgroundColor: '#FFD700',
  },
  invisibleButton: {
    padding: 8,
    borderRadius: 5,
    opacity: 0,
  },
  controlText: {
    fontSize: 25,
    fontWeight: 'bold',
  },
});

export default GameView;
