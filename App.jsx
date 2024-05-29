import 'react-native-gesture-handler';
import React, {useState, createContext} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import MainMenuView from './components/MainMenu';
import GameView from './components/Game';
import ShopView from './components/Shop';
import SettingsView from './components/Settings';
import GameOverView from './components/GameOver';
import LeaderboardView from './components/Leaderboard';
import {MusicProvider} from './components/Settings';

export const GameContext = createContext();

const App = () => {
  const Stack = createNativeStackNavigator();
  const [gold, setGold] = useState(0);
  const [clickMultiplier, setClickMultiplier] = useState(1);
  const [goldMultiplier, setGoldMultiplier] = useState(1);
  const [start, setStart] = useState(false);
  return (
    <MusicProvider>
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
              name="SettingsScreen"
              component={SettingsView}
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
    </MusicProvider>
  );
};
export default App;
