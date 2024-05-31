import React, {useContext, useEffect, useState} from 'react';
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
import SettingsView from './Settings';
import {MusicProvider} from './Settings';
import GameOverView from './GameOver';

const GameView = ({navigation}) => {
  const [shopVisible, setShopVisible] = useState(false);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [gameOverVisible, setGameOverVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
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

  useEffect(() => {
    resetGame();
  }, [resetGame]);

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
            setGameOverVisible(true);
            return Timer;
          }
        });
      }, 1000);
    }
    return () => clearInterval(timerInterval);
  }, [navigation, start, setTimer]);

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
    setEnemyHealth(25 * level * 1.1);
    setTimer(10);
    setStart(false);
  };

  const openShop = () => {
    setShopVisible(true);
  };

  const closeShop = () => {
    setShopVisible(false);
  };

  const openSettings = () => {
    setSettingsVisible(true);
  };

  const closeSettings = () => {
    setSettingsVisible(false);
  };

  const closeGameOver = () => {
    setGameOverVisible(false);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const resetGame = () => {
    setScore(0);
    setGold(0);
    setClickMultiplier(1);
    setGoldMultiplier(1);
    setLevel(1);
    setEnemyHealth(25);
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
          <TouchableOpacity style={styles.button} onPress={openSettings}>
            <Text style={styles.buttonText}>Settings</Text>
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
      <Modal
        animationType="fade"
        visible={settingsVisible}
        onRequestClose={closeSettings}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <SettingsView
              navigation={navigation}
              closeSettings={closeSettings}
              isPlaying={isPlaying}
              setIsPlaying={setIsPlaying}
            />
          </View>
        </View>
      </Modal>
      <Modal
        animationType="fade"
        visible={gameOverVisible}
        onRequestClose={closeGameOver}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <GameOverView navigation={navigation} level={level} score={score} />
          </View>
        </View>
      </Modal>
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
});

export default GameView;
