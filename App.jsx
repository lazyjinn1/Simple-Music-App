import React from 'react';
import NavigationContainer from '@react-navigation/native';
import createNativeStackNavigator from '@react-navigation/native-stack';
import MainMenuView from './MainMenu';
import GameView from './Game';
import ShopView from './Shop';
import SettingsView from './Settings';
import GameOverView from './GameOver';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="MainMenuView">
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
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default App;
