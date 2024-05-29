import React, { useState, useEffect, useRef, createContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Sound from 'react-native-sound';

const songs = [
  { uri: require('../assets/songs/Yellow.mp3'), name: 'Yellow' },
  { uri: require('../assets/songs/ScissorSeven.mp3'), name: 'Scissor Seven' },
  { uri: require('../assets/songs/ForestFly.mp3'), name: 'Forest Fly' },
  { uri: require('../assets/songs/KillTheLights.mp3'), name: 'Kill The Lights' },
  { uri: require('../assets/songs/Shawty.mp3'), name: 'Shawty' },
]; // placed outside the application so that it is accessible from anywhere. Its static so it shouldn't matter. -J.C.

const MusicContext = createContext();

const SettingsView = ({ navigation }) => {
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const sound = useRef(null); // making sure that the application knows that sound is of class Sound -J.C.

  Sound.setCategory('Playback'); //sets the category for the type of sound - J.C.

  useEffect(() => {
    if (sound.current !== null) {
      sound.current.release();
    }

    // removed parentheses around "error" and added Sound.MAIN_BUNDLE - J.C.
    sound.current = new Sound(
      songs[currentSongIndex].uri,
      Sound.MAIN_BUNDLE,
      error => {
        if (error) {
          console.log('Error loading sound: ', error);
        }
      },
    );

    return () => {
      if (sound.current !== null) {
        sound.current.pause();
        sound.current.release();
        sound.current = null;
      }
    };
  }, [currentSongIndex]);

  const playPause = () => {
    if (sound.current !== null) {
      if (isPlaying) {
        sound.current.pause();
      } else {
        // removed the parentheses around success - J.C.
        sound.current.play(success => {
          if (success) {
            console.log('Playback successful');
          } else {
            console.log('Playback failed');
          }
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const nextSong = () => {
    if (currentSongIndex === songs.length - 1) {
      setCurrentSongIndex(0); // Loop back to the first song
    } else {
      setCurrentSongIndex(currentSongIndex + 1);
    }
  };

  const prevSong = () => {
    if (currentSongIndex === 0) {
      setCurrentSongIndex(songs.length - 1); // Loop back to the last song
    } else {
      setCurrentSongIndex(currentSongIndex - 1);
    }
  };


  return (
    <View style={styles.container}>
      <Text stye={styles.title}>Settings:</Text>
      <Text style={styles.songText}>{songs[currentSongIndex].name}</Text>
      <Text style={styles.artistText}>Artist: Dragon</Text>
      <View style={styles.controls}>
        <TouchableOpacity style={styles.controlButton} onPress={prevSong}>
          <Text style={styles.controlText}>Previous</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton} onPress={playPause}>
          <Text style={styles.controlText}>{isPlaying ? 'Pause' : 'Play'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton} onPress={nextSong}>
          <Text style={styles.controlText}>Next</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('GameScreen')}>
        <Text>Back to the game</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('MainMenuScreen')}>
        <Text>Main Menu</Text>
      </TouchableOpacity>
    </View>
  );
};

const MusicProvider = ({ children }) => {
  const [selectedMusic, setSelectedMusic] = useState(null);
  return (
    <MusicContext.Provider value={{ selectedMusic, setSelectedMusic }}>
      {children}
    </MusicContext.Provider>
  );
};

const useMusic = () => useContext(MusicContext);

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
  songText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  artistText: {
    fontSize: 16,
    marginBottom: 10,
    paddingBottom: 5,
  },
  timeText: {
    fontSize: 16,
    marginBottom: 10,
  },
  slider: {
    width: 300,
    marginBottom: 20,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
  },
  controlButton: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#FFD700',
  },
  controlText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    backgroundColor: '#FFD700',
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
    alignItems: 'center',
  }
});

export default SettingsView;
export { MusicProvider, useMusic };
