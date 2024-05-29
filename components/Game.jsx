import React, {useState, useContext, useEffect} from 'react';
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
  } = useContext(GameContext);
  const [score, setScore] = useState(0);
  const [damageDone, setDamageDone] = useState(0);
  const [level, setLevel] = useState(1);
  const [enemyHealth, setEnemyHealth] = useState(50);
  const [timer, setTimer] = useState(60);

  useEffect(() => {
    let timerInterval;
    if (start) {
      timerInterval = setInterval(() => {
        setTimer(prevTimer => {
          if (prevTimer > 0) {
            return prevTimer - 1;
          } else {
            clearInterval(timerInterval);
            navigation.navigate('GameOver', {score, level});
            return prevTimer;
          }
        });
      }, 1000);
    }

    return () => clearInterval(timerInterval);
  }, [navigation, score, start, level]);

  const incrementClicks = () => {
    setStart(true);
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
    setTimer(60);
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
    setTimer(60);
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
        <TouchableOpacity style={styles.mainButton} onPress={incrementClicks}>
          <Text style={styles.mainButtonText}>Click me!</Text>
        </TouchableOpacity>
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
    justifyContent: 'right',
    alignItems: 'right',
  },

  sideInfo: {
    justifyContent: 'right',
    alignItems: 'right',
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
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
  },

  buttonText: {
    color: 'white',
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
