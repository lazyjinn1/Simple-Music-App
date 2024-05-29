import React, { useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { GameContext } from '../App'
import { MusicProvider } from './Settings';

const UpgradeItem = ({ upgrade, onPurchase }) => {
  const { name, cost, clickBonus, goldBonus } = upgrade;

  const handlePress = () => {
    onPurchase(upgrade);
  };

  return (
    <TouchableOpacity style={styles.upgradeButton} onPress={handlePress}>
      <Text style={styles.upgradeText}>
        {name} - Cost: {cost} Gold
      </Text>
      <Text style={styles.upgradeText}>Click Bonus: {clickBonus}</Text>
      <Text style={styles.upgradeText}>Gold Bonus: {goldBonus}</Text>
    </TouchableOpacity>
  );
};

const ShopView = ({ navigation }) => {
  const { gold, setGold, clickMultiplier, setClickMultiplier, goldMultiplier, setGoldMultiplier } = useContext(GameContext);

  const upgrades = [
    { id: '1', name: 'Upgrade 1', cost: 50, clickBonus: 1, goldBonus: 1 },
    { id: '2', name: 'Upgrade 2', cost: 100, clickBonus: 5, goldBonus: 3 },
    { id: '3', name: 'Upgrade 3', cost: 250, clickBonus: 10, goldBonus: 5 },
    { id: '4', name: 'Upgrade 4', cost: 500, clickBonus: 25, goldBonus: 10 },
    { id: '5', name: 'Upgrade 5', cost: 1000, clickBonus: 50, goldBonus: 25 }
  ];

  const purchaseUpgrade = (upgradePurchased) => {
    let upgradeCost = upgradePurchased.cost;
    let upgradeClickBonus = upgradePurchased.clickBonus;
    let upgradeGoldBonus = upgradePurchased.goldBonus;
    const messageSuccess = `You have purchased ${upgradePurchased.name}`;
    const messageFail = 'Insufficient gold.';
    if (gold >= upgradeCost) {
      setClickMultiplier(clickMultiplier + upgradeClickBonus);
      setGoldMultiplier(goldMultiplier + upgradeGoldBonus);
      setGold(gold - upgradeCost);
      Alert.alert(messageSuccess);
      return;
    } else {
      Alert.alert(messageFail);
      return;
    }
  };

  return (
    <MusicProvider>
      <View style={styles.container}>
        <Text style={styles.title}>Shop</Text>
        <FlatList
          data={upgrades}
          renderItem={({ item }) => (
            <UpgradeItem upgrade={item} onPurchase={purchaseUpgrade} />
          )}
          keyExtractor={item => item.id}
        />
        <Text style={styles.title}>Gold: {gold.toFixed(2)}</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('GameScreen')}>
          <Text style={styles.backButtonText}>Back to the Game</Text>
        </TouchableOpacity>
      </View>
    </MusicProvider>
  );
};

const styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  upgradeButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
    alignItems: 'center',
  },
  upgradeText: {
    color: 'white',
    fontSize: 18,
  },
  backButton: {
    marginTop: 20,
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
  },
  backButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
};

export default ShopView;
