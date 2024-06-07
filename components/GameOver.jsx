import React, {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,
} from 'react-native';
import uuid from 'react-native-uuid';
import RadialGradient from 'react-native-radial-gradient';

const GameOverView = ({navigation, route}) => {
  const {level, score} = route.params;
  const [highScoreName, setHighScoreName] = useState('');
  const [highScores, setHighScores] = useState([]);

  useEffect(() => {
    const loadHighScores = async () => {
      try {
        const storedScores = await AsyncStorage.getItem('highScores');
        if (storedScores) {
          setHighScores(JSON.parse(storedScores));
        } else {
          setHighScores([]);
        }
      } catch (error) {
        Alert.alert('Failed to load high scores');
      }
    };
    loadHighScores();
  }, []);

  const saveHighScore = async () => {
    if (!highScoreName) {
      Alert.alert('Please enter your name');
    } else {
      const newEntry = {
        id: uuid.v4(),
        name: highScoreName.trim(),
        score: score,
        level: level,
      };
      const updatedHighScores = [...highScores, newEntry].sort(
        (a, b) => b.score - a.score,
      );
      setHighScores(updatedHighScores);

      try {
        await AsyncStorage.setItem(
          'highScores',
          JSON.stringify(updatedHighScores),
        );
        Alert.alert('High score saved!');
        navigation.navigate('LeaderboardScreen');
      } catch (error) {
        Alert.alert('Failed to save high score');
      }
    }
  };

  return (
    <RadialGradient
      style={styles.container}
      colors={['white', 'black']}
      stops={[0, 1]}
      center={[50, 100]}
      radius={750}>
      <Text style={styles.title}>Game Over</Text>
      <Text style={styles.score}>Your Score: {score}</Text>
      <Text style={styles.score}>Level Reached: {level}</Text>
      <TextInput
        editable
        numberOfLines={1}
        maxLength={12}
        placeholder="Write your name here:"
        style={styles.inputBox}
        onChangeText={name => setHighScoreName(name)}
        value={highScoreName}
      />
      <TouchableOpacity style={styles.button} onPress={saveHighScore}>
        <Text style={styles.textButton}>Submit Score</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          navigation.navigate('MainMenuScreen');
        }}>
        <Text style={styles.textButton}>Main Menu</Text>
      </TouchableOpacity>
    </RadialGradient>
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
  inputBox: {
    height: 40,
    borderWidth: 2,
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
    backgroundColor: 'white',
    color: 'black',
  },
});

export default GameOverView;
