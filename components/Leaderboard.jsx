import React, {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  FlatList,
} from 'react-native';

const LeaderboardView = ({route, navigation}) => {
  const {highScore} = route.params;
  const {highScoreName} = route.params;
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

  useEffect(() => {
    if (highScore && highScoreName) {
      const newEntry = {name: highScoreName, score: highScore};
      const updatedHighScores = [...highScores, newEntry].sort(
        (a, b) => b.score - a.score,
      );
      setHighScores(updatedHighScores);

      const saveHighScores = async () => {
        try {
          await AsyncStorage.setItem(
            'highScores',
            JSON.stringify(updatedHighScores),
          );
        } catch (error) {
          console.log('Failed to save high scores', error);
        }
      };
      saveHighScores();
    }
  }, [highScore, highScoreName, highScores]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Game Over</Text>
      <Text style={styles.score}>Your Score: {highScore}</Text>
      <Text style={styles.title}>Leaderboard</Text>
      <FlatList
        data={highScores}
        keyExtractor={index => index.toString()}
        renderItem={({item}) => (
          <View style={styles.scoreEntry}>
            <Text style={styles.scoreText}>{item.name}</Text>
            <Text style={styles.scoreText}>{item.score}</Text>
          </View>
        )}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('GameScreen')}>
        <Text style={styles.buttonText}>Play Again</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('MainMenuScreen')}>
        <Text style={styles.buttonText}>Main Menu</Text>
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
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  score: {
    fontSize: 20,
    marginBottom: 20,
  },
  scoreEntry: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  scoreText: {
    fontSize: 18,
  },
});

export default LeaderboardView;
