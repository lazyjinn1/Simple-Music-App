import React, {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  FlatList,
  View,
} from 'react-native';
import RadialGradient from 'react-native-radial-gradient';

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
    <RadialGradient
      style={styles.container}
      colors={['white', 'gold']}
      stops={[0.1, 1]}
      center={[50, 100]}
      radius={600}>
      <Text style={styles.title}>Leaderboards</Text>
      <FlatList
        data={highScores}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <View style={styles.scoreEntry}>
            <Text style={styles.scoreName}>{item.name}</Text>
            <Text style={styles.scoreScore}>{item.score} points</Text>
            <Text style={styles.scoreLevel}>Level {item.level} </Text>
          </View>
        )}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('MainMenuScreen')}>
        <Text style={styles.buttonText}>Main Menu</Text>
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
    fontSize: 50,
    color: 'gold',
    marginBottom: 10,
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
  scoreEntry: {
    flex: 1,
    flexDirection: 'row',
    padding: 5,
    borderWidth: 1,
    borderColor: 'black',
    backgroundColor: 'pink',
  },
  scoreName: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  scoreScore: {
    color: 'black',
    fontSize: 18,
    textAlign: 'right',
  },
  scoreLevel: {
    color: 'black',
    fontSize: 18,
    textAlign: 'right',
  },
});

export default LeaderboardView;
