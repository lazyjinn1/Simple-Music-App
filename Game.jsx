import React, {useState} from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';

const GameView = navigation => {
  const [score, setScore] = useState(0);
  const [clickValue, setClickValue] = useState(1);
  const [gold, setGold] = useState(0);
  const [upgrades] = useState([
    {id: '1', name: 'Double Click', cost: 10, bonus: 2},
    {id: '2', name: 'Triple Click', cost: 30, bonus: 3},
    {id: '3', name: 'Mega Click', cost: 60, bonus: 5},
    {id: '4', name: 'Super Click', cost: 100, bonus: 10},
  ]);
  const [currentUpgrades, setCurrentUpgrades] = useState([]);

  const incrementClicks = () => {
    setScore(score + 1);
    setGold(gold + clickValue);
  };

  const openShop = () => {
    navigation.navigate('Shop', {
      gold,
      setGold,
      clickValue,
      upgrades,
      setClickValue,
      currentUpgrades,
    });
  };

  const resetGame = () => {
    setScore(0);
    setGold(0);
    setClickValue(1);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Clicker Game</Text>
      <Text style={styles.score}>Score: {score}</Text>
      <TouchableOpacity style={styles.button} onPress={incrementClicks}>
        <Text style={styles.buttonText}>Click me!</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={openShop}>
        <Text style={styles.buttonText}>Shop</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={resetGame}>
        <Text style={styles.buttonText}>Reset</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
});

export default GameView;
