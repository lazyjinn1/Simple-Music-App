import React, {useContext, useEffect} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, Alert} from 'react-native';
import {GameContext} from '../App';
import {MusicProvider} from './Settings';

const GameView = ({navigation}) => {
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
    damageDone,
    setDamageDone,
    level,
    setLevel,
    enemyHealth,
    setEnemyHealth,
    timer,
    setTimer,
  } = useContext(GameContext);

  const startGame = () => {
    setStart(true);
  };

  useEffect(() => {
    let timerInterval;
    if (start) {
      timerInterval = setInterval(() => {
        setTimer(Timer => {
          if (Timer > 0) {
            return Timer - 1;
          } else {
            clearInterval(timerInterval);
            Alert.alert('Game Over');
            navigation.navigate('GameOverScreen', {score, level});
            return Timer;
          }
        });
      }, 1000);
      return () => clearInterval(timerInterval);
    }
  }, [navigation, score, start, level, setTimer]);

  const incrementClicks = () => {
    setScore(score + 1 * clickMultiplier);
    setGold(gold + 1 * goldMultiplier);
    setDamageDone(1 * clickMultiplier);
    setEnemyHealth(enemyHealth - damageDone);
    if (damageDone >= enemyHealth) {
      levelUp(level, gold);
    }
  };

  const levelUp = () => {
    setLevel(level + 1);
    const levelUpMessage = `Congratulations! Level: ${level + 1}`;
    Alert.alert(levelUpMessage);
    setGold(gold + goldMultiplier * level * 15);
    setDamageDone(0);
    setEnemyHealth(50 * level * 1.1);
    setTimer(10);
  };

  const openShop = () => {
    navigation.navigate('ShopScreen', {
      gold,
      setGold,
      clickMultiplier,
      setClickMultiplier,
    });
  };

  const resetGame = () => {
    setScore(0);
    setGold(0);
    setClickMultiplier(1);
    setGoldMultiplier(1);
    setLevel(1);
    setEnemyHealth(50);
    setTimer(10);
    setStart(false);
  };

  return (
    <MusicProvider>
      <View style={styles.container}>
        <Text style={styles.title}>Level: {level}</Text>
        <Text style={styles.timer}>Time Left: {timer} seconds</Text>
        <View style={styles.mainInfo}>
          <Text style={styles.score}>Score: {score}</Text>
          <Text style={styles.score}>
            Enemy Health: {enemyHealth.toFixed(1)}
          </Text>
        </View>
        <View style={styles.sideInfo}>
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
            onPress={() => navigation.navigate('SettingsScreen')}>
            <Text style={styles.buttonText}>Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('MainMenuScreen')}>
            <Text style={styles.buttonText}>Main Menu</Text>
          </TouchableOpacity>
        </View>
      </View>
    </MusicProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    color: 'black',
  },

  mainInfo: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  sideInfo: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  menuButtons: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
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
});

export default GameView;
