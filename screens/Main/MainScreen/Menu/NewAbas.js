import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import { View, ActivityIndicator } from 'react-native';
import { useTheme } from '../../../../context/ThemeContext';
import { getStyles } from './ModalStyles';
import Home from './Home';
import Atendimento from './Atendimento';
import Financeiro from './Financeiro';
import Settings from './Settings';

const Tab = createBottomTabNavigator();

const TabBarIcon = ({ focused, name, color }) => {
  let iconName;

  if (name === 'Home') {
    iconName = focused ? 'person' : 'person-outline';
  } else if (name === 'Atendimento') {
    iconName = focused ? 'chatbubble-ellipses-sharp' : 'chatbubble-ellipses-outline';
  } else if (name === 'Financeiro') {
    iconName = focused ? 'wallet-sharp' : 'wallet-outline';
  } else if (name === 'Settings') {
    iconName = focused ? 'settings' : 'settings-outline';
  }
  return <Icon name={iconName} size={24} color={color} />;
};

const App = () => {
  const { theme, isThemeLoaded } = useTheme();
  const styles = getStyles(theme);

  return (
    <View style={styles.inicontainer}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color }) => (
            <TabBarIcon focused={focused} name={route.name} color={color} />
          ),
          tabBarLabelStyle: styles.tabBarLabelStyle,
          tabBarStyle: styles.tabBarStyle,
          tabBarActiveTintColor: styles.tabBarActiveTintColor, // Dynamic value
          tabBarActiveBackgroundColor: styles.tabBarActiveBackgroundColor, // Dynamic value
        })}
      >
        <Tab.Screen name="Home" options={{ headerShown: false }} component={Home} />
        <Tab.Screen name="Atendimento" options={{ headerShown: false }} component={Atendimento} />
        <Tab.Screen name="Financeiro" options={{ headerShown: false }} component={Financeiro} />
        <Tab.Screen name="Settings" options={{ headerShown: false }} component={Settings} />
      </Tab.Navigator>
    </View>
  );
};

export default App;