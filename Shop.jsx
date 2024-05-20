import React from 'react';
import {View, Text, FlatList, TouchableOpacity, Alert} from 'react-native';

const UpgradeItem = ({upgrade, onPurchase}) => {
  const {name, cost, bonus} = upgrade;

  const handlePress = () => {
    onPurchase(upgrade);
  };

  return (
    <TouchableOpacity style={styles.upgradeButton} onPress={handlePress}>
      <Text style={styles.upgradeText}>
        {name} - Cost: {cost} Gold
      </Text>
      <Text style={styles.upgradeText}>Bonus: {bonus}</Text>
    </TouchableOpacity>
  );
};

const ShopView = ({upgrades, clickValue, gold, setClickValue, setGold}) => {
  const purchaseUpgrade = upgradePurchased => {
    let upgradeCost = upgradePurchased.cost;
    let upgradeBonus = upgradePurchased.bonus;
    const messageSuccess = `You have purchased ${upgradePurchased.name}`;
    const messageFail = 'Insufficient gold.';
    if (gold >= upgradeCost) {
      setClickValue(clickValue + upgradeBonus);
      setGold(gold - upgradeCost);
      Alert.alert(messageSuccess);
      return;
    } else {
      Alert.alert(messageFail);
      return;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Shop</Text>
      <FlatList
        data={upgrades}
        renderItem={({item}) => (
          <UpgradeItem upgrade={item} onPurchase={purchaseUpgrade} />
        )}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    width: '80%',
  },
  upgradeText: {
    color: 'white',
    fontSize: 18,
  },
};

export default ShopView;
