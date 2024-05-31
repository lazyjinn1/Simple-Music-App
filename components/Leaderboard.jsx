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

const LeaderboardView = ({navigation}) => {
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Leaderboards</Text>
      <FlatList
        data={highScores}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <View style={styles.scoreEntry}>
            <Text style={styles.scoreName}>{item.name}</Text>
            <Text style={styles.scoreScore}>{item.score} Points</Text>
            <Text style={styles.scoreLevel}>Level {item.level}</Text>
          </View>
        )}
      />
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
    fontSize: 50,
    color: 'gold',
    marginBottom: 10,
  },
  score: {
    fontSize: 25,
    marginBottom: 20,
  },
  scoreEntry: {
    flexDirection: 'row',
    padding: 10,
    borderWidth: 3,
    borderColor: 'black',
    gap: 50,
    backgroundColor: 'teal',
  },
  scoreName: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
    justifyContent: 'flex-start',
    textAlign: 'left',
  },
  scoreScore: {
    color: 'black',
    fontSize: 18,
    justifyContent: 'center',
  },
  scoreLevel: {
    color: 'black',
    fontSize: 18,
    justifyContent: 'flex-end',
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
});

export default LeaderboardView;
