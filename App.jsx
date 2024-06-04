import 'react-native-gesture-handler';
import React, {useState, createContext} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import MainMenuView from './components/MainMenu';
import GameView from './components/Game';
import ShopView from './components/Shop';
import GameOverView from './components/GameOver';
import LeaderboardView from './components/Leaderboard';

export const GameContext = createContext();

const App = () => {
  const Stack = createNativeStackNavigator();
  const [gold, setGold] = useState(0);
  const [clickMultiplier, setClickMultiplier] = useState(1);
  const [goldMultiplier, setGoldMultiplier] = useState(1);
  const [start, setStart] = useState(false);
  const [score, setScore] = useState(0);
  const [damageDone, setDamageDone] = useState(0);
  const [level, setLevel] = useState(1);
  const [enemyHealth, setEnemyHealth] = useState(25);
  const [timer, setTimer] = useState(10);
  const [paused, setPaused] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [shopVisible, setShopVisible] = useState(false);
  return (
    <GameContext.Provider
      value={{
        gold,
        setGold,
        clickMultiplier,
        setClickMultiplier,
        goldMultiplier,
        setGoldMultiplier,
        start,
        setStart,
        score,
        setScore,
        damageDone,
        setDamageDone,
        level,
        setLevel,
        enemyHealth,
        setEnemyHealth,
        timer,
        setTimer,
        paused,
        setPaused,
        currentSongIndex,
        setCurrentSongIndex,
        isPlaying,
        setIsPlaying,
        shopVisible,
        setShopVisible,
      }}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="MainMenuScreen">
          <Stack.Screen
            name="MainMenuScreen"
            component={MainMenuView}
            options={{
              headerBackVisible: false,
              headerBackButtonMenuEnabled: false,
            }}
          />
          <Stack.Screen
            name="GameScreen"
            component={GameView}
            options={{
              headerBackVisible: false,
              headerBackButtonMenuEnabled: false,
            }}
          />
          <Stack.Screen
            name="ShopScreen"
            component={ShopView}
            options={{
              headerBackVisible: false,
              headerBackButtonMenuEnabled: false,
            }}
          />
          <Stack.Screen
            name="GameOverScreen"
            component={GameOverView}
            options={{
              headerBackVisible: false,
              headerBackButtonMenuEnabled: false,
            }}
          />
          <Stack.Screen
            name="LeaderboardScreen"
            component={LeaderboardView}
            options={{
              headerBackVisible: false,
              headerBackButtonMenuEnabled: false,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </GameContext.Provider>
  );
};
export default App;
