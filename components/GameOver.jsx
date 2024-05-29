import React, {useState, useEffect, useRef} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

const GameOverView = ({route, navigation}) => {
  const { score } = route.params;

  const handleSubmitScore = () => {
    alert(`Score of ${score} submitted!`);
    navigation.navigate('MainMenu');
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Game Over</Text>
      <Text style={styles.score}>Your Score: {score}</Text>
      <TouchableOpacity title="Submit Score" onPress={handleSubmitScore}></TouchableOpacity>
      <TouchableOpacity title="Back to Main Menu" onPress={() => navigation.navigate('MainMenuView')}></TouchableOpacity>
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
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  score: {
    fontSize: 20,
    marginBottom: 20,
  },
});

export default GameOverView;
