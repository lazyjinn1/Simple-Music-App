import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MusicProvider } from './Settings';

const MainMenuView = ({ navigation }) => {
  return (
    <MusicProvider>
      <View style={styles.container}>
        <Text style={styles.title}>Welcome to the Clicker Game!</Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('GameScreen')}>
          <Text style={styles.textButton}>Start Game</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('SettingsScreen')}>
          <Text style={styles.textButton}>Settings</Text>
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
    fontSize: 24,
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

  textButton: {
    color: 'white',
    fontSize: 18,
  },
});

export default MainMenuView;
