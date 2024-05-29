import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,
} from 'react-native';

const GameOverView = ({route, navigation}) => {
  const {score} = route.params;
  const {level} = route.params;
  const [highScoreName, setHighScoreName] = useState('');
  const [highScore, setHighScore] = useState(0);

  const handleSubmitScore = () => {
    Alert.alert(`Score of ${score} submitted!`);

    if (score > highScore) {
      setHighScore(score);
      Alert.alert(
        'High Score alert!!',
        'Would you like to view the leaderboard?',
        [
          {
            text: 'Yes',
            onPress: () =>
              navigation.navigate('LeaderboardScreen', {
                highScore,
                highScoreName,
              }),
            style: 'cancel',
          },
          {
            text: 'No',
            onPress: () => navigation.navigate('MainMenuScreen'),
            style: 'cancel',
          },
        ],
      );
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Game Over</Text>
      <Text style={styles.score}>Your Score: {score}</Text>
      <Text style={styles.score}>Level Reached: {level}</Text>
      <TextInput
        editable
        multiline
        numberOfLines={4}
        maxLength={40}
        onChangeText={name => setHighScoreName(name)}
        value={highScoreName}
      />
      <TouchableOpacity title="Submit Score" onPress={handleSubmitScore} />
      <TouchableOpacity
        title="Back to Main Menu"
        onPress={() => navigation.navigate('MainMenuView')}
      />
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
