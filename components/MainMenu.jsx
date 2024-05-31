import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {MusicProvider} from './Settings';

const MainMenuView = ({navigation}) => {
  return (
    <MusicProvider>
      <View style={styles.container}>
        <Text style={styles.title}>Welcome to Dragon Clicker</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('GameScreen')}>
          <Text style={styles.buttonText}>Start Game</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('LeaderboardScreen')}>
          <Text style={styles.buttonText}>Leaderboards</Text>
        </TouchableOpacity>
      </View>
    </MusicProvider>
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
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
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

export default MainMenuView;
