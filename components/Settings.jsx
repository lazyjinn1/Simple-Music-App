import React, {
  useState,
  useEffect,
  useRef,
  createContext,
  useContext,
} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Sound from 'react-native-sound';

const songs = [
  {uri: require('../assets/songs/Yellow.mp3'), name: 'Yellow'},
  {uri: require('../assets/songs/ScissorSeven.mp3'), name: 'Scissor Seven'},
  {uri: require('../assets/songs/ForestFly.mp3'), name: 'Forest Fly'},
  {uri: require('../assets/songs/KillTheLights.mp3'), name: 'Kill The Lights'},
  {uri: require('../assets/songs/Shawty.mp3'), name: 'Shawty'},
]; // placed outside the application so that it is accessible from anywhere. Its static so it shouldn't matter. -J.C.

const MusicContext = createContext();

const SettingsView = ({closeSettings, isPlaying, setIsPlaying}) => {
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const sound = useRef(null); // making sure that the application knows that sound is of class Sound -J.C.

  //sets the category for the type of sound - J.C.
  Sound.setCategory('Playback');

  useEffect(() => {
    if (sound.current) {
      sound.current.pause();
      sound.current.release();
    }
    // removed parentheses around "error" and added Sound.MAIN_BUNDLE - J.C.
    sound.current = new Sound(
      songs[currentSongIndex].uri,
      Sound.MAIN_BUNDLE,
      error => {
        if (error) {
          console.log('Error loading sound: ', error);
          return;
        }
        sound.current.play();
      },
    );
  }, [currentSongIndex]);

  const playPause = () => {
    if (sound.current && isPlaying) {
      sound.current.pause();
    } else {
      sound.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const nextSong = () => {
    if (currentSongIndex === songs.length - 1) {
      sound.current.release;
      setCurrentSongIndex(0); // Loop back to the first song
    } else {
      sound.current.release;
      setCurrentSongIndex(currentSongIndex + 1);
    }
  };

  const prevSong = () => {
    if (currentSongIndex === 0) {
      sound.current.release;
      setCurrentSongIndex(songs.length - 1); // Loop back to the last song
    } else {
      sound.current.release;
      setCurrentSongIndex(currentSongIndex - 1);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings:</Text>
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
      <TouchableOpacity style={styles.backButton} onPress={closeSettings}>
        <Text style={styles.controlText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
};

const MusicProvider = ({children}) => {
  const [selectedMusic, setSelectedMusic] = useState(null);
  return (
    <MusicContext.Provider value={{selectedMusic, setSelectedMusic}}>
      {children}
    </MusicContext.Provider>
  );
};

const useMusic = () => useContext(MusicContext);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  title: {
    fontSize: 30,
    marginBottom: 20,
  },
  songText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  artistText: {
    fontSize: 18,
    fontWeight: 'bold',
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
    gap: 10,
  },
  controlButton: {
    padding: 20,
    borderRadius: 5,
    backgroundColor: '#FFD700',
  },
  controlText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    backgroundColor: '#FFD700',
    padding: 20,
    borderRadius: 5,
    marginVertical: 5,
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
});

export default SettingsView;
export {MusicProvider, useMusic};
