import React, {useState, useEffect, useRef} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Sound from 'react-native-sound';

const songs = [
  {uri: require('./assets/songs/Yellow.mp3'), name: 'Yellow'},
  {uri: require('./assets/songs/ScissorSeven.mp3'), name: 'Scissor Seven'},
  {uri: require('./assets/songs/ForestFly.mp3'), name: 'Forest Fly'},
  {uri: require('./assets/songs/KillTheLights.mp3'), name: 'Kill The Lights'},
  {uri: require('./assets/songs/Shawty.mp3'), name: 'Shawty'},
]; // placed outside the application so that it is accessible from anywhere. Its static so it shouldn't matter. -J.C.

const App = () => {
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const sound = useRef<Sound | null>(null); // making sure that the application knows that sound is of class Sound -J.C.

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
      setIsPlaying(false);
    } else {
      setCurrentSongIndex(currentSongIndex + 1);
      setIsPlaying(false); // Set play button to "Play" when switching to next song
    }
  };

  const prevSong = () => {
    if (currentSongIndex === 0) {
      setCurrentSongIndex(songs.length - 1); // Loop back to the last song
      setIsPlaying(false);
    } else {
      setCurrentSongIndex(currentSongIndex - 1);
      setIsPlaying(false); // Set play button to "Play" when switching to previous song
    }
  };

  return (
    <View style={styles.container}>
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
});

export default App;
